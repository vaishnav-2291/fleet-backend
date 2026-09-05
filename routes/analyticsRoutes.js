const express = require("express");

const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const Fuel = require("../models/Fuel");
const SafetyAlert = require("../models/SafetyAlert");

const router = express.Router();

/*
 * GET /api/analytics/summary
 *
 * Provides a fleet-wide operational summary by aggregating
 * the existing Vehicle, Driver, Trip, Maintenance, Fuel,
 * and Safety Alert collections.
 */

router.get("/summary", async (req, res) => {
  try {
    const [
      totalVehicles,
      travellingVehicles,
      idleVehicles,
      maintenanceVehicles,

      totalDrivers,
      activeDrivers,
      availableDrivers,

      totalTrips,
      activeTrips,
      completedTrips,

      totalMaintenance,
      dueMaintenance,
      highPriorityMaintenance,

      totalFuelRecords,
      fuelAnomalies,
      criticalFuelAnomalies,

      totalSafetyAlerts,
      openSafetyAlerts,
      highSafetyAlerts,
      criticalSafetyAlerts
    ] = await Promise.all([
      Vehicle.countDocuments(),

      Vehicle.countDocuments({
        status: {
          $in: ["travelling", "in_transit", "active"]
        }
      }),

      Vehicle.countDocuments({
        status: "idle"
      }),

      Vehicle.countDocuments({
        status: "maintenance"
      }),

      Driver.countDocuments(),

      Driver.countDocuments({
        status: {
          $in: ["active", "assigned", "on_trip"]
        }
      }),

      Driver.countDocuments({
        status: {
          $in: ["available", "ready"]
        }
      }),

      Trip.countDocuments(),

      Trip.countDocuments({
        status: {
          $in: ["scheduled", "in_progress"]
        }
      }),

      Trip.countDocuments({
        status: "completed"
      }),

      Maintenance.countDocuments(),

      Maintenance.countDocuments({
        status: "due"
      }),

      Maintenance.countDocuments({
        priority: {
          $in: ["high", "critical"]
        }
      }),

      Fuel.countDocuments(),

      Fuel.countDocuments({
        $or: [
          { status: "anomaly" },
          { anomalyType: "theft_siphon" },
          { anomalyType: "consumption_spike" },
          { anomalyType: "unauthorized_refueling" },
          { anomalyType: "sensor_anomaly" }
        ]
      }),

      Fuel.countDocuments({
        anomalySeverity: "critical"
      }),

      SafetyAlert.countDocuments(),

      SafetyAlert.countDocuments({
        status: "open"
      }),

      SafetyAlert.countDocuments({
        severity: "high"
      }),

      SafetyAlert.countDocuments({
        severity: "critical"
      })
    ]);

    const fleetHealth = {
      totalVehicles,
      travellingVehicles,
      idleVehicles,
      maintenanceVehicles,

      totalDrivers,
      activeDrivers,
      availableDrivers,

      totalTrips,
      activeTrips,
      completedTrips,

      totalMaintenance,
      dueMaintenance,
      highPriorityMaintenance,

      totalFuelRecords,
      fuelAnomalies,
      criticalFuelAnomalies,

      totalSafetyAlerts,
      openSafetyAlerts,
      highSafetyAlerts,
      criticalSafetyAlerts
    };

    const riskIndicators = [];

    if (criticalFuelAnomalies > 0) {
      riskIndicators.push(
        `${criticalFuelAnomalies} critical fuel anomaly record(s)`
      );
    }

    if (criticalSafetyAlerts > 0) {
      riskIndicators.push(
        `${criticalSafetyAlerts} critical safety alert(s)`
      );
    }

    if (dueMaintenance > 0) {
      riskIndicators.push(
        `${dueMaintenance} maintenance record(s) due`
      );
    }

    if (highPriorityMaintenance > 0) {
      riskIndicators.push(
        `${highPriorityMaintenance} high-priority maintenance record(s)`
      );
    }

    let riskLevel = "low";

    if (
      criticalFuelAnomalies > 0 ||
      criticalSafetyAlerts > 0
    ) {
      riskLevel = "critical";
    } else if (
      fuelAnomalies > 0 ||
      openSafetyAlerts > 0 ||
      dueMaintenance > 0
    ) {
      riskLevel = "high";
    } else if (
      highPriorityMaintenance > 0 ||
      activeTrips > 0
    ) {
      riskLevel = "medium";
    }

    let message = "Fleet summary retrieved successfully.";

    if (riskIndicators.length > 0) {
      message =
        `Fleet summary retrieved with ${riskIndicators.length} risk indicator(s).`;
    }

    res.json({
      success: true,

      message,

      data: {
        fleetHealth,

        risk: {
          level: riskLevel,
          indicators: riskIndicators
        },

        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(
      "Fleet analytics summary failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate fleet analytics summary.",
      error: error.message
    });
  }
});

module.exports = router;