const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../index');  // path to your app.js or server.js or index.js

describe('Authentication Routes', function() {

  // Testing /auth/register route
  describe('POST /auth/register', function() {
    it('should create a new user', function(done) {
      request(app)
        .post('/auth/register')
        .send({username: 'testuser', email: 'testuser@gmail.com', password: 'testpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('message', 'User created successfully!');
          expect(res.body).to.have.property('user');
          done();
        });
    });

      // Test case: Attempt to register a user that already exists
  describe('POST /auth/register - User already exists', function() {
    it('should return 409 conflict', function(done) {
      request(app)
        .post('/auth/register')
        .send({username: 'existinguser', email: 'existinguser@gmail.com', password: 'testpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(409);
          expect(res.body).to.have.property('message', 'User already exists');
          done();
        });
    });
  });

  // Test case: Validation Error for missing email
  describe('POST /auth/register - Missing Email', function() {
    it('should return 400 Bad Request', function(done) {
      request(app)
        .post('/auth/register')
        .send({username: 'newuser', password: 'testpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('message', 'Email is required');
          done();
        });
    });
  });

  // Test case: Validation Error for weak password
  describe('POST /auth/register - Weak Password', function() {
    it('should return 400 Bad Request', function(done) {
      request(app)
        .post('/auth/register')
        .send({username: 'newuser', email: 'newuser@gmail.com', password: '123'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('message', 'Weak password');
          done();
        });
    });
  });

  // Test case: Incorrect password during login
  describe('POST /auth/login - Incorrect Password', function() {
    it('should return 401 Unauthorized', function(done) {
      request(app)
        .post('/auth/login')
        .send({email: 'existinguser@gmail.com', password: 'wrongpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message', 'Incorrect password');
          done();
        });
    });
  });

  // Test case: Email not found during login
  describe('POST /auth/login - Email Not Found', function() {
    it('should return 404 Not Found', function(done) {
      request(app)
        .post('/auth/login')
        .send({email: 'nonexistent@gmail.com', password: 'testpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('message', 'Email not found');
          done();
        });
    });
  });

  });

  // Testing /auth/login route
  describe('POST /auth/login', function() {
    it('should login the user', function(done) {
      request(app)
        .post('/auth/login')
        .send({email: 'testuser@gmail.com', password: 'testpass'})
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          // Add more assertions based on your logic
          done();
        });
    });
  });

  describe('POST /auth/logout - Logout', function() {
    it('should logout successfully', function(done) {
      request(app)
        .post('/auth/logout')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message', 'Logged out successfully');
          done();
        });
    });
  });
  
});
