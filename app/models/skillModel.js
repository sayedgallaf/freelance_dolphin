const db = require('../config/db');

const Skill = {
    async getAllSkills() {
        try {
            const [rows] = await db.query('SELECT * FROM Skill');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all skills: ${error.message}`);
        }
    },

    async getJobSkills(jobId) {
        try {
            const [rows] = await db.query('SELECT * FROM JobSkill WHERE JobID = ?', [jobId]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching job skills: ${error.message}`);
        }
    },

    async getUserSkills(userId) {
        try {
            const [rows] = await db.query('SELECT * FROM UserSkill WHERE UserID = ?', [userId]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching user skills: ${error.message}`);
        }
    },

    async addSkill(skill) {
        const { SkillID, SkillName } = skill;
        try {
            const sql = 'INSERT INTO Skill (SkillID, SkillName) VALUES (?, ?)';
            const [result] = await db.query(sql, [SkillID, SkillName]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error adding skill: ${error.message}`);
        }
    },

    async addUserSkill(userSkill) {
        const { UserSkillID, UserID, SkillID, SkillName } = userSkill;
        try {
            const checkSkillQuery = 'SELECT * FROM Skill WHERE SkillID = ?';
            const [skillResult] = await db.query(checkSkillQuery, [SkillID]);
    
            if (skillResult.length === 0) {
                // Skill doesn't exist, create it
                const newSkillID = await this.addSkill({ SkillID, SkillName });
                userSkill.SkillID = newSkillID;
            }
    
            const sql = 'INSERT INTO UserSkill (UserSkillID, UserID, SkillID) VALUES (?, ?, ?)';
            const [result] = await db.query(sql, [UserSkillID, UserID, userSkill.SkillID || SkillID]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error adding user skill: ${error.message}`);
        }
    },
    
    async addJobSkill(jobSkill) {
        const { JobSkillID, JobID, SkillID, SkillName } = jobSkill;
        try {
            const checkSkillQuery = 'SELECT * FROM Skill WHERE SkillID = ?';
            const [skillResult] = await db.query(checkSkillQuery, [SkillID]);
    
            if (skillResult.length === 0) {
                // Skill doesn't exist, create it
                const newSkillID = await this.addSkill({ SkillID, SkillName });
                jobSkill.SkillID = newSkillID;
            }
    
            const sql = 'INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES (?, ?, ?)';
            const [result] = await db.query(sql, [JobSkillID, JobID, jobSkill.SkillID || SkillID]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error adding job skill: ${error.message}`);
        }
    },

    async deleteSkill(skillId) {
        try {
            const sql = 'DELETE FROM Skill WHERE SkillID = ?';
            const [result] = await db.query(sql, [skillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting skill: ${error.message}`);
        }
    },

    async deleteUserSkill(userSkillId) {
        try {
            const sql = 'DELETE FROM UserSkill WHERE UserSkillID = ?';
            const [result] = await db.query(sql, [userSkillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting user skill: ${error.message}`);
        }
    },

    async deleteJobSkill(jobSkillId) {
        try {
            const sql = 'DELETE FROM JobSkill WHERE JobSkillID = ?';
            const [result] = await db.query(sql, [jobSkillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting job skill: ${error.message}`);
        }
    },

    async updateSkill(skillId, updatedSkillData) {
        const { SkillName } = updatedSkillData;
        try {
            const sql = 'UPDATE Skill SET SkillName = ? WHERE SkillID = ?';
            const [result] = await db.query(sql, [SkillName, skillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating skill: ${error.message}`);
        }
    },

    async updateUserSkill(userSkillId, updatedUserSkillData) {
        const { UserID, SkillID } = updatedUserSkillData;
        try {
            const sql = 'UPDATE UserSkill SET UserID = ?, SkillID = ? WHERE UserSkillID = ?';
            const [result] = await db.query(sql, [UserID, SkillID, userSkillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating user skill: ${error.message}`);
        }
    },

    async updateJobSkill(jobSkillId, updatedJobSkillData) {
        const { JobID, SkillID } = updatedJobSkillData;
        try {
            const sql = 'UPDATE JobSkill SET JobID = ?, SkillID = ? WHERE JobSkillID = ?';
            const [result] = await db.query(sql, [JobID, SkillID, jobSkillId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating job skill: ${error.message}`);
        }
    }

    // Other methods for Skill CRUD operations
};

module.exports = Skill;
