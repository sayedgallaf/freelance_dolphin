require("dotenv").config();
const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()
const PORT = 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

const terms = fs.readFileSync(path.resolve("public","assets","terms.txt"),"utf-8")
const privacy = fs.readFileSync(path.resolve("public","assets","privacy.txt"),"utf-8")


//middleWare
const verifyToken = require("./middleware/verifyToken")
const isAdmin = require("./middleware/isAdmin")

//controllers
const UserController = require('./controllers/userController');
const ContactController = require('./controllers/contactController');
const JobController = require('./controllers/jobController');


//user routers
app.post("/login", UserController.loginUser)

app.post("/signup", UserController.createUser)

app.post("/forgotPassword", UserController.forgotPassword)
app.post("/confirmForgotPassword", UserController.confirmForgotPassword)
app.post("/changePassword", UserController.changePassword)

//contact routes
app.post("/contact", ContactController.createContact)
app.post("/getAllContacts",isAdmin, ContactController.getAllContacts)
app.post("/deleteContact",isAdmin, ContactController.deleteContact)

//job routes
app.post("/getJobByID", JobController.getJobByID)
app.post("/searchJobs", JobController.searchAndFilterJobs)

app.get("/", verifyToken, (req,res) => {
    res.render("landing", {data:{authData:req.session.authData}})
})

app.get("/terms", verifyToken, (req,res) => {
    res.render("legal", {data:{authData:req.session.authData}, legal:terms})
})

app.get("/privacy", verifyToken, (req,res) => {
    res.render("legal", {data:{authData:req.session.authData}, legal:privacy})
})

app.get("/listings", verifyToken, (req,res) => {
    res.render("listings", {data:{authData:req.session.authData}})
})


app.listen(PORT, () => {
    console.log(`index.js is running at port ${PORT}`)
})