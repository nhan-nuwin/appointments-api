drop database if exists appointments;
create database appointments;

use appointments;

create table doctors(
  id int unsigned auto_increment,
  first_name varchar(100),
  last_name varchar(100),
  primary key(id)
);

create table patients(
  id int unsigned auto_increment,
  first_name varchar(100),
  last_name varchar(100),
  primary key(id)
);

create table appointments(
  id int unsigned auto_increment,
  date datetime,
  created timestamp,
  patient int,
  doctor int,
  visit_type varchar(300),
  primary key(id)
);

insert into doctors(first_name, last_name) values
('Tyrion', 'Lannister'),
('Davos', 'Seaworth'),
('Ramsay', 'Bolton'),
('Arya', 'Stark'),
('Joffrey', 'Baratheon');