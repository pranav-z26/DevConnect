const express = require('express');

const {isUserAuthenticated} = require('../middlewares/authUser')

const app = express();

const PORT = 7777;

app.use('/', isUserAuthenticated)

app.get('/getUserData', (req, res) => {
    res.send("Got user Data")
})

app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`)
})