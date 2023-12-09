require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const secretKey = process.env.JWT_KEY; 

function verifyToken(req, res, next) {
  const token = req.cookies.authorization;
  if (typeof token !== 'undefined') {
    jwt.verify(token, secretKey, async (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        req.authData = await User.getUserById(authData.UserID);
        next();
      }
    });
  } else {
    req.authData = null;
    next();
  }
}

module.exports = verifyToken;