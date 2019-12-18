var express = require('express');
var router = express.Router();
var db = require('../db');

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
  const firstName = req.body['first-name'];
  const lastName = req.body['last-name'];

  /* Check if query param is not empty */
  if(!firstName && !lastName) {
    res.send("first-name or last-name cannot be empty");
  }

  /* Insert name into db */
  db.query(`INSERT INTO doctors(first_name, last_name) VALUES ('${firstName}', '${lastName}')`, (err, results, fields) => {
    if(err)
      res.send(err);

    res.status(200).send("Resource created");
  }); 
});

/* Update Doctor's Name */
router.put('/doctors/:id', function(req, res, next) {
  const firstName = req.body['first-name'];
  const lastName = req.body['last-name'];
  const id = req.params.id;

  /* Check if query param is not empty */
  if(!firstName && !lastName) {
    res.send("first-name or last-name cannot be empty");
  }

  /* Check if resource exists */
  db.query(`SELECT id FROM doctors WHERE id = ${id}`, (err, results, fields) => {
    if(err)
      res.send(err);
    
    if(results > 0) {
      db.query(`UPDATE doctors SET first_name = ${firstName}, last_name = ${lastName} WHERE id = ${id}`, (err, results, fields) => {
        if(err)
          res.send(err);

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
      if(err)
        console.log(err);
      res.send(results);
    });
  } else {
    res.send('Failed');
  }
});

/* Get list of appointments */
router.get('/appointments', function(req, res, next) {
});

/* Delete an existing appointment */
router.delete('/appointments', function(req, res, next) {
});

/* Add new appointments */
router.post('/appoinments', function(req, res, next) {
});

/* Testing */
router.get('/test', function(req, res, next) {
  console.log(req.query);
});


module.exports = router;
