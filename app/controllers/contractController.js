const Contract = require('../models/contractModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const random = require("nanoid");

const ContractController = {
    async getAllContractsByUserID(req, res) {
        try {
            const { UserID } = req.body;
            const contracts = await Contract.getAllContractsByUserID(UserID);

            if (!contracts || contracts.length === 0) {
                return res.status(200).json({ contracts:[] });
            }

            // Fetch user data for each contract
            const contractsWithUserData = await Promise.all(
                contracts.map(async (contract) => {
                    const user = await User.getUserById(contract.UserID);
                    delete user.Password; // Remove password from user data if present
                    contract.user = user;
                    const job = await Job.getJobByID(contract.JobID)
                    contract.job = job;
                    contract.job.Deadline = contract.Deadline
                    return contract;
                })
            );

            res.status(200).json({ contracts: contractsWithUserData });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async getContractByID(req, res) {
        try {
            const { ContractID } = req.body;
            const contract = await Contract.getContractByID(ContractID);

            if (!contract) {
                return res.status(404).json({ message: 'Contract not found' });
            }

            res.status(200).json({ contract });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async createContract(req, res) {
        try {
            const contractData = req.body;

            contractData.ContractID = random.nanoid(15);
            contractData.Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const createdContractID = await Contract.createContract(contractData);

            res.status(201).json({ message: 'Contract created successfully', ContractID: createdContractID });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateContract(req, res) {
        try {
            const { ContractID } = req.body;
            const updatedContractData = req.body;
            const contractUpdated = await Contract.updateContract(ContractID, updatedContractData);

            if (!contractUpdated) {
                return res.status(404).json({ message: 'Contract not found or could not be updated' });
            }

            res.status(200).json({ message: 'Contract updated successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteContract(req, res) {
        try {
            const { ContractID } = req.body;
            const contractDeleted = await Contract.deleteContract(ContractID);

            if (!contractDeleted) {
                return res.status(404).json({ message: 'Contract not found or could not be deleted' });
            }

            res.status(200).json({ message: 'Contract deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};

module.exports = ContractController;
