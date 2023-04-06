const emailValidate = require("email-validator");
const codiceFiscaleValidate = require("codice-fiscale-js");
const i18n = require("i18next");
const { logger } = require("./logger.controller");
const User = require("../models/user.model");
const Plan = require("../models/plan.model");
const Role = require("../models/role.model");
const RefreshToken = require("../models/refreshToken.model");
const { normalizeEmail, isAdmin, objectContains } = require("../helpers/misc");

exports.getAllUsersWithFullInfo = (req, res) => {
  // get all users and refresh tokens
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
  }).catch(err => {
    logger.error("Error getting all users with full info:", err.message);
    return res.status(500).json({err: err.message});
  });
};

exports.getAllUsers = async(req, res) => {
  try {
    filter = req.body.filter ?? {};
    if (typeof filter !== "object") {
      return res.status(400).json({ message: req.t("A filter must be an object") });
    }
    const users = await User.find(filter)
      .select(["-password", "-__v"])
      .populate("roles", "-__v")
      .populate("plan", "-__v")
      .lean()
      .exec()
    ;
    res.status(200).json({users});
  } catch(err) {
    logger.error("Error getting all users with:", err.message);
    return res.status(500).json({err: err.message});
  };
};

// get all plans
exports.getAllPlans = async(req, res) => {
  try {
    Plan.find({})
    .select(["name", "supportTypes", "priceCurrency", "pricePerYear", "cigNumberAllowed", "-_id"])
    .sort({pricePerYear: 1})
    .exec(async(err, plan) => {
      if (err) {
        logger.error("Error getting plans:", err);
        return res.status(err.code).json({ message: req.t("Could not get plans"), reason: err.message });
      }
      res.status(200).json(plan);
    });
  } catch(err) {
    logger.error("Error getting all plans:", err.message);
    res.status(500).json({ message: req.t("Error getting all plans"), reason: err.message });
  }
};

// get all roles
exports.getAllRoles = async(req, res) => {
  try {
    // the first element in the returned array is the "default" role
    Role.find({})
    .select(["name", "-_id"])
    .exec(async(err, roles) => {
      if (err) {
        logger.error("Error getting roles:", err);
        return res.status(err.code).json({ message: req.t("Could not get roles"), reason: err.message });
      }
      res.status(200).json(roles);
    })
  } catch(err) {
    logger.error("Error getting roles:", err);
    res.status(500).json({ message: req.t("Error getting roles"), reason: err.message });
  }
};

exports.getProfile = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  //if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  User.findOne({
    _id: req.userId
  })
  .populate("roles", "-__v")
  .populate("plan", "-__v")
  .exec(async(err, user) => {
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Could not find user"), reason: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: req.t("Could not find this user") });
    }
    res.status(200).json({user});
  });
};

/**
 * Update current user's profile
 */
exports.updateProfile = async(req, res, next) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  //if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  User.findOne({ _id: userId }, async(err, user) => {
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: req.t("User not found") });
    }

    // validate and normalize email
    let [message, value] = [null, null];

    if (req.body.email !== undefined) {
      [message, value] = await propertyEmailValidate(req.body.email, user);
      if (message) return res.status(400).json({ message });
      user.email = value;
    }

    if (req.body.firstName !== undefined) {
      [message, value] = user.firstName = propertyFirstNameValidate(req.body.firstName, user);
      if (message) return res.status(400).json({ message });
      user.firstName = value;
    }

    if (req.body.lastName !== undefined) {
      [message, value] = user.lastName = propertyLastNameValidate(req.body.lastName, user);
      if (message) return res.status(400).json({ message });
      user.lastName = value;
    }

    if (req.body.fiscalCode !== undefined) {
      [message, value] = user.fiscalCode = propertyFiscalCodeValidate(req.body.fiscalCode, user);
      if (message) return res.status(400).json({ message });
      user.fiscalCode = value;
    }

    if (req.body.businessName !== undefined) {
      user.businessName = req.body.businessName;
    }

    if (req.body.address !== undefined) {
      user.address = req.body.address;
    }

    // verify and save the user
    user.save(err => {
      if (err) return res.status(err.code).json({ message: err.message });
      res.status(200).json({ message: req.t("The profile has been updated")});
    });
  });
}

/**
 * Update a property of any user's profile
 */
exports.updateUserProperty = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  //if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  //let payload = req.body.payload;
  User.findOneAndUpdate({ _id: userId }, req.body.payload, {new: true, lean: true}, async(err, data) => {
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
//console.info("findOneAndUpdate response data:", data);
//console.info("req.body.payload:", req.body.payload);
    let ok = objectContains(data, req.body.payload);
    if (ok === true) {
      res.status(200).json({ message: req.t("The property has been updated")});
    } else {
      res.status(400).json({ message: req.t("Property {{property}} was not updated", {property: ok}) });
    }
  });
}
 

