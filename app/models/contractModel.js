const db = require('../config/db');

const Contract = {
    async getAllContractsByUserID(UserID) {
        try {
            const sql = `
            SELECT c.*, u.UserID, u.UserType, u.FullName, u.Email, u.ProfilePicURL, u.Bio
            FROM Contract c
            INNER JOIN User u ON (c.EmployerID = u.UserID OR c.FreelancerID = u.UserID)
            WHERE (c.EmployerID = ? OR c.FreelancerID = ?) AND u.UserID != ?
            `;
            const [rows] = await db.query(sql, [UserID, UserID,UserID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching contracts by UserID: ${error.message}`);
        }
    },
    async createContract(contract) {
        const { ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp } = contract;
        try {
            const sql = 'INSERT INTO Contract (ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating contract: ${error.message}`);
        }
    },

    async getContractByID(ContractID) {
        try {
            const [rows] = await db.query('SELECT * FROM Contract WHERE ContractID = ?', [ContractID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching contract by ID: ${error.message}`);
        }
    },
    async getContractByJobID(jobID) {
        try {
            const [rows] = await db.query('SELECT * FROM Contract WHERE JobID = ?', [jobID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching contract by ID: ${error.message}`);
        }
    },

    async updateContract(ContractID, updatedContractData) {
        // Implement logic to update contract details based on ContractID
    },

    async deleteContract(ContractID) {
        try {
            const [result] = await db.query('DELETE FROM Contract WHERE ContractID = ?', [ContractID]);
            return result;
        } catch (error) {
            throw new Error(`Error deleting contract: ${error.message}`);
        }
    },

    // Additional methods related to contracts can be added here
};

module.exports = Contract;
