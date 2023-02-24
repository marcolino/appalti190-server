const url = require("url");
//const punycode = require("punycode");
const config = require("../config");

module.exports = {

  sanitizeJob: (job) => {
    if (!job?.transform?.xml) {
      return job;
    }
    let j = job;
    j.transform.xml = "…";
    return j;
  },

  // validateEmail: (email) => {
  //   return false;
  // },

  normalizeEmail: (email) => {
    //return email.toLowercase();
    if (!email) {
      return null;
    }

    email = email.trim().toLowerCase();

    const atIndex = email.lastIndexOf("@");

    // We don't need to check that there is an @ or if it's the last index
    // because validation rejects those cases.

    let localPart = email.substring(0, atIndex);
    let domain = email.substring(atIndex + 1);

    domain = cleanDomain(domain);

    // trim separators that allow multiple emails for the same real address
    const separator = domain === "yahoo.com" ? "-" : "+";
    const separatorIndex = localPart.indexOf(separator);
    if (separatorIndex > 0) {
      localPart = localPart.substring(0, separatorIndex);
    }

    return localPart + "@" + domain;
  },

  nowLocaleDateTime: () => {
    return new Date().toLocaleString(config.languages.default, { timeZoneName: "short" }); // TODO: use requested language
  },

  remoteAddress: (req) => {
    return (
      req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    ).replace(/^.*:/, '');
  },

};

const cleanDomain = (domain) => {
  // We don't need to trim leading whitespace
  // because validation rejects it as invalid.

  // We don't need to strip a trailing '.'
  // because validation rejects it as invalid.

  //domain = punycode.toASCII(domain);
  domain = url.domainToASCII(domain);

  return domain;
};