exports.updateRoles = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  //if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  if (req.body.roles === undefined || typeof req.body.roles !== "object" || req.body.roles.length <= 0) {
    return res.status(400).json({ message: req.t("Please specify at least one role") });
  }

  User.findOne({ _id: userId })
  .populate("roles", "-__v")
  .exec(async(err, user) => {  
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: req.t("User not found") });
    }

    // get roles ids, here we only have the names...
    Role.find({
      "name": { $in: req.body.roles }
    }, async(err, docs) => {
      if (err) {
        logger.error("Error finding roles:", err);
        return res.status(err.code).json({ message: "Error finding roles", reason: err.message });
      }

      if (!await isAdmin(req.userId)) { // caller is not admin: check if requested roles do not require an upgrade, otherwise error out
        requestedRolesMaxPriority = Math.max(...docs.map(role => role.priority));
        currentRolesMaxPriority = Math.max(...user.roles.map(role => role.priority));
        if (requestedRolesMaxPriority > currentRolesMaxPriority) {
          return res.status(403).json({ message: req.t("Sorry, this user is not allowed elevate roles") });
        }
      }
      user.roles = docs.map(doc => doc._id);

      // verify and save the user
      user.save(err => {
        if (err) {
          logger.error("Error saving user:", err);
          return res.status(err.code).json({ message: "Error saving user", reason: err.message });
        }
        res.status(200).json({ message: req.t("The roles have been updated") });
      });
    });
  });
}
  
exports.updatePlan = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  //if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  if (!req.body.plan) return res.status(400).json({ message: req.t("Plan is mandatory") });
  // plan value correctness is enforced by database model

  User.findOne({ _id: userId })
  .populate("plan", "-__v")
  .exec(async(err, user) => {  
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: req.t("User not found") });
    }

    // search plan
    Plan.findOne({
      "name": req.body.plan
    }, async(err, doc) => {
      if (err) {
        logger.error("Error finding plan:", err);
        return res.status(err.code).json({ message: "Error finding plan", reason: err.message });
      }

      if (!await isAdmin(req.userId)) { // caller is not admin: check if requested plan do not require an upgrade, otherwise error out
        if (doc.cigNumberAllowed > user.plan.cigNumberAllowed) { // we assume cigNumberAllowed is a measure of plan priority
          return res.status(403).json({ message: req.t("Sorry, this user is not allowed elevate plan") });
        }
      }
      user.plan = doc._id;

      // verify and save the user
      user.save(err => {
        if (err) {
          logger.error("Error saving user:", err);
          return res.status(err.code).json({ message: "Error saving user", reason: err.message });
        }
        res.status(200).json({ message: req.t("The plan has been updated"), user });
      });
    });
  });
};

// deletes a user: delete it from database
exports.delete = async(req, res) => {
  if (!req.body.filter) {
    return res.status(400).json({ message: req.t("A filter is mandatory to delete users (use \"*\" for all users)") });
  }

  if (req.body.filter === "*") { // we require a not null filter (string "*") to delete all users for added security reasons
    filter = {};
  } else {
    if (typeof filter !== "object") {
      return res.status(400).json({ message: req.t("A filter must be the string \"*\" or an object") });
    } else {
      filter = req.body.filter;
    }
  }

  try {
    const data = await User.deleteMany(filter);
    if (data.deletedCount > 0) {
      res.status(200).json({ message: req.t("{{count}} user(s) have been deleted", { count: data.deletedCount }), count: data.deletedCount });
    } else {
      res.status(400).json({ message: req.t("No user have been deleted") });
    }
  } catch(err) {
    res.status(err.code).json({ message: req.t("Could not delete user(s)"), reason: err.message });
  }
};

// removes a user: mark it as deleted, but do not delete from database
exports.remove = async(req, res) => {
  if (!req.body.filter) {
    return res.status(400).json({ message: req.t("A filter is mandatory to delete users (use \"*\" for all users)") });
  }

  if (req.body.filter === "*") { // we require a not null filter (string "*") to delete all users for added security reasons
    filter = {};
  } else {
    if (typeof req.body.filter !== "object") {
      return res.status(400).json({ message: req.t("A filter must be the string \"*\" or an object") });
    } else {
      filter = req.body.filter;
    }
  }

  const payload = { isDeleted: true };
  User.updateMany(filter, payload, {new: true, lean: true}, async(err, data) => {
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
    if (data.nModified > 0) {
      res.status(200).json({ message: req.t("{{count}} user(s) have been deleted", { count: data.nModified }), count: data.nModified });
    } else {
      res.status(400).json({ message: req.t("No user have been deleted") });
    }
  });

  // const result = await User.deleteMany(filter);
  // res.status(200).json(result);
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
  value = value?.trim();
  if (!value) {
    return [ i18n.t("First name cannot be empty, sorry"), value ];
  }
  return [null, value];
};

const propertyLastNameValidate = (value, user) => { // validate and normalize last name
  value = value?.trim();
  if (!value) {
    return [ i18n.t("Last name cannot be empty, sorry"), value ];
  }
  return [null, value];
};

const propertyFiscalCodeValidate = (value, user) => { // validate and normalize (italian) fiscal code
  value = value?.trim();
  if (!codiceFiscaleValidate.check(value)) {
    return [ i18n.t("Fiscal code is not valid, sorry"), value ];
  }
  return [null, value];
};
