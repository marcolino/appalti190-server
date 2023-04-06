const jwt = require("jsonwebtoken");
const validateEmail = require("email-validator");
const { sendEmail, notification } = require("../helpers/notification");
const { normalizeEmail, nowLocaleDateTime, remoteAddress } = require("../helpers/misc");
const { logger } = require("./logger.controller");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Plan = require("../models/plan.model");
const RefreshToken = require("../models/refreshToken.model");
const VerificationCode = require("../models/verificationCode.model");

const config = require("../config");

const signup = async(req, res) => {
  let roleName = "user";
  let planName = "free";
  let role, plan;
  
  if (!validateEmail.validate(req.body.email)) {
    return res.status(400).json({ message: req.t("Please supply a valid email") });
  }
  const email = normalizeEmail(req.body.email);

  if (process.env.NODE_ENV === "test") { // in test mode we allow role and plan to be forced by client
    if (req.body.forcerole) {
      roleName = req.body.forcerole;
    }
    if (req.body.forceplan) {
      planName = req.body.forceplan;
    }
  }

  // get the role
  try {
    role = await Role.findOne({name: roleName});
  } catch(err) {
    logger.error(`Error finding role ${roleName}:`, err);
    return res.status(err.code).json({ message: err });
  }
  if (!role) {
    return res.status(400).json({ message: req.t("Invalid role name {{roleName}}", { roleName })});
  }
  

  // get plan
  try {
    plan = await Plan.findOne({name: planName});
  } catch(err) {
    logger.error(`Error finding plan ${planName}:`, err);
    return res.status(err.code).json({ message: err });
  }
  if (!plan) {
    return res.status(400).json({ message: req.t("Invalid plan name {{planName}}", { planName })});
  }

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
      // we don't check duplicated user email (err.code === 11000) as it is done already as a route middleware
      logger.error("New user creation error:", err);
      return res.status(err.code).json({ message: err });
    }

    // send verification code
    try {
      const signupVerification = user.generateSignupVerification(user._id);
      await signupVerification.save(); // save the verification code
  
      //logger.info("VERIFICATION CODE:", signupVerification.code);
      
      const subject = req.t("Signup Verification Code");
      const to = user.email;
      const from = process.env.FROM_EMAIL;
      const html = `
<p>${req.t("Hi")}, ${user.firstName} ${user.lastName}.<p>
<p>${req.t("The code to confirm your registration is")} <b>${signupVerification.code}</b>.</p>
<p><i>${req.t("If you did not request this, please ignore this email")}.</i></p>
      `;
      logger.info("Sending email:", to, from, subject);
      await sendEmail({to, from, subject, html});

      res.status(201).json({
        message: req.t("A verification code has been sent to {{email}}", {email: user.email}),
        codeDeliveryMedium: config.auth.codeDeliveryMedium,
        ...(process.env.NODE_ENV === "test") && { code: signupVerification.code } // to enble test mode to confirm signup
      });
    } catch(err) {
      logger.error("Error sending verification code:", err);
      res.status(err.code).json({ message: req.t("Error sending verification code") + ": " + err.message });
    }
  });
};

