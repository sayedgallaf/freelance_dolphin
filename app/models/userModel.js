const bcrypt = require('bcrypt');
const db = require('../config/db');

const User = {
    async getAllUsers() {
        try {
            const [rows] = await db.query('SELECT * FROM User');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    },

    async getUserById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM User WHERE UserID = ?', [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching user by ID: ${error.message}`);
        }
    },

    async createUser(user) {
        const { UserID, UserType, FullName, Email, Password, Bio } = user;
        try {
            const hashedPassword = await bcrypt.hash(Password, 10); // Hashing the password

            const sql = 'INSERT INTO User (UserID, UserType, FullName, Email, Password, Bio) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [UserID, UserType, FullName, Email, hashedPassword, Bio]);

            return result.insertId; // Return the ID of the newly created user
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    },

    async comparePasswords(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword); // Compare hashed and plain passwords
        } catch (error) {
            throw new Error(`Error comparing passwords: ${error.message}`);
        }
    },
    async getUserByEmail(email) {
        try {
          const [rows] = await db.query('SELECT * FROM User WHERE Email = ?', [email]);
          return rows.length > 0 ? rows[0] : null; // Return the user object or null if not found
        } catch (error) {
          throw new Error(`Error fetching user by email: ${error.message}`);
        }
    },
    
    // Other methods for updating, deleting users, etc.
};

module.exports = User;
