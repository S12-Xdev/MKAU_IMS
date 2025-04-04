"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "photo", {
      type: Sequelize.STRING, // Use STRING for storing file paths
      allowNull: true, // Allow NULL values initially
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "photo");
  },
};
