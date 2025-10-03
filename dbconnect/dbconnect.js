const db = require("../models/index");

const ensureDatabaseConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    throw err;
  }
};

module.exports = ensureDatabaseConnection;
