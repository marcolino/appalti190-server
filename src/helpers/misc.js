const url = require("url");
//const punycode = require("punycode");

module.exports = {
  sanitizeJob: (job) => {
    if (!job?.transform?.xml) {
      return job;
    }
    let j = job;
    j.transform.xml = "…";
    return j;
  },
  normalizeEmail: (email) => {
    //return email.toLowercase();
    email = email.trim().toLowerCase();

    const atIndex = email.lastIndexOf("@");

    // We don't need to check that there is an @ or if it's the last index
    // because validation rejects those cases.

    let localPart = email.substring(0, atIndex);
    let domain = email.substring(atIndex + 1);

    domain = cleanDomain(domain);

    const separator = domain === "yahoo.com" ? "-" : "+";
    const separatorIndex = localPart.indexOf(separator);
    if (separatorIndex > 0) {
      localPart = localPart.substring(0, separatorIndex);
    }

    return localPart + "@" + domain;
  }
};

const cleanDomain = (domain) => {
  // We don't need to trim the domain as if it has any leading whitespace
  // validation rejects it as invalid.

  // We don't need to strip a trailing '.' because validation rejects domains
  // that have it.

  //domain = punycode.toASCII(domain);
  domain = url.domainToASCII(domain);

  return domain;
};
