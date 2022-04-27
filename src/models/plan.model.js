const mongoose = require("mongoose");

const PlanSchema = mongoose.Schema({
  name: String,
  priceCurrency: String,
  pricePerYear: Number,
  pricePerMonth: Number,
  cigNumberAllowed: Number,
  supportTypes: [
    {
      type: String,
      enum : [ "email", "phone" ],
    }
  ],
});

PlanSchema.pre("save", function(next) {
  const plan = this;

  // convert -1 ("unlimited") value to a number (MAX_SAFE_INTEGER), to allow easier handling
  if (plan.cigNumberAllowed === -1) {
    plan.cigNumberAllowed = Number.MAX_SAFE_INTEGER;
  }
  next();
});

module.exports = mongoose.model("Plan", PlanSchema);
