const config = require("../config");
const sendemail = require("../helpers/sendemail");

const assertEnvironment = () => {
  console.log("assertEnvironment");

  if (!process.env) {
    console.error("Missing env!");
    sendemail.assertionsCheckFailure(`Missing env!`);
    return false;
  }
  // find missing variables in current environment
  const missing = config.envRequiredVariables.filter(v => {
    return !(v in process.env); // this variable doesn't exist in process.env
  });
  if (missing.length) {
    console.error("Missing in env:", missing);
    sendemail.assertionsCheckFailure(`Missing in env: ${JSON.stringify(missing)}`);
    return false;
  }
  return true;
}

module.exports = { assertEnvironment };
