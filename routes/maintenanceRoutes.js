const express = require("express");
const Maintenance = require("../models/Maintenance");

const router = express.Router();

/*
 * GET /api/maintenance
 * Fetch maintenance records with optional filters.
 *
 * Examples:
 * /api/maintenance
 * /api/maintenance?status=due
 * /api/maintenance?vehicleId=VH001
 * /api/maintenance?priority=high
 * /api/maintenance?maintenanceType=oil_change
 */

router.get("/", async (req, res) => {
  try {
    const {
      status,
      vehicleId,
      priority,
      maintenanceType
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (maintenanceType) {
      filter.maintenanceType = maintenanceType;
    }

    const maintenanceRecords = await Maintenance.find(filter)
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: maintenanceRecords.length,
      data: maintenanceRecords
    });
  } catch (error) {
    console.error("Maintenance fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance data.",
      error: error.message
    });
  }
});

/*
 * GET /api/maintenance/:maintenanceId
 * Fetch one maintenance record by maintenanceId.
 */

router.get("/:maintenanceId", async (req, res) => {
  try {
    const maintenance = await Maintenance.findOne({
      maintenanceId: req.params.maintenanceId
    }).lean();

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found."
      });
    }

    res.json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    console.error("Maintenance lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance record.",
      error: error.message
    });
  }
});

/*
 * POST /api/maintenance
 * Create a new maintenance record.
 */

router.post("/", async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    res.status(201).json({
      success: true,
      message: "Maintenance record created successfully.",
      data: maintenance
    });
  } catch (error) {
    console.error("Maintenance creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create maintenance record.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/maintenance/:maintenanceId
 * Update an existing maintenance record.
 */

router.patch("/:maintenanceId", async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndUpdate(
      { maintenanceId: req.params.maintenanceId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found."
      });
    }

    res.json({
      success: true,
      message: "Maintenance record updated successfully.",
      data: maintenance
    });
  } catch (error) {
    console.error("Maintenance update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update maintenance record.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/maintenance/:maintenanceId
 * Delete a maintenance record by maintenanceId.
 */

router.delete("/:maintenanceId", async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndDelete({
      maintenanceId: req.params.maintenanceId
    });

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found."
      });
    }

    res.json({
      success: true,
      message: "Maintenance record deleted successfully.",
      data: maintenance
    });
  } catch (error) {
    console.error("Maintenance deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete maintenance record.",
      error: error.message
    });
  }
});

module.exports = router;