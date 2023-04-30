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
  });

  afterAll( async() => {
    await mongoose.disconnect(DB_HOST);
  });

  it('should login user', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
      email: "anna@mail.com",
      password: '123456',
    });

    expected(response.statusCode).toBe(200);
    expected(response.body.data.user).toEqual({
      email: "anna@mail.com",
      subscription: "starter"
    });
    expected(response.body.data.user.email).toBe(String);
    expected(response.body.data.user.subscription).toBe(String);
    expected(response.body.data.token).not.toBeFalsy();
  });
});