const url = require("url");
const config = require("../config");
const db = require("../models");
const User = db.models.user;
const Role = db.models.role;

module.exports = {

  objectContains: (big, small) => {
    if (big === small) return true; // if both big and small are null or undefined and exactly the same
  
    if (!(big instanceof Object) || !(small instanceof Object)) {
      return "is not an object"; // if they are not strictly equal, they both need to be Objects
    }

    for (let p in big) {
      if (!big.hasOwnProperty(p)) continue;
  
      if (big[p] === small[p]) continue; // if they have the same strict value or identity then they are equal
  
      if (typeof small[p] !== "undefined") {
        if (! module.exports.objectContains(big[p], small[p])) return p; // Objects and Arrays must be tested recursively
      }
    }
  
    for (p in small) {
      if (small.hasOwnProperty(p) && !big.hasOwnProperty(p)) {
        return p; // allows big[p] to be set to undefined
      }
      if (typeof small[p] === "string" || typeof small[p] === "number" || typeof small[p] === "boolean" || typeof small[p] === "undefined") {
        // a native type
        if (small[p] !== big[p]) {
          return p; // compares values
        }
      }
    }
  
    return true;
  },

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
    return new Date().toLocaleString(config.locale, { timeZoneName: "short" });
  },

  nowLocaleDateTimeFilenameFormat: (date = new Date()) => {
    let offset = new Date(date).getTimezoneOffset() / 60;
    let d = new Date(date);
    d.setHours(d.getHours() + offset);
    let year = d.getFullYear();
    let month = "" + (d.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    let day = "" + d.getDate();
    if (day.length < 2) day = "0" + day;
    let hour = "" + d.getHours();
    if (hour.length < 2) hour = "0" + hour;
    let minute = "" + d.getMinutes();
    if (minute.length < 2) minute = "0" + minute;
    let second = "" + d.getSeconds();
    if (second.length < 2) second = "0" + second;
    return [year, month, day].join("-") + "_" + [hour, minute, second].join(":");
  },

  remoteAddress: (req) => {
    return (
      req.headers["x-forwarded-for"] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    ).replace(/^.*:/, "");
  },

  isAdmin: async(userId) => {
    const user = await User.findOne({ _id: userId }).populate("roles", "-__v");
    for (let i = 0; i < user?.roles?.length; i++) {
      if (user.roles[i].name === "admin") {
        return true;
      }
    }
    return false;
  },

};

const cleanDomain = (domain) => {
  // We don't need to trim leading whitespace
  // because validation rejects it as invalid.

  // We don't need to strip a trailing "."
  // because validation rejects it as invalid.

  domain = url.domainToASCII(domain);

  return domain;
};
