const db = require('../config/db');

const DiscussionModel = {
    async createDiscussion(DiscussionID, JobID, Timestamp, Status) {
        try {
            const sql = 'INSERT INTO Discussion (DiscussionID, JobID, Timestamp, Status) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(sql, [DiscussionID, JobID, Timestamp, Status]);
            return result.insertId; // Return the ID of the newly created discussion
        } catch (error) {
            throw new Error(`Error creating discussion: ${error.message}`);
        }
    },
    async checkIfUserInDiscussion(UserID, DiscussionID) {
        try {
            const sql = `
                SELECT COUNT(*) AS count
                FROM DiscussionUser
                WHERE UserID = ? AND DiscussionID = ?
            `;
            const [result] = await db.query(sql, [UserID, DiscussionID]);
            const userCount = result[0].count || 0;
            return userCount > 0; // Returns true if user is found in the discussion, false otherwise
        } catch (error) {
            throw new Error(`Error checking if user is in discussion: ${error.message}`);
        }
    },

    async addDiscussionUser(DiscussionUserID, DiscussionID, UserID) {
        try {
            const sql = 'INSERT INTO DiscussionUser (DiscussionUserID, DiscussionID, UserID) VALUES (?, ?, ?)';
            await db.query(sql, [DiscussionUserID, DiscussionID, UserID]);
            return true; // Successfully added user to discussion
        } catch (error) {
            throw new Error(`Error adding user to discussion: ${error.message}`);
        }
    },

    async addMedia(MediaID, DiscussionID, UserID, MediaType, MediaURL, Description, Timestamp) {
        try {
            const sql = 'INSERT INTO Media (MediaID, DiscussionID, UserID, MediaType, MediaURL, Description, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [MediaID, DiscussionID, UserID, MediaType, MediaURL, Description, Timestamp]);
            return result.insertId; // Return the ID of the newly added media
        } catch (error) {
            throw new Error(`Error adding media: ${error.message}`);
        }
    },
    async deleteDiscussion(DiscussionID) {
        try {
            const sql = 'DELETE FROM Discussion WHERE DiscussionID = ?';
            const [result] = await db.query(sql, [DiscussionID]);
            return result; // Return true if deletion was successful
        } catch (error) {
            throw new Error(`Error deleting discussion: ${error.message}`);
        }
    },
    async getAllDiscussionsByUserID(UserID) {
        try {
            const sql = `SELECT DU.DiscussionID, R.ReviewID, Co.ContractID, Co.Timestamp as ContractTimestamp, Co.Deadline as ContractDeadline, D.Status as DiscussionStatus, DU.UserID, U.UserType, U.FullName AS UserName,
            D.JobID, J.Title AS JobTitle, J.Description AS JobDescription, J.Status AS JobStatus, J.Timestamp AS JobTimestamp,
            E.EscrowID, E.Amount AS EscrowAmount, E.Timestamp AS EscrowTimestamp,
            (SELECT DU_Freelancer.UserID FROM DiscussionUser DU_Freelancer
                JOIN User U_Freelancer ON DU_Freelancer.UserID = U_Freelancer.UserID
                WHERE DU_Freelancer.DiscussionID = DU.DiscussionID AND U_Freelancer.UserType = 'freelancer') AS FreelancerID,
            (SELECT DU_Employer.UserID FROM DiscussionUser DU_Employer
                JOIN User U_Employer ON DU_Employer.UserID = U_Employer.UserID
                WHERE DU_Employer.DiscussionID = DU.DiscussionID AND U_Employer.UserType = 'employer') AS EmployerID
        FROM DiscussionUser DU
        JOIN User U ON DU.UserID = U.UserID
        JOIN Discussion D ON DU.DiscussionID = D.DiscussionID
        JOIN Job J ON D.JobID = J.JobID
        LEFT JOIN Contract Co ON D.JobID = Co.JobID
        LEFT JOIN Escrow E ON D.JobID = E.JobID
        LEFT JOIN Review R ON D.JobID = R.JobID AND R.ReviewerID = U.UserID
        WHERE DU.UserID = ? ORDER BY D.Timestamp DESC`;
            const discussionsWithJobs = await db.query(sql, [UserID]);
            return discussionsWithJobs[0]; // Return discussions along with associated job details
        } catch (error) {
            throw new Error(`Error fetching discussions and job details: ${error.message}`);
        }
    },
    async getMessagesByDiscussionID(DiscussionID) {
        try {
            const messagesSql = `
                SELECT Message.*, User.FullName 
                FROM Message 
                INNER JOIN User ON Message.UserID = User.UserID 
                WHERE Message.DiscussionID = ? 
                ORDER BY Message.Timestamp ASC
            `;
            const mediaSql = `
                SELECT Media.*, User.FullName 
                FROM Media 
                INNER JOIN User ON Media.UserID = User.UserID 
                WHERE Media.DiscussionID = ? 
                ORDER BY Media.Timestamp ASC
            `;
    
            const [messages] = await db.query(messagesSql, [DiscussionID]);
            const [media] = await db.query(mediaSql, [DiscussionID]);
    
            // Combine messages and media into one array and sort by timestamp
            const combinedArray = [...messages, ...media].sort((a, b) => {
                const timestampA = a.Timestamp || a.MediaTimestamp;
                const timestampB = b.Timestamp || b.MediaTimestamp;
                return new Date(timestampA) - new Date(timestampB);
            });
    
            return combinedArray;
        } catch (error) {
            throw new Error(`Error fetching and sorting messages and media: ${error.message}`);
        }
    },
    async createMessage(MessageID, DiscussionID, UserID, MessageContent, Timestamp) {
        try {
            const sql = 'INSERT INTO Message (MessageID, DiscussionID, UserID, MessageContent, Timestamp) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [MessageID, DiscussionID, UserID, MessageContent, Timestamp]);
            return result; // Return the ID of the newly created message
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`);
        }
    },
    async getDiscussion(DiscussionID) {
        try {
            const sql = 'SELECT * FROM Discussion WHERE DiscussionID = ?';
            const [discussion] = await db.query(sql, [DiscussionID]);
            if (discussion.length === 0) {
                throw new Error('Discussion not found');
            }
            return discussion[0]; // Return the discussion object
        } catch (error) {
            throw new Error(`Error fetching discussion: ${error.message}`);
        }
    },
    async getAllDiscussions() {
        try {
            const sql = `SELECT DU.DiscussionID, DI.DisputeID, DI.Description as DisputeDescription, R.ReviewID, Co.ContractID, Co.Timestamp as ContractTimestamp, Co.Deadline as ContractDeadline, D.Status as DiscussionStatus, DU.UserID, U.UserType, U.FullName AS UserName,
            D.JobID, J.Title AS JobTitle, J.Description AS JobDescription, J.Status AS JobStatus, J.Timestamp AS JobTimestamp,
            E.EscrowID, E.Amount AS EscrowAmount, E.Timestamp AS EscrowTimestamp,
            (SELECT DU_Freelancer.UserID FROM DiscussionUser DU_Freelancer
                JOIN User U_Freelancer ON DU_Freelancer.UserID = U_Freelancer.UserID
                WHERE DU_Freelancer.DiscussionID = DU.DiscussionID AND U_Freelancer.UserType = 'freelancer') AS FreelancerID,
            (SELECT DU_Employer.UserID FROM DiscussionUser DU_Employer
                JOIN User U_Employer ON DU_Employer.UserID = U_Employer.UserID
                WHERE DU_Employer.DiscussionID = DU.DiscussionID AND U_Employer.UserType = 'employer') AS EmployerID
        FROM DiscussionUser DU
        JOIN User U ON DU.UserID = U.UserID
        JOIN Discussion D ON DU.DiscussionID = D.DiscussionID
        JOIN Job J ON D.JobID = J.JobID
        LEFT JOIN Contract Co ON D.JobID = Co.JobID
        LEFT JOIN Escrow E ON D.JobID = E.JobID
        LEFT JOIN Dispute DI ON Co.ContractID = DI.ContractID
        LEFT JOIN Review R ON D.JobID = R.JobID AND R.ReviewerID = U.UserID
        WHERE U.UserType != 'freelancer' ORDER BY D.Timestamp DESC`;
            const [discussion] = await db.query(sql);
            return discussion; // Return the discussion object
        } catch (error) {
            throw new Error(`Error fetching discussion: ${error.message}`);
        }
    },
    async updateDiscussionStatus(DiscussionID, newStatus) {
        try {
            const sql = 'UPDATE Discussion SET Status = ? WHERE DiscussionID = ?';
            const [result] = await db.query(sql, [newStatus, DiscussionID]);

            if (result.affectedRows === 0) {
                throw new Error('Discussion not found or status update failed');
            }

            return true; // Return true if update was successful
        } catch (error) {
            throw new Error(`Error updating discussion status: ${error.message}`);
        }
    },
    async uploadMedia(MediaID, DiscussionID, UserID, MediaType, MediaURL, Timestamp) {
        try {
            const sql = 'INSERT INTO Media (MediaID, DiscussionID, UserID, MediaType, MediaURL, Timestamp) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [MediaID, DiscussionID, UserID, MediaType, MediaURL, Timestamp]);
            return result; // Return the ID of the newly added media
        } catch (error) {
            throw new Error(`Error adding media: ${error.message}`);
        }
    }

    // Additional methods for updating, deleting discussions, messages, users in discussion, media, etc.
};

module.exports = DiscussionModel;
