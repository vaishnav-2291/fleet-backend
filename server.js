require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fleet Management Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "fleet-backend",
    database: "MongoDB Atlas"
  });
});

// Vehicle APIs
app.use("/api/vehicles", vehicleRoutes);

// Driver APIs
app.use("/api/drivers", driverRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Fleet backend running on http://localhost:${PORT}`);
  });
}

startServer();