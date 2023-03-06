const db = require("../models");
const User = db.models.user;

const checkDuplicateUsername = (req, res, next) => {
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (user) {
      return res.status(400).json({ message: "Username is already in use" });
    }
    next();
  });
};

const checkDuplicateEmail = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (user) {
      return res.status(400).json({
        message: "Email is already in use",
        code: "EmailExistsAlready",
      });
    }
    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      const role = req.body.roles[i];
      if (!db.roles.map(role => role.name).includes(role)) {
        return res.status(400).json({
          message: `Role ${role} does not exist`
        });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsername,
  checkDuplicateEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
