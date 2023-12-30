const db = require('../config/db');
const Quote = {
    async createQuote(quote) {
        const { QuoteID, JobID, UserID, DiscussionID, QuoteAmount, QuoteMessage, Timestamp } = quote;
        try {
            
            const sql = 'INSERT INTO Quote (QuoteID, JobID, UserID, DiscussionID, QuoteAmount, QuoteMessage, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [QuoteID, JobID, UserID, DiscussionID, QuoteAmount, QuoteMessage, Timestamp]);
            return result.insertId; // Return the ID of the newly created quote
        } catch (error) {
            throw new Error(`Error creating quote: ${error.message}`);
        }
    },

    async deleteQuote(quoteID) {
        try {
            const sql = 'DELETE FROM Quote WHERE QuoteID = ?';
            const [result] = await db.query(sql, [quoteID]);

            return result.affectedRows > 0; // Return true if the quote was deleted successfully
        } catch (error) {
            throw new Error(`Error deleting quote: ${error.message}`);
        }
    },

    async updateQuote(quoteID, updatedQuoteData) {
        const { QuoteAmount, QuoteMessage, Timestamp } = updatedQuoteData;
        try {
            let updateFields = '';
            const updateValues = [];

            if (QuoteAmount !== undefined) {
                updateFields += 'QuoteAmount = ?, ';
                updateValues.push(QuoteAmount);
            }
            if (QuoteMessage) {
                updateFields += 'QuoteMessage = ?, ';
                updateValues.push(QuoteMessage);
            }
            if (Timestamp) {
                updateFields += 'Timestamp = ?, ';
                updateValues.push(Timestamp);
            }

            // Remove trailing comma and space from updateFields
            updateFields = updateFields.replace(/,\s*$/, '');

            if (updateFields) {
                updateValues.push(quoteID); // Push the quote ID to the end for WHERE clause

                const sql = `UPDATE Quote SET ${updateFields} WHERE QuoteID = ?`;
                const [result] = await db.query(sql, updateValues);

                return result.affectedRows > 0; // Return true if the quote was updated successfully
            } else {
                throw new Error('No fields to update');
            }
        } catch (error) {
            throw new Error(`Error updating quote: ${error.message}`);
        }
    },

    async getQuote(quoteID) {
        try {
            const [rows] = await db.query('SELECT * FROM Quote WHERE QuoteID = ?', [quoteID]);
            return rows.length > 0 ? rows[0] : null; // Return the quote object or null if not found
        } catch (error) {
            throw new Error(`Error fetching quote: ${error.message}`);
        }
    },
    async getQuoteByDiscussionID(DiscussionID) {
        try {
            const query = `
            SELECT Quote.*, User.FullName, User.UserType
            FROM Quote
            INNER JOIN User ON Quote.UserID = User.UserID
            WHERE Quote.DiscussionID = ?
        `;
            const [rows] = await db.query(query, [DiscussionID]);
            return rows[0]; // Return the quote object or null if not found
        } catch (error) {
            throw new Error(`Error fetching quote: ${error.message}`);
        }
    },

    async getAllQuotes() {
        try {
            const [rows] = await db.query('SELECT * FROM Quote');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all quotes: ${error.message}`);
        }
    },
    async getAllQuotesByUserId(userID) {
        try {
            const [rows] = await db.query('SELECT * FROM Quote WHERE UserID = ?', [userID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching quotes by user ID: ${error.message}`);
        }
    },
    async getQuoteByJobIDAndUserID(JobID, UserID) {
        try {
            const query = `
                SELECT *
                FROM Quote
                WHERE JobID = ? AND UserID = ?
            `;
            const [rows] = await db.query(query, [JobID, UserID]);
            return rows.length > 0 ? rows[0] : null; // Return the quote object or null if not found
        } catch (error) {
            throw new Error(`Error fetching quote by JobID and UserID: ${error.message}`);
        }
    }

    // Other methods for quotes
};

module.exports = Quote;
