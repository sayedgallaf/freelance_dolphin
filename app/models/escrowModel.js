const db = require('../config/db');

const Escrow = {
    async createEscrow(escrowData) {
        const { EscrowID, JobID, EmployerID, Amount, Timestamp } = escrowData;
        try {
            const sql = 'INSERT INTO Escrow (EscrowID, JobID, UserID, Amount, Timestamp) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [EscrowID, JobID, EmployerID, Amount, Timestamp]);
            return result;
        } catch (error) {
            throw new Error(`Error creating escrow: ${error.message}`);
        }
    },
    async getEscrowByID(EscrowID) {
        try {
            const [rows] = await db.query('SELECT * FROM Escrow WHERE EscrowID = ?', [EscrowID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching escrow by ID: ${error.message}`);
        }
    },

    async getAllEscrows() {
        try {
            const [rows] = await db.query('SELECT * FROM Escrow');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all escrows: ${error.message}`);
        }
    },

    async deleteEscrow(EscrowID) {
        try {
            const [result] = await db.query('DELETE FROM Escrow WHERE EscrowID = ?', [EscrowID]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting escrow: ${error.message}`);
        }
    }
};

module.exports = Escrow;
