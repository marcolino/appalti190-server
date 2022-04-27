const db = require("../models");
const { normalizeEmail } = require("../helpers/misc");

const {
  user: User,
  refreshToken: RefreshToken,
} = db.models;

exports.getProfile = async(req, res) => {
  console.info("getProfile");

  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});

  //try {
    // find current user
    User.findOne({ _id: req.userId }, async (err, user) => { // TODO: remove try/catch from findOne (returns err...)
      if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
      if (!user) return res.status(400).json({ message: "We were unable to find this user" });

      res.status(200).json({user});
    });
  //} catch (error) {
  //  res.status(500).json({message: error.message})
  //}
};

exports.updateProfile = async(req, res) => {
  console.info("updateProfile - address:", req.body.address);

  if (!req.userId) return res.status(400).json({message: "User must be authenticated"});
  if (!req.body.email) return res.status(400).json({message: "Email is mandatory"});

  //try {
    // find current user
    User.findOne({ _id: req.userId }, async (err, user) => { // TODO: remove try/catch from findOne (returns err...)
      if (err) return res.status(500).json({ message: "We could not find user", reason: errorMessage(err) });
      if (!user) return res.status(400).json({ message: "We were unable to find this user" });

      // be sure email - if changed - is not taken already
      if (normalizeEmail(req.body.email) !== normalizeEmail(user.email)) {
        const check = await User.findOne({ email: req.body.email });
        if (check) return res.status(400).json({ message: "This email is already taken, sorry." });
      }
  
      // TODO: check requires fields are present and valid...

      user.email = req.body.email;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.address = req.body.address;
      user.fiscalCode = req.body.fiscalCode;

      // verify and save the user
      user.save(err => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "The profile has been updated." });
      });
    });
  //} catch (error) {
  //  res.status(500).json({message: error.message})
  //}
}

exports.allAccess = (req, res) => {
  res.status(200).json("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).json("User Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json("Moderator Content.");
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
    User.find()
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

