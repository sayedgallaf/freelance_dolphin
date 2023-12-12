const Job = require('../models/jobModel');
const random = require("nanoid")

const JobController = {
    async getJobByID(req, res) {
        try {
            const { JobID } = req.body;
            const job = await Job.getJobByID(JobID);

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.status(200).json({ job });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getJobsByUser(req, res) {
        try {
            const { UserID } = req.body;
            const jobs = await Job.getJobsByUser(UserID);

            if (!jobs || jobs.length === 0) {
                return res.status(404).json({ message: 'No jobs found for this user' });
            }

            res.status(200).json({ jobs });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async searchAndFilterJobs(req, res) {
        try {
            const { keyword, filterOptions, pageNumber } = req.body;
    
            const jobs = await Job.searchAndFilterJobs({ keyword, filterOptions, pageNumber });
    
            if (!jobs || jobs.length === 0) {
                return res.status(404).json({ message: 'No jobs found for the provided criteria' });
            }
    
            res.status(200).json({ jobs });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async createJob(req, res) {
        try {
            const jobData = req.body;

            jobData.JobID = random.nanoid(15);
            jobData.Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const createdJobID = await Job.createJob(jobData);

            res.status(201).json({ message: 'Job created successfully', JobID: createdJobID });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async editJob(req, res) {
        try {
            const { JobID } = req.body;
            const updatedJobData = req.body;
            const jobUpdated = await Job.editJob(JobID, updatedJobData);

            if (!jobUpdated) {
                return res.status(404).json({ message: 'Job not found or could not be updated' });
            }

            res.status(200).json({ message: 'Job updated successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteJob(req, res) {
        try {
            const { JobID } = req.body;
            const jobDeleted = await Job.deleteJob(JobID);

            if (!jobDeleted) {
                return res.status(404).json({ message: 'Job not found or could not be deleted' });
            }

            res.status(200).json({ message: 'Job deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};

module.exports = JobController;
