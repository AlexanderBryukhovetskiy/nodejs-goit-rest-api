const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config();

//import packages: multer, path ---
const multer = require('multer');
const path = require('path');
//---------------------------------

const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

//create path to directory for temporary saving pictures:
const tempDir = path.join(__dirname, 'temp');

//create config.object for multer: write the path to directory for temporary saving pictures:
const multerConfig = multer.diskStorage({
  destination: tempDir,
  //OPTIONAL: function for naming files (00:26:00)
  filename: (req, file, cb) => {
    cb( null, file.originalname);
  }
})

//middleware for saving files:
const upload = multer({
  storage: multerConfig
});

//-----------------------

app.use('/api/auth', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server Error"} = err;
  res.status(status).json({ message })
})

module.exports = app;
