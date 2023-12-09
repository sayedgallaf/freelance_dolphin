const express = require("express")
const app = express()
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req,res) => {
    res.render("landing")
})
app.get("/test", (req,res) => {
    res.render("dialogText")
})


app.listen(PORT, () => {
    console.log(`index.js is running at port ${PORT}`)
})