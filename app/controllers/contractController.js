const Contract = require('../models/contractModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Discussion = require('../models/discussionModel');
const Escrow = require('../models/escrowModel');
const Transaction = require('../models/transactionModel');
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
            const ContractID = random.nanoid(15)
            const EscrowID = random.nanoid(15)
            const EmployerID = req.session.authData ? req.session.authData.UserID : null
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            if (!EmployerID) {
                return res.status(400).json({ message: 'You Must Login' });
            }

            if(req.session.authData.UserType == "freelancer"){
                return res.status(400).json({ message: 'Unauthorized' });
            }
        
            const {DiscussionID, JobID, FreelancerID, Amount, Deadline } = req.body;


            const employer = await User.getUserById(EmployerID)
            if(Number(employer.Balance) < Amount){
                return res.status(400).json({ message: 'Insuffient Funds' });
            }

            const escrow = await Escrow.createEscrow({EscrowID, JobID, EmployerID, Amount, Timestamp})
            if(!escrow){
                return res.status(400).json({ message: 'Error' });
            }
            await User.spendBalance(EmployerID,Amount);

            const createdContractID = await Contract.createContract({
                ContractID,
                EscrowID,
                JobID,
                FreelancerID,
                EmployerID,
                Deadline,
                Timestamp
            });
            await Discussion.updateDiscussionStatus(DiscussionID,"Hired")
            await Job.updateStatus(JobID,"Hired")
            
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

    async endContract(req, res) {
        try {
            const { ContractID, DiscussionID } = req.body;
            const contract = await Contract.getContractByID(ContractID);
            if (!contract) {
                return res.status(404).json({ message: 'Contract not found' });
            }

            const escrow = await Escrow.getEscrowByID(contract.EscrowID);
            if (!escrow) {
                return res.status(404).json({ message: 'Escrow not found' });
            }

            await User.increaseBalance(contract.FreelancerID,escrow.Amount);

            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await Transaction.createTransaction({
                TransactionID:random.nanoid(15), UserID:contract.FreelancerID, TransactionType:`Contract Finished`, Description:`Contract By ${contract.EmployerID}`, Amount:contract.Amount, Timestamp
            })

            await Discussion.updateDiscussionStatus(DiscussionID, "Archived")
            await Job.updateStatus(contract.JobID, "Archived")
            
            res.status(200).json({ message: 'Contract ended successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};

module.exports = ContractController;
