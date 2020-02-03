const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../../db');

/**
 * Get all doctors @GET /doctors
 * @param {undefined}
 * @returns {Array<{id: int, firstName: string, lastName: string}>}
*/ 
router.get('/doctors', function(req, res, next) {
  const stmt = `SELECT id, first_name AS firstName, last_name AS lastName FROM doctors`;
  db.query(stmt, (err, results, fields) => {
    if(err) {
      console.log(err);
      next();
    }
    res.send(results);
  });
});

/**
 * Get a specific doctor @GET /doctors/:id
 * @param {int} id
 * @returns {Array<{id: int, firstName: string, lastName: string}>}
*/ 
router.get('/doctors/:id', function(req, res, next) {
  const id = Number(req.params.id);
  if(id) {
    const stmt = `SELECT id, first_name AS firstName, last_name AS lastName FROM doctors WHERE id = ${id}`;
    db.query(stmt, (err, results, field) => {
      if(err) {
        console.log(err);
        next();
      }
      res.send(results);
    });
  } else {
    res.send(400);
  } 
});

/**
 * Create a doctor resource @POST /doctors
 * @param {firstName: string, lastName:string}
 * @returns {Array<{id: int, firstName: string, lastName: string}>}
*/ 
router.post('/doctors', function(req, res, next) {
  const firstName = req.body['firstName'];
  const lastName = req.body['lastName'];

  if(firstName && lastName) {
    const stmt = `INSERT INTO doctors(first_name, last_name) VALUES ('${firstName}', '${lastName}');`
    db.query(stmt, (err, results, fields) => {
      if(err) {
        console.log(err);
        next();
      }
      console.log(results);
      const rowId = results.insertId;
      res.location(`/doctors/${rowId}`);
      res.send(204);
    }); 
  } else {
    const error = {"error":{"message":"Invalid params"}}
    res.status(400).json(error);
  }
});

/**
 * Update doctor @PUT /doctors/:id
 * @param {int} id
 * @param {firstName: string, lastName:string}
 * @returns {Array<{id: int, firstName: string, lastName: string}>}
*/ 
router.put('/doctors/:id', function(req, res, next) {
  const firstName = req.body['firstName'];
  const lastName = req.body['lastName'];
  const id = Number(req.params.id);

  if(id && firstName && lastName) {
    db.query(`UPDATE doctors SET first_name = '${firstName}', last_name = '${lastName}' WHERE id = ${id}`, (err, results, fields) => {
      if(err) {
        console.log(err);
        next();
      }
      if(results.affectedRows) {
        res.location(`/doctors/${id}`);
        res.status(200).send('Resource updated');
      } else {
        res.status(404).json({error:{message:'Resource not found'}});
      }
    });
  } else {
    res.status(400).json({error:{message:'Invalid params'}});
  }
});

/**
 * Delete doctor @DELETE /doctors/:id
 * @param {int} id
 * @returns {string}
*/ 
router.delete('/doctors/:id', function(req, res, next) {
  const id = Number(req.params.id);
  
  if(id) {
    db.query(`DELETE from doctors WHERE id = ${id}`, (err, results, field) => {
      if(err) {
        console.log(err);
        next();
      }
      if(results.affectedRows) {
        res.send(204);
      } else {
        res.send(404);
      }
    });
  } else {
    res.send(400);
  }
});

