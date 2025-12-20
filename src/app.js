const express = require('express');

const { isUserAuthenticated } = require('./middlewares/authUser')
const { connectDb } = require('./config/database')
const User = require('./models/user')

const app = express();

const PORT = 7777;

app.use('/', isUserAuthenticated)
app.use(express.json());

// both middlewares will be applied to all routes, in one line below
// app.use('/', express.json(), isUserAuthenticated);
// app.use(express.json(), isUserAuthenticated); equivalent path as above line

app.get('/getUserData', (req, res) => {
    res.send("Got user Data")
})

app.post('/signup', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        res.send(`User ${user.firstName} added successfully!!`)
    }
    catch (err) {
        res.status(400).send("Data not added")
    }
})

app.get('/feed', async (req, res) => {

    //get all users available in database

    try {
        const users = await User.find({})
        if (users.length === 0) {
            return res.status(404).send("No users found")
        }
        else {
            res.send(users)
        }
    } catch (err) {
        res.status(500).send("Error fetching users")
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
