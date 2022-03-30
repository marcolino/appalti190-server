const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("./role.model");
const Plan = require("./plan.model");
const VerificationCode = require("./verificationCode.model");

// Address schema
const AddressSchema = mongoose.Schema({
  street: String,
  houseNumber: String,
  city: String,
  state: String, // (state or province)
  zip: String,
});

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: {
    type: String,
    required: "First Name is required",
    max: 100
  },
  lastName: {
    type: String,
    required: "Last Name is required",
    max: 100
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan"
  },
  address: {
    type: AddressSchema,
  },
  bio: {
    type: String,
    required: false,
    max: 255
  },
  profileImage: {
    type: String,
    required: false,
    max: 255
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordCode: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  },
  // googleId: { // TODO: do we need this? possibly not, we use email as id for any user
  //   profileImage: {
  //     type: String,
  //     required: false,
  //     max: 255
  //   },
  // },
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = (passwordInput, passwordUser) => {
  return bcrypt.compareSync(passwordInput, passwordUser/*this.password*/);
};

UserSchema.methods.generatePasswordResetCode = () => {
  const maxDigits = 6;
  const expirySeconds = 60 * 60; // 1 hour

  this.resetPasswordCode = generateRandomCode(maxDigits); //crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + (expirySeconds * 1000);
};

UserSchema.methods.generateVerificationCode = (userId) => {
  const maxDigits = 6;

  let payload = {
    userId: /*this._id*/userId,
    //token: crypto.randomBytes(20).toString("hex")
    code: generateRandomCode(maxDigits),
  };
console.log("generateVerificationCode payload:", payload);
  return new VerificationCode(payload);
};

function generateRandomCode(maxDigits) {
  const maxValue = Math.pow(10, maxDigits);
  return Math.floor(Math.random(maxValue) * maxValue);
}

module.exports = mongoose.model("User", UserSchema);