const db = require("../models");
const validateEmail = require("email-validator");
const { normalizeEmail } = require("../helpers/misc");

const {
  user: User,
  plan: Plan,
  role: Role,
  refreshToken: RefreshToken,
} = db.models;

exports.getProfile = async(req, res) => {
  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});

  User.findOne({
    _id: req.userId
  })
  .populate("roles", "-__v")
  .populate("plan", "-__v")
  .exec(async(err, user) => {
    if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: "We were unable to find this user" });
console.log("getProfile - user.roles:", user.roles);
    res.status(200).json({user});
  });
};

exports.updateProfile = async(req, res) => {
console.log("UpdateProfile, body:", req.body);
  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});
  if (!req.body.email) return res.status(400).json({message: "Email is mandatory"});

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: "We were unable to find this user" });

    // validate and normalize email
    let email = req.body.email;
    if (!validateEmail.validate(email)) {
      return res.status(400).json({ message: "Please supply a valid email" });
    } 
    email = normalizeEmail(email);

    // be sure email - if changed - is not taken already
    if (normalizeEmail(email) !== normalizeEmail(user.email)) {
      const check = await User.findOne({ email });
      if (check) return res.status(400).json({ message: "This email is already taken, sorry." });
    }

    user.email = email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.fiscalCode = req.body.fiscalCode;
    user.businessName = req.body.businessName;
    user.address = req.body.address;

    // verify and save the user
    user.save(err => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "The profile has been updated." });
    });
  });
}

exports.updateRoles = async(req, res) => {
  console.log("UpdateRoles, body:", req.body);
  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: "We were unable to find this user" });

    // get roles ids, here we only have the names...
    Role.find({
      "name": { $in: req.body.roles }
    }, (err, docs) => {
      if (err) return res.status(500).json({ message: err.message });
      console.log("user old roles:", user.roles);
      console.log("Roles docs:", docs);
      user.roles = docs.map(doc => doc._id);
      console.log("user new roles:", user.roles);

      // verify and save the user
      user.save(err => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "The profile has been updated." });
      });
    });
  });
}
  
exports.updatePlan = async(req, res) => {
  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});
  if (!req.body.plan) return res.status(400).json({message: "Plan is mandatory"});
  // plan value correctness is enforced by database model

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: "We were unable to find this user" });

    // search plan
    Plan.findOne({
      "name": { $in: req.body.plan }
    }, (err, doc) => {
      if (err) return res.status(500).json({ message: err.message });
      user.plan = doc;

      // verify and save the user
      user.save(err => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "The plan has been updated." });
      });
    });
  });
}

exports.allAccess = (req, res) => {
  res.status(200).json("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).json("User Content.");
};

exports.users = async(req, res) => {
  let users = await User.find()
    .select(["-password", "-__v"])
    .populate("roles", "-__v")
    .populate("plan", "-__v")
    .lean()
    .exec()
  ;
  res.status(200).json({users});
};

exports.adminPanel = (req, res) => {
  Promise.all([
    User.find({
      // we comment next row just waiting to add isDeleted property to current db...
      //isDeleted: false, // TODO: add isDeleted condition everywhere?
      isVerified: true, // TODO: add isVerified condition everywhere?
    })
    .select(["-password", "-__v"])
    .populate("roles", "-__v")
    .populate("plan", "-__v")
    .lean()
    .exec(),
    RefreshToken.find({
      expiryDate: {
        $gte: new Date(), 
      }
    })
    .select("token user expiryDate -_id")
    .lean()
    .exec()
  ]).then(([users, refreshTokens]) => {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      for (let j = 0; j < refreshTokens.length; j++) {
        const refreshToken = refreshTokens[j];
        if ((String(refreshToken.user) === String(user._id)) && (!user.refreshToken || user.refreshToken?.expiryDate < refreshToken?.expiryDate.toISOString())) {
          user.refreshToken = (({ token, expiryDate }) => ({ token, expiryDate }))(refreshToken);
        }
      }
    }
    //console.log("adminPanel users with refresh tokens:", users);
    res.status(200).json({users});
  }).catch(function(err){
    console.log("adminPanel error:", err);
  });
};

exports.adminBoard = (req, res) => {
  console.log("Admin Board:", req.params, req.body);
  res.status(200).json("Admin Board.");
};

