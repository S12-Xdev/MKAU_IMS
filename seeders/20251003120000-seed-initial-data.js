"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Seed Roles
    const rolesToInsert = [
      { role_name: "Admin", createdAt: now, updatedAt: now },
      { role_name: "Manager", createdAt: now, updatedAt: now },
      { role_name: "User", createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert("Roles", rolesToInsert, {});

    // Fetch role ids
    const [rolesRows] = await queryInterface.sequelize.query(
      `SELECT id, role_name FROM "Roles" WHERE role_name IN ('Admin','Manager','User')`
    );
    const roleMap = {};
    rolesRows.forEach((r) => (roleMap[r.role_name] = r.id));

    // Seed Categories
    const categoriesToInsert = [
      { category_name: "Electronics", createdAt: now, updatedAt: now },
      { category_name: "Furniture", createdAt: now, updatedAt: now },
      { category_name: "Office Supplies", createdAt: now, updatedAt: now },
    ];
    await queryInterface.bulkInsert("Categories", categoriesToInsert, {});

    const [catRows] = await queryInterface.sequelize.query(
      `SELECT id, category_name FROM "Categories" WHERE category_name IN ('Electronics','Furniture','Office Supplies')`
    );
    const categoryMap = {};
    catRows.forEach((c) => (categoryMap[c.category_name] = c.id));

    // Seed Item Statuses
    const statusesToInsert = [
      { status_name: "Available", createdAt: now, updatedAt: now },
      { status_name: "Checked Out", createdAt: now, updatedAt: now },
      { status_name: "Under Maintenance", createdAt: now, updatedAt: now },
    ];
    await queryInterface.bulkInsert("ItemStatuses", statusesToInsert, {});

    const [statusRows] = await queryInterface.sequelize.query(
      `SELECT id, status_name FROM "ItemStatuses" WHERE status_name IN ('Available','Checked Out','Under Maintenance')`
    );
    const statusMap = {};
    statusRows.forEach((s) => (statusMap[s.status_name] = s.id));

    // Seed Users (hash passwords)
    const usersToInsert = [
      {
        first_name: "System",
        last_name: "Administrator",
        email: "admin@example.com",
        password: bcrypt.hashSync("Password123!", 10),
        role_id: roleMap["Admin"],
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "Jane",
        last_name: "Manager",
        email: "manager@example.com",
        password: bcrypt.hashSync("Password123!", 10),
        role_id: roleMap["Manager"],
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "John",
        last_name: "User",
        email: "user@example.com",
        password: bcrypt.hashSync("Password123!", 10),
        role_id: roleMap["User"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Users", usersToInsert, {});

    // Fetch user ids if needed (not strictly necessary for Items)
    const [userRows] = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email IN ('admin@example.com','manager@example.com','user@example.com')`
    );

    // Seed Items - link to categories and statuses
    const itemsToInsert = [
      {
        name: "Dell Laptop",
        category_id: categoryMap["Electronics"],
        location_id: null,
        status_id: statusMap["Available"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Office Chair",
        category_id: categoryMap["Furniture"],
        location_id: null,
        status_id: statusMap["Available"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Projector",
        category_id: categoryMap["Electronics"],
        location_id: null,
        status_id: statusMap["Under Maintenance"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Items", itemsToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    // remove seeded rows (reverse order)
    await queryInterface.bulkDelete("Items", {
      name: ["Dell Laptop", "Office Chair", "Projector"],
    });

    await queryInterface.bulkDelete("Users", {
      email: ["admin@example.com", "manager@example.com", "user@example.com"],
    });

    await queryInterface.bulkDelete("ItemStatuses", {
      status_name: ["Available", "Checked Out", "Under Maintenance"],
    });

    await queryInterface.bulkDelete("Categories", {
      category_name: ["Electronics", "Furniture", "Office Supplies"],
    });

    await queryInterface.bulkDelete("Roles", {
      role_name: ["Admin", "Manager", "User"],
    });
  },
};
