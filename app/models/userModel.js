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
    async updateUser(id, updatedUserData) {
        const { UserType, FullName, Email, Password, Bio } = updatedUserData;
        try {
            let updateFields = '';
            const updateValues = [];

            if (UserType) {
                updateFields += 'UserType = ?, ';
                updateValues.push(UserType);
            }
            if (FullName) {
                updateFields += 'FullName = ?, ';
                updateValues.push(FullName);
            }
            if (Email) {
                updateFields += 'Email = ?, ';
                updateValues.push(Email);
            }
            if (Password) {
                const hashedPassword = await bcrypt.hash(Password, 10); // Hash the new password
                updateFields += 'Password = ?, ';
                updateValues.push(hashedPassword);
            }
            if (Bio) {
                updateFields += 'Bio = ?, ';
                updateValues.push(Bio);
            }

            // Remove trailing comma and space from updateFields
            updateFields = updateFields.replace(/,\s*$/, '');

            if (updateFields) {
                updateValues.push(id); // Push the user ID to the end for WHERE clause

                const sql = `UPDATE User SET ${updateFields} WHERE UserID = ?`;
                const [result] = await db.query(sql, updateValues);

                return result.affectedRows > 0; // Return true if the user was updated successfully
            } else {
                throw new Error('No fields to update');
            }
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Other methods for updating, deleting users, etc.
};

module.exports = User;
