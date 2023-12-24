const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const random = require("nanoid");

const TransactionController = {
    async createTransaction(req, res) {
        try {
            const TransactionID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const UserID = req.session.authData ? req.session.authData.UserID : null
            
            const { TransactionType, Description, Amount } = req.body;

            if (!UserID || !TransactionType || !Description || !Amount || !Timestamp) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Fetch user to ensure the user exists
            const user = await User.getUserById(UserID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newTransaction = {
                TransactionID,
                UserID,
                TransactionType,
                Description,
                Amount,
                Timestamp
            };

            const createdTransactionId = await Transaction.createTransaction(newTransaction);

            res.status(201).json({ message: 'Transaction created successfully', createdTransactionId });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteTransaction(req, res) {
        try {
            const { transactionID } = req.params;

            const deleted = await Transaction.deleteTransaction(transactionID);

            if (deleted) {
                res.status(200).json({ message: 'Transaction deleted successfully' });
            } else {
                res.status(404).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateTransaction(req, res) {
        try {
            const { transactionID } = req.params;
            const updatedTransactionData = req.body;

            const updated = await Transaction.updateTransaction(transactionID, updatedTransactionData);

            if (updated) {
                res.status(200).json({ message: 'Transaction updated successfully' });
            } else {
                res.status(404).json({ message: 'Transaction not found or no fields to update' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getTransaction(req, res) {
        try {
            const { transactionID } = req.params;

            const transaction = await Transaction.getTransaction(transactionID);

            if (transaction) {
                res.status(200).json({ transaction });
            } else {
                res.status(404).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getAllTransactions(req, res) {
        try {
            const transactions = await Transaction.getAllTransactions();
            res.status(200).json({ transactions });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }

    // Other methods for handling transactions
};

module.exports = TransactionController;
