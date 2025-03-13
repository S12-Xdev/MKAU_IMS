"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Correcting the association
      Users.belongsTo(models.Roles, {
        foreignKey: "role_id", // Foreign key in Users table
        targetKey: "id", // Primary key in Roles table
      });
    }
  }

  Users.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: DataTypes.INTEGER, // Foreign key
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
