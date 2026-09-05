const express = require("express");
const Trip = require("../models/Trip");

const router = express.Router();

/*
 * GET /api/trips
 * Fetch trips with optional filters.
 *
 * Examples:
 * /api/trips
 * /api/trips?status=scheduled
 * /api/trips?tripId=TR001
 * /api/trips?vehicleId=VH001
 * /api/trips?driverId=DR001
 */

router.get("/", async (req, res) => {
  try {
    const {
      status,
      tripId,
      vehicleId,
      driverId
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (tripId) {
      filter.tripId = tripId;
    }

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    if (driverId) {
      filter.driverId = driverId;
    }

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error("Trip fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip data.",
      error: error.message
    });
  }
});

/*
 * GET /api/trips/:tripId
 * Fetch one trip by tripId.
 */

router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      tripId: req.params.tripId
    }).lean();

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error("Trip lookup failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip.",
      error: error.message
    });
  }
});

/*
 * POST /api/trips
 * Create a new trip.
 */

router.post("/", async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      data: trip
    });
  } catch (error) {
    console.error("Trip creation failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create trip.",
      error: error.message
    });
  }
});

/*
 * PATCH /api/trips/:tripId
 * Update an existing trip.
 */

router.patch("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { tripId: req.params.tripId },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.json({
      success: true,
      message: "Trip updated successfully.",
      data: trip
    });
  } catch (error) {
    console.error("Trip update failed:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update trip.",
      error: error.message
    });
  }
});

/*
 * DELETE /api/trips/:tripId
 * Delete a trip by tripId.
 */

router.delete("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      tripId: req.params.tripId
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.json({
      success: true,
      message: "Trip deleted successfully.",
      data: trip
    });
  } catch (error) {
    console.error("Trip deletion failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete trip.",
      error: error.message
    });
  }
});

module.exports = router;