const config = require("../config");
const { sendemail } = require("../helpers/notification");
const db = require("../models");
const jwt = require("jsonwebtoken");

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
    return res.status(500).send({ message: err });
  }
  // get default plan
  try {
    plan = await Plan.findOne({name: "Free"});
  } catch (err) {
    return res.status(500).send({ message: err });
  }

  const user = new User({
    //username: req.body.username,
    email: req.body.email,
    password: /*bcrypt.hashSync(*/req.body.password/*, 8)*/,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    roles: [role._id],
    plan: plan._id,
  });

  user.save(async(err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    // send verification code
    try {
console.log("sending email - user:", user);
      const signupVerificationCode = user.generateSignupVerificationCode(user._id);
console.log("sending email - signupVerificationCode:", signupVerificationCode);
      
      await signupVerificationCode.save(); // save the verification code
  
      const subject = "Account Verification Code";
      const to = user.email;
      const from = process.env.FROM_EMAIL;
      const html = `
<p>Hi, ${user.firstName} ${user.lastName}.<p>
<p>The code to confirm your registration is <b>${signupVerificationCode.code}</b>.</p>
<p><i>If you did not request this, please ignore this email.</i></p>
      `;
console.log("sending email:", to, from, subject, html);
      await sendemail({to, from, subject, html});
console.warn("CODE:", signupVerificationCode.code);
  
      res.status(200).json({ message: `A verification code has been sent to ${user.email}`, codeDeliveryMedium: "email" }); // TODO: handle codeDeliveryMedium
    } catch (error) {
console.log("send email error:", error);
      res.status(error.code).json({ message: `Error sending verification code: ${error.message}` });
    }
  });
};

const resendSignUpCode = async(req, res) => {
  // TODO...
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`});

    if (user.isVerified) return res.status(400).json({ message: "This account has already been verified. You can log in."});

console.log("user:", user);
    const signupVerificationCode = await user.generateSignupVerificationCode(user._id);
console.log("signupVerificationCode:", signupVerificationCode);
    const result = await signupVerificationCode.save(); // save the verification code
console.log("RESULT signupVerificationCode.save():", result);

    //// save the updated user object
    //await user.save();

    const subject = "Account Verification Code Resent";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
/*
    const link = `http://${req.headers.host}/api/auth/verify/${code.code}`;
    const html = `<p>Hi ${user.firstName} ${user.lastName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>`;
*/
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.<p>
<p>The code to confirm your registration is <b>${signupVerificationCode.code}</b>.</p>
<p><i>If you did not request this, please ignore this email.</i></p>
    `;
console.log("sending email:", to, from, subject, html);
    await sendemail({to, from, subject, html});

    res.status(200).json({ message: `A verification code has been resent to ${user.email}.`, codeDeliveryMedium: "email" }); // TODO: handle codeDeliveryMedium

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const signupConfirm = async(req, res) => {
  console.info("signupConfirm - req.body:", req.body);

  if (!req.body.code) return res.status(400).json({message: "Code is mandatory"});

  try {
    // find a matching code
console.log("looking for code:", req.body.code, req.body.email);
    const code = await VerificationCode.findOne({ code: req.body.code, /* TODO: join with user email... email: req.params.email*/ });
console.log("result for code:", code);
    if (!code) return res.status(400).json({ message: "We were unable to find a valid code, this code my have expired" });

    // we found a code, find a matching user
    User.findOne({ _id: code.userId }, (err, user) => {
      if (!user) return res.status(400).json({ message: "We were unable to find a user for this code" });
      if (user.isVerified) return res.status(400).json({ message: "This user has already been verified" });

      // verify and save the user
      user.isVerified = true;
      user.save(function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "The account has been verified, you can now log in." });
      });
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const signin = async(req, res) => {
  console.info("signin - req.body:", req.body);
  const { email } = req.body;
  User.findOne({
    //username: req.body.username,
    email
  })
    //.populate("plan", "-__v")
    .populate("roles", "-__v")
    .exec(async(err, user) => {
      if (err) {
        console.error("user findone err:", err.message);
        console.error("user findone err.message:", err.message);
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // const passwordIsRight = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // );
      // const passwordIsRight = (
      //   req.body.password === user.password
      // );
console.log("User:", user);

      if (!user.comparePassword(req.body.password, user.password)) {
        return res.status(401).send({
          accessToken: null,
          message: "Wrong password",
        });
      }

      const token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: config.auth.jwtExpiration,
      });

      const refreshToken = await RefreshToken.createToken(user);

      const roles = [];
      // for (let i = 0; i < user.roles.length; i++) {
      //   roles.push("ROLE_" + user.roles[i].name.toUpperCase());
      // }
      for (let i = 0; i < user.roles.length; i++) {
        roles.push(user.roles[i].name.toUpperCase());
      }

      const plan = user.plan?.name?.toUpperCase(); // TODO: remove "?", all users will have a plan...

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles,
        plan,
        accessToken: token,
        refreshToken: refreshToken,
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
    if (!user) return res.status(401).json({ message: `The email address ${email} is not associated with any account: double-check your email address and try again.`});

    // generate and set password reset code
    const resetPassword = user.generatePasswordResetCode();
    user.resetPasswordCode = resetPassword.code;
    user.resetPasswordExpires = resetPassword.expires;

    // save the updated user object
    await user.save();

    // send email
    const subject = "Password change request";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    //const link = "//" + req.headers.host + "/api/auth/reset/" + user.resetPasswordCode;
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.</p>
<p>The code to reset your password is <b>${user.resetPasswordCode}</b>.</p>
<p><i>If you did not request this, please ignore this email and your password will remain unchanged.</i></p>
    `;
    await sendemail({to, from, subject, html});

    res.status(200).json({message: `A reset email has been sent to ${user.email}.`});
  } catch (error) {
console.log("resetPassword error:", error);
    res.status(500).json({message: error.message})
  }

};

