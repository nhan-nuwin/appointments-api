const db = require('../db');

// Create DB
let sql = `
create database appointments;

use appointments;

create table doctors(
  id int auto_increment,
  first_name varchar(100),
  last_name varchar(100),
  primary key(id)
);

create table appointments(
  id int auto_increment,
  date datetime,
  created timestamp,
  patient int,
  doctor int,
  visit_type text,
  primary key(id)
);
`;

/* run command
db.query(sql, (err, results, fields) => {

});
*/
