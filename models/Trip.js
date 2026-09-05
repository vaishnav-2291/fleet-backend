const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    vehicleId: {
      type: String,
      required: true,
      trim: true
    },

    driverId: {
      type: String,
      required: true,
      trim: true
    },

    origin: {
      type: String,
      required: true,
      trim: true
    },

    destination: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled"
      ],
      default: "scheduled"
    },

    distanceKm: {
      type: Number,
      default: 0,
      min: 0
    },

    estimatedDurationMinutes: {
      type: Number,
      default: 0,
      min: 0
    },

    actualDurationMinutes: {
      type: Number,
      default: null,
      min: 0
    },

    startTime: {
      type: Date,
      default: null
    },

    endTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Trip", tripSchema);