const Quote = require('../models/quoteModel');
const random = require("nanoid")

const QuoteController = {
    async createQuote(req, res) {
        try {
            const QuoteID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const { JobID, UserID, QuoteAmount, QuoteMessage } = req.body;

            if (!JobID || !UserID || !QuoteAmount || !QuoteMessage || !Timestamp) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newQuote = {
                QuoteID,
                JobID,
                UserID,
                QuoteAmount,
                QuoteMessage,
                Timestamp
            };

            const createdQuoteId = await Quote.createQuote(newQuote);

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
