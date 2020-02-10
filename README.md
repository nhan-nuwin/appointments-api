# Appointments - Backend RESTful API
Created a backend RESTful API to schedule appointments for a mock doctor's office
to learn about REST APIs.

Technologies used
Web Server - NodeJS, Express 
Database - MySQL
Testing - Mocha and Supertest
REST Client - Insomnia
## API Endpoints
### Doctors  
GET /v1/doctors  |List all doctors
:---|:---
GET /v1/doctors/{id}|Get doctor by id
GET /v1/doctors?firstName{firstName}|Get doctor by first name
GET /v1/doctors?lastName{lastName}|Get doctor by last name
POST /v1/doctors|Create new doctor
PUT /v1/doctors/{id}|Update for doctor
DELETE /v1/doctirs{id}|Delete for doctor

### Patients
GET /patients  |List all patients
:---|:---
GET /v1/patients/{id}|Get patient by id
GET /v1/patients?firstName{firstName}|Get patient by first name
GET /v1/patients?lastName{lastName}|Get patient by last name
POST /v1/patients|Create new patient
PUT /v1/patients|Update for patient
DELETE /v1/patients|Delete for patient

### Appointments
GET /v1/appointments  |List all appointments
:---|:---
GET /v1/appointments{id}|Get appointments by id
GET /v1/appointments?date={date}|Get appointments by date
GET /v1/doctors/{id}/appointments|Get appointments by doctors
GET /v1/doctors/{id}/appointments?date={date}|Get appointments by doctors and date
POST /v1/appointments| Create appointment
PUT /v1/appointments/{id}|Update appointment
DELETE /v1/appointments{id}|Delete appointment

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
