const moment = require('moment');
const db = require('../db');

/* Create randomized appointments each day for a number amount of days */
createAppointments(180);
module.exports = createAppointments;
function createAppointments(numOfDays) {
  let startDate = moment();
  let endDate = moment().add(numOfDays, 'days');
  
  while( !startDate.isSame(endDate, 'day') ) {
    let date = startDate.format('YYYY-MM-DD');
    let dayOfWeek = startDate.format('dddd');
  
    // Create appointments if there are no appointments on a given date
    // and if the days are not Saturday or Sunday
    getAppointmentCount(date)
      .then( count => {
        if(count === 0 && dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') {
          Promise.all([getAllPatientNames(), getAllDoctorNames()])
          .then( results => {
            let visitTypes = ['New Patient', 'Follow Up'];
            let hourOpen = moment('08:00', 'hh:mm:ss');
            let hourClosed = moment('17:00', 'hh:mm:ss');
            let patientNames = results[0];
            let patientNamesIndex = 0;
            let doctorNames = results[1];
            let currHour = hourOpen;
  
            while(!currHour.isSame(hourClosed)){
              doctorNames.forEach( doc => {
                // 60% chance of getting an appointment
                if(Math.random() >= 0.4) {
                  let currPatient = patientNames[patientNamesIndex++];
                  // Randomize visit type
                  let visitType = visitTypes[Math.floor(Math.random() * 2)];
                  let datetime = moment(date + " " + currHour.format('HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
                  let obj = {
                    datetime,
                    currHour,
                    doctor: doc.id,
                    patient: currPatient.id ,
                    visitType
                  }
                  createAppointment(obj);
                }
              });
              currHour = currHour.add(30, 'minute');
            }
          })
          .catch( err => console.log(err));
        }
      })
    startDate = startDate.add(1, 'days');
  }  
}

function getAllPatientNames() {
  const stmt = `SELECT id, first_name, last_name FROM patients ORDER BY RAND()`;
  
  return new Promise((resolve, reject) => {
    db.query(stmt, (err, results, fields) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  });
}

function getAppointmentCount(date) {
  const stmt = `SELECT COUNT(*) AS count FROM appointments WHERE CAST(date as DATE) = '${date}'`;
  
  return new Promise((resolve, reject) => {
    db.query(stmt, (err, results, fields) => {
      if(err) {
        reject(err);
      }
      resolve(results[0].count);
    });
  });
}

function getAllDoctorNames() {
  const stmt = `SELECT id, first_name, last_name FROM doctors`;

  return new Promise((resolve, reject) => {
    db.query(stmt, (err, results, fields) => {
      resolve(results);
    });
  });
}

function createAppointment({datetime, doctor, patient, visitType}) {  
  const stmt = 
  `INSERT INTO appointments(date, doctor, patient, visit_type)
   VALUES('${datetime}', ${doctor}, ${patient}, '${visitType}')
  `;

  return new Promise((resolve, reject) => {
    db.query(stmt, (err, results, fields) => {
      if(err) {
        reject(err);
      }

      resolve(true);
    });
  });
}