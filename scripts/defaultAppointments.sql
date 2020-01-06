drop database if exists appointment;
create database appointment;

use appointment;

create table if not exists doctors(
  id int auto_increment,
  first_name varchar(100),
  last_name varchar(100),
  primary key(id)
);

create table if not exists patients(
  id int auto_increment,
  first_name varchar(100),
  last_name varchar(100),
  primary key(id)
);

create table if not exists appointments(
  id int auto_increment,
  date datetime,
  created timestamp,
  patient int,
  doctor int,
  visit_type varchar(300),
  primary key(id)
);

insert into patients(first_name, last_name) values
('George', 'Smith'),
('Sally', 'Hoffman'),
('Elizabeth', 'Johnson'),
('Darin', 'Acosta'),
('Robert', 'Wong'),
('David', 'Simpsons'),
('Elizabeth', 'Whitman'),
('Steven', 'Lee'),
('Chris', 'Evans'),
('Stephanie', 'Chang');

insert into doctors(first_name, last_name) values
('Chris', 'Evans'),
('Robert', 'Mueller'),
('Sarah', 'Conner');

insert into 
appointments(created, date, doctor, patient, visit_type) values 
(NOW(),'2019-12-20 08:00:00', 1,1,'New Patient'),
(NOW(),'2019-12-21 08:45:00', 1,4,'New Patient'),
(NOW(),'2019-12-20 09:30:00', 1,2,'Follow Up'),
(NOW(),'2019-12-20 11:30:00', 2,3,'Follow Up'),
(NOW(),'2019-12-23 13:30:00', 2,6,'New Patient'),
(NOW(),'2019-12-20 16:45:00', 2,8,'Follow Up'),
(NOW(),'2019-01-05 12:45:00', 3,7,'Follow Up'),
(NOW(),'2019-12-23 14:00:00', 3,9,'New Patient'),
(NOW(),'2019-12-20 08:30:00', 3,10,'New Patient');