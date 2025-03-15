'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {

    static associate(models) {
      // define association here
    }
  }
  Items.init({
    name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};