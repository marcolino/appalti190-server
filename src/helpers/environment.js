const config = require("../config");
const { assertionsCheckFailure } = require("../helpers/notification");

module.exports = {
  assertEnvironment: () => {
    if (!process.env) {
      console.error("Missing env!");
      assertionsCheckFailure(`Missing env!`);
      return false;
    }
    // find missing variables in current environment
//console.log("environment - .env:", process.env);
//console.log("environment - config.envRequiredVariables:", config.envRequiredVariables);
    const missing = config.envRequiredVariables.filter(v => {
      return !(v in process.env); // this variable doesn't exist in process.env
    });
    if (missing.length) {
      console.error("Missing in env:", missing);
      assertionsCheckFailure(`Missing in env: ${JSON.stringify(missing)}`);
      return false;
    }

    return true;
  },
};
