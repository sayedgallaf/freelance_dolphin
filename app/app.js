require("dotenv").config();
const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()
const PORT = 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const {rateLimit} = require("express-rate-limit")

const limiter = rateLimit({
	windowMs: 60 * 1000, // 15 minutes
	limit: 1000, 
	legacyHeaders: false
})
app.use(limiter)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'media/');
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + extname); // Rename the file
    }
});
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ProfilePic/');
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + extname); // Rename the file
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // Set file size limit if needed (in bytes)
})
const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: 100000000 }, // Set file size limit if needed (in bytes)
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));


// Initialize Multer upload variable

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
const terms = fs.readFileSync(path.resolve("public", "assets", "terms.txt"), "utf-8")
const privacy = fs.readFileSync(path.resolve("public", "assets", "privacy.txt"), "utf-8")


//middleWare
const verifyToken = require("./middleware/verifyToken")
const { isAdmin, isEmployer, isFreelancer, isLoggedIn } = require("./middleware/userType")

//controllers
const UserController = require('./controllers/userController');
const ContactController = require('./controllers/contactController');
const JobController = require('./controllers/jobController');
const SkillController = require('./controllers/skillController');
const QuoteController = require('./controllers/quoteController');
const ReportController = require('./controllers/reportController');
const ContractController = require('./controllers/contractController');
const ReviewController = require('./controllers/reviewController');
const DiscussionController = require('./controllers/discussionController');
const DisputeController = require('./controllers/disputeController');
const SocialController = require('./controllers/socialController');

//models
const UserModel = require('./models/userModel')
const JobModel = require('./models/jobModel')
const ContractModel = require('./models/contractModel')
const ReviewModel = require('./models/reviewModel')
const QuoteModel = require('./models/quoteModel')
const SkillModel = require('./models/skillModel')
const DiscussionModel = require("./models/discussionModel")
const SocialModel = require("./models/socialModel")


//user routers
app.post("/login", UserController.loginUser)

app.post("/signup", UserController.createUser)

app.post("/forgotPassword", UserController.forgotPassword)
app.post("/confirmForgotPassword", UserController.confirmForgotPassword)
app.post("/changePassword", UserController.changePassword)

app.post("/updateProfile",isLoggedIn, UserController.updateUserProfile)
app.post("/updateProfilePic",isLoggedIn,uploadProfile.single("ProfilePic"), UserController.updateUserProfile)
app.post("/depositBalance",isLoggedIn, UserController.depositBalance)

app.post("/giveAdmin",isAdmin, UserController.giveAdmin)
app.post("/banUser",isAdmin, UserController.banUser)
app.post("/unbanUser",isAdmin, UserController.unbanUser)


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

//quote routes
app.post("/createQuote", isFreelancer, QuoteController.createQuote)

//report routes
app.post("/createReport", ReportController.createReport)


//contract routes
app.post("/createContract", isEmployer, ContractController.createContract)
app.post("/endContract", isEmployer, ContractController.endContract)

//review routes
app.post("/getReviewByJobID", ReviewController.getReviewByJobID)
app.post("/addReview",isLoggedIn, ReviewController.addReview)

//discussion router
app.post("/getDiscussion",isLoggedIn, DiscussionController.getDiscussion)
app.post("/deleteDiscussion",isLoggedIn, DiscussionController.deleteDiscussion)
app.post("/interested",isLoggedIn, DiscussionController.interested)
app.post("/createMessage",isLoggedIn, DiscussionController.createMessage)
app.post("/uploadMedia",isLoggedIn,upload.single("mediaFile"), DiscussionController.uploadMedia, (req,res) => {
    const { DiscussionID } = req.body;
    io.to(DiscussionID).emit('media', {by:req.session.authData.FullName, media:req.file.filename, UserID: req.session.authData.UserID}); // Broadcast the message to all connected clients     
})

//dispute routes
app.post("/createDispute",isLoggedIn,DisputeController.createDispute)
app.post("/resolveDispute",isAdmin,DisputeController.resolveDispute)
app.post("/cancelDispute",isAdmin,DisputeController.cancelDispute)

//social routes
app.post("/createSocial",isLoggedIn, SocialController.createSocial)
app.post("/updateSocial",isLoggedIn, SocialController.updateSocial)

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

