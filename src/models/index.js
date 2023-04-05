const mongoose = require("mongoose");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Plan = require("../models/plan.model");
//const RefreshToken = require("../models/refreshToken.model");
//const VerificationCode = require("../models/verificationCode.model");
const { logger } = require("../controllers/logger.controller");
const config = require("../config");

mongoose.Promise = global.Promise;
//db.mongoose = mongoose;

const db = {
  users: [
    {
      email: config.defaultUsers.admin.email,
      password: config.defaultUsers.admin.password,
      firstName: config.defaultUsers.admin.firstName,
      lastName: config.defaultUsers.admin.lastName,
    },
  ],

  roles: [
    {
      name: "user", 
      priority: 1,
    }, {
      name: "admin",
      priority: 999,
    }
  ],

  plans: [
    {
      name: "free",
      priceCurrency: config.currency,
      pricePerYear: 0,
      pricePerMonth: undefined,
      cigNumberAllowed: "10",
      supportTypes: [ "email" ],
    },
    {
      name: "standard",
      priceCurrency: config.currency,
      pricePerYear: 399,
      pricePerMonth: undefined,
      cigNumberAllowed: "200",
      supportTypes: [ "email" ],
    },
    {
      name: "unlimited",
      priceCurrency: config.currency,
      pricePerYear: 799,
      pricePerMonth: undefined,
      cigNumberAllowed: -1, // unlimited
      supportTypes: [ "email", "phone" ],
    },
  ],
};

const populate = () => { // first time populate static reference documents

  User.estimatedDocumentCount((err, count) => {
    if (err) {
      logger.error("Error estimating users documents count:", err);
      throw(err);
    }
    if (count === 0) { // roles is empty
      db.users.map(user => {
        new User(user).save(err => {
          if (err) {
            logger.error("Error saving user:", err);
            throw(err);
          }
          //console.log(`added user ${user.name} to users collection`);
        });
        // TODO: give user admin role and unlimited plan
      });
    }
  });
  
  Role.estimatedDocumentCount((err, count) => {
    if (err) {
      logger.error("Error estimating roles documents count:", err);
      throw(err);
    }
    if (count === 0) { // roles is empty
      db.roles.map(role => {
        new Role(role).save(err => {
          if (err) {
            logger.error(`error saving role ${role}:`, err);
            throw(err);
          }
          //console.log(`added role ${role.name} to roles collection`);
        });
      });
    }
  });

  Plan.estimatedDocumentCount((err, count) => {
    if (err) {
      logger.error("Error estimating plans documents count:", err);
      throw(err);
    }
    if (count === 0) { // plans is empty
      db.plans.map(plan => {
        new Plan(
          plan
        ).save(err => {
          if (err) {
            logger.error(`Error saving plan ${plan.name}:`, err);
            throw(err);
          }
        });
      });
    }
  });
};

module.exports = { mongoose, populate };