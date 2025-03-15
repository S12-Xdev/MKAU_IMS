const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const syncDatabaseAlter = require("./dbconnect/dbconnect.js");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes.js");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default port fallback

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Adjust CLIENT_URL in .env
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Database Sync and Server Start
const startServer = async () => {
  try {
    await syncDatabaseAlter();
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
};

startServer();
