const Social = require('../models/socialModel');
const random = require('nanoid');

const SocialController = {
    async getSocialBySocialID(req, res) {
        try {
            const { SocialID } = req.body;
            const social = await Social.getSocialBySocialID(SocialID);

            if (!social) {
                return res.status(404).json({ message: 'Social not found' });
            }

            res.status(200).json({ social });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async createSocial(req, res) {
        try {
            const { UserID, URL, SocialType } = req.body;
            const SocialID = random.nanoid(15);

            if (!SocialID || !UserID || !URL || !SocialType) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newSocial = {
                SocialID,
                UserID,
                URL,
                SocialType,
            };

            const createdSocialID = await Social.createSocial(newSocial);

            res.status(201).json({ message: 'Social created successfully', SocialID: createdSocialID });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateSocial(req, res) {
        try {
            const { SocialID, URL } = req.body;
            const socialUpdated = await Social.updateSocial(SocialID, URL);

            if (!socialUpdated) {
                return res.status(404).json({ message: 'Social not found or could not be updated' });
            }

            res.status(200).json({ message: 'Social updated successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteSocial(req, res) {
        try {
            const { SocialID } = req.body;
            const socialDeleted = await Social.deleteSocial(SocialID);

            if (!socialDeleted) {
                return res.status(404).json({ message: 'Social not found or could not be deleted' });
            }

            res.status(200).json({ message: 'Social deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getSocialsByUserID(req, res) {
        try {
            const { UserID } = req.body;
            const socials = await Social.getSocialsByUserID(UserID);

            if (!socials || socials.length === 0) {
                return res.status(404).json({ message: 'No socials found for this user' });
            }

            res.status(200).json(socials);
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};

module.exports = SocialController;
