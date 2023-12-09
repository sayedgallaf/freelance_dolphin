const express = require("express")
const app = express()
const PORT = 3000;

const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const verifyToken = require("./middleware/verifyToken")
const UserController = require('./controllers/userController');

app.post("/login", UserController.loginUser)
app.post("/signup", UserController.createUser)

app.get("/", verifyToken, (req,res) => {
    res.render("landing", {data:{authData:req.authData}})
})


app.listen(PORT, () => {
    console.log(`index.js is running at port ${PORT}`)
})