const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    maintenanceId: {
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

    maintenanceType: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: null,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "due",
        "in_progress",
        "completed",
        "cancelled"
      ],
      default: "scheduled"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    dueDate: {
      type: Date,
      default: null
    },

    completedDate: {
      type: Date,
      default: null
    },

    mileageAtService: {
      type: Number,
      default: null,
      min: 0
    },

    serviceCenter: {
      type: String,
      default: null,
      trim: true
    },

    cost: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);