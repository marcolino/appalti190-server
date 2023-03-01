const emailValidator = require("email-validator");

const checkValidEmail = (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) {
console.log("EMAIL:", req.params);
    return res.status(400).json({ message: "Email is not valid" });
  }
  next();
};

const verifySignIn = {
  checkValidEmail,
};

module.exports = verifySignIn;
