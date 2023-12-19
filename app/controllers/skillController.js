const Skill = require('../models/skillModel');

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
            const { SkillID, SkillName } = req.body;

            if (!SkillID || !SkillName) {
                return res.status(400).json({ message: 'SkillID and SkillName are required' });
            }

            const newSkill = {
                SkillID,
                SkillName
            };

            const createdSkillId = await Skill.addSkill(newSkill);

            res.status(201).json({ message: 'Skill added successfully', skillId: createdSkillId });
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
    }

    // Other methods for handling skill-related functionalities
};

module.exports = SkillController;
