const bcrypt = require('bcrypt');
const db = require('../config/db');
const random = require("nanoid")

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
            const [userRows] = await db.query('SELECT * FROM User WHERE UserID = ?', [id]);
    
            if (userRows.length === 0) {
                return null;
            }
    
            const user = userRows[0];
    
            const [skillRows] = await db.query(
                'SELECT s.SkillID, s.SkillName FROM Skill s INNER JOIN UserSkill us ON s.SkillID = us.SkillID WHERE us.UserID = ?',
                [id]
            );
    
            const skills = skillRows.map((row) => ({
                skillId: row.SkillID,
                skillName: row.SkillName
            }));
    
            user.skills = skills;
    
            return user;
        } catch (error) {
            // Handle the error gracefully
            return null;
        }
    },
    
    

    async createUser(user) {
        const { UserID, UserType, FullName, Email, Password, Bio, ProfilePicURL, Balance } = user;
        try {
            const hashedPassword = await bcrypt.hash(Password, 10); // Hashing the password
            const sql = 'INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Balance, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [UserID, UserType, FullName, Email, hashedPassword, ProfilePicURL, Balance, Bio]);

            return result.insertId; // Return the ID of the newly created user
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    },
    async spendBalance(userId, amount) {
        try {
            const [userRow] = await db.query('SELECT Balance FROM User WHERE UserID = ?', [userId]);

            if (userRow.length === 0) {
                throw new Error('User not found');
            }

            const userBalance = userRow[0].Balance;

            if (Number(userBalance) < amount) {
                throw new Error('Insufficient balance');
            }

            const updatedBalance = userBalance - amount;

            const updateResult = await db.query('UPDATE User SET Balance = ? WHERE UserID = ?', [updatedBalance, userId]);

            return updateResult[0].affectedRows > 0;
        } catch (error) {
            throw new Error(`Error spending balance: ${error.message}`);
        }
    },
    async increaseBalance(userId, amount) {
        try {
            // Increment the balance by the specified amount
            const updateResult = await db.query('UPDATE User SET Balance = Balance + ? WHERE UserID = ?', [Number(amount), userId]);
    
            return updateResult[0].affectedRows > 0;
        } catch (error) {
            throw new Error(`Error increasing balance: ${error.message}`);
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
        const { UserType, FullName, Email, Password, Bio, ProfilePicURL } = updatedUserData;
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
            
            if (ProfilePicURL) {
                updateFields += 'ProfilePicURL = ?, ';
                updateValues.push(ProfilePicURL);
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
    },

    async banUser(UserID, bannedUntil) {
        try {
            const BannedUserID = random.nanoid(15); // Generate a unique BannedUserID
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get the current timestamp
            
            const sql = 'INSERT INTO BannedUser (BannedUserID, UserID, Timestamp, bannedUntil) VALUES (?, ?, ?, ?)';
            await db.query(sql, [BannedUserID, UserID, Timestamp, bannedUntil]);

            return BannedUserID; // Return the ID of the newly created banned user record
        } catch (error) {
            throw new Error(`Error banning user: ${error.message}`);
        }
    },

    async isUserBanned(UserID) {
        try {
            const [rows] = await db.query('SELECT * FROM BannedUser WHERE UserID = ? AND bannedUntil > NOW()', [UserID]);
            return rows.length > 0; // Return true if the user is found in the banned users list and not expired
        } catch (error) {
            throw new Error(`Error checking if user is banned: ${error.message}`);
        }
    },
    async unbanUser(UserID) {
        try {
            const sql = 'DELETE FROM BannedUser WHERE UserID = ?';
            const [result] = await db.query(sql, [UserID]);

            return result.affectedRows > 0; // Return true if the user's ban record was deleted successfully
        } catch (error) {
            throw new Error(`Error unbanning user: ${error.message}`);
        }
    }

    // Other methods for updating, deleting users, etc.
};

module.exports = User;
