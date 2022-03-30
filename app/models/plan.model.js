const mongoose = require("mongoose");

const PlanSchema = mongoose.Schema({
  name: String,
  priceCurrency: String,
  pricePerYear: Number,
  pricePerMonth: Number,
  cigNumberAllowed: String,
  supportTypes: [
    {
      type: String,
      enum : [ "email", "phone" ],
    }
  ],
});

module.exports = mongoose.model("Plan", PlanSchema);
