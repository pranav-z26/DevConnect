const express = require("express");
const { userAuth } = require("../middlewares/authUser");
const profileRouter = express.Router();
const { validateProfileEditData, validatePasswordUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: "User fetched successfully!!",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //sanitize req coming from user- in utils file
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request!!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));

    await loggedInUser.save();
    res.json({ message: "Profile updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // `loggedInUser` is a Mongoose document; call document deletion method
    await loggedInUser.deleteOne();
    res.clearCookie("token"); //clearing cookie on deletion

    res.json({ message: `${loggedInUser.firstName}'s profile deleted successfully` });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    //validate user req body for password update in utils file
    if (!validatePasswordUpdateData(req)) {
      throw new Error("Invalid password update request!!");
    }

    const loggedInUser = req.user;

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    res.json({ message: "Password updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
