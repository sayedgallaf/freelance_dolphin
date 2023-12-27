const db = require('../config/db');

const Dispute = {
    async getDisputeByID(DisputeID) {
        try {
            const [rows] = await db.query('SELECT * FROM Dispute WHERE DisputeID = ?', [DisputeID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching dispute by ID: ${error.message}`);
        }
    },

    async getAllDisputes() {
        try {
            const [rows] = await db.query('SELECT * FROM Dispute');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all disputes: ${error.message}`);
        }
    },

    async createDispute(disputeData) {
        const { DisputeID, ContractID, JobID, UserID, Description, Status, Timestamp } = disputeData;
        try {
            const sql = 'INSERT INTO Dispute (DisputeID, ContractID, JobID, UserID, Description, Status, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [DisputeID, ContractID, JobID, UserID, Description, Status, Timestamp]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating dispute: ${error.message}`);
        }
    },

    async deleteDispute(DisputeID) {
        try {
            const [result] = await db.query('DELETE FROM Dispute WHERE DisputeID = ?', [DisputeID]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting dispute: ${error.message}`);
        }
    },

    async getDisputeByContractID(ContractID) {
        try {
            const [rows] = await db.query('SELECT * FROM Dispute WHERE ContractID = ?', [ContractID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching disputes by ContractID: ${error.message}`);
        }
    },

    async getDisputeByJobID(JobID) {
        try {
            const [rows] = await db.query('SELECT * FROM Dispute WHERE JobID = ?', [JobID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching disputes by JobID: ${error.message}`);
        }
    }
};

module.exports = Dispute;
