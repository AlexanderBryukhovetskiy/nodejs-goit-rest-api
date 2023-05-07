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
  const verificationCode = nanoid(16);

  const newUser = await User.create({
    ...req.body, 
    password: hashPassword, 
    avatarURL,
    verificationCode
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${verificationCode}'>Click to verify email</a>`
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

const login = async(req, res) => {
  const {email, password} = req.body;

  //check if user is in database
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(401, 'Email or password is wrong')
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
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
}