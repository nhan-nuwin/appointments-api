require('dotenv').config();
var mysql      = require('mysql');
var connection = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : 'appointments'
});

module.exports = connection;
