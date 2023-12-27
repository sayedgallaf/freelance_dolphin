const Dispute = require('../models/disputeModel');
const Discussion = require('../models/discussionModel');
const random = require("nanoid")

const disputeController = {
    async getDispute(req, res) {
        try {
            const { DisputeID } = req.body;
            if (!DisputeID) {
                return res.status(400).json({ error: 'DisputeID is required in the request body' });
            }

            const dispute = await Dispute.getDisputeByID(DisputeID);
            if (!dispute) {
                return res.status(404).json({ error: 'Dispute not found' });
            }

            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({ error: `Error getting dispute: ${error.message}` });
        }
    },

    async getAllDisputes(req, res) {
        try {
            const allDisputes = await Dispute.getAllDisputes();
            return res.status(200).json(allDisputes);
        } catch (error) {
            return res.status(500).json({ error: `Error fetching all disputes: ${error.message}` });
        }
    },

    async createDispute(req, res) {
        try {
            const { ContractID, JobID, DiscussionID, Description } = req.body;

            // Generate unique IDs using random.nanoid
            const DisputeID = random.nanoid(15); // Generate a 15-character unique ID for DisputeID
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp

            // Create an object with generated IDs and other data
            const disputeData = {
                DisputeID,
                ContractID,
                JobID,
                UserID:req.session.authData.UserID,
                Description,
                Status:"Unresolved",
                Timestamp,
            };

            const createdDisputeID = await Dispute.createDispute(disputeData);
            await Discussion.updateDiscussionStatus(DiscussionID,"Dispute")
            
            return res.status(201).json({ message: 'Dispute created successfully', DisputeID: createdDisputeID });
        } catch (error) {
            return res.status(500).json({ error: `Error creating dispute: ${error.message}` });
        }
    },

    async deleteDispute(req, res) {
        try {
            const { DisputeID } = req.body;
            if (!DisputeID) {
                return res.status(400).json({ error: 'DisputeID is required in the request body' });
            }

            const deleted = await Dispute.deleteDispute(DisputeID);
            if (deleted) {
                return res.status(200).json({ message: 'Dispute deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Dispute not found or could not be deleted' });
            }
        } catch (error) {
            return res.status(500).json({ error: `Error deleting dispute: ${error.message}` });
        }
    },

    async getDisputesByContractID(req, res) {
        try {
            const { ContractID } = req.body;
            if (!ContractID) {
                return res.status(400).json({ error: 'ContractID is required in the request body' });
            }

            const disputes = await Dispute.getDisputeByContractID(ContractID);
            return res.status(200).json(disputes);
        } catch (error) {
            return res.status(500).json({ error: `Error fetching disputes by ContractID: ${error.message}` });
        }
    },

    // Additional methods for handling disputes by JobID, updating dispute details, etc.
};

module.exports = disputeController;
