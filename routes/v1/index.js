var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../db');

/* Doctors Model                  
    id: int,
    first_name: string,
    last_name: string
*/

/* Get list of all doctors */
router.get('/doctors', function(req, res, next) {
  console.log('doctors')
  db.query('select * from doctors', (err, results, fields) => {
    res.send(results);
  });
});

/* Get name of specific doctor */
router.get('/doctors/:id', function(req, res, next) {
  const id = req.params.id;
  db.query(`select * from doctors where id = ${id}`, (err, results, field) => {
    if(results.length < 1) {
      res.status = 404;
      res.send('404 Not Found')
    } else {
      res.send(results);
    }
  });
});

/* Create Doctor's Name */
router.post('/doctors', function(req, res, next) {
  const firstName = req.body['firstName'];
  const lastName = req.body['lastName'];

  /* Check if body param is not empty */
  if(!firstName || !lastName) {
    res.send("first-name or last-name cannot be empty");
  }

  /* Insert name into db */
  db.query(`INSERT INTO doctors(first_name, last_name) VALUES ('${firstName}', '${lastName}')`, (err, results, fields) => {
    if(err) {
      console.log(err);
      return;
    }

    res.status(201).send("Resource created");
  }); 
});

/* Update Doctor's Name */
router.put('/doctors/:id', function(req, res, next) {
  const firstName = req.body['firstName'];
  const lastName = req.body['lastName'];
  const id = req.params.id;

  /* Check if body param is not empty */
  if(!firstName || !lastName) {
    res.send("first-name or last-name cannot be empty");
  }

  /* Check if resource exists */
  db.query(`SELECT id FROM doctors WHERE id = ${id}`, (err, results, fields) => {
    if(err) {
      console.log(err);
      return;
    }

    if(results.length > 0) {
      db.query(`UPDATE doctors SET first_name = '${firstName}', last_name = '${lastName}' WHERE id = ${id}`, (err, results, fields) => {
        if(err) {
          console.log(err);
          return;
        }

        res.status(200).send('Resource updated');
      });
    }
  });
});

/* Delete Doctor's names */
router.delete('/doctors', function(req, res, next) {
  const id = req.query.id;
  
  if(id) {
    db.query(`DELETE from doctors WHERE id = ${id}`, (err, results, field) => {
      if(err) {
        console.log(err);
        return;
      }
      
      res.send(results);
    });
  } else {
    res.send('Failed');
  }
});

/* Appointments
    id: int,
    created: timestamp,
    date: datetime,
    patient : id int
    doctor: id int,
    visitType: string | "New Patient" , "Follow Up"
*/

/* Get list of appointments for a doctor on a given date */
router.get('/appointments', function(req, res, next) {
  // If there are no query params, return all appointments
  if(Object.keys(req.query).length === 0) {
    const stmt = 
      `SELECT 
        A.id as id,
        A.date as appointment_date, 
        P.first_name as patient_first_name, 
        P.last_name as patient_last_name,
        D.first_name as doctor_first_name,
        D.last_name as doctor_last_name,
        A.visit_type as visit_type
      FROM appointments A 
      INNER JOIN patients P ON A.patient = P.id 
      INNER JOIN doctors D ON A.doctor = D.id;`;
      
    db.query(stmt, (err, results, fields) => {
      res.send(results);
    });
  } else {
    // Appointments filter by date
    if(typeof req.query.doctor === 'undefined') {
      const date = req.query['date'];

      db.query(`select * from appointments where date >= '${date}' and date < '${date}' + interval 1 day`, (err, results, fields) => {
        res.send(results);
      });
    // Appointments filter by doctor id
    } else if(typeof req.query.date === 'undefined') {
      const doctor = req.query['doctor'];

      db.query(`select * from appointments where doctor = ${doctor}`, (err, results, fields) => {
        res.send(results);
      });
    // Appointments filter by date and doctor id
    } else {
      const date = req.query['date'];
      const doctor = req.query['doctor'];

      db.query(`select * from appointments where date >= '${date}' and date < '${date}' + interval 1 day and doctor = ${doctor}`, (err, results, fields) => {
        res.send(results);
      });
    }
  }
});

/* Delete an existing appointment */
router.delete('/appointments/:id', function(req, res, next) {
  const id = req.params.id;

  const stmt = `DELETE FROM appointments WHERE id = ${id}`;
  db.query(stmt, (err, results, fields) => {
    res.send(results);
  });
});

/* Add new appointments */
router.post('/appointments', function(req, res, next) {
  const {date, patient, doctor, visitType} = req.body;

  const dateObj = new Date(date);
  const interval = 15;
  const appointmentIsOnInterval = dateObj.getMinutes() % interval == 0;

  if ((date && patient && doctor && visitType) && appointmentIsOnInterval) {
    console.log(date);
    const appointmentsForDoctor = `SELECT COUNT(*) AS count FROM appointments WHERE date = '${date}' AND doctor = ${doctor}`;
    const appointmentsForPatient = `SELECT COUNT(*) AS count FROM appointments WHERE date = '${date}' AND patient = ${patient}`;
    const stmt = `INSERT INTO appointments(date, patient, doctor, visit_type) VALUES('${date}', ${patient}, ${doctor}, '${visitType}')`;

    db.query(appointmentsForDoctor, (err, results, fields) => {
      let numRows = results[0].count;
      if (numRows < 3) {
        db.query(appointmentsForPatient, (err, results, fields) => {
          numRows = results[0].count;
          if (numRows < 1) {
            db.query(stmt, (err, results, fields) => {
              res.send(results);
            });
          } else {
            res.send('failed');
          }
        });
      } else {
        res.send('failed');
      }
    });
  } else {
    res.send('failed');
  }
});

/* Patients Model
    id: int,
    first_name: string,
    last_name: string
*/

/* Get patient matching name */
router.get('/patients', function(req, res, next) {
  const firstName = req.query['first_name'];
  const lastName = req.query['last_name'];

  db.query(`select * from patients where first_name = '${firstName}' and last_name = '${lastName}'`, (err, results, fields) => {
    res.send(results);
  });
});

/* Get patient by id */
router.get('/patients/:id', function(req, res, next) {
  const id = req.params.id;
  db.query(`select * from patients where id = ${id}`, (err, results, field) => {
    if(results.length < 1) {
      res.status = 404;
      res.send('404 Not Found')
    } else {
      res.send(results);
    }
  });
});

/* Create Patient's Name */
router.post('/patients', function(req, res, next) {
  const firstName = req.body['firstName'];
  const lastName = req.body['lastName'];

  /* Check if body param is not empty */
  if(!firstName || !lastName) {
    res.send("first-name or last-name cannot be empty");
  }

  /* Insert name into db */
  db.query(`INSERT INTO patients(first_name, last_name) VALUES ('${firstName}', '${lastName}')`, (err, results, fields) => {
    if(err)
      res.send(err);

    res.status(201).send("Resource created");
  });
});

/* Testing */
router.get('/test', function(req, res, next) {
});

router.post('/test', (req, res, next) => {
  if(req.body){
    res.send('hi');
  }
});

module.exports = router;
