const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    vehicleType: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    vin: {
      type: String,
      required: true,
      unique: true,
    },

    mileage: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Available", "Sold", "Reserved"],
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);