const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const path = require('path');

const fs = require('fs/promises');

const gravatar = require('gravatar');

const jimp = require('jimp');

require('dotenv').config();

const {nanoid} = require('nanoid');


const {SECRET_KEY, BASE_URL} = process.env; 

const { User } = require('../models/user');

const { HttpError, ctrlWrapper, resizeAvatar, sendEmail } = require('../helpers');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')

const register = async(req, res) => {
  //check is email unique
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  //------------

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body, 
    password: hashPassword, 
    avatarURL,
    verificationToken
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${verificationToken}'>Click to verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    }
  });

  console.log(res);
};

const verifyEmail = async(req, res) => {
  const {verificationToken} = req.params;

  const user = await User.findOne({verificationToken});
  if(!user){
    throw HttpError(404, 'Not found');
  }
  console.log('user._id in verifyEmail:', user._id);

  await User.findByIdAndUpdate(user._id, {
    verify: true, 
    verificationToken: null,
  });

  res.json({
    message: 'Verification successful',
  })
};


//////  --------------------------------------------
const resendVerifyEmail = async (req, res) => {

  console.log("it is router.get('/users/verify, ctrl.resendVerifyEmail)");

  const {email} = req.body;

  console.log('req.body.email:', email);

  if(!email){
    throw HttpError(400, 'missing required field email');
  }
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(404, 'Not found');
  }
  if(user.verify){
    throw HttpError(400, 'Verification has already been passed');
  }
  
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${user.verificationToken}'>Click to verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: 'Verification email sent'
  });
}
/////----------------------------------


const login = async(req, res) => {
  const {email, password} = req.body;

  //check if user is in database
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(401, 'Email or password is wrong');
  }

  //check if user verify
  if(!user.verify){
    throw HttpError(401, 'Email is not verified');
  }

  //check password
  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    throw HttpError(401, 'Email or password is wrong')
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});

  await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    }
  })
};

const getCurrent = async(req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email, 
    subscription,
  })
};

const logout = async(req, res) => {
  const {_id} = req.user;

  await User.findByIdAndUpdate(_id, {token: ''});

  res.status(204).json({'message': 'Logout success'});
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

const updateAvatar = async(req, res) => {
  const {_id} = req.user;

  const {path: tempUpload, originalname} = req.file;

  await resizeAvatar({ img: tempUpload, size:{ width: 250, height: 250 } });

  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join('avatars', filename);

  await User.findByIdAndUpdate(_id, {avatarURL});

  res.json({
    avatarURL,
  })

}

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
}