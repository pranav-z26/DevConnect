const express = require('express');

const { isUserAuthenticated } = require('./middlewares/authUser')
const { connectDb } = require('./config/database')
const User = require('./models/user')

const app = express();

const PORT = 7777;

app.use('/', isUserAuthenticated)

app.get('/getUserData', (req, res) => {
    res.send("Got user Data")
})

app.post('/signup', async (req, res) => {

    const user = new User({
        firstName: "Chaitanya",
        lastName: "Batchu",
        emailId: "chaitu@gmail.com",
    })

    try {
        await user.save()
        res.send(`User ${user.firstName} added successfully!!`)
    }
    catch (err) {
        res.status(400).send("Data not added")
    }
})

connectDb().then(() => {
    console.log("Database connection established successfully...");
    app.listen(PORT, () => {
        console.log(`Server running on https://localhost:${PORT}`)
    })
})
    .catch((err) => {
        console.error("Database cannot be connected!!")
    })