app.get("/dashboard", verifyToken, async (req, res) => {
    const sidePanelURLs = [
        { href: "/dashboard", title: "Jobs" },
        { href: "/discussion", title: "Discussions" },
        { href: "/profile/", title: "Profile" },
    ]
    const UserID = req.session.authData ? req.session.authData.UserID : null
    if (!UserID) {
        return res.status(404).json({ message: 'You Must Login' });
    }
    if(req.session.authData.UserType == "admin"){
        return res.redirect("/watchroom")
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

app.get("/watchroom", verifyToken, isAdmin, async (req, res) => {
    const sidePanelURLs = [
        { href: "/watchroom", title: "Jobs" },
        { href: "/watchroomDiscussions", title: "Discussions" },
        { href: "/profile/", title: "Profile" },
    ]

    try {
        // Get all jobs
        const jobs = await JobModel.getAllJobs()

        // Attach contracts to jobs if they exist
        for (const job of jobs) {
            const contract = await ContractModel.getContractByJobID(job.JobID);
            if (contract) {

                const EmployerID = contract['EmployerID'];

                // Fetch user details of the opposite type
                const employer = await UserModel.getUserById(EmployerID);

                job.contract = {
                    ...contract,
                    user: employer // Attach opposite user details to the contract
                };
            }
        }

        res.render("dashboardJobs", { data: { jobs, authData: req.session.authData, sidePanelURLs, skills:await SkillModel.getAllSkills() } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get("/watchroomDiscussions", verifyToken, isAdmin, async (req,res) => {
    const sidePanelURLs = [
        { href: "/watchroom", title: "Jobs" },
        { href: "/watchroomDiscussions", title: "Discussions" },
        { href: "/profile/", title: "Profile" },
    ]

    let skills = await SkillModel.getAllSkills()
    const discussions = await DiscussionModel.getAllDiscussions();
    res.render("discussion",{data:{ authData: req.session.authData, sidePanelURLs, discussions, skills}})
})

app.get("/profile/:UserID?", verifyToken, async (req, res) => {
    const UserID = req.params.UserID ? req.params.UserID : (req.session.authData ? req.session.authData.UserID : null);
    if (!UserID) {
        return res.status(404).json({ message: 'Specify UserID' });
    }

    let User;
    try {
        User = await UserModel.getUserById(UserID);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving user information" });
    }

    if (!User) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    delete User.Password;

    let skills = await SkillModel.getAllSkills()
    let socials = await SocialModel.getSocialsByUserID(UserID)

    try {
        const jobs = await JobModel.getJobsByUser(UserID);

        if (jobs && jobs.length > 0) {
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                const review = await ReviewModel.getReviewByJobID(job.JobID, UserID);
                jobs[i].review = review;
            }
        }

        res.render("profile", {
            data: { authData: req.session.authData, jobs: jobs ? jobs : [], user: User, skills, socials }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving jobs or reviews" });
    }
});

app.get("/discussion", verifyToken, async (req,res) => {
    const UserID = req.session.authData ? req.session.authData.UserID : null
    if (!UserID) {
        return res.status(404).json({ message: 'You Must Login' });
    }
    const sidePanelURLs = [
        { href: "/dashboard", title: "Jobs" },
        { href: "/discussion", title: "Discussions" },
        { href: "/profile/", title: "Profile" }
    ]

    let skills = await SkillModel.getAllSkills()
    const discussions = await DiscussionModel.getAllDiscussionsByUserID(UserID);
    res.render("discussion",{data:{ authData: req.session.authData, sidePanelURLs, discussions, skills}})
})

app.get("/media/:DiscussionID/:filename",isLoggedIn, (req,res) => {
    const { DiscussionID, filename } = req.params;
    const userCheck = DiscussionModel.checkIfUserInDiscussion(req.session.authData.UserID,DiscussionID)
    if(req.session.authData.UserType != "admin" && !userCheck){
        return res.status(400).json({ message: 'Unauthorized' });
    }
    res.sendFile(path.resolve("media", filename))
})
app.get("/ProfilePic/:filename", (req,res) => {
    const { filename } = req.params;
    const filePath = path.resolve("ProfilePic", filename)
    const fileExists = fs.existsSync(filePath)
    if(fileExists){
        return res.sendFile(filePath)
    }else{
        return res.sendStatus(404)
    }
})

app.get('/logout',isLoggedIn, (req, res) => {
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
    socket.on('joinRoom', (roomName) => {
        const rooms = Array.from(socket.adapter.rooms).map(([value]) => value);
        rooms.forEach(room => {
            socket.leave(room);
        });
        socket.join(roomName); 
    });
    socket.on('message', (message) => {
        io.to(message.room).emit('message', {by:message.by, content:message.content, UserID: message.UserID}); // Broadcast the message to all connected clients     
    });
});