/**
 * Get all appointments @GET /appointments
 * @param {undefined} ||
 * @param {date: string} ||
 * @param {doctor: int} ||
 * @param {date: string, doctor: int}
 * @returns 
 *  {Array<{
 *    id: int,
 *    date: string,
 *    time: string,
 *    patient: {
 *      firstName: string,
 *      lastName: string
 *    },
 *    doctor: {
 *      firstName: string,
 *      lastName: string
 *    },
 *    visitType: string
 *  }>}
*/ 
router.get('/appointments', function(req, res, next) {
  let stmt = '';
  // if no query params are passed, get all appointments
  if(Object.keys(req.query).length === 0) {
    stmt = 
      `SELECT 
        A.id as id,
        A.date as date, 
        P.first_name as patient_first_name, 
        P.last_name as patient_last_name,
        D.first_name as doctor_first_name,
        D.last_name as doctor_last_name,
        A.visit_type as visit_type
      FROM appointments A 
      INNER JOIN patients P ON A.patient = P.id 
      INNER JOIN doctors D ON A.doctor = D.id;`;
  } else {
    // Get appointments by date
    if(typeof req.query.doctor === 'undefined') {
      const date = req.query['date'];
      stmt = 
        `SELECT 
          A.id as id,
          A.date as date, 
          P.first_name as patient_first_name, 
          P.last_name as patient_last_name,
          D.first_name as doctor_first_name,
          D.last_name as doctor_last_name,
          A.visit_type as visit_type
        FROM appointments A 
        INNER JOIN patients P ON A.patient = P.id 
        INNER JOIN doctors D ON A.doctor = D.id
        WHERE CAST(date as DATE) = '${date}'`;
    // Get appointments by doctor
    } else if(typeof req.query.date === 'undefined') {
      const doctor = req.query['doctor'];
      stmt = 
        `SELECT 
          A.id as id,
          A.date as date, 
          P.first_name as patient_first_name, 
          P.last_name as patient_last_name,
          D.first_name as doctor_first_name,
          D.last_name as doctor_last_name,
          A.visit_type as visit_type
        FROM appointments A 
        INNER JOIN patients P ON A.patient = P.id 
        INNER JOIN doctors D ON A.doctor = D.id
        WHERE A.doctor = '${doctor}'`;
    // Get appointments by date and doctor
    } else {
      const date = req.query['date'];
      const doctor = req.query['doctor'];
      stmt = 
        `SELECT 
          A.id as id,
          A.date as date, 
          P.first_name as patient_first_name, 
          P.last_name as patient_last_name,
          D.first_name as doctor_first_name,
          D.last_name as doctor_last_name,
          A.visit_type as visit_type
        FROM appointments A 
        INNER JOIN patients P ON A.patient = P.id 
        INNER JOIN doctors D ON A.doctor = D.id
        WHERE CAST(date as DATE) = '${date}' 
        AND
        A.doctor = '${doctor}'`;
    }
  }
  // Execute query and return results
  db.query(stmt, (err, results, fields) => {
    if(err) {
      console.log(err);
      next();
    }
    // Convert results to JSON Object
    results = results.map( each => {
      // Split date and time
      let date = moment(each.date).format('YYYY-MM-DD');
      let time = moment.utc(each.date).format('HH:mm:ss');

      return {
        id: each.id,
        date,
        time,
        patient: {
          firstName: each.patient_first_name,
          lastName: each.patient_last_name
        },
        doctor: {
          firstName: each.doctor_first_name,
          lastName: each.doctor_last_name
        },
        visitType: each.visit_type
      }
    });
    res.send(results);
  });
});

/**
 *  Delete an existing appointment @DELETE /appointments/:id
 *  @param {id: int}
 */ 
router.delete('/appointments/:id', function(req, res, next) {
  const id = Number(req.params.id);
  if(id) {
    const stmt = `DELETE FROM appointments WHERE id = ${id}`;
    db.query(stmt, (err, results, fields) => {
      if(err) {
        console.log(err);
        next();
      }
      if(results.affectedRows) {
        res.location(`/appointments/${id}`);
        res.send(results);
      } else {
        res.send(404);
      }
    });
  } else {
    res.send(400);
  }
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
          if(err) {
            console.log(err);
            next();
          }
          numRows = results[0].count;
          if (numRows < 1) {
            db.query(stmt, (err, results, fields) => {
              if(err) {
                console.log(err);
                next();
              }
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

/* Get patient matching name */
router.get('/patients', function(req, res, next) {
  const firstName = req.query['first_name'];
  const lastName = req.query['last_name'];

  db.query(`select * from patients where first_name = '${firstName}' and last_name = '${lastName}'`, (err, results, fields) => {
    if(err) {
      console.log(err);
      return;
    }
    res.send(results);
  });
});

/* Get patient by id */
router.get('/patients/:id', function(req, res, next) {
  const id = req.params.id;
  db.query(`select * from patients where id = ${id}`, (err, results, field) => {
    if(err) {
      console.log(err);
      return;
    }
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
    if(err) {
      console.log(err);
      return;
    }

    res.status(201).send("Resource created");
  });
});

module.exports = router;
