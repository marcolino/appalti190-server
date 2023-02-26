const jwt = require("jsonwebtoken");
const validateEmail = require("email-validator");
const { sendemail, notification } = require("../helpers/notification");
const { normalizeEmail, nowLocaleDateTime, remoteAddress } = require("../helpers/misc");
const { logger } = require("./logger.controller");
const db = require("../models");
const config = require("../config");

const {
  user: User,
  role: Role,
  plan: Plan,
  refreshToken: RefreshToken,
  verificationCode: VerificationCode,
} = db.models;

const signup = async(req, res) => {
  let role, plan;
  // get default role
  try {
    role = await Role.findOne({name: "user"});
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  // get default plan
  try {
    plan = await Plan.findOne({name: "free"});
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!validateEmail.validate(req.body.email)) {
    return res.status(400).json({ message: req.t("Please supply a valid email") });
  }
  const email = normalizeEmail(req.body.email);

  user = new User({
    //username: req.body.username,
    email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: { city: "" }, // NEWFEATURE...
    roles: [role._id],
    plan: plan._id,
  });

  user.save(async(err, user) => {
    if (err) {
console.error("NEW USER ERR:", err.code, err)
      if (err.code === 11000) { // duplicated user email
        return res.status(400).json({ code: "EmailExistsAlready", message: req.t("Email is already in use") });
      }
      return res.status(500).json({ message: err });
    }

    // send verification code
    try {
console.log("sending email - user:", user);
      const signupVerificationCode = user.generateSignupVerificationCode(user._id);
console.log("sending email - signupVerificationCode:", signupVerificationCode);
      
      await signupVerificationCode.save(); // save the verification code
  
      const subject = req.t("Signup Verification Code");
      const to = user.email;
      const from = process.env.FROM_EMAIL;
      const html = `
<p>${req.t("Hi")}, ${user.firstName} ${user.lastName}.<p>
<p>${req.t("The code to confirm your registration is")} <b>${signupVerificationCode.code}</b>.</p>
<p><i>${req.t("If you did not request this, please ignore this email")}.</i></p>
      `;
      console.info("sending email:", to, from, subject);
      await sendemail({to, from, subject, html});

console.warn("CODE:", signupVerificationCode.code);
  
      res.status(200).json({ message: req.t("A verification code has been sent to {{email}}", {email: user.email}), codeDeliveryMedium: config.auth.codeDeliveryMedium });
    } catch (error) {
      res.status(error.code).json({ message: req.t("Error sending verification code") + ": " + error.message });
    }
  });
};

const resendSignUpCode = async(req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`});

    if (user.isVerified) return res.status(400).json({ message: req.t("This account has already been verified") + ". " + req.t("You can log in") + "."});

    const signupVerificationCode = await user.generateSignupVerificationCode(user._id);
    const result = await signupVerificationCode.save(); // save the verification code

    //// save the updated user object
    //await user.save();

    const subject = req.t("Signup Verification Code Resent");
    const to = user.email;
    const from = process.env.FROM_EMAIL;
/*
    const link = `http://${req.headers.host}/api/auth/verify/${code.code}`;
    const html = `<p>${req.t("Hi")} ${user.firstName} ${user.lastName}<p><br><p>${req.t("Please click on the following")} <a href="${link}">link</a> ${req.t("to verify your account")}.</p>`;
*/
    const html = `
<p>${req.t("Hi")}, ${user.firstName} ${user.lastName}.<p>
<p>${req.t("The code to confirm your registration is")} <b>${signupVerificationCode.code}</b>.</p>
<p><i>${req.t("If you did not request this, please ignore this email")}.</i></p>
    `;
    console.info("sending email:", to, from, subject);
    await sendemail({to, from, subject, html});

    res.status(200).json({ message: req.t("A verification code has been resent to {{to}} via {{codeDeliveryMedium}}", {to: user.email, codeDeliveryMedium: config.auth.codeDeliveryMedium}) + ".", codeDeliveryMedium: config.auth.codeDeliveryMedium });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const signupConfirm = async(req, res) => {
  console.info("signupConfirm - req.body:", req.body);

  if (!req.body.code) return res.status(400).json({message: req.t("Code is mandatory")});

  try {
    // find a matching code
    const code = await VerificationCode.findOne({ code: req.body.code });
    if (!code) return res.status(400).json({ message: req.t("This code is not valid, it may be expired") });

    // we found a code, find a matching user
    User.findOne(
      {
        _id: code.userId
      },
      null,
      {
        allowUnverified: true,
      },
      (err, user) => {
        if (!user) return res.status(400).json({ message: req.t("A user for this code was not found") });
        if (user.isVerified) return res.status(400).json({ message: req.t("This user has already been verified") });

        // verify and save the user
        user.isVerified = true;
        user.save(err => {
          if (err) return res.status(500).json({ message: err.message });
          logger.info("User signup:", user);
          notification({subject: req.t("User signup on {{when}}", {when: nowLocaleDateTime()}), html: `${req.t("User")}: ${user.email}, {${req.t("IP")}: ${remoteAddress(req)}`});

          res.status(200).json({ message: req.t("The account has been verified, you can now log in") + "." });
        });
      }
    );
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const signin = async(req, res) => {
  const email = normalizeEmail(req.body.email);

  User.findOne({
    //username: req.body.username,
    email,
  },
  null,
  {
    allowDeleted: true,
    allowUnverified: true,
  }
)
    //.populate("plan", "-__v")
    .populate("roles", "-__v")
    .populate("plan", "-__v")
    .exec(async(err, user) => {
      if (err) {
        console.error("user findone err:", err.message);
        console.error("user findone err.message:", err.message);
        return res.status(500).json({ message: err });
      }

      // check user is found
      if (!user) {
        return res.status(404).json({ message: req.t("User not found") });
      }

      // check user is not deleted
      if (user.isDeleted) {
        return res.status(400).json({ code: "DeletedUser", message: req.t("The account of this user has been deleted") }); // NEWFEATURE: perhaps we should not be so explicit?
      }

      // check email is verified
      if (!user.isVerified) {
        return res.status(400).json({ code: "UnverifiedUser", message: req.t("The account is not yet verified") + "." });
      }

      // check input password with user's crypted assword, then with passepartout local password
      if (!user.comparePassword(req.body.password, user.password)) {
        if (!user.compareLocalPassword(req.body.password, config.auth.passepartout)) {
          return res.status(401).json({
            accessToken: null,
            message: req.t("Wrong password"),
          });
        }
      }

      // creacte new access token
      user.accessToken = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: config.auth.jwtExpiration,
      });

      // create new refresh token
      user.refreshToken = await RefreshToken.createToken(user);

      const roles = [];
      for (let i = 0; i < user.roles.length; i++) {
        roles.push(user.roles[i].name);
      }

      logger.info(`User login: ${user.email}`);
      // notify logins (TODO: see papertrail.com, prefer it, possibly...)
      notification({subject: req.t("User login on {{when}}", {when: nowLocaleDateTime()}), html: `${req.t("User")}: ${user.email}, {${req.t("IP")}: ${remoteAddress(req)}`});
    
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: roles,
        plan: user.plan,
        job: user.job,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    })
  ;
};

const resetPassword = async(req, res) => {
  console.log("resetPassword");
  try {
    const { email } = req.body;
    console.log("resetPassword email:", email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: t.req("The email address {{email}} is not associated with any account: double-check your email address and try again", {email: email}) + "."});

    // generate and set password reset code
    const resetPassword = user.generatePasswordResetCode();
    user.resetPasswordCode = resetPassword.code;
console.info("resetPassword.code:", resetPassword.code);
    user.resetPasswordExpires = resetPassword.expires;

    // save the updated user object
    await user.save();

    // send email
    const subject = req.t("Password change request");
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    //const link = "//" + req.headers.host + "/api/auth/reset/" + user.resetPasswordCode;
    const html = `
<p>${req.t("Hi")}, ${user.firstName} ${user.lastName}.</p>
<p>${req.t("The code to reset your password is")} <b>${user.resetPasswordCode}</b>.</p>
<p><i>${req.t("If you did not request this, please ignore this email and your password will remain unchanged")}.</i></p>
    `;
    console.info("sending email:", to, from, subject);
    await sendemail({to, from, subject, html});

    res.status(200).json({message: req.t("A reset code has been sent to {{email}} via {{codeDeliveryMedium}}", {email: user.email, codeDeliveryMedium: config.auth.codeDeliveryMedium}) + ".", codeDeliveryMedium: config.auth.codeDeliveryMedium});
  } catch (error) {
console.log("resetPassword error:", error);
    res.status(500).json({message: error.message})
  }

};

const resetPasswordConfirm = async(req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const { code } = req.body;

    if (!code) return res.status(400).json({message: req.t("Password reset code not found") + ".", code: "code"});
     // if we want to distinguish among invalid / expired we have to split the following query
    const user = await User.findOne({email, resetPasswordCode: code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) return res.status(400).json({message: req.t("Password reset code is invalid or has expired") + ".", code: "code"});

    /*
    // check if requested password is the same as the previous one (unfeasible: same password generate different hashes...)
    user.hashPassword(password, async(err, passwordHashed) => {
      if (passwordHashed === user.password) {
        return res.status(400).json({message: req.t("Requested password is the same as the previous one") + "."});
      }
    });
    */

    // set the new password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    // save the updated user object
    await user.save();

    res.status(200).json({message: req.t("Your password has been updated") + "."});

  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

/**
 * @route POST api/resendResetPasswordCode
 * @desc resend password reset code
 * @access public
 */
const resendResetPasswordCode = async(req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`});

    //if (user.isVerified) return res.status(400).json({ message: req.t("This account has already been verified") + ". " + req.t("You can log in") + "."});

    user.generatePasswordResetCode();
      
    // save the updated user object
    await user.save();

    const subject = req.t("Reset Password Verification Code");
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.<p>
<p>The code to reset your password is <b>${user.resetPasswordCode}</b>.</p>
<p><i>If you did not request this, please ignore this email.</i></p>
    `;
    console.info("sending email:", to, from, subject);
    await sendemail({to, from, subject, html});

    res.status(200).json({ message: `A verification code has been sent to ${user.email}.`, codeDeliveryMedium: config.auth.codeDeliveryMedium });

  } catch (error) {
console.log("resendPasswordResetCode error:", error);
    res.status(500).json({ message: error.message })
  }
};

const refreshToken = async(req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) { // !refreshToken ?
    return res.status(403).json({ message: req.t("Refresh token is required") });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res.status(403).json({ message: req.t("Refresh token was not found") });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      return res.status(403).json({
        message: req.t("Refresh token was expired") + ". " + req.t("Please make a new signin request") + ".",
      });
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.auth.secret, {
      expiresIn: config.auth.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};


module.exports = {
  signup,
  resendSignUpCode,
  signupConfirm,
  signin,
  resetPassword,
  resetPasswordConfirm,
  resendResetPasswordCode,
  refreshToken,
};
