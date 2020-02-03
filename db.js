const ck = require('ckey');

var mysql      = require('mysql');
var connection = mysql.createPool({
  connectionLimit : 10,
  host            : ck.DB_HOST,
  user            : ck.DB_USER,
  password        : ck.DB_PASS,
  database        : 'appointments',
  timezone: 'utc',
  multipleStatements: true
});

module.exports = connection;