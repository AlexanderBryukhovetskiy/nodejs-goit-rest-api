const nodemailer = require('nodemailer');
require('dotenv').config();

const {EMAIL_PASSWORD} = process.env;

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465, //25, 465, 2525
  secure: true,
  auth: {
    user: 'a.v.bryukhovetskiy@meta.ua',
    pass: EMAIL_PASSWORD
  }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async(data) => {
  const email = {...data, from: 'a.v.bryukhovetskiy@meta.ua'};
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;