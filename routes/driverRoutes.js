const express = require("express");
const Driver = require("../models/Driver");

const router = express.Router();

/*
 * GET /api/drivers
 * Fetch drivers with optional filters.
 *
 * Examples:
 * /api/drivers
 * /api/drivers?status=active
 * /api/drivers?driverId=DR001
 * /api/drivers?licenseNumber=TN123456789
 */

router.get("/", async (req, res) => {
  try {
    const {
      status,
      driverId,
      licenseNumber,
      assignedVehicleId
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (driverId) {
      filter.driverId = driverId;
    }

    if (licenseNumber) {
      filter.licenseNumber = licenseNumber;
    }

    if (assignedVehicleId) {
      filter.assignedVehicleId = assignedVehicleId;
    }

    const drivers = await Driver.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error("Driver fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver data.",
      error: error.message
    });
  }
});

/*
 * GET /api/drivers/:driverId
 * Fetch one driver by driverId.
 */

router.get("/:driverId", async (req, res) => {
  try {
    const driver = await Driver.findOne({
      driverId: req.params.driverId
    }).lean();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found."
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    console.error("Driver lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver.",
      error: error.message
    });
  }
});

/*
 * POST /api/drivers
 * Create a new driver.
 */

router.post("/", async (req, res) => {
  try {
    const driver = await Driver.create(req.body);

    res.status(201).json({
      success: true,
      message: "Driver created successfully.",
      data: driver
    });
  } catch (error) {
    console.error("Driver creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create driver.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/drivers/:driverId
 * Update an existing driver.
 */

router.patch("/:driverId", async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { driverId: req.params.driverId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found."
      });
    }

    res.json({
      success: true,
      message: "Driver updated successfully.",
      data: driver
    });
  } catch (error) {
    console.error("Driver update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update driver.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/drivers/:driverId
 * Delete a driver by driverId.
 */

router.delete("/:driverId", async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      driverId: req.params.driverId
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found."
      });
    }

    res.json({
      success: true,
      message: "Driver deleted successfully.",
      data: driver
    });
  } catch (error) {
    console.error("Driver deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete driver.",
      error: error.message
    });
  }
});

module.exports = router;