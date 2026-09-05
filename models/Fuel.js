const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
  {
    fuelRecordId: {
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

    fuelType: {
      type: String,
      enum: ["diesel", "petrol", "cng", "electric"],
      default: "diesel"
    },

    fuelLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    fuelAddedLiters: {
      type: Number,
      default: 0,
      min: 0
    },

    fuelConsumedLiters: {
      type: Number,
      default: 0,
      min: 0
    },

    fuelEfficiencyKmPerLiter: {
      type: Number,
      default: 0,
      min: 0
    },

    distanceKm: {
      type: Number,
      default: 0,
      min: 0
    },

    fuelCost: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "normal",
        "low",
        "critical",
        "anomaly"
      ],
      default: "normal"
    },

    anomalyType: {
      type: String,
      enum: [
        null,
        "none",
        "consumption_spike",
        "theft_siphon",
        "unauthorized_refueling",
        "sensor_anomaly"
      ],
      default: "none"
    },

    anomalySeverity: {
      type: String,
      enum: [
        null,
        "low",
        "medium",
        "high",
        "critical"
      ],
      default: null
    },

    location: {
      type: String,
      default: null,
      trim: true
    },

    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Fuel", fuelSchema);