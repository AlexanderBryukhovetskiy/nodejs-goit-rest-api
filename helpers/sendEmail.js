const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

const sendEmail = (data) => {
  const nodemailerConfig = {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  };

  const transport = nodemailer.createTransport(nodemailerConfig);

  const email = {...data, from: 'a.v.bryukhovetskiy@gmail.com'};

  return transport.sendMail(email);
};

module.exports = sendEmail;