const express = require('express');
const request = require('supertest');
const assert = require('assert');
let { expect } = require('chai');

const app = 'http://localhost:3000';

/**
 *  Doctors Resource
 */

 /**
  *  GET /doctors
  */
describe('GET /doctors', () => {
  describe('No Query Passed', () => {
    let expected = 'Should Return Status 200; Content-Type: json';
    let testCase = '/v1/doctors';
    describe(testCase,() => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });

  describe('Invalid Queries', () => {
    let expected = 'Should Return Status 400';
    let testCase = '/v1/doctors?x=1';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    })

    testCase = '/v1/doctors?p=';
    describe(testCase,() => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    });

    testCase = '/v1/doctors?dog=llkdjfufu9827959686';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    });
  });

  describe('Valid Queries', () => {
    let expected = `Should Return Status 200: Content-Type: json`;
    let testCase = '/v1/doctors?firstName=jerry';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    
    testCase = '/v1/doctors?lastName=len';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    
    testCase = '/v1/doctors?firstName=jerry&lastName=len';
    describe('/v1/doctors?firstName=jerry&lastName=len', () => {
      it(expected, done => {
        request(app)
          .get('/v1/doctors?firstName=jerry&lastName=len')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });
});

/**
 *  GET /doctors/:id
 */
describe('GET /doctors/:id', () => {
  describe('Valid Route Param', () => {
    let expected = `Should Return Status 200; Content-Type: json`;
    describe('/v1/doctors/1', () => {
      it(expected, done => {
        request(app)
          .get('/v1/doctors/5')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });

    expected = `Should Return Status 404`;
    describe('/v1/doctors/999999999', () => {
      it(expected, done => {
        request(app)
          .get('/v1/doctors/999999999')
          .expect(404, done);
      });
    });
  });

  describe('Invalid Route Param', () => {
    let expected = `Should Return Status 400`;
    let testCase ='/v1/doctors/ABCDASFASF'
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    });

    testCase = '/v1/doctors/@!@$$#@%#$^$^&^%*^';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    });

    testCase = '/v1/doctors/123-5';
    describe(testCase, () => {
      it(expected, done => {
        request(app)
          .get(testCase)
          .expect(400, done);
      });
    });
  });
});

/**
 * POST /doctors
 */
describe('POST /doctors', () => {
  describe('Valid Params', () => {
    let expected = 'Should Return Status 201; Header location should exist';
    let testCase = {firstName: 'Leeroy', lastName: 'Jenkins'};
    describe(`Body Param -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(201)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            let isLocationPresent = res.header['location'] !== undefined;
            expect(isLocationPresent).be.true;
            done();
          });
      });
    });
  });

  describe('Invalid Params', () => {
    let expected = 'Should Return Status 400';
    let testCase = {};
    describe(`Empty Param -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(400, done);
      });
    });

    testCase = {firstName: '', lastName: 'Smith'};
    describe(`Empty firstName -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(400, done);
      });
    });

    testCase = {firstName: 'Bob', lastName: ''};
    describe(`Empty lastName -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(400, done);
      });
    });

    testCase = {firstName: '', lastName: ''};
    describe(`Empty params -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(400, done);
      });
    });

    testCase = '/v1/doctors?firstName=John&lastName=Smith'
    describe(`With Query Params -> ${testCase}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors?firstName=John&lastName=Smith')
          .expect(400, done);
      });
    });

    testCase = {firstname: 'Bob', lastname: 'Smith'};
    describe(`lower case param -> ${JSON.stringify(testCase)}`, () => {
      it(expected, done => {
        request(app)
          .post('/v1/doctors')
          .send(testCase)
          .expect(400, done);
      });
    });

  });
});

/**
 * PUT /doctors
 */

/**
* DELETE /doctors
*/

/**
 * GET /appointments
 */

/**
* POST /appointments
*/

/**
 * DELETE /appointments
 */