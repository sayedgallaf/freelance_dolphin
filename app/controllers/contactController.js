const Contact = require('../models/contactModel');
const random = require("nanoid")
const {sendToAdmins} = require('../config/email');

const contactController = {
    async getAllContacts(req, res) {
        try {
            const contacts = await Contact.getAllContact();
            return res.status(200).json({ contacts });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async createContact(req, res) {
        const { Email, Message } = req.body;

        if (!Email || !Message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const contact = { ContactID:random.nanoid(15), UserID: req.session.authData ? req.session.authData.UserID : null, ContactMethod:"Email", ContactDetails:Email, Message };
        sendToAdmins("Freelance Dolphin: Contact Sent", `Email: ${Email}\nMessage: ${Message}`)
        try {
            const createdContactId = await Contact.createContact(contact);
            return res.status(201).json({ message:"Message has been sent successfully." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteContact(req, res) {
        const { contactID } = req.body; // If you're passing the contact ID in the request body for deletion

        try {
            const isDeleted = await Contact.deleteContact(contactID);
            if (isDeleted) {
                return res.status(200).json({ message: 'Contact deleted successfully' });
            } else {
                return res.status(404).json({ message: 'Contact not found or could not be deleted' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Other controller methods for updating contacts, getting contact by ID, etc.
};

module.exports = contactController;
