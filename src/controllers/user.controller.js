const db = require("../models");

const {
  user: User,
  refreshToken: RefreshToken,
} = db.models;

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

