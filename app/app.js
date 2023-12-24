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
const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
const terms = fs.readFileSync(path.resolve("public", "assets", "terms.txt"), "utf-8")
const privacy = fs.readFileSync(path.resolve("public", "assets", "privacy.txt"), "utf-8")


//middleWare
const verifyToken = require("./middleware/verifyToken")
const { isAdmin, isEmployer, isFreelancer } = require("./middleware/userType")

//controllers
const UserController = require('./controllers/userController');
const ContactController = require('./controllers/contactController');
const JobController = require('./controllers/jobController');
const SkillController = require('./controllers/skillController');
const QuoteController = require('./controllers/quoteController');
const ReportController = require('./controllers/reportController');
const ContractController = require('./controllers/contractController');
const ReviewController = require('./controllers/reviewController');

//models
const UserModel = require('./models/userModel')
const JobModel = require('./models/jobModel')
const ContractModel = require('./models/contractModel')
const ReviewModel = require('./models/reviewModel')
const SkillModel = require('./models/skillModel')


//user routers
app.post("/login", UserController.loginUser)

app.post("/signup", UserController.createUser)

app.post("/forgotPassword", UserController.forgotPassword)
app.post("/confirmForgotPassword", UserController.confirmForgotPassword)
app.post("/changePassword", UserController.changePassword)

app.post("/updateProfile", UserController.updateUserProfile)
app.post("/depositBalance", UserController.depositBalance)


//contact routes
app.post("/contact", ContactController.createContact)
app.post("/getAllContacts", isAdmin, ContactController.getAllContacts)
app.post("/deleteContact", isAdmin, ContactController.deleteContact)

//job routes
app.post("/getJobByID", JobController.getJobByID)
app.post("/getJobsByUser", JobController.getJobsByUser)
app.post("/searchJobs", JobController.searchAndFilterJobs)
app.post("/createJob", isEmployer, JobController.createJob)
app.post("/deleteJob", isEmployer, JobController.deleteJob)

//skill routes
app.post("/getAllSkills", SkillController.getAllSkills)
app.post("/addSkill", SkillController.getAllSkills)
app.post("/getAllSkills", SkillController.getAllSkills)

//quote routes
app.post("/createQuote", isFreelancer, QuoteController.createQuote)

//report routes
app.post("/createReport", ReportController.createReport)


//contract routes
app.post("/getAllUserContracts", ContractController.getAllContractsByUserID)

//review routes
app.post("/getReviewByJobID", ReviewController.getReviewByJobID)


app.get("/", verifyToken, (req, res) => {
    res.render("landing", { data: { authData: req.session.authData } })
})

app.get("/terms", verifyToken, (req, res) => {
    res.render("legal", { data: { authData: req.session.authData }, legal: terms })
})

app.get("/privacy", verifyToken, (req, res) => {
    res.render("legal", { data: { authData: req.session.authData }, legal: privacy })
})

app.get("/listings", verifyToken, (req, res) => {
    res.render("listings", { data: { authData: req.session.authData } })
})

app.get("/dashboard/jobs", verifyToken, async (req, res) => {
    const sidePanelURLs = [
        { href: "/dashboard/jobs", title: "Jobs" },
        { href: "/", title: "Discussions" },
        { href: "/profile/"+req.session.authData.UserID, title: "Profile" },
    ]
    const UserID = req.session.authData ? req.session.authData.UserID : null
    if (!UserID) {
        return res.status(404).json({ message: 'You Must Login' });
    }

    try {
        // Get all jobs
        const jobs = await JobModel.getJobsByUser(UserID);

        // Attach contracts to jobs if they exist
        for (const job of jobs) {
            const contract = await ContractModel.getContractByJobID(job.JobID);
            if (contract) {
                // Determine which user to fetch based on session user type
                const oppositeUserType = req.session.authData.UserType === 'freelancer' ? 'employer' : 'freelancer';
                const oppositeUserID = contract[capitalize(oppositeUserType) + 'ID'];

                // Fetch user details of the opposite type
                const oppositeUser = await UserModel.getUserById(oppositeUserID);

                job.contract = {
                    ...contract,
                    user: oppositeUser // Attach opposite user details to the contract
                };
            }
        }

        res.render("dashboardJobs", { data: { jobs, authData: req.session.authData, sidePanelURLs, skills:await SkillModel.getAllSkills() } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get("/profile/:UserID", verifyToken, async (req, res) => {
    const UserID = req.params.UserID;
    if (!UserID) {
        return res.status(404).json({ message: 'Specify UserID' });
    }

    let User;
    try {
        User = await UserModel.getUserById(UserID);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error retrieving user information" });
    }

    if (!User) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    delete User.Password;
    try {
        const jobs = await JobModel.getJobsByUser(UserID);

        if (jobs && jobs.length > 0) {
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                const review = await ReviewModel.getReviewByJobID(job.JobID);
                jobs[i].review = review;
            }
        }

        res.render("profile", {
            data: { authData: req.session.authData, jobs: jobs ? jobs : [], user: User }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error retrieving jobs or reviews" });
    }
});

app.get("/discussion",verifyToken,(req,res) => {
    const UserID = req.session.authData ? req.session.authData.UserID : null
    if (!UserID) {
        return res.status(404).json({ message: 'You Must Login' });
    }
    const sidePanelURLs = [
        { href: "/dashboard/jobs", title: "Jobs" },
        { href: "/", title: "Discussions" },
        { href: "/profile/"+req.session.authData.UserID, title: "Profile" },
    ]
    res.render("discussion",{data:{ authData: req.session.authData, sidePanelURLs}})
})
app.get('/logout', (req, res) => {
    res.clearCookie('authorization'); // Clears the 'authorization' cookie
    req.session.authData = null; // Clear session data if needed
    // Perform any additional logout actions if required

    res.redirect('/'); // Redirect to home page or any other desired location after logout
});

const server = app.listen(PORT, () => {
    console.log(`index.js is running at port ${PORT}`)
})


const io = require('socket.io')(server);


io.on('connection', (socket) => {
    socket.on('message', (message) => {
        io.to(message.room).emit('chat message', {by:message.by, content:message.content}); // Broadcast the message to all connected clients
    });
});