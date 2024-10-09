var express = require("express");
var router = express.Router();
var _ = require("lodash");
var logger = require("../lib/logger");
var log = logger();

var users = require("../init_data.json").data;
var curId = users.length;

/* GET users listing. */
router.get("/", function (req, res) {
  res.json(_.toArray(users));
});

/* Create a new user */
router.post("/", function (req, res) {
  var user = req.body;
  user.id = curId++;
  if (!user.status) {
    user.status = "pending";
  }
  users.push(user);
  log.info("Created user", user);
  res.status(201).json(user);
});

/* Get a specific user by id */
router.get("/:id", function (req, res, next) {
  var userId = parseInt(req.params.id);
  var user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

/* Delete a user by id */
router.delete("/:id", function (req, res) {
  var userId = parseInt(req.params.id);
  var index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  var deleteUser = users.splice(index, 1)[0];
  log.info("Deleted user", deleteUser);
  res.status(204).send();
});

/* Update a user by id */
router.put("/:id", function (req, res, next) {
  var userId = parseInt(req.params.id);
  var user = req.body;

  if (user.id != userId) {
    return next(new Error("ID paramter does not match body"));
  }
  var index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return next(new Error("User not found"));
  }

  users[index] = { ...users[index], ...user };
  log.info("Updating user", users[index]);
  res.json(users[index]);
});

module.exports = router;