const resetPasswordConfirm = async(req, res) => {
  console.log("resetPasswordConfirm");
  try {
    const { email } = req.body;
    const { password } = req.body;
    const { code } = req.body;

    //if (password !== passwordConfirmed) return res.status(400).json({message: "Password confirmation does not match."});
    if (!code) return res.status(400).json({message: "Password reset code not found."});
    const user = await User.findOne({email, resetPasswordCode: code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) return res.status(401).json({message: "Password reset code is invalid or has expired."}); // TODO: distinguish invalid/expired...

    // set the new password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    //user.isVerified = true; // TODO: we don't need this...

    // save the updated user object
    await user.save();

    const subject = "Your password has been updated";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.</p>
<p>This is a confirmation that the password for your account ${user.email} has just been updated.</p>
    `;
    //await sendemail({to, from, subject, html}); // TODO: try catch

    res.status(200).json({message: "Your password has been updated."});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

/**
 * @route POST api/resendPasswordResetCode
 * @desc resend password reset code
 * @access public
 */
const resendPasswordResetCode = async(req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`});

    // TODO: do we need this?
    if (user.isVerified) return res.status(400).json({ message: "This account has already been verified. You can log in."});

    //await sendVerificationEmail(user, req, res);
    //const code = user.generateVerificationCode();
    user.generatePasswordResetCode();
      
    // save the updated user object
    console.log("p recover 5");
    await user.save();

console.log("sending email - code:", code);
    
    const subject = "Reset Password Verification Code";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
/*
    const link = `http://${req.headers.host}/api/auth/verify/${code.code}`;
    const html = `<p>Hi ${user.firstName} ${user.lastName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>`;
*/
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.<p>
<p>The code to reset your password is <b>${user.resetPasswordCode}</b>.</p>
<p><i>If you did not request this, please ignore this email.</i></p>
    `;
console.log("sending email:", to, from, subject, html);
    await sendemail({to, from, subject, html});

    res.status(200).json({ message: `A verification code has been sent to ${user.email}.`, codeDeliveryMedium: "email" }); // TODO: handle codeDeliveryMedium

  } catch (error) {
console.log("resendPasswordResetCode error:", error);
    res.status(500).json({ message: error.message })
  }
};

const refreshToken = async(req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) { // !refreshToken ?
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in database" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
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
    return res.status(500).send({ message: err });
  }
};


module.exports = {
  signup,
  resendSignUpCode,
  signupConfirm,
  signin,
  resetPassword,
  resetPasswordConfirm,
  resendPasswordResetCode,
  refreshToken,
};

