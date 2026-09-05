const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      default: null,
      trim: true
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive", "on_leave"],
      default: "active"
    },

    assignedVehicleId: {
      type: String,
      default: null,
      trim: true
    },

    currentLocation: {
      type: String,
      default: null,
      trim: true
    },

    tripsCompleted: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Driver", driverSchema);