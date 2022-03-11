const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../../models/user");

console.log("process.env.JWT_ACCESS_TOKEN_SECRET:", process.env.JWT_ACCESS_TOKEN_SECRET);
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch(err => {
          return done(err, false, { message: "Server Error" });
        })
      ;
    })
  );
};
