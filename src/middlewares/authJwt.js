const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const User = db.models.user;
const Role = db.models.role;

const { TokenExpiredError } = jwt;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "You must be authenticated to access this page", code: "NoToken", reason: "No token provided" });
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ message: "You must be authorized to access this page", code: "AuthorizationExpired", reason: "Authorization was expired, please repeat login!" });
      }
      return res.status(401).json({ message: "You must be authorized to access this page", code: "NoAuthorization", rreason: "Unauthorized!" });
    }
//console.log("TOKEN DECODED:", decoded);
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err});
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).json({ message: "You must have admin role to access this page", code: "MustBeAdmin", reason: "Admin role required" });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).json({ message: "You must have moderator role to access this page", code: "MustBeModerator", reason: "Moderator role required" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
