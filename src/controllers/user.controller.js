const emailValidate = require("email-validator");
const codiceFiscaleValidate = require("codice-fiscale-js");
const i18n = require("i18next");
const db = require("../models");
const { normalizeEmail, isAdmin, objectContains } = require("../helpers/misc");

const {
  user: User,
  plan: Plan,
  role: Role,
  refreshToken: RefreshToken,
} = db.models;

exports.getUsers = async(req, res) => {
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
};

exports.getPlan = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's plan
    if (!await isAdmin(userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to get another user's plan"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) {
    return res.status(400).json({ message: req.t("User must be authenticated") });
  }

  Plan.find({})
  .select(["name", "supportTypes", "priceCurrency", "pricePerYear", "cigNumberAllowed", "-_id"])
  .exec(async(err, plan) => {
    if (err) {
      logger.error("Error finding plan:", err);
      return res.status(err.code).json({ message: req.t("Could not find plan"), reason: err.message });
    }
    res.status(200).json(plan);
  })
};

exports.getRoles = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's role
    if (!await isAdmin(req.body.userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to get another user's roles"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

  // default role must be the first element in the returned array
  Role.find({})
  .select(["name", "-_id"])
  .exec(async(err, roles) => {
    if (err) {
      logger.error("Error finding roles:", err);
      return res.status(err.code).json({ message: req.t("Could not find roles"), reason: err.message });
    }
console.log("ROLES:", roles);
    res.status(200).json(roles);
  })
};

exports.getProfile = async(req, res) => {
  let userId = req.userId;
  if (req.body.userId) { // request to update another user's profile
    if (!await isAdmin(req.body.userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

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
    if (!await isAdmin(req.body.userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

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

    [message, value] = await propertyEmailValidate(req.body.email, user);
    if (message) return res.status(400).json({ message });
    user.email = value;

    if (req.body.firstName) {
      [message, value] = user.firstName = propertyFirstNameValidate(req.body.firstName, user);
      if (message) return res.status(400).json({ message });
      user.firstName = value;
    }

    if (req.body.lastName) {
      [message, value] = user.lastName = propertyLastNameValidate(req.body.lastName, user);
      if (message) return res.status(400).json({ message });
      user.lastName = value;
    }

    if (req.body.fiscalCode) {
      [message, value] = user.fiscalCode = propertyFiscalCodeValidate(req.body.fiscalCode, user);
      if (message) return res.status(400).json({ message });
      user.fiscalCode = value;
    }

    if (req.body.businessName) {
      user.businessName = req.body.businessName;
    }

    if (req.body.address) {
      user.address = req.body.address;
    }

    // verify and save the user
    user.save(err => {
      if (err) return res.status(errocode).json({ message: err.message });
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
    if (!await isAdmin(req.body.userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });

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
  const callerId = req.userId;
  const requestedId = req.body.userId;
  const callerIsAdmin = await isAdmin(callerId);
  //const requestedIsAdmin = await isAdmin(requestedId);
  let userId = callerId;
  if (!callerId) return res.status(400).json({ message: req.t("User must be authenticated") });
  if (requestedId !== undefined) { // request to update another user's profile
    if (!callerIsAdmin) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = requestedId; // if admin, accept a specific user id in request
    }
  }

  if (req.body.roles === undefined || typeof req.body.roles !== "object" || req.body.roles.length <= 0) {
    return res.status(400).json({ message: req.t("Please specify at least one role") });
  }

  //User.findOne({ _id: userId }, async(err, user) => {
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
    }, (err, docs) => {
      if (err) {
        logger.error("Error finding roles:", err);
        return res.status(err.code).json({ message: "Error finding roles", reason: err.message });
      }

      if (!callerIsAdmin) { // caller is not admin: check if requested roles do not require an upgrade, otherwise error out
        requestedRolesMaxPriority = Math.max(...docs.map(role => role.priority));
        currentRolesMaxPriority = Math.max(...user.roles.map(role => role.priority));
        if (requestedRolesMaxPriority > currentRolesMaxPriority) {
          return res.status(400).json({ message: req.t("Sorry, this user is not allowed elevate roles") });
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
    if (!await isAdmin(req.body.userId)) { // check if request is from admin
      return res.status(403).json({ message: req.t("You must have admin role to update another user's profile"), code: "MustBeAdmin", reason: req.t("Admin role required") });
    } else {
      userId = req.body.userId; // if admin, accept a specific user id in request
    }
  }
  if (!userId) return res.status(400).json({ message: req.t("User must be authenticated") });
  if (!req.body.plan) return res.status(400).json({ message: req.t("Plan is mandatory") });
  // plan value correctness is enforced by database model

  User.findOne({ _id: userId }, async(err, user) => {
    if (err) {
      logger.error("Error finding user:", err);
      return res.status(err.code).json({ message: req.t("Error looking for user"), reason: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: req.t("User not found") });
    }

    // search plan
    Plan.findOne({
      "name": { $in: req.body.plan }
    }, (err, doc) => {
      if (err) {
        logger.error("Error finding plan:", err);
        return res.status(err.code).json({ message: "Error finding plan", reason: err.message });
      }
      user.plan = doc;

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
  } catch (err) {
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

exports.adminPanel = (req, res) => { // TODO: rename as getAllUsersWithFullInfo
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
  }).catch(function(err){
    console.log("adminPanel error:", err);
  });
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
