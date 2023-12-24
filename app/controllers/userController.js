require('dotenv').config();
const User = require('../models/userModel');
const random = require("nanoid")
const jwt = require('jsonwebtoken');
const resend = require('../config/email');

const UserController = {
    async loginUser(req, res) {
        try {
            const { Email, Password } = req.body;

            if (!Email || !Password) {
                return res.status(400).json({ message: 'Email and Password are required' });
            }

            const user = await User.getUserByEmail(Email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const passwordMatch = await User.comparePasswords(Password, user.Password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const expiresIn1Month = 30 * 24 * 60 * 60;
            const token = jwt.sign({ UserID: user.UserID }, process.env.JWT_KEY, { expiresIn: expiresIn1Month });
            res.cookie('authorization', token, {
                maxAge: expiresIn1Month * 1000,
                httpOnly: true,
                secure: false
            });

            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async createUser(req, res) {
        try {
            const UserID = random.nanoid(15);
            const { UserType, FullName, Email, Password, Password2 } = req.body;
            const Bio = "";

            if (!UserType || !FullName || !Email || !Password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (Password != Password2) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            if (Password.length < 8) {
                return res.status(400).json({ message: 'Password must be atleast 8 characters long' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }
    
            // Validate full name length
            if (FullName.length <= 3) {
                return res.status(400).json({ message: 'Full name must be longer than 3 characters' });
            }

            const existingUser = await User.getUserByEmail(Email);

            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            

            const newUser = {
                UserID,
                UserType,
                FullName,
                Email,
                Password,
                Bio
            };

            const createdUserId = await User.createUser(newUser);

            const expiresIn1Month = 30 * 24 * 60 * 60;
            const token = jwt.sign({ UserID: UserID }, process.env.JWT_KEY, { expiresIn: expiresIn1Month });
            res.cookie('authorization', token, {
                maxAge: expiresIn1Month * 1000,
                httpOnly: true,
                secure: false
            });
            console.log("test")
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async forgotPassword(req, res) {
        try {
            const { Email } = req.body;
            if (!Email) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const user = await User.getUserByEmail(Email);

            if (!user) {
                return res.status(404).json({ message: 'Email not found' });
            }
            req.session.Email = Email;
            req.session.ForgotPasswordCode = random.customAlphabet("1234567890", 6)()
            resend.emails.send({
                from: 'support@dolphin.directory',
                to: Email,
                subject: 'Freelance Dolphin: Change Password Request',
                text: 'This is your 6 digit code: ' + req.session.ForgotPasswordCode
            })
            res.status(201).json({ message: 'Email has been sent' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async confirmForgotPassword(req, res) {
        try {
            const { ForgotPasswordCode } = req.body;

            if (!ForgotPasswordCode) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            if (ForgotPasswordCode != req.session.ForgotPasswordCode) {
                return res.status(400).json({ message: 'Wrong Confirmation Code' });
            }

            const user = await User.getUserByEmail(req.session.Email);

            if (!user) {
                return res.status(404).json({ message: 'Email not found' });
            }

            const expiresIn1Month = 30 * 24 * 60 * 60;
            const token = jwt.sign({ UserID: user.UserID }, process.env.JWT_KEY, { expiresIn: expiresIn1Month });
            res.cookie('authorization', token, {
                maxAge: expiresIn1Month * 1000,
                httpOnly: true,
                secure: false
            });

            res.status(201).json({ message: 'Confirmed Successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async changePassword(req, res) {
        try {
            const { Password, Password2 } = req.body;
            if (!req.session.authData) {
                return res.status(401).send('Unauthorized');
            }

            if (Password != Password2) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            if (Password.length < 8) {
                return res.status(400).json({ message: 'Password must be atleast 8 characters long' });
            }

            const user = await User.getUserById(req.session.authData.UserID);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            User.updateUser(user.UserID, { Password })

            res.status(201).json({ message: 'Password Changed' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async updateUserProfile(req, res) {
        try {
            const { type, value } = req.body;

            const UserID = req.session.authData ? req.session.authData.UserID : null;
            if (!UserID) {
                return res.status(400).json({ message: 'Unauthorized' });
            }

            const allowedTypes = ['FullName', 'Bio', 'Email'];

            if (!type || !value || !allowedTypes.includes(type)) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            const user = await User.getUserById(UserID);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let updatedUserData = {};

            if (type === 'FullName') {
                updatedUserData.FullName = value;
            } else if (type === 'Bio') {
                updatedUserData.Bio = value;
            } else if (type === 'Email') {
                // Check if the provided email already exists
                const existingUser = await User.getUserByEmail(value);

                if (existingUser && existingUser.UserID !== UserID) {
                    return res.status(409).json({ message: 'Email already exists' });
                }

                updatedUserData.Email = value;
            }

            const isUpdated = await User.updateUser(UserID, updatedUserData);

            if (isUpdated) {
                res.status(200).json({ message: 'Profile updated successfully' });
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async depositBalance(req,res){
        const UserID = req.session.authData ? req.session.authData.UserID : null;
        const {amount} = req.body
        if (!UserID) {
            return res.status(400).json({ message: 'Unauthorized' });
        }
        if (isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid amount provided' });
        }
        if(Number(amount) < 0){
            return res.status(400).json({ message: 'Invalid amount provided' });
        }
        await User.increaseBalance(UserID,amount)

        res.status(201).json({ message: 'Balance Added!' });
    }
};

module.exports = UserController;
