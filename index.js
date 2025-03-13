const express = require("express");
require("dotenv/config");
const cookieParser = require("cookie-parser");
const syncDatabaseAlter = require("./dbconnect/dbconnect.js");

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  syncDatabaseAlter();
  console.log(`Server is running on port ${port}`);
});
