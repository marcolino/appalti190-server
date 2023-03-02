const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("./role.model");
const Plan = require("./plan.model");
const VerificationCode = require("./verificationCode.model");

// Address schema
const AddressSchema = mongoose.Schema({
  street: String,
  streetNo: String,
  city: String,
  province: String, // (state or province)
  zip: String,
  country: String,
});

const UserSchema = mongoose.Schema({
  // username:
  //   type: String,
  //   required: "Username is required",
  // },
  email: {
    type: String,
    required: "Email is required",
    unique: true // `email` must be unique
  },
  password: String,
  firstName: {
    type: String,
    max: 100
  },
  lastName: {
    type: String,
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
  job: Object,
  address: {
    type: AddressSchema,
  },
  fiscalCode: {
    type: String,
    max: 16,
  },
  businessName: {
    type: String,
  },
  bio: {
    type: String,
    max: 255
  },
  profileImage: {
    type: String,
    max: 255
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordCode: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, {timestamps: true});

UserSchema.pre("find", function() {
  const user = this;
  let condition = {};
  if (!this.options.allowDeleted) condition.isDeleted = false;
  if (!this.options.allowUnverified) condition.isVerified = true;
  user.where(condition);
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  user.hashPassword(user.password, async(err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.hashPassword = async(password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);
      bcrypt.hash(password, salt, (err, hash) => {
      if (err) return callback(err);
      return callback(null, hash);
    });
  });
};

UserSchema.methods.comparePassword = (passwordInput, passwordUser) => {
  return bcrypt.compareSync(passwordInput, passwordUser);
};

UserSchema.methods.compareLocalPassword = (passwordInput, passwordUser) => {
  return passwordInput === passwordUser;
};

UserSchema.methods.generatePasswordResetCode = () => {
  const maxDigits = 6;
  const expirySeconds = 60 * 60; // 1 hour

  return {
    code: generateRandomCode(maxDigits), //crypto.randomBytes(20).toString("hex")
    expires: Date.now() + (expirySeconds * 1000),
  };
};

UserSchema.methods.generateSignupVerificationCode = (userId) => {
  const maxDigits = 6;

  let payload = {
    userId: /*this._id*/userId,
    //token: crypto.randomBytes(20).toString("hex")
    code: generateRandomCode(maxDigits),
  };
  //console.info("generateSignupVerificationCode payload:", payload);
  return new VerificationCode(payload);
};

function generateRandomCode(maxDigits) {
  const maxValue = Math.pow(10, maxDigits);
  return String(Math.floor(Math.random(maxValue) * maxValue)).padStart(maxDigits, "0");
}

module.exports = mongoose.model("User", UserSchema);