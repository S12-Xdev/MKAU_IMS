const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ensureDatabaseConnection = require("./dbconnect/dbconnect.js");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes.js");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default port fallback
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : true;

// Middlewares
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: allowedOrigins !== true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Database Sync and Server Start
const startServer = async () => {
  try {
    await ensureDatabaseConnection();
    console.log("Database connection verified.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
};

startServer();
