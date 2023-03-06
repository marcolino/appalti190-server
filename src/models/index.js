const { process_params } = require("express/lib/router");
const mongoose = require("mongoose");
const config = require("../config");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.models = {
  user: require("./user.model"),
  role: require("./role.model"),
  plan: require("./plan.model"),
  refreshToken: require("./refreshToken.model"),
  verificationCode: require("./verificationCode.model"),
};

db.roles = [
  {
    name: "user", 
    priority: 1,
  }, {
    name: "admin",
    priority: 999,
  }
];

db.plans = [
  {
    name: "free",
    priceCurrency: config.currency,
    pricePerYear: 0,
    pricePerMonth: undefined,
    cigsCountAllowed: "10",
    supportTypes: [ "email" ],
  },
  {
    name: "standard",
    priceCurrency: config.currency,
    pricePerYear: 399,
    pricePerMonth: undefined,
    cigsCountAllowed: "200",
    supportTypes: [ "email" ],
  },
  {
    name: "unlimited",
    priceCurrency: config.currency,
    pricePerYear: 799,
    pricePerMonth: undefined,
    cigsCountAllowed: -1, // unlimited
    supportTypes: [ "email", "phone" ],
  },
];

db.populate = () => { // first time populate static reference documents

  // NEWFEATURE: add admin user
  
  const Role = db.models.role;
  Role.estimatedDocumentCount((err, count) => {
    if (err) {
      console.error(`error estimating roles documents count: ${err}`);
      process.exit(-1);
    }
    if (count === 0) { // roles is empty
      db.roles.map(role => {
        new Role(role).save(err => {
          if (err) {
            console.error(`error saving role ${role}: ${err}`);
            process.exit(-1);
          }
          console.log(`added ${role} to roles collection`);
        });
      });
    }
  });

  const Plan = db.models.plan;
  Plan.estimatedDocumentCount((err, count) => {
    if (err) {
      console.error(`error estimating plans documents count: ${err}`);
      process.exit(-1);
    }
    if (count === 0) { // plans is empty
      db.plans.map(plan => {
        new Plan(
          plan
        ).save(err => {
          if (err) {
            console.error(`error saving plan ${plan.name}: ${err}`);
            process.exit(-1);
          }
          console.log(`added ${plan.name} to plans collection`);
        });
      });
    }
  });
};

module.exports = db;