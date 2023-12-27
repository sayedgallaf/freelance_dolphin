const random = require('nanoid');
const db = require('../config/db');

const SocialModel = {
    async getSocialBySocialID(SocialID) {
        try {
            const [rows] = await db.query('SELECT * FROM Social WHERE SocialID = ?', [SocialID]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching social by ID: ${error.message}`);
        }
    },

    async createSocial(social) {
        try {
            const {SocialID, UserID, URL, SocialType} = social
            const sql = 'INSERT INTO Social (SocialID, UserID, URL, SocialType) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(sql, [SocialID, UserID, URL, SocialType]);
            return result;
        } catch (error) {
            throw new Error(`Error creating social: ${error.message}`);
        }
    },

    async updateSocial(SocialID, URL) {
        try {
            const sql = 'UPDATE Social SET URL = ? WHERE SocialID = ?';
            const [result] = await db.query(sql, [URL, SocialID]);

            if (result.affectedRows === 0) {
                throw new Error('Social not found or update failed');
            }

            return true; // Return true if update was successful
        } catch (error) {
            throw new Error(`Error updating social: ${error.message}`);
        }
    },

    async deleteSocial(SocialID) {
        try {
            const [result] = await db.query('DELETE FROM Social WHERE SocialID = ?', [SocialID]);
            return result;
        } catch (error) {
            throw new Error(`Error deleting social: ${error.message}`);
        }
    },

    async getSocialsByUserID(UserID) {
        try {
            const [rows] = await db.query('SELECT * FROM Social WHERE UserID = ?', [UserID]);
            const result = {};

            rows.forEach(obj => {
              result[obj.SocialType] = {SocialID:obj.SocialID,URL:obj.URL};
            });

            return result;
        } catch (error) {
            throw new Error(`Error fetching socials by UserID: ${error.message}`);
        }
    },

    // Other methods for additional functionalities related to socials...
};

module.exports = SocialModel;
