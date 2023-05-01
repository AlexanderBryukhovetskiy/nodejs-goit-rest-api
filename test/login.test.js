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

  it('should login user', async () => {
      const response = await supertest(app).post('/api/auth/login').send({
        email: "anna@mail.com",
        password: '123456',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toEqual("anna@mail.com");
      expect(response.body.user.subscription).toEqual("starter");
      expect(response.body.token).not.toBeFalsy();
  });
});

