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

    async createMessage(MessageID, DiscussionID, UserID, MessageContent, Timestamp) {
        try {
            const sql = 'INSERT INTO Message (MessageID, DiscussionID, UserID, MessageContent, Timestamp) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [MessageID, DiscussionID, UserID, MessageContent, Timestamp]);
            return result.insertId; // Return the ID of the newly created message
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`);
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
            return result.affectedRows > 0; // Return true if deletion was successful
        } catch (error) {
            throw new Error(`Error deleting discussion: ${error.message}`);
        }
    }

    // Additional methods for updating, deleting discussions, messages, users in discussion, media, etc.
};

module.exports = DiscussionModel;
