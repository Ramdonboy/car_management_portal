const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",          // default XAMPP
  database: "car_management", // EXACT db name from phpMyAdmin
});

module.exports = pool.promise();