const resendSignUpCode = async(req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`});
    }

    if (user.isVerified) {
      return res.status(400).json({ message: req.t("This account has already been verified, you can log in")});
    }

    const signupVerification = await user.generateSignupVerification(user._id);
    await signupVerification.save(); // save the verification code

    const subject = req.t("Signup Verification Code Resent");
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const html = `
<p>${req.t("Hi")}, ${user.firstName} ${user.lastName}.<p>
<p>${req.t("The code to confirm your registration is")} <b>${signupVerification.code}</b>.</p>
<p><i>${req.t("If you did not request this, please ignore this email")}.</i></p>
    `;
    logger.info("Sending email:", to, from, subject);
    await sendEmail({to, from, subject, html});

    res.status(200).json({ message: req.t("A verification code has been resent to {{to}} via {{codeDeliveryMedium}}", {to: user.email, codeDeliveryMedium: config.auth.codeDeliveryMedium}), codeDeliveryMedium: config.auth.codeDeliveryMedium });

  } catch(err) {
    logger.error("Error resending signup code:", err);
    res.status(err.code).json({ message: req.t("Error resending signup code") + ": " + err.message });
  }
};

const signupConfirm = async(req, res) => {
  if (!req.body.code) {
    return res.status(400).json({message: req.t("Code is mandatory")});
  }

  try {
    // find a matching code
    const code = await VerificationCode.findOne({ code: req.body.code });
    if (!code) {
      return res.status(400).json({ message: req.t("This code is not valid, it may be expired") });
    }

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
        if (err) {
          logger.error("Error finding user for the requested code:", err);
          res.status(err.code).json({message: err.message})
        }
        if (!user) {
          return res.status(400).json({ message: req.t("A user for this code was not found") });
        }
        if (user.isVerified) {
          return res.status(400).json({ message: req.t("This account has already been verified") });
        }

        // verify and save the user
        user.isVerified = true;
        user.save(async(err, user) => {
          if (err) {
            logger.error("Error saving user in signup confirm:", err);
            return res.status(err.code).json({ message: err.message });
          }
          logger.info(`User signup: ${JSON.stringify(user)}`);
          notification({subject: `User ${user.email} signup completed`, html: `User: ${user.email}, IP: ${remoteAddress(req)}, on ${nowLocaleDateTime()}`});
          res.status(200).json({ message: req.t("The account has been verified, you can now log in") });
        });
      }
    );
  } catch(err) {
    logger.error("Error confirming signup:", err);
    res.status(err.code).json({message: err.message})
  }
}

const signin = async(req, res) => {
  const email = normalizeEmail(req.body.email);

  User.findOne(
    {
      //username: req.body.username,
      email,
    },
    null,
    {
      allowDeleted: true,
      allowUnverified: true,
    }
  )
  .populate("roles", "-__v")
  .populate("plan", "-__v")
  .exec(async(err, user) => {
    if (err) {
      logger.error("Error finding user in signin request:", err);
      return res.status(err.code).json({ message: err });
    }

    // check user is found
    if (!user) {
      return res.status(400).json({ message: req.t("User not found") });
    }

    // check user is not deleted
    if (user.isDeleted) {
      return res.status(400).json({ code: "DeletedUser", message: req.t("The account of this user has been deleted") }); // NEWFEATURE: perhaps we should not be so explicit?
    }

    // check email is verified
    if (!user.isVerified) {
      return res.status(400).json({ code: "UnverifiedUser", message: req.t("The account is not yet verified") });
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
      expiresIn: config.auth.jwtExpirationSeconds,
    });

    // create new refresh token
    user.refreshToken = await RefreshToken.createToken(user);

    const roles = [];
    for (let i = 0; i < user.roles.length; i++) {
      roles.push(user.roles[i].name);
    }

    logger.info(`User signin: ${user.email}`);
    // notify administration about logins
    notification({subject: `User ${user.email} signin`, html: `User: ${user.email}, IP: ${remoteAddress(req)}, on ${nowLocaleDateTime()}`});
  
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
  });
};

const resetPassword = async(req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: req.t("The email address {{email}} is not associated with any account: double-check your email address and try again", {email: email})});

    // generate and set password reset code
    const resetPassword = user.generatePasswordResetCode();
    user.resetPasswordCode = resetPassword.code;
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
    logger.info("Sending email:", to, from, subject);
    await sendEmail({to, from, subject, html});

    res.status(200).json({
      message: req.t("A reset code has been sent to {{email}} via {{codeDeliveryMedium}}", {email: user.email, codeDeliveryMedium: config.auth.codeDeliveryMedium}),
      codeDeliveryMedium: config.auth.codeDeliveryMedium,
      ...(process.env.NODE_ENV === "test") && { code: user.resetPasswordCode } // to enble test mode to confirm reset password
    });
  } catch(err) {
    logger.error("Error resetting password:", err);
    res.status(err.code).json({message: err.message})
  }
};

const resetPasswordConfirm = async(req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({message: req.t("Password reset code not found"), code: "code"});
    }
     // if we want to distinguish among invalid / expired we have to split the following query
    const user = await User.findOne({email, resetPasswordCode: code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) {
      return res.status(400).json({message: req.t("Password reset code is invalid or has expired"), code: "code"});
    }

    /*
    // check if requested password is the same as the previous one (unfeasible: same password generate different hashes...)
    user.hashPassword(password, async(err, passwordHashed) => {
      if (passwordHashed === user.password) {
        return res.status(400).json({message: req.t("Requested password is the same as the previous one")});
      }
    });
    */

    // set the new password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    // save the updated user object
    await user.save();

    res.status(200).json({message: req.t("Your password has been updated")});

  } catch(err) {
    logger.error("Error in reset password confirme:", err);
    res.status(err.code).json({message: err.message})
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

    //if (user.isVerified) return res.status(400).json({ message: req.t("This account has already been verified") + ". " + req.t("You can log in")});

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
    logger.info("Sending email:", to, from, subject);
    await sendEmail({to, from, subject, html});

    res.status(200).json({ message: `A verification code has been sent to ${user.email}`, codeDeliveryMedium: config.auth.codeDeliveryMedium });

  } catch(err) {
    logger.error("Error resending reset password code:", err);
    res.status(err.code).json({ message: err.message })
  }
};

const refreshToken = async(req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) { // refresh token is required
    return res.status(403).json({ message: req.t("Please make a new signin request") });
  }

  try {
    const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });

    if (!refreshTokenDoc) { // refresh token not found
      return res.status(403).json({
        message: req.t("Session is expired, please make a new signin request"),
      });
    }

    // should never go past this point, since expired tokens are automatically disposed by database 'expiresAfterSeconds' feature

    if (RefreshToken.verifyExpiration(refreshTokenDoc)) {
      refreshTokenDoc.findByIdAndRemove(refreshTokenDoc._id, { useFindAndModify: false }).exec();
      
      return res.status(403).json({ // refresh token is expired
        message: req.t("Session is just expired, please make a new signin request"),
      });
    }

    let newAccessToken = jwt.sign({ id: refreshTokenDoc.user._id }, config.auth.secret, {
      expiresIn: config.auth.jwtExpirationSeconds,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshTokenDoc.token,
    });
  } catch(err) {
    logger.error("Error refreshing token:", err);    
    return res.status(err.code).json({ message: err });
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
