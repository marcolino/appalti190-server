const mongoose = require("mongoose");
const config = require("../config");
const { v4: uuidv4 } = require("uuid");

const RefreshTokenSchema = mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user) {
  const expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.auth.jwtRefreshExpiration
  );

  const token = uuidv4();

  const object = new this({
    token: token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  //console.log("RefreshTokenSchema object:", object);

  const refreshToken = await object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
