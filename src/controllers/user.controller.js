const db = require("../models");
const emailValidate = require("email-validator");
const codiceFiscaleValidate = require("codice-fiscale-js");
const i18n = require("i18next");
const { normalizeEmail } = require("../helpers/misc");

const {
  user: User,
  plan: Plan,
  role: Role,
  refreshToken: RefreshToken,
} = db.models;

// const PROPERTY_OK = 0;
// const PROPERTY_EMAIL_INVALID = 1;
// const PROPERTY_EMAIL_DUPLICATED = 2;
// const PROPERTY_FIRSTNAME_EMPTY = 3;
// const PROPERTY_LASTNAME_EMPTY = 4;



exports.getRoles = async(req, res) => {
console.log("getRoles CALLED");
  // default role must be the first element in the returned array
  Role.find({})
  .select(["name", "-_id"])
  .exec(async(err, roles) => {
    if (err) return res.status(500).json({ message: req.t("Could not find roles"), reason: err });
console.log("ROLES:", roles);
    res.status(200).json(roles);
  })
};

exports.getProfile = async(req, res) => {
  if (!req.userId) return res.status(400).json({message: req.t("User must be authenticated")});

  User.findOne({
    _id: req.userId
  })
  .populate("roles", "-__v")
  .populate("plan", "-__v")
  .exec(async(err, user) => {
    if (err) return res.status(500).json({ message: req.t("Could not find user"), reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: req.t("Could not find this user") });
    res.status(200).json({user});
  });
};

/**
 * Update current user's profile
 */
exports.updateProfile = async(req, res) => {
  if (!req.userId) return res.status(400).json({ message: req.t("User must be authenticated") });
  if (!req.body.email) return res.status(400).json({ message: req.t("Email is mandatory") });

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: req.t("Could not find user"), reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: req.t("Could not find this user") });

    // validate and normalize email
    const [error, value] = [null, null];

    [error, value] = await propertyEmailValidate(req.body.email, user);
    if (error) return res.status(400).json({ message: error });
    user.email = value;

    [error, value] = user.firstName = propertyFirstNameValidate(req.body.firstName, user);
    if (error) return res.status(400).json({ message: error });
    user.firstName = value;

    [error, value] = user.lastName = propertyLastNameValidate(req.body.lastName, user);
    if (error) return res.status(400).json({ message: error });
    user.lastName = value;

    user.fiscalCode = req.body.fiscalCode;

    user.businessName = req.body.businessName;

    user.address = req.body.address;

    // verify and save the user
    user.save(err => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: req.t("The profile has been updated")});
    });
  });
}

/**
 * Update a property of any user's profile
 */
exports.updateUserProperty = async(req, res) => {
console.log("updateUserProperty - userId:", req.body.userId);
console.log("updateUserProperty - propertyName:", req.body.propertyName);
console.log("updateUserProperty - propertyValue:", req.body.propertyValue);
  User.findOne({ _id: req.body.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: req.t("Could not find user"), reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: req.t("Could not find this user") });

    const propertyName = req.body.propertyName;
    const propertyValue = req.body.propertyValue;
    
    // if (!(req.body.propertyName in user)) {
    //   return res.status(400).json({ message: `Property ${propertyName} can't be set` });
    // }

    const [error, value] = [null, null];
    switch (propertyName) {
      case "firstName":
        [error, value] = propertyFirstNameValidate(propertyValue, user);
        if (error) return res.status(400).json({ message: error });
        user[propertyName] = value;
        break;
      case "lastName":
        [error, value] = propertyLastNameValidate(propertyValue, user);
        if (error) return res.status(400).json({ message: error });
        user[propertyName] = value;
        break;
      case "email":
        [error, value] = await propertyEmailValidate(propertyValue, user);
        if (error) return res.status(400).json({ message: error });
console.log("$$$$", propertyName, value)
        user[propertyName] = value;
      break;
        case "fiscalCode":
        [error, value] = propertyFiscalCodeValidate(propertyValue, user);
        if (error) return res.status(400).json({ message: error });
        user[propertyName] = value;
        break;
      case "businessName":
        user[propertyName] = propertyValue;
        break;
      case "address_street":
        if (!user.address) user.address = {};
        user.address.street = propertyValue;
        break;
      case "address.streetNo":
        if (!user.address) user.address = {};
        user.address.streetNo = propertyValue;
        break;
      case "address.city":
        if (!user.address) user.address = {};
        user.address.city = propertyValue;
        break;
      case "address.zip":
        if (!user.address) user.address = {};
        user.address.zip = propertyValue;
        break;
      case "address.province":
        if (!user.address) user.address = {};
        user.address.province = propertyValue;
        break;
      case "address.country":
        if (!user.address) user.address = {};
        user.address.country = propertyValue;
        break;

      default: // unforeseen properties here do pass validation
        user[propertyName] = propertyValue;
        break;
    }

    // verify and save the user
    user.save((err, user) => {
      if (err) return res.status(500).json({ message: err.message });
console.log("USER AFTER:", user.address);
      res.status(200).json({ message: req.t("The property has been updated"), propertyValue: value });
    });
  });
}

