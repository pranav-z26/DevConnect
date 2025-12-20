const express = require('express');

const { isUserAuthenticated } = require('./middlewares/authUser')
const { connectDb } = require('./config/database')

const app = express();

const PORT = 7777;

app.use('/', isUserAuthenticated)

app.get('/getUserData', (req, res) => {
    res.send("Got user Data")
})

connectDb().then(() => {
    console.log("Database connection established successfully...");
    app.listen(PORT, () => {
        console.log(`Server running on https://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.error("Database cannot be connected!!")
})
