const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/request");

const app = express();

const PORT = 7777;

app.use(express.json());
app.use(cookieParser());

// both middlewares will be applied to all routes, in one line below
// app.use('/', express.json(), userAuth);
// app.use(express.json(), userAuth); equivalent path as above line

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);

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
