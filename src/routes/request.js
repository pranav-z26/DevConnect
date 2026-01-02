const express = require("express");
const { userAuth } = require("../middlewares/authUser");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Allow this api only if status is - interested or ignored
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error(`Invalid status type: ${status}`);
      }

      //Check if toUserId and fromUserId are not same
      //Checked this in schema level validation (pre) - alternatively it could have been done here also
      if (fromUserId.equals(toUserId)) {
        throw new Error("Cannot send connection request to self!!");
      }

      //Check in db if toUser exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found!!");
      }

      //check if existing connection request
      const isExistingConnnectionRequest = await ConnectionRequestModel.findOne(
        {
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        }
      );

      if (isExistingConnnectionRequest) {
        throw new Error("Connection request already exists!!");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${
          status === "interested" ? "sent" : "ignored"
        } successfully!!`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = connectionRouter;
