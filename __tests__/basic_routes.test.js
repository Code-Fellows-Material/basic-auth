'use strict';
const superTest = require('supertest');
const { app } = require('../lib/server.js');
const mockRequest = superTest(app);

const {signUpHandler} = require('../lib/auth/signUp');
const {signInHandler} = require('../lib/auth/signUp');
const { Users } = require('../lib/models');


let testUser = { username: 'tester', password: 'test' };

// Pre-load our database with fake users
beforeAll( async (done) => {
  await Users.create(testUser);
  done();
});


describe('Tests for basic auth routes', () => {

    it('POST to /signup to create a new user', async () => {
      const response = await mockRequest.post('/signup').send(testUser);
      const userObject = response.body;

      expect(response.status).toBe(201);
      expect(userObject.id).toBeDefined();
      expect(userObject.username).toEqual(testUser.username)
    });

    it('POST to /signin to login as a user (use basic auth)', async () => {
      const response = await mockRequest.post('/signin')
      .auth(testUser.username, testUser.password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.id).toBeDefined();
    expect(userObject.username).toEqual(testUser.username);
    })
});


describe('Tests for basic auth middleware', () => {

  const req = {};
  const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    }
  const next = jest.fn();

  it('fails signup a user with the incorrect info', () => {

    // Change the request to match this test case
    req.body = {
      notUsername: 'tester', notPassword: 'test' 
    };

    return signUpHandler(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith('Error Creating User');
      });

  });

  it('fails a login for a user with the incorrect basic credentials', () => {

    // Change the request to match this test case
    req.headers = {
      authorization: 'Basic NotTheCorrectString',
    };

    return signInHandler(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith("Invalid Login");
      });

  });

    it('logs in an admin user with the right credentials', async () => {

      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic dGVzdGVyOnRlc3Q=',
      };

      return await signInHandler(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
});
