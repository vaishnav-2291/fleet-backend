const express = require("express");
const Fuel = require("../models/Fuel");

const router = express.Router();

/*
 * GET /api/fuel
 * Fetch fuel records with optional filters.
 *
 * Examples:
 * /api/fuel
 * /api/fuel?vehicleId=VH001
 * /api/fuel?status=anomaly
 * /api/fuel?anomalyType=theft_siphon
 * /api/fuel?anomalySeverity=critical
 */

router.get("/", async (req, res) => {
  try {
    const {
      vehicleId,
      fuelType,
      status,
      anomalyType,
      anomalySeverity
    } = req.query;

    const filter = {};

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    if (fuelType) {
      filter.fuelType = fuelType;
    }

    if (status) {
      filter.status = status;
    }

    if (anomalyType) {
      filter.anomalyType = anomalyType;
    }

    if (anomalySeverity) {
      filter.anomalySeverity = anomalySeverity;
    }

    const fuelRecords = await Fuel.find(filter)
      .sort({ recordedAt: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: fuelRecords.length,
      data: fuelRecords
    });
  } catch (error) {
    console.error("Fuel fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel data.",
      error: error.message
    });
  }
});

/*
 * GET /api/fuel/:fuelRecordId
 * Fetch one fuel record by fuelRecordId.
 */

router.get("/:fuelRecordId", async (req, res) => {
  try {
    const fuel = await Fuel.findOne({
      fuelRecordId: req.params.fuelRecordId
    }).lean();

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found."
      });
    }

    res.json({
      success: true,
      data: fuel
    });
  } catch (error) {
    console.error("Fuel lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel record.",
      error: error.message
    });
  }
});

/*
 * POST /api/fuel
 * Create a new fuel record.
 */

router.post("/", async (req, res) => {
  try {
    const fuel = await Fuel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Fuel record created successfully.",
      data: fuel
    });
  } catch (error) {
    console.error("Fuel creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create fuel record.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/fuel/:fuelRecordId
 * Update an existing fuel record.
 */

router.patch("/:fuelRecordId", async (req, res) => {
  try {
    const fuel = await Fuel.findOneAndUpdate(
      { fuelRecordId: req.params.fuelRecordId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found."
      });
    }

    res.json({
      success: true,
      message: "Fuel record updated successfully.",
      data: fuel
    });
  } catch (error) {
    console.error("Fuel update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update fuel record.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/fuel/:fuelRecordId
 * Delete a fuel record by fuelRecordId.
 */

router.delete("/:fuelRecordId", async (req, res) => {
  try {
    const fuel = await Fuel.findOneAndDelete({
      fuelRecordId: req.params.fuelRecordId
    });

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found."
      });
    }

    res.json({
      success: true,
      message: "Fuel record deleted successfully.",
      data: fuel
    });
  } catch (error) {
    console.error("Fuel deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete fuel record.",
      error: error.message
    });
  }
});

module.exports = router;