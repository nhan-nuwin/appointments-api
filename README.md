# Appoinments - Backend RESTful API
A backend RESTful api to manage doctor's appointments

## Requirements
1. GET to retrieve a list of doctor's names
2. GET to retrieve a doctor's appointment by day
3. DELETE to delete an appointment
4. POST to create an appointment for a doctor

## API Endpoints
### Doctors  
GET /v1/doctors  |List all doctors
:---|:---
GET /v1/doctors/{id}|Get doctor by id
GET /v1/doctors?firstName{firstName}|Get doctor by first name
GET /v1/doctors?lastName{lastName}|Get doctor by last name
POST /v1/doctors|Create new doctor
PUT /v1/doctors/{id}|Update doctor
DELETE /v1/doctirs{id}|Delete doctor

### Patients
GET /patients  |List all patients
:---|:---
GET /v1/patients/{id}|Get patient by id
GET /v1/patients?firstName{firstName}|Get patient by first name
GET /v1/patients?lastName{lastName}|Get patient by last name
POST /v1/patients|Create new patient
PUT /v1/patients|Update patient
DELETE /v1/patients|Delete patient


## Data Models
```
Doctors = {
  id: int,
  first_name: string,
  last_name: string
}
```
```
Appointments = {
  id: int,
  date: date,
  patient: id int
  doctor: id int,
  type: string
}
```
## Proposed REST Routes
```
. GET to retrieve a list of doctor's names
.. GET /doctors 
. GET to retrieve a doctor's appointment by day
.. GET /appointments?doctor={id}&date={date}
. DELETE to delete an appointment
.. DELETE /appointements/{id}
. POST to create an appointment for a doctor
.. POST /appointments
```
