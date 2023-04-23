const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');
require('dotenv').config();

const {SECRET_KEY} = process.env; 

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const register = async(req, res) => {
  //check ia email unique
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if (user) {
    throw HttpError(409, "Email in use");
  }
  //------------

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({...req.body, password: hashPassword});

  res.status(201).json({
  user: {
    email: newUser.email,
    name: newUser.name,
  }
})
} 

const login = async(req, res) =>{
  const {email, password} = req.body;

  const user = await User.findOne({email});

  //check if user is in database
  if(!user){
    throw HttpError(401, "Email or password is wrong")
  }
  //check password
  const passwordCompare = await bcrypt.compare(password, user.password);

  if(!passwordCompare){
    throw HttpError(401, "Email or password is wrong")
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

  res.json({
    token,
    user: {
      email,
      subscription,
    }
  })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
}