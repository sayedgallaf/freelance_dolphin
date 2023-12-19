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
const {isAdmin, isEmployer, isFreelancer} = require("./middleware/userType")

//controllers
const UserController = require('./controllers/userController');
const ContactController = require('./controllers/contactController');
const JobController = require('./controllers/jobController');
const SkillController = require('./controllers/skillController');
const QuoteController = require('./controllers/quoteController');
const ReportController = require('./controllers/reportController');

//models
const UserModel = require('./models/userModel')
const JobModel = require('./models/jobModel')


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
app.post("/getJobsByUser", JobController.getJobsByUser)
app.post("/searchJobs", JobController.searchAndFilterJobs)

//skill routes
app.post("/getAllSkills", SkillController.getAllSkills)

//quote routes
app.post("/createQuote", isFreelancer, QuoteController.createQuote)

//report routes
app.post("/createReport", ReportController.createReport)


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

app.get("/dashboard", verifyToken, (req,res) => {
    const sidePanelURLs = [
        {href:"/", title:"Jobs"},
        {href:"/", title:"Discussions"},
        {href:"/", title:"Payments"},
        {href:"/", title:"Profile"},
    ]
    res.render("dashboard", {data:{authData:req.session.authData, sidePanelURLs}})
})

app.get("/profile/:UserID", verifyToken, async (req,res) => {
    const UserID = req.params.UserID
    if(!UserID){
        return res.status(404).json({ message: 'Specify UserID' });
    }
    let User;
    try {
        User = await UserModel.getUserById(UserID)
    } catch (error) {
        console.log(error)
    }
    if(!User){
        return res.status(404).json({ message: "User doesn't exist" });
    }
    delete User.Password
    const jobs = await JobModel.getJobsByUser(UserID)
    res.render("profile", {data:{authData:req.session.authData, jobs: jobs ? jobs : [], user:User}})
})


app.listen(PORT, () => {
    console.log(`index.js is running at port ${PORT}`)
})