exports.updateRoles = async(req, res) => {
  console.log("UpdateRoles, body:", req.body);
  if (!req.userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: req.t("Could not find user"), reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: req.t("Could not find this user") });

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
        res.status(200).json({ message: req.t("The profile has been updated") });
      });
    });
  });
}
  
exports.updatePlan = async(req, res) => {
  if (!req.userId) return res.status(400).json({ message: req.t("User must be authenticated") });
  if (!req.body.plan) return res.status(400).json({ message: req.t("Plan is mandatory") });
  // plan value correctness is enforced by database model

  User.findOne({ _id: req.userId }, async (err, user) => {
    if (err) return res.status(500).json({ message: req.t("Error looking for user"), reason: errorMessage(err) });
    if (!user) return res.status(400).json({ message: req.t("User not found") });

    // search plan
    Plan.findOne({
      "name": { $in: req.body.plan }
    }, (err, doc) => {
      if (err) return res.status(500).json({ message: err.message });
      user.plan = doc;

      // verify and save the user
      user.save(err => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ user });
      });
    });
  });
}

exports.allAccess = (req, res) => {
  res.status(200).json("Public Content");
};

exports.userBoard = (req, res) => {
  res.status(200).json("User Content");
};

exports.users = async(req, res) => {
  const users = await User.find()
    .select(["-password", "-__v"])
    .populate("roles", "-__v")
    .populate("plan", "-__v")
    .lean()
    .exec()
  ;
  res.status(200).json({users});
};

exports.deleteAll = async(req, res) => {
  const result = User.deleteMany({}/*, () => {}*/);
console.log("deleteAll result:", result);
  res.status(200).json(result);
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
    res.status(200).json({users});
  }).catch(function(err){
    console.log("adminPanel error:", err);
  });
};

exports.adminBoard = (req, res) => {
  console.log("Admin Board:", req.params, req.body);
  res.status(200).json("Admin Board");
};

// user properties validation
const propertyEmailValidate = async(value, user) => { // validate and normalize email
  if (!emailValidate.validate(value)) {
    return [ i18n.t("Please supply a valid email"), value];
  } 
  value = normalizeEmail(value);

  // be sure email - if changed - is not taken already
  if (value !== normalizeEmail(user.email)) {
    const check = await User.findOne({ email: value });
    if (check) return [ i18n.t("This email is already taken, sorry"), value ];
  }
  return [null, value];
};

const propertyFirstNameValidate = (value, user) => { // validate and normalize first name
  value = value.trim();
  if (!value) {
    return [ i18n.t("First name cannot be empty, sorry"), value ];
  }
  return [null, value];
};

const propertyLastNameValidate = (value, user) => { // validate and normalize last name
  value = value.trim();
  if (!value) {
    return [ i18n.t("Last name cannot be empty, sorry"), value ];
  }
  return [null, value];
};

const propertyFiscalCodeValidate = (value, user) => { // validate and normalize (italian) fiscal code
  value = value.trim();
  if (!codiceFiscaleValidate.check(value)) {
    return [ i18n.t("Fiscal code is not valid, sorry"), value ];
  }
  return [null, value];
};
