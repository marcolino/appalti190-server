const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const User = db.models.user;
const Role = db.models.role;

const { TokenExpiredError } = jwt;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: req.t("You must be authenticated to access this page"), code: "NoToken", reason: req.t("No token provided") });
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ message: req.t("Access token expired"), code: "AuthorizationExpired", reason: req.t("Authorization was expired, please repeat login!") });
      }
      return res.status(401).json({ message: req.t("You must be authorized to access this page"), code: "NoAuthorization", reason: req.t("Unauthorized!") });
    }
//console.log("TOKEN DECODED:", decoded);
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err});
    }
    if (!user) {
      return res.status(500).json({ message: req.t("User not found!")});
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).json({ message: err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            if (next) { let a = 1; }
            return next();
          }
        }

        return res.status(403).json({ message: req.t("You must have admin role to access this page"), code: "MustBeAdmin", reason: req.t("Admin role required") });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
