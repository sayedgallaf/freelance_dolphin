const db = require('../config/db');

const Contact = {
    async getAllContact() {
        try {
            const [rows] = await db.query('SELECT * FROM Contact');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching contacts: ${error.message}`);
        }
    },

    async createContact(contact) {
        const { ContactID, UserID, ContactMethod, ContactDetails, Message } = contact;
        try {
            const sql = 'INSERT INTO Contact (ContactID, UserID, ContactMethod, ContactDetails, Message) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [ContactID, UserID, ContactMethod, ContactDetails, Message]);

            return result.insertId; // Return the ID of the newly created contact
        } catch (error) {
            throw new Error(`Error creating contact: ${error.message}`);
        }
    },

    async deleteContact(contactID) {
        try {
            const sql = 'DELETE FROM Contact WHERE ContactID = ?';
            const [result] = await db.query(sql, [contactID]);

            return result.affectedRows > 0; // Return true if contact was deleted successfully
        } catch (error) {
            throw new Error(`Error deleting contact: ${error.message}`);
        }
    }

    // Other methods for updating contacts, getting contact by ID, etc.
};

module.exports = Contact;
