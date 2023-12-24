const db = require('../config/db');

const Transaction = {
    async createTransaction(transaction) {
        const { TransactionID, UserID, TransactionType, Description, Amount, Timestamp } = transaction;
        try {
            const sql = 'INSERT INTO Transaction (TransactionID, UserID, TransactionType, Description, Amount, Timestamp) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [TransactionID, UserID, TransactionType, Description, Amount, Timestamp]);

            return result.insertId; // Return the ID of the newly created transaction
        } catch (error) {
            throw new Error(`Error creating transaction: ${error.message}`);
        }
    },

    async deleteTransaction(transactionID) {
        try {
            const sql = 'DELETE FROM Transaction WHERE TransactionID = ?';
            const [result] = await db.query(sql, [transactionID]);

            return result.affectedRows > 0; // Return true if the transaction was deleted successfully
        } catch (error) {
            throw new Error(`Error deleting transaction: ${error.message}`);
        }
    },

    async updateTransaction(transactionID, updatedTransactionData) {
        const { TransactionType, Description, Amount, Timestamp } = updatedTransactionData;
        try {
            let updateFields = '';
            const updateValues = [];

            if (TransactionType) {
                updateFields += 'TransactionType = ?, ';
                updateValues.push(TransactionType);
            }
            if (Description) {
                updateFields += 'Description = ?, ';
                updateValues.push(Description);
            }
            if (Amount !== undefined) {
                updateFields += 'Amount = ?, ';
                updateValues.push(Amount);
            }
            if (Timestamp) {
                updateFields += 'Timestamp = ?, ';
                updateValues.push(Timestamp);
            }

            // Remove trailing comma and space from updateFields
            updateFields = updateFields.replace(/,\s*$/, '');

            if (updateFields) {
                updateValues.push(transactionID); // Push the transaction ID to the end for WHERE clause

                const sql = `UPDATE Transaction SET ${updateFields} WHERE TransactionID = ?`;
                const [result] = await db.query(sql, updateValues);

                return result.affectedRows > 0; // Return true if the transaction was updated successfully
            } else {
                throw new Error('No fields to update');
            }
        } catch (error) {
            throw new Error(`Error updating transaction: ${error.message}`);
        }
    },

    async getTransaction(transactionID) {
        try {
            const [rows] = await db.query('SELECT * FROM Transaction WHERE TransactionID = ?', [transactionID]);
            return rows.length > 0 ? rows[0] : null; // Return the transaction object or null if not found
        } catch (error) {
            throw new Error(`Error fetching transaction: ${error.message}`);
        }
    },

    async getAllTransactions() {
        try {
            const [rows] = await db.query('SELECT * FROM Transaction');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all transactions: ${error.message}`);
        }
    },

    async getAllTransactionsByUserId(userID) {
        try {
            const [rows] = await db.query('SELECT * FROM Transaction WHERE UserID = ?', [userID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching transactions by user ID: ${error.message}`);
        }
    }

    // Other methods for transactions
};

module.exports = Transaction;
