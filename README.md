# Appoinments - Backend RESTful API
A backend REST api to manage doctor's appointments

## Requirements
1. GET to retrieve a list of doctor's names
2. GET to retrieve a doctor's appointment by day
3. DELETE to delete an appointment
4. POST to create an appointment for a doctor

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
  patient : id int
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
