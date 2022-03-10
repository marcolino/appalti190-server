const express = require("express");
const { oneOf, check } = require("express-validator");
const passport = require("passport");
const Auth = require("../controllers/auth");
//Password = require("../controllers/password");
const validate = require("../middlewares/validate");
const config = require("../config");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: `Welcome to ${config.APIname} auth API` });
});

router.post("/register", [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").not().isEmpty().isLength({min: 6}).withMessage("Must be at least 6 chars long"),
  check("firstName").not().isEmpty().withMessage("You first name is required"),
  check("lastName").not().isEmpty().withMessage("You last name is required")
], validate, Auth.register);

// registration confirmation verification
router.get("/verify/:code", Auth.verify);

// code resend
router.post("/resend", Auth.resendCode);

// password recover
router.post("/recover", [
  check("email").isEmail().withMessage("Enter a valid email address"),
],/*, validate*/ Auth.recoverPassword);

router.get("/reset/:code", Auth.resetPassword);

router.post("/reset", oneOf([
  //check("password").not().isEmpty().isLength({min: 6}).withMessage("Password must be at least 6 chars long"),
  //check("passwordConfirmed", "Passwords do not match").custom((value, {req}) => { console.log("BODY:", req.body, value); return(value === req.body.password)}),
  check(
    "passwordConfirmed",
    "Password confirmation does not match",
  )
  .exists()
  .custom((value, { req }) => value === req.body.password),
]),/*, validate*/ Auth.resetPassword);

router.post("/login", (req, res, next) => {console.log("*** login"); next();}, [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").not().isEmpty(),
], validate, Auth.login);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get("/loginGoogle", passport.authenticate("google",
  //{ scope: [ "email", "profile" ] }
  { scope: [ "email", "profile" ],
  accessType: 'offline', approvalPrompt: 'force' } // to get refresh token too
), Auth.loginGoogle);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

//router.get("/loginGoogle/callback", passport.authenticate("google", { successRedirect: "/", failureRedirect: "/login" }));

router.get("/loginGoogleCallback", passport.authenticate("google", { session: false }), /*(req, res) => {
  // if this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
console.log("req.user:", req.user);
  //res.cookie("auth", { user: req.user }, { httpOnly: false }); // save user in a cookie; it should be read by client
  res.redirect("/");
},*/
  Auth.loginGoogleCallback
);

router.get("/logout", (req, res) => { // TODO: test this really works
  req.logout();
  res.redirect("/");
});

// router.get("/currentAuthenticatedUser", function(req, res) {
//   console.log("currentAuthenticatedUser:", req.user, req.isAuthenticated());
//   //res.status(200).json(req.isAuthenticated());
//   res.status(200).json(req.user ? req.user : false);
// });

module.exports = router;