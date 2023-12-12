const db = require('../config/db');

const Job = {
    async getJobByID(JobID) {
        try {
            const [rows] = await db.query('SELECT * FROM Job WHERE JobID = ?', [JobID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching job by ID: ${error.message}`);
        }
    },

    async getJobsByUser(UserID) {
        try {
            const [rows] = await db.query('SELECT * FROM Job WHERE UserID = ?', [UserID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching jobs by user: ${error.message}`);
        }
    },

    async searchAndFilterJobs({ keyword, filterOptions, pageNumber }) {
        try {
            const limitPerPage = 5; // Results per page

            let sql = `
                SELECT j.*, u.UserID, u.UserType, u.FullName, u.Email, u.ProfilePicURL, u.Bio, COUNT(q.JobID) AS totalQuotes, GROUP_CONCAT(js.SkillID) AS jobSkills
                FROM Job j 
                LEFT JOIN Quote q ON j.JobID = q.JobID
                LEFT JOIN JobSkill js ON j.JobID = js.JobID
                LEFT JOIN User u ON j.UserID = u.UserID
                WHERE (j.Title LIKE ? OR j.Description LIKE ?)`;

            const likeKeyword = `%${keyword}%`;
            const values = [likeKeyword, likeKeyword];

            const { skills, totalQuotesMin, totalQuotesMax, sortBy } = filterOptions;

            if (skills && skills.length > 0) {
                const skillConditions = skills.map(() => 'js.SkillID = ?').join(' OR ');
                sql += ' AND (' + skillConditions + ')';
                values.push(...skills);
            }

            if (totalQuotesMin !== undefined) {
                sql += ' AND j.JobID IN (SELECT JobID FROM Quote GROUP BY JobID HAVING COUNT(*) >= ?)';
                values.push(totalQuotesMin);
            }

            if (totalQuotesMax !== undefined) {
                sql += ' AND j.JobID IN (SELECT JobID FROM Quote GROUP BY JobID HAVING COUNT(*) <= ?)';
                values.push(totalQuotesMax);
            }

            switch (sortBy) {
                case 'newest':
                    sql += ' GROUP BY j.JobID ORDER BY j.Timestamp DESC';
                    break;
                case 'oldest':
                    sql += ' GROUP BY j.JobID ORDER BY j.Timestamp ASC';
                    break;
                case 'mostPopular':
                    sql += ' GROUP BY j.JobID ORDER BY COUNT(q.JobID) DESC';
                    break;
                default:
                    break;
            }

            if (pageNumber && pageNumber > 0) {
                const offset = (pageNumber - 1) * limitPerPage;
                sql += ` LIMIT ${offset}, ${limitPerPage}`;
            } else {
                sql += ` LIMIT ${limitPerPage}`;
            }

            const [rows] = await db.query(sql, values);
            return rows;
        } catch (error) {
            throw new Error(`Error searching and filtering jobs: ${error.message}`);
        }
    },

    async createJob(job) {
        const { JobID, UserID, Title, Description, Timestamp } = job;
        try {
            const sql = 'INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [JobID, UserID, Title, Description, Timestamp]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating job: ${error.message}`);
        }
    },

    async editJob(JobID, updatedJobData) {
        const { Title, Description } = updatedJobData;
        try {
            const sql = 'UPDATE Job SET Title = ?, Description = ? WHERE JobID = ?';
            const [result] = await db.query(sql, [Title, Description, JobID]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating job: ${error.message}`);
        }
    },

    async deleteJob(JobID) {
        try {
            const [result] = await db.query('DELETE FROM Job WHERE JobID = ?', [JobID]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting job: ${error.message}`);
        }
    }
};

module.exports = Job;
