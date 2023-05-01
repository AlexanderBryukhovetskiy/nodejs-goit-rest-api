require('dotenv').config();

const supertest = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const { User} = require('../models/user');

mongoose.set("strictQuery", false);

const {DB_HOST, PORT = 3000} = process.env;

describe('login', () => {
  beforeAll( async() => {
    await mongoose.connect(DB_HOST);
    app.listen(PORT);
  });

  afterAll( async() => {
    await mongoose.disconnect(DB_HOST);
  });

  it('should return a response with code status 200', async () => {
      const response = await supertest(app).post('/api/auth/login').send({
        email: "anna@mail.com",
        password: '123456',
      });
      expect(response.statusCode).toBe(200);
  });

    
  it('should return in response a token', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
      email: "anna@mail.com",
      password: '123456',
    });
    expect(response.body.token).not.toBeFalsy();
  });

  it('should return in response an object user with 2 fields: email and subscription', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
      email: "anna@mail.com",
      password: '123456',
    });
    expect(typeof response.body.user).toBe("object");
    expect(response.body.user.email).toEqual("anna@mail.com");
    expect(response.body.user.subscription).toEqual("starter");
  });

  it('email and subscription data type in response is "string"', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
      email: "anna@mail.com",
      password: '123456',
    });
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
    expect(response.body.token).not.toBeFalsy();
  });
});

