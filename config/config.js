require("dotenv").config();

const common = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12@PostgresDB",
    database: process.env.DB_NAME || "mkauims",
    ...common,
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12@PostgresDB",
    database: process.env.DB_NAME || "mkauims",
    ssl:
      process.env.DB_SSL === "true"
        ? { require: true, rejectUnauthorized: false }
        : false,
    ...common,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12@PostgresDB",
    database: process.env.TEST_DB_NAME || "mkauims_test",
    ...common,
  },
};
