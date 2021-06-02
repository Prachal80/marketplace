const {
  mysql_url,
  mysql_database,
  mysql_password,
  mysql_username,
} = require("./config");
var mysql = require("mysql");

const connection = mysql.createConnection({
  host: mysql_url,
  user: mysql_username,
  password: mysql_password,
  database: mysql_database,
});

//establishing connecting to database
connection.connect((error) => {
  if (error) {
    return console.log("Connection Failed", error);
  }
  console.log("Connection to RDS-MYSQL Successful");
});

module.exports = {
  connection: connection,
};
