const express = require('express');
const request = require('supertest');
const assert = require('assert');

const app = 'http://localhost:3000';

/**
 *  Doctors Resource
 */

 /**
  *  GET /doctors
  */
describe('GET /doctors', () => {
  describe('empty query', () => {
    const expected = 'should return status 200; Content-Type: json';
    it(expected, done => {
      request(app)
        .get('/v1/doctors')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('invalid query params', () => {
    const expected = 'should return status 400; Content-Type: json';
    it(expected, done => {
      request(app)
        .get('/v1/doctors?x=1')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(expected, done => {
      request(app)
        .get('/v1/doctors?2=')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(expected, done => {
      request(app)
        .get('/v1/doctors?dog=llkdjfufu9827959686')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });

  describe('valid queries', () => {
    const expected = `should return status 200: Content-Type: json`;
    it(expected, done => {
      request(app)
        .get('/v1/doctors?firstName=jerry')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it(expected, done => {
      request(app)
        .get('/v1/doctors?lastName=len')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it(expected, done => {
      request(app)
        .get('/v1/doctors?firstName=jerry&lastName=len')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

/**
 *  GET /doctors/:id
 */
describe('GET /doctors/:id', () => {
  describe('valid route params', () => {
    const expected = `should return status 200; Content-Type: json`;
    it(expected, done => {
      request(app)
        .get('/v1/doctors/5')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

