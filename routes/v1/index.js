var express = require('express');
var router = express.Router();

/* Get list of all doctors */
router.get('/doctors', function(req, res, next) {
  const id = req.query.id;

  if(id) {
    id = parseInt(id);
    db.get(id)
      .then( response => response.json() )
      .then( data => {
        const firstName = data[0].first_name;
        const lastName = data[0].last_name;
        const obj = {
          firstName,
          lastName
        };

        res.send(obj);
      })
      .catch( err => console.log(err));
  } else {
    res.send('Not Found');
  }
});

/* Insert Doctor's Names */
router.post('/doctors', function(req, res,next) {
  let firstName = req.query['first-name'];
  let lastName = req.query['last-name'];

  if(firstName && lastName) {
    db.add({firstName, lastName})
      .then( () => res.send('Success'))
      .catch( err => console.log(err));
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
