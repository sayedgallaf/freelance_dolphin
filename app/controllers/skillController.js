const Skill = require('../models/skillModel');
const random = require("nanoid")

const SkillController = {
    async getAllSkills(req, res) {
        try {
            const skills = await Skill.getAllSkills();
            res.status(200).json({ skills });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async addSkill(req, res) {
        try {
            const { skills, skillType, UserID, JobID } = req.body;

            if (!skills || !Array.isArray(skills) || skills.length === 0 || !skillType) {
                return res.status(400).json({ message: 'Skills array and skillType are required' });
            }

            const createdSkillIds = [];

            for (const skill of skills) {
                const SkillID = random.nanoid(15);
                const { SkillName } = skill;

                if (!SkillID || !SkillName) {
                    return res.status(400).json({ message: 'SkillID and SkillName are required' });
                }

                const newSkill = {
                    SkillID,
                    SkillName
                };

                await Skill.addSkill(newSkill);
                createdSkillIds.push(SkillID);

                if (skillType === 'user' && UserID) {
                    const userSkill = {
                        UserSkillID: random.nanoid(15),
                        UserID,
                        SkillID
                    };
                    await Skill.addUserSkill(userSkill);
                } else if (skillType === 'job' && JobID) {
                    const jobSkill = {
                        JobSkillID: random.nanoid(15),
                        JobID,
                        SkillID
                    };
                    await Skill.addJobSkill(jobSkill);
                }
            }

            res.status(201).json({ message: 'Skills added successfully', skillIds: createdSkillIds });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteSkill(req, res) {
        try {
            const { skillId } = req.params;

            const deleted = await Skill.deleteSkill(skillId);

            if (deleted) {
                res.status(200).json({ message: 'Skill deleted successfully' });
            } else {
                res.status(404).json({ message: 'Skill not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateSkill(req, res) {
        try {
            const { skillId } = req.params;
            const { SkillName } = req.body;

            const updatedSkillData = {
                SkillName
            };

            const updated = await Skill.updateSkill(skillId, updatedSkillData);

            if (updated) {
                res.status(200).json({ message: 'Skill updated successfully' });
            } else {
                res.status(404).json({ message: 'Skill not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async addUserSkill(req, res) {
        try {
            const { skills, UserID } = req.body;

            if (!skills || !Array.isArray(skills) || skills.length === 0 || !UserID) {
                return res.status(400).json({ message: 'Skills array and UserID are required' });
            }

            const createdUserSkillIds = [];

            for (const skill of skills) {
                const { SkillID } = skill;

                if (!SkillID) {
                    return res.status(400).json({ message: 'SkillID is required in each skill object' });
                }

                const userSkill = {
                    UserSkillID: random.nanoid(15),
                    UserID,
                    SkillID
                };

                const createdUserSkillId = await Skill.addUserSkill(userSkill);
                createdUserSkillIds.push(createdUserSkillId);
            }

            res.status(201).json({ message: 'User Skills added successfully', userSkillIds: createdUserSkillIds });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async addJobSkill(req, res) {
        try {
            const { skills, JobID } = req.body;

            if (!skills || !Array.isArray(skills) || skills.length === 0 || !JobID) {
                return res.status(400).json({ message: 'Skills array and JobID are required' });
            }

            const createdJobSkillIds = [];

            for (const skill of skills) {
                const { SkillID } = skill;

                if (!SkillID) {
                    return res.status(400).json({ message: 'SkillID is required in each skill object' });
                }

                const jobSkill = {
                    JobSkillID: random.nanoid(15),
                    JobID,
                    SkillID
                };

                const createdJobSkillId = await Skill.addJobSkill(jobSkill);
                createdJobSkillIds.push(createdJobSkillId);
            }

            res.status(201).json({ message: 'Job Skills added successfully', jobSkillIds: createdJobSkillIds });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },


    // Other methods for handling skill-related functionalities
};

module.exports = SkillController;
