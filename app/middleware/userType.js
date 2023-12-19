require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const secretKey = process.env.JWT_KEY; 

function isAdmin(req, res, next) {
  req.session.authData ? (req.session.authData.UserType == "admin" ? next() : res.sendStatus(403)) : res.sendStatus(403);
}
function isEmployer(req, res, next) {
  req.session.authData ? (req.session.authData.UserType == "employer" ||  req.session.authData.UserType == "admin"? next() : res.sendStatus(403)) : res.sendStatus(403);
}
function isFreelancer(req, res, next) {
  req.session.authData ? (req.session.authData.UserType == "freelancer" || req.session.authData.UserType == "admin" ? next() : res.sendStatus(403)) : res.sendStatus(403);
}

module.exports = {
  isAdmin,
  isEmployer,
  isFreelancer
};