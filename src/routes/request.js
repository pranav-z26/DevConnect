const express = require('express');
const { userAuth } = require("../middlewares/authUser");

const connectionRouter = express.Router();

connectionRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    //Sending connection request
    res.send("Connection Req Sent");
});

module.exports = connectionRouter;