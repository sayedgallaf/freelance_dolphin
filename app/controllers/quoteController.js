const Quote = require('../models/quoteModel');
const User = require('../models/userModel');
const Transcation = require('../models/transactionModel');
const discussionModel = require("../models/discussionModel")
const jobModel = require("../models/jobModel")
const random = require("nanoid")

const QuoteController = {
    async createQuote(req, res) {
        try {
            const QuoteID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const UserID = req.session.authData ? req.session.authData.UserID : null
            const { JobID, QuoteAmount, QuoteMessage } = req.body;

            if (!JobID || !UserID || !QuoteAmount || !QuoteMessage || !Timestamp) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Fetch user's balance
            const user = await User.getUserById(UserID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const job = await jobModel.getJobByID(JobID)
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            if (user.UserType != "freelancer") {
                return res.status(404).json({ message: 'User cannot quote' });
            }
            let userQuoted = await Quote.getQuoteByJobIDAndUserID(JobID,UserID)
            if(userQuoted){
                return res.status(404).json({ message: 'You have already made a quote for this job' });
            }
            const employer = await User.getUserById(job.UserID);

            resend.emails.send({
                from: 'support@dolphin.directory',
                to: employer.Email,
                subject: `Freelance Dolphin: ${user.FullName} has sent you a quote`,
                text: `Quote Amount: ${QuoteAmount}\n Message: ${QuoteMessage}`
            })

            const newQuote = {
                QuoteID,
                JobID,
                UserID,
                QuoteAmount,
                QuoteMessage,
                Timestamp
            };

            const quoteCost = 0.1; // Cost of creating a quote

            // Check if it's the user's first quote (free)
            const userQuotes = await Quote.getAllQuotesByUserId(UserID);
            const isFirstQuote = userQuotes.length === 0;
            const transaction = {
                TransactionID: random.nanoid(15),
                UserID: UserID,
                TransactionType: "Quote",
                Description: `Quote for Job: ${JobID} on ${Timestamp}`,
                Amount: 0.00,
                Timestamp: Timestamp,
            }
            // If it's the first quote for the user, create it without deducting any cost
            if (isFirstQuote) {

                const createdQuoteId = await Quote.createQuote(newQuote);

                const DiscussionID = random.nanoid(15);
                await discussionModel.createDiscussion(DiscussionID, JobID, Timestamp, "Quote")
                await discussionModel.addDiscussionUser(random.nanoid(15), DiscussionID, job.UserID)

                await Transcation.createTransaction(transaction)
                return res.status(201).json({ message: 'First quote created successfully for free', createdQuoteId });
            }

            // Check if user has enough balance to create the quote
            if (Number(user.Balance) < quoteCost) {
                return res.status(403).json({ message: 'Insufficient balance to create the quote' });
            }

            // Deduct the quote cost from user's balance
            transaction.Amount = quoteCost;
            const spent = await User.spendBalance(UserID, quoteCost);

            if (!spent) {
                return res.status(500).json({ message: 'Error deducting balance' });
            } else {
                await Transcation.createTransaction(transaction)
            }

            const createdQuoteId = await Quote.createQuote(newQuote);

            const DiscussionID = random.nanoid(15);
            await discussionModel.createDiscussion(DiscussionID, JobID, Timestamp, "Quote")
            await discussionModel.addDiscussionUser(random.nanoid(15), DiscussionID, job.UserID)
            res.status(201).json({ message: 'Quote created successfully', createdQuoteId });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteQuote(req, res) {
        try {
            const { quoteID } = req.params;

            const deleted = await Quote.deleteQuote(quoteID);

            if (deleted) {
                res.status(200).json({ message: 'Quote deleted successfully' });
            } else {
                res.status(404).json({ message: 'Quote not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateQuote(req, res) {
        try {
            const { quoteID } = req.params;
            const updatedQuoteData = req.body;

            const updated = await Quote.updateQuote(quoteID, updatedQuoteData);

            if (updated) {
                res.status(200).json({ message: 'Quote updated successfully' });
            } else {
                res.status(404).json({ message: 'Quote not found or no fields to update' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getQuote(req, res) {
        try {
            const { quoteID } = req.params;

            const quote = await Quote.getQuote(quoteID);

            if (quote) {
                res.status(200).json({ quote });
            } else {
                res.status(404).json({ message: 'Quote not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getAllQuotes(req, res) {
        try {
            const quotes = await Quote.getAllQuotes();
            res.status(200).json({ quotes });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }

    // Other methods for handling quotes
};

module.exports = QuoteController;
