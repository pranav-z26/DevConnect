const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { validateSignupData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //dont trust the data coming from client side

    //Validate data - best practice id create a utility function for validation
    validateSignupData(req);

    //Encrypt password - using bcrypt npm package

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    //Creating new instance of User model
    const user = new User({
      ...req.body,
      password: passwordHash,
    });
    await user.save();
    res.send(`User ${user.firstName} added successfully!!`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const enteredPassword = req.body.password;

    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      throw new Error("Invalid credentails!!");
    }

    const isUserAuthenticated = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    if (isUserAuthenticated) {
      //generate a jwt token and send it to user

      const token = await jwt.sign({ _id: user._id }, "Devconnect@Pranav$26", {expiresIn: "1h"});

      res.cookie("token", token);
      res.json({
        message: "Logged in successfully!!",
        data: user,
      });
    } else {
      throw new Error("Invalid credentails!!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {

  // res.cookie("token", null, { expires: new Date(Date.now())});
  // Alternatively, you can use res.clearCookie to remove the cookie

  res.clearCookie("token");
  res.send("Logged out successfully!!");
});

module.exports = authRouter;