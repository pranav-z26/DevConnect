const express = require("express");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/authUser");
const { connectDb } = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./models/user");

const jwt = require("jsonwebtoken");

const app = express();

const PORT = 7777;

app.use(express.json());
app.use(cookieParser());

// both middlewares will be applied to all routes, in one line below
// app.use('/', express.json(), userAuth);
// app.use(express.json(), userAuth); equivalent path as above line

app.get("/getUserData", (req, res) => {
  res.send("Got user Data");
});

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

      const token = await jwt.sign({ _id: user._id }, "Devconnect@Pranav$26");

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

app.get("/profile", userAuth, async (req, res) => {
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

app.get("/feed", async (req, res) => {
  //get all users available in database

  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      emailId: req.body.emailId,
    });
    res.status(200).send(`User ${deletedUser.firstName} deleted successfully`);
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];

  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error("Req data not allowed to update");
    }

    if (req.body.skills && !Array.isArray(req.body.skills)) {
      throw new Error("Skills must be an array of strings");
    }
    if (req.body.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { runValidators: true }
    );
    res.send(`User ${updatedUser.firstName} updated successfully`);
  } catch (err) {
    res.status(400).send("Update Failed : " + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection established successfully...");
    app.listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
