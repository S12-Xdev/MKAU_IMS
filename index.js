const express = require("express");
require("dotenv/config");
const cookieParser = require("cookie-parser");
const syncDatabaseAlter = require("./dbconnect/dbconnect.js");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes.js");

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  syncDatabaseAlter();
  console.log(`Server is running on port ${port}`);
});
