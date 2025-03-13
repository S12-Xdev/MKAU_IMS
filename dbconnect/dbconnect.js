// syncDatabaseAlter.js

const db = require("../models/index");

// Sync with `alter: true` (modifies tables to match models without losing data)
const syncDatabaseAlter = async () => {
  try {
    await db.sequelize.sync({ alter: true }); // Alter tables without dropping
    console.log("Database is synchronized.");
  } catch (err) {
    console.error("Error syncing database with alter:", err);
  }
};

module.exports = syncDatabaseAlter;
