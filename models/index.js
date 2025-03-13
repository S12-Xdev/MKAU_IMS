const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const configData = require("../config/config.js"); // Import config.js
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configData[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== basename);

modelFiles.forEach((file) => {
  const model = require(path.join(__dirname, file)); // Import each model
  db[model.name] = model(sequelize, DataTypes);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
