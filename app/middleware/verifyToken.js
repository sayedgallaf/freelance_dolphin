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
        req.session.authData = await User.getUserById(authData.UserID);
        if (req.session.authData) {
          delete req.session.authData.Password;
        }else{
          req.session.authData = null
        }
        if(await User.isUserBanned(authData.UserID)){
          return res.status(403).json({message:"You Have Been Banned"});
        }
        next();
      }
    });
  } else {
    req.session.authData = null;
    next();
  }
}

module.exports = verifyToken;