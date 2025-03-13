"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      // Define the reverse association
      Roles.belongsToMany(models.Users, {
        foreignKey: "role_id", // Foreign key in Users table
        sourceKey: "id", // Primary key in Roles table
      });
    }
  }

  Roles.init(
    {
      role_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Roles",
    }
  );
  return Roles;
};
