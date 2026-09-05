const express = require("express");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

/*
 * GET /api/vehicles
 * Fetch vehicles with optional filters.
 *
 * Examples:
 * /api/vehicles
 * /api/vehicles?status=active
 * /api/vehicles?vehicleId=VH001
 */

router.get("/", async (req, res) => {
  try {
    const { status, vehicleId, registrationNumber } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    if (registrationNumber) {
      filter.registrationNumber = registrationNumber;
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error("Vehicle fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle data.",
      error: error.message
    });
  }
});

/*
 * GET /api/vehicles/:vehicleId
 * Fetch one vehicle by vehicleId.
 */

router.get("/:vehicleId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      vehicleId: req.params.vehicleId
    }).lean();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found."
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error("Vehicle lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle.",
      error: error.message
    });
  }
});

/*
 * POST /api/vehicles
 * Create a new vehicle.
 */

router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully.",
      data: vehicle
    });
  } catch (error) {
    console.error("Vehicle creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create vehicle.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/vehicles/:vehicleId
 * Update an existing vehicle.
 */

router.patch("/:vehicleId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId: req.params.vehicleId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found."
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully.",
      data: vehicle
    });
  } catch (error) {
    console.error("Vehicle update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update vehicle.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/vehicles/:vehicleId
 * Delete a vehicle by vehicleId.
 */

router.delete("/:vehicleId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      vehicleId: req.params.vehicleId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found."
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted successfully.",
      data: vehicle
    });
  } catch (error) {
    console.error("Vehicle deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle.",
      error: error.message
    });
  }
});

module.exports = router;