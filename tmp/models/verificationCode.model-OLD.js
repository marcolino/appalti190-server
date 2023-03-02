const mongoose = require("mongoose");

const VerificationCode = mongoose.model(
  "VerificationCode",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "userId user reference is required in VerificationCode document",
      ref: "User"
    },
    code: {
      type: String,
      required: "code string is required in VerificationCode document",
    },
    createdAt: {
      type: Date,
      required: "createdAt date is required in VerificationCode document",
      default: Date.now,
      expires: 43200
    }
  }, {timestamps: true})
);

module.exports = VerificationCode;