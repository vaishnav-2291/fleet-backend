const mongoose = require("mongoose");

const safetyAlertSchema = new mongoose.Schema(
  {
    alertId: {
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
      default: null,
      trim: true
    },

    alertType: {
      type: String,
      enum: [
        "accident",
        "overspeed",
        "harsh_braking",
        "harsh_acceleration",
        "geofence_breach",
        "driver_fatigue",
        "unauthorized_stop",
        "other"
      ],
      required: true
    },

    severity: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "critical"
      ],
      default: "medium"
    },

    status: {
      type: String,
      enum: [
        "open",
        "acknowledged",
        "resolved",
        "false_positive"
      ],
      default: "open"
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      default: null,
      trim: true
    },

    speedKmph: {
      type: Number,
      default: null,
      min: 0
    },

    detectedAt: {
      type: Date,
      default: Date.now
    },

    resolvedAt: {
      type: Date,
      default: null
    },

    resolutionNotes: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SafetyAlert", safetyAlertSchema);