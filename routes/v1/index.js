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
    return;
  }

  /* Insert name into db */
  db.query(`INSERT INTO doctors(first_name, last_name) VALUES ('${firstName}', '${lastName}')`, (err, results, fields) => {
    if(err) {
      res.send(err);
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
    return;
  }

  /* Check if resource exists */
  db.query(`SELECT id FROM doctors WHERE id = ${id}`, (err, results, fields) => {
    if(err) {
      res.send(err);
      return;
    }

    if(results.length > 0) {
      db.query(`UPDATE doctors SET first_name = '${firstName}', last_name = '${lastName}' WHERE id = ${id}`, (err, results, fields) => {
        if(err) {
          res.send(err);
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
  const date = req.body['date'];
  const doctor = req.body['doctor'];

  db.query(`select * from appointments where date >= '${date}' and date < '${date}' + interval 1 day and doctor = ${doctor}`, (err, results, fields) => {
    res.send(results);
  });
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

  if ((date && patient && doctor && visitType) &&
    appointmentIsOnInterval
  ) {
    console.log(date);
    const appointmentsByDate = `select count(*) from appointments where date = '${date}' and doctor = ${doctor}`;
    const stmt = `INSERT INTO appointments(date, patient, doctor, visit_type) VALUES('${date}', ${patient}, ${doctor}, '${visitType}')`;

    db.query(appointmentsByDate, (err2, results2, fields2) => {
      console.log(err2);
      const numRows = JSON.parse(JSON.stringify(results2))[0]['count(*)'];
      if (numRows < 3) {
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

/* Patients Model
    id: int,
    first_name: string,
    last_name: string
*/

/* Get list of all patients */
router.get('/patients', function(req, res, next) {
  db.query('select * from patients', (err, results, fields) => {
    res.send(results);
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
