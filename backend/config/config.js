const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const frontend_url = "http://localhost:3000";
const mysql_username = process.env.MYSQL_USERNAME;
const mysql_password = process.env.MYSQL_PASSWORD;
const mysql_database = process.env.MYSQL_DATABASE;
const mysql_url = process.env.MYSQL_URL;

module.exports = {
  frontend_url: frontend_url,
  mysql_database: mysql_database,
  mysql_password: mysql_password,
  mysql_username: mysql_username,
  mysql_url: mysql_url,
};
