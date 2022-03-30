const config = require("../config");
const { sendemail } = require("../helpers/notification");
const db = require("../models");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");

const {
  user: User,
  role: Role,
  plan: Plan,
  refreshToken: RefreshToken,
  verificationCode: VerificationCode,
} = db.models;

exports.signup = async(req, res) => {

  // if (!req.body.roles) { // warning: client can choose its roles simply passing them??
  //   req.body.roles = "user";
  // }

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

    // if (!req.body.roles) { // warning: client can choose its roles simply passing them??
    //   req.body.roles = "user";
    // }
    // Role.findOne(
    //   {
    //     name: "user",
    //   },
    //   async(err, role) => {
    //     if (err) { // a "user " role MUST exist
    //       return res.status(500).send({ message: err });
    //     }

    //     user.roles = [role._id];
    //     user.save(async(err) => {
    //       if (err) {
    //         return res.status(500).send({ message: err });
    //       }

          // send verification code
          try {
console.log("sending email - user:", user);
            const verificationCode = user.generateVerificationCode(user._id);
console.log("sending email - verificationCode:", verificationCode);
            
            await verificationCode.save(); // save the verification code
        
            const subject = "Account Verification Code";
            const to = user.email;
            const from = process.env.FROM_EMAIL;
            const html = `
        <p>Hi, ${user.firstName} ${user.lastName}.<p>
        <p>The code to confirm your registration is <b>${verificationCode.code}</b>.</p>
        <p><i>If you did not request this, please ignore this email.</i></p>
            `;
console.log("sending email:", to, from, subject, html);
            await sendemail({to, from, subject, html});
console.warn("CODE:", verificationCode.code);
        
            res.status(200).json({ message: `A verification email has been sent to ${user.email}`, codeDeliveryMedium: "email" });
          } catch (error) {
        console.log("send email error:", error);
            res.status(error.code).json({ message: `Error sending verification email: ${error.message}` });
          }

          // res.send({
          //   message: "User was registered successfully",
          //   details: `Roles are: ${role.name}`,
          // });
  //      });
  //     }
  //   );
  });
};

exports.signupConfirm = async(req, res) => {
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

exports.signin = (req, res) => {
  console.info("signin - req.body:", req.body);
  User.findOne({
    //username: req.body.username,
    email: req.body.email,
  })
    .populate("plan", "-__v")
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
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

exports.refreshToken = async(req, res) => {
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
