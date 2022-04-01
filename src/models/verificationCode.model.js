const mongoose = require("mongoose");

const VerificationCode = mongoose.model(
  "VerificationCode",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    code: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200
    }
  }, {timestamps: true})
);

module.exports = VerificationCode;