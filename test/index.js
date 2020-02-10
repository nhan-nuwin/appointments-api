const express = require('express');
const request = require('supertest');
const assert = require('assert');

const app = 'http://localhost:3000';

describe('GET /doctors', () => {
  describe('Empty queries', () => {
    const expected = 'should return status 200; Content-Type: json';
    it(expected, done => {
      request(app)
        .get('/v1/doctors')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

