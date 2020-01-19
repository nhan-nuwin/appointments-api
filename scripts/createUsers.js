const db = require('../db');
const randomProfile = require('random-profile-generator');

/* Creates random firstName and lastName and inserts into patients table */
function createUsers( numOfUser ) {
  for(let i = 0; i < numOfUser; i++) {
    const profile = randomProfile.profile();
    const stmt = 
    `INSERT INTO patients(first_name, last_name) 
    VALUES
    ('${profile.firstName}', '${profile.lastName}');
    `;

    db.query(stmt, (err, results, fields) => {
      if(err) {
        console.log(err);
      }
    });
  }
}

module.exports = createUsers;

// createUsers(1000);
