require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const secretKey = process.env.JWT_KEY; 

function isAdmin(req, res, next) {
  req.session.authData ? (req.session.authData.admin ? next() : res.sendStatus(403)) : res.sendStatus(403);
}

module.exports = isAdmin;