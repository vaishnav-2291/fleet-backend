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


/*
 * GET /api/analytics/analysis
 *
 * Provides deeper fleet performance analysis using
 * the same operational collections.
 */

router.get("/analysis", async (req, res) => {
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

    const safePercentage = (value, total) => {
      if (!total || total <= 0) {
        return 0;
      }

      return Number(((value / total) * 100).toFixed(2));
    };

    const vehicleUtilizationRate = safePercentage(
      travellingVehicles,
      totalVehicles
    );

    const vehicleIdleRate = safePercentage(
      idleVehicles,
      totalVehicles
    );

    const vehicleMaintenanceRate = safePercentage(
      maintenanceVehicles,
      totalVehicles
    );

    const driverActiveRate = safePercentage(
      activeDrivers,
      totalDrivers
    );

    const driverAvailabilityRate = safePercentage(
      availableDrivers,
      totalDrivers
    );

    const tripCompletionRate = safePercentage(
      completedTrips,
      totalTrips
    );

    const tripActiveRate = safePercentage(
      activeTrips,
      totalTrips
    );

    const maintenanceDueRate = safePercentage(
      dueMaintenance,
      totalMaintenance
    );

    const highPriorityMaintenanceRate = safePercentage(
      highPriorityMaintenance,
      totalMaintenance
    );

    const fuelAnomalyRate = safePercentage(
      fuelAnomalies,
      totalFuelRecords
    );

    const criticalFuelAnomalyRate = safePercentage(
      criticalFuelAnomalies,
      totalFuelRecords
    );

    const openSafetyAlertRate = safePercentage(
      openSafetyAlerts,
      totalSafetyAlerts
    );

    const highSafetyAlertRate = safePercentage(
      highSafetyAlerts,
      totalSafetyAlerts
    );

    const criticalSafetyAlertRate = safePercentage(
      criticalSafetyAlerts,
      totalSafetyAlerts
    );

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

    const strengths = [];
    const concerns = [];
    const recommendations = [];

    if (vehicleUtilizationRate >= 70) {
      strengths.push(
        `Vehicle utilization is strong at ${vehicleUtilizationRate}%.`
      );
    } else if (vehicleUtilizationRate > 0) {
      concerns.push(
        `Vehicle utilization is ${vehicleUtilizationRate}%.`
      );
    }

    if (tripCompletionRate >= 70) {
      strengths.push(
        `Trip completion rate is ${tripCompletionRate}%.`
      );
    } else if (totalTrips > 0) {
      concerns.push(
        `Trip completion rate is ${tripCompletionRate}%.`
      );
    }

    if (maintenanceDueRate > 0) {
      concerns.push(
        `${maintenanceDueRate}% of maintenance records are currently due.`
      );

      recommendations.push(
        "Prioritize vehicles with due maintenance before assigning additional workload."
      );
    }

    if (fuelAnomalyRate > 0) {
      concerns.push(
        `${fuelAnomalyRate}% of fuel records contain anomalies.`
      );

      recommendations.push(
        "Review anomalous fuel records and investigate abnormal consumption or fuel loss."
      );
    }

    if (openSafetyAlertRate > 0) {
      concerns.push(
        `${openSafetyAlertRate}% of safety alerts are currently open.`
      );

      recommendations.push(
        "Review and resolve open safety alerts to reduce operational risk."
      );
    }

    if (criticalSafetyAlerts > 0) {
      recommendations.push(
        "Immediately review all critical safety alerts."
      );
    }

    if (availableDrivers === 0 && totalDrivers > 0) {
      concerns.push(
        "No drivers are currently marked as available."
      );

      recommendations.push(
        "Review driver allocation and availability before scheduling additional trips."
      );
    }

    if (totalVehicles === 0) {
      concerns.push(
        "No vehicles are currently registered in the fleet."
      );
    }

    if (totalTrips === 0) {
      concerns.push(
        "No trip records are currently available for performance analysis."
      );
    }

    const performance = {
      vehicleUtilizationRate,
      vehicleIdleRate,
      vehicleMaintenanceRate,

      driverActiveRate,
      driverAvailabilityRate,

      tripCompletionRate,
      tripActiveRate,

      maintenanceDueRate,
      highPriorityMaintenanceRate,

      fuelAnomalyRate,
      criticalFuelAnomalyRate,

      openSafetyAlertRate,
      highSafetyAlertRate,
      criticalSafetyAlertRate
    };

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

    res.json({
      success: true,

      message:
        "Fleet performance analysis completed successfully.",

      data: {
        fleetHealth,

        performance,

        risk: {
          level: riskLevel,
          indicators: riskIndicators
        },

        analysis: {
          strengths,
          concerns,
          recommendations
        },

        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(
      "Fleet performance analysis failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate fleet performance analysis.",
      error: error.message
    });
  }
});


module.exports = router;