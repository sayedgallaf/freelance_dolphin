require('dotenv').config();
const User = require('../models/userModel');
const uniqid = require('uniqid'); 
const jwt = require('jsonwebtoken');

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
            const token = jwt.sign({UserID:user.UserID}, process.env.JWT_KEY, { expiresIn: expiresIn1Month });
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
            const UserID = uniqid();
            const { UserType, FullName, Email, Password, Password2 } = req.body;
            const Bio = "";

            if (!UserType || !FullName || !Email || !Password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if(Password != Password2){
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            if(Password.length < 8){
                return res.status(400).json({ message: 'Password must be atleast 8 characters long' });
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
            const token = jwt.sign({UserID:createdUserId}, process.env.JWT_KEY, { expiresIn: expiresIn1Month });
            res.cookie('authorization', token, {
              maxAge: expiresIn1Month * 1000,
              httpOnly: true,
              secure: false
            });

            res.status(201).json({ message: 'User created successfully', userId: createdUserId });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
};

module.exports = UserController;
