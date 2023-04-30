//import packages: multer, path ---
const multer = require('multer');
const path = require('path');

//create path to directory for temporary saving pictures:
// const tempDir = path.join(__dirname, '../temp');
const tempDir = path.join(__dirname, '../', 'temp');

//create config.object for multer: write the path to directory for temporary saving pictures:
const multerConfig = multer.diskStorage({
  destination: tempDir,
  //OPTIONAL: function for renaming files (00:26:00)
  filename: (req, file, cb) => {
    cb( null, file.originalname);
  },
  limits: {
    fileSize: 2097152,
  },
})

const upload = multer({
  storage: multerConfig
});

module.exports = upload;