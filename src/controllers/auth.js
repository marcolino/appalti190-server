const User = require("../models/user");
const Code = require("../models/code");
const sendemail = require("../helpers/sendemail");
//const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate");

/**
 * @route POST api/auth/register
 * @desc register user
 * @access public
 */
exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    // make sure this account doesn't already exist
    const user = await User.findOne({ email });
    if (user) return res.status(401).json({message: "The email address you have entered is already associated with another account."});

    const newUser = new User({ ...req.body, role: "user" });

    await newUser.save(); // TODO: check errors...

    //return await sendVerificationEmail(newUser, req, res); // TODO: if error remove refreshtoken ?
    try {
      //console.log("sending email - user:", user);
      const code = newUser.generateVerificationCode();
  console.log("sending email - code:", code);
      
      await code.save(); // save the verification code
  
      const subject = "Account Verification Code";
      const to = newUser.email;
      const from = process.env.FROM_EMAIL;
  /*
      const link = `http://${req.headers.host}/api/auth/verify/${code.code}`;
      const html = `<p>Hi ${user.firstName} ${user.lastName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>`;
  */
      const html = `
  <p>Hi, ${newUser.firstName} ${newUser.lastName}.<p>
  <p>The code to confirm your registration is <b>${code.code}</b>.</p>
  <p><i>If you did not request this, please ignore this email.</i></p>
      `;
  console.log("sending email:", to, from, subject, html);
      await sendemail({to, from, subject, html});
  
      res.status(200).json({ message: `A verification email has been sent to ${newUser.email}.`, codeDeliveryMedium: "email" });
    } catch (error) {
  console.log("send email error:", error);
      res.status(error.code).json({ message: `Error sending verification email: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({/*success: false, */message: error.message})
  }
};

/**
 * @route GET api/verify/:code
 * @desc verify code
 * @access public
 */
exports.verify = async (req, res) => {
  if (!req.params.code) return res.status(400).json({message: "We were unable to find a user for this code."});

  try {
    // find a matching code
console.log("looking for code:", req.params.code);
    const code = await Code.findOne({ code: req.params.code });
console.log("result for code:", code);
    if (!code) return res.status(400).json({ message: "We were unable to find a valid code, this code my have expired." });

    // we found a code, find a matching user
    User.findOne({ _id: code.userId }, (err, user) => {
      if (!user) return res.status(400).json({ message: "We were unable to find a user for this code." });
      if (user.isVerified) return res.status(400).json({ message: "This user has already been verified." });

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
};

/**
 * @route POST api/resendCode
 * @desc resend password freset  code
 * @access public
 */
exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`});

    // TODO: do we need this? if (user.isVerified) return res.status(400).json({ message: "This account has already been verified. Please log in."});

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

    res.status(200).json({ message: `A verification email has been sent to ${user.email}.`, codeDeliveryMedium: "email" });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

/**
 * @desc send verification email
 * @access private
 */
 const ___UNUSED_sendVerificationEmail = async(user, req, res) => {
  try {
    //console.log("sending email - user:", user);
    const code = user.generateVerificationCode();
console.log("sending email - code:", code);
    
    await code.save(); // save the verification code

    const subject = "Account Verification Code";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
/*
    const link = `http://${req.headers.host}/api/auth/verify/${code.code}`;
    const html = `<p>Hi ${user.firstName} ${user.lastName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>`;
*/
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.<p>
<p>The code to confirm your registration is <b>${code.code}</b>.</p>
<p><i>If you did not request this, please ignore this email.</i></p>
    `;
console.log("sending email:", to, from, subject, html);
    await sendemail({to, from, subject, html});

    res.status(200).json({ message: `A verification email has been sent to ${user.email}.`, codeDeliveryMedium: "email" });
  } catch (error) {
console.log("send email error:", error);
    res.status(error.code).json({ message: `Error sending verification email: ${error.message}` });
  }
}

/**
 * @route POST api/auth/login
 * @desc login user and return JWT token
 * @access public
 */
exports.login = async (req, res) => {
  try {
    console.log("p login req.body:", req.body)
    const { email, password } = req.body;

    // check user email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`, reason: "email-not-found" });

    // validate password
    if (!user.comparePassword(password)) return res.status(401).json({ message: "Invalid email or password", reason: "invalid-email-or-password" });

    // make sure the user has been verified
    if (!user.isVerified) return res.status(401).json({ message: "Your account has not been verified yet", reason: "not-verified" });

    // login successful, write token, and send back user
    const { accessToken, refreshToken } = user.generateJWT();
    res.status(200).json({ accessToken, refreshToken, user}); // TODO: put tokens inside user, like loginGoogle ?
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

/**
 * @route POST api/auth/loginGoogle
 * @desc login user and return JWT token (? TODO...)
 * @access public
 */
exports.loginGoogle = async (req, res) => { // TODO!!!
  //console.log("Auth.loginGoogle:", req);
  //res.status(200).json({ accessToken, refreshToken, user});
  res.status(200).json({ user: res.user });
};

/**
 * @route POST api/auth/loginGoogle
 * @desc login user and return JWT token (? TODO...)
 * @access public
 */
exports.loginGoogleCallback = async (req, res) => { // TODO!!!
  res.cookie("auth", { user: req.user }, {
    secure: true, //process.env.NODE_ENV !== "development",
    httpOnly: false, // TODO: true !!!
    maxAge: 2 * 60 * 60 * 1000, // TODO: put maxAge in config
  });
  res.redirect("/");
};

/**
 * @route POST api/auth/recoverPassword
 * @desc recover password - generates code and sends password reset email
 * @access public
 */
 exports.recoverPassword = async (req, res) => {
  console.log("p recoverPassword");
  try {
console.log("p recoverPassword 1", req.body);
    const { email } = req.body;
    console.log("p recoverPassword 2 email:", email);
    const user = await User.findOne({ email });
    console.log("p recrecoverPasswordover 3");
    if (!user) return res.status(401).json({ message: `The email address ${req.body.email} is not associated with any account: double-check your email address and try again.`});

    // generate and set password reset code
    console.log("p recoverPassword 4");
    user.generatePasswordResetCode();

    // save the updated user object
    console.log("p recoverPassword 5");
    await user.save();

    // send email
    console.log("p recoverPassword 6");
    const subject = "Password change request";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    //const link = "//" + req.headers.host + "/api/auth/reset/" + user.resetPasswordCode;
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}.</p>
<p>The code to reset your password is <b>${user.resetPasswordCode}</b>.</p>
<p><i>If you did not request this, please ignore this email and your password will remain unchanged.</i></p>
    `;

    console.log("p recoverPassword 7", to, from, subject, html);
    try {
      //await sendemail({to, from, subject, html});

      console.log("p recoverPassword 8", user.resetPasswordCode);
      res.status(200).json({message: `A reset email has been sent to ${user.email}.`});
    } catch (error) {
      console.error("Send email error:", /*error.message, error,*/ error.response.body.errors[0].message); // TODO...
return res.status(200).json({message: `${user.resetPasswordCode}`}); // TODO: only when sendgrid credits exhausted
      res.status(401).json({message: `Send email error: ${error.response.body.errors[0].message}`});
    }
  } catch (error) {
    console.log("p recoverPassword 9", error);
    res.status(500).json({message: error.message})
  }
};

/**
 * @route POST api/auth/resetPassword
 * @desc reset password - validate password reset code and shows the password reset view
 * @access public
 */
exports.OLDDDDDresetPassword = async (req, res) => {
console.log("p reset 1 - params:", req.params);
  try {
    //const { code } = req.body;
    const { code } = req.params;
    if (!code) return res.status(400).json({message: "Password reset code not found."});
    const user = await User.findOne({resetPasswordCode: code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) return res.status(401).json({message: "Password reset code is invalid or has expired."});

    // redirect user to form with the email address
    res.render("reset", {user});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

/**
 * @route POST api/auth/resetPassword
 * @desc Reset Password
 * @access Public
 */
exports.resetPassword = async (req, res) => {
console.log("p resetPassword 1 - req.body:", req.body);
  try {
    const { code } = req.body;
    const { password } = req.body;
    const { passwordConfirmed } = req.body;
    if (password !== passwordConfirmed) return res.status(400).json({message: "Password confirmation does not match."});
    if (!code) return res.status(400).json({message: "Password reset code not found."});
    const user = await User.findOne({resetPasswordCode: code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) return res.status(401).json({message: "Password reset code is invalid or has expired."}); // TODO: distinguish invalid/expired...

    // set the new password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    //user.isVerified = true; // TODO: we don't need this, right ?

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
