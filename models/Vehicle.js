const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    type: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    },

    driverId: {
      type: String,
      default: null,
      trim: true
    },

    location: {
      type: String,
      default: null,
      trim: true
    },

    mileage: {
      type: Number,
      default: 0
    },

    fuelLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);