const express = require("express");
const SafetyAlert = require("../models/SafetyAlert");

const router = express.Router();

/*
 * GET /api/safety-alerts
 * Fetch safety alerts with optional filters.
 *
 * Examples:
 * /api/safety-alerts
 * /api/safety-alerts?status=open
 * /api/safety-alerts?severity=critical
 * /api/safety-alerts?vehicleId=VH001
 * /api/safety-alerts?alertType=overspeed
 */

router.get("/", async (req, res) => {
  try {
    const {
      vehicleId,
      driverId,
      alertType,
      severity,
      status
    } = req.query;

    const filter = {};

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    if (driverId) {
      filter.driverId = driverId;
    }

    if (alertType) {
      filter.alertType = alertType;
    }

    if (severity) {
      filter.severity = severity;
    }

    if (status) {
      filter.status = status;
    }

    const alerts = await SafetyAlert.find(filter)
      .sort({ detectedAt: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error("Safety alert fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch safety alerts.",
      error: error.message
    });
  }
});

/*
 * GET /api/safety-alerts/:alertId
 * Fetch one safety alert by alertId.
 */

router.get("/:alertId", async (req, res) => {
  try {
    const alert = await SafetyAlert.findOne({
      alertId: req.params.alertId
    }).lean();

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Safety alert not found."
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error("Safety alert lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch safety alert.",
      error: error.message
    });
  }
});

/*
 * POST /api/safety-alerts
 * Create a new safety alert.
 */

router.post("/", async (req, res) => {
  try {
    const alert = await SafetyAlert.create(req.body);

    res.status(201).json({
      success: true,
      message: "Safety alert created successfully.",
      data: alert
    });
  } catch (error) {
    console.error("Safety alert creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create safety alert.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/safety-alerts/:alertId
 * Update an existing safety alert.
 */

router.patch("/:alertId", async (req, res) => {
  try {
    const alert = await SafetyAlert.findOneAndUpdate(
      { alertId: req.params.alertId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Safety alert not found."
      });
    }

    res.json({
      success: true,
      message: "Safety alert updated successfully.",
      data: alert
    });
  } catch (error) {
    console.error("Safety alert update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update safety alert.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/safety-alerts/:alertId
 * Delete a safety alert by alertId.
 */

router.delete("/:alertId", async (req, res) => {
  try {
    const alert = await SafetyAlert.findOneAndDelete({
      alertId: req.params.alertId
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Safety alert not found."
      });
    }

    res.json({
      success: true,
      message: "Safety alert deleted successfully.",
      data: alert
    });
  } catch (error) {
    console.error("Safety alert deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete safety alert.",
      error: error.message
    });
  }
});

module.exports = router;