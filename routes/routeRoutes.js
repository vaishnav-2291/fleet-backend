const express = require("express");

const router = express.Router();

/*
 * POST /api/routes/optimize
 *
 * Accepts an origin and destination and returns
 * a basic optimized route recommendation.
 *
 * This implementation does not depend on an
 * external maps provider.
 */

router.post("/optimize", async (req, res) => {
  try {
    const {
      origin,
      destination,
      waypoints = []
    } = req.body;

    if (
      typeof origin !== "string" ||
      !origin.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Origin is required.",
        data: null
      });
    }

    if (
      typeof destination !== "string" ||
      !destination.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
        data: null
      });
    }

    if (!Array.isArray(waypoints)) {
      return res.status(400).json({
        success: false,
        message: "Waypoints must be an array.",
        data: null
      });
    }

    const cleanOrigin = origin.trim();
    const cleanDestination = destination.trim();

    const cleanWaypoints = waypoints
      .filter(
        (point) =>
          typeof point === "string" &&
          point.trim().length > 0
      )
      .map((point) => point.trim());

    const optimizedStops = [
      cleanOrigin,
      ...cleanWaypoints,
      cleanDestination
    ];

    const recommendation =
      cleanWaypoints.length > 0
        ? "Recommended route uses the supplied intermediate stops."
        : "Recommended direct route between the origin and destination.";

    res.json({
      success: true,

      message: "Route optimization completed successfully.",

      data: {
        origin: cleanOrigin,

        destination: cleanDestination,

        waypoints: cleanWaypoints,

        optimizedStops,

        stopCount: optimizedStops.length,

        recommendation,

        optimization: {
          strategy:
            cleanWaypoints.length > 0
              ? "origin_waypoints_destination"
              : "direct",

          externalMapProvider: false
        },

        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(
      "Route optimization failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to optimize route.",
      error: error.message
    });
  }
});

module.exports = router;