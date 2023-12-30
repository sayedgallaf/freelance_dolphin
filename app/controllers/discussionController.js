const random = require("nanoid")
const DiscussionModel = require("../models/discussionModel");
const QuoteModel = require('../models/quoteModel');
const JobModel = require('../models/jobModel');
const {resend} = require('../config/email');


const discussionController = {
    async getDiscussion(req, res) {
        try {
            const { DiscussionID } = req.body;
            if (!DiscussionID) {
                return res.status(400).json({ error: 'DiscussionID is required in the request body' });
            }

            const discussion = await DiscussionModel.getDiscussion(DiscussionID);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }

            if (discussion.Status === 'Quote') {
                const quote = await QuoteModel.getQuoteByJobID(discussion.JobID);
                return res.status(200).json(quote);
            } else if (discussion.Status != 'Quote') {
                const messages = await DiscussionModel.getMessagesByDiscussionID(DiscussionID);
                return res.status(200).json(messages);
            } else {
                return res.status(400).json({ error: 'Invalid Status provided' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error getting discussion: ${error.message}` });
        }
    },
    async deleteDiscussion(req, res) {
        try {
            const { DiscussionID } = req.body;
            if (!DiscussionID) {
                return res.status(400).json({ error: 'DiscussionID is required in the request body' });
            }
            const discussion = await DiscussionModel.getDiscussion(DiscussionID);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }
            if (discussion.Status !== 'Negotiation' && discussion.Status !== 'Quote' && discussion.Status !== 'Archived') {
                return res.status(400).json({ error: 'Discussion status is not archived or quote' });
            }
            const checkUser = await DiscussionModel.checkIfUserInDiscussion(req.session.authData.UserID,DiscussionID)
            if (req.session.authData.UserType != "admin" && !checkUser) {
                return res.status(400).json({ error: 'Unauthorized' });
            }
            const deleted = await DiscussionModel.deleteDiscussion(DiscussionID);
            if (deleted) {
                return res.status(200).json({ message: 'Discussion deleted successfully' });
            } else {
                return res.status(500).json({ error: 'Error deleting discussion' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error deleting discussion: ${error.message}` });
        }
    },

    async interested(req, res) {
        try {
            const DiscussionUserID = random.nanoid(15)
            const { DiscussionID, UserID } = req.body;

            if (!DiscussionUserID || !DiscussionID || !UserID) {
                return res.status(400).json({ error: 'DiscussionUserID, DiscussionID, and UserID are required in the request body' });
            }

            const discussion = await DiscussionModel.getDiscussion(DiscussionID)
            if (!discussion) {
                return res.status(400).json({ error: 'Discussion not found' });
            }
            const job = await JobModel.getJobByID(discussion.JobID)
            if (req.session.authData.UserType != "admin" && job.UserID != req.session.authData.UserID) {
                return res.status(400).json({ error: 'Unauthorized' });
            }

            const added = await DiscussionModel.addDiscussionUser(DiscussionUserID, DiscussionID, UserID);

            const freelancer = await User.getUserById(UserID);
            const employer = await User.getUserById(job.UserID);
            console.log(freelancer,employer)
            resend.emails.send({
                from: 'support@dolphin.directory',
                to: freelancer.Email,
                subject: `Freelance Dolphin: ${employer.FullName} is interested.`,
                text: `Discussion URL: https://dolphin.directory/discussion#job=${discussion.JobID}`
            })
            
            if (added) {
                await DiscussionModel.updateDiscussionStatus(DiscussionID, "Negotiation")

                return res.status(200).json({ message: 'User added to discussion successfully' });
            } else {
                return res.status(500).json({ error: 'Error adding user to discussion' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error adding user to discussion: ${error.message}` });
        }
    },
    async createMessage(req, res) {
        try {
            const { DiscussionID, UserID, MessageContent } = req.body;
            if (!DiscussionID || !UserID || !MessageContent) {
                return res.status(400).json({ error: 'DiscussionID, UserID, and MessageContent are required in the request body' });
            }
            const discussion = await DiscussionModel.getDiscussion(DiscussionID);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }

            const MessageID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const createdMessageID = await DiscussionModel.createMessage(MessageID, DiscussionID, UserID, MessageContent, Timestamp);
            if (createdMessageID) {
                return res.status(200).json({ message: 'Message created successfully', MessageID: createdMessageID });
            } else {
                return res.status(500).json({ error: 'Error creating message' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error creating message: ${error.message}` });
        }
    },
    async uploadMedia(req, res, next) {
        try {
            const { DiscussionID, UserID } = req.body;
    
            // Validate DiscussionID and UserID
            if (!DiscussionID || !UserID) {
                return res.status(400).json({ error: 'DiscussionID and UserID are required in the request body' });
            }
            const discussion = await DiscussionModel.getDiscussion(DiscussionID);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Incomplete file data was provided' });
            }
            const mediaID = random.nanoid(15);
    
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const inserted = await DiscussionModel.uploadMedia(
                mediaID,
                DiscussionID,
                UserID,
                req.file.mimetype, // Set the MediaType to 'file'
                req.file.filename,
                timestamp
            );
            if (inserted) {
                next()
            } else {
                return res.status(500).json({ error: 'Error storing media data' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error uploading file: ${error.message}` });
        }
    }
};

module.exports = discussionController;
