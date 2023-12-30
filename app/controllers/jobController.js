const Job = require('../models/jobModel');
const Skill = require('../models/skillModel');
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
                return res.status(200).json({ message: 'No jobs found for the provided criteria', jobs:[] });
            }
    
            res.status(200).json({ jobs });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async createJob(req, res) {
        try {
            const UserID = req.session.authData ? req.session.authData.UserID : null
            const JobID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const {Title, Description, Skills} = req.body;
            

            if (!JobID || !UserID || !Title || !Description || !Timestamp) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            
            const newJob = {
                JobID,
                UserID,
                Title,
                Description,
                Timestamp
            };
            
            const createdJobID = await Job.createJob(newJob);

            if (Array.isArray(Skills) && Skills.length > 0) {
                for (const skill of Skills) {
                    if (!skill.id) {
                        // If the skill ID is null, it's a new skill
                        const { value: SkillName } = skill;
                        await Skill.addJobSkill({
                            JobSkillID: random.nanoid(15),
                            JobID: JobID,
                            SkillID: random.nanoid(15), // Assuming SkillID is null for a new skill
                            SkillName // Add the new SkillName
                        });
                    } else {
                        // If skill ID exists, associate it with the job
                        await Skill.addJobSkill({
                            JobSkillID: random.nanoid(15),
                            JobID: JobID,
                            SkillID: skill.id
                        });
                    }
                }
            }

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
            const job = await Job.getJobByID(JobID);
            const UserID = req.session.authData ? req.session.authData.UserID : null

            if(!UserID){
                return res.status(404).json({ message: 'Unauthorized' });
            }

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }
            if(job.Status != "Active" && job.Status != "Archived"){
                return res.status(400).json({ message: 'Job must either be active or archived to get deleted' });
            }
            
            if(req.session.authData.UserType != "admin" && job.UserID != UserID){
                return res.status(400).json({ message: 'Unauthorized' });
            }

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
