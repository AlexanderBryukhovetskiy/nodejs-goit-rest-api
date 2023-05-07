const {Schema, model} = require('mongoose');

const Joi = require('joi');

const {handleMongooseError} = require('../helpers');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema ({
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: [true, 'Email is required'],
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String,
    default: '',
  },
  avatarURL: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: '',
    // required: [true, 'Verify token is required'],
  },
}, {versionKey: false, timestamps: true});

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business'),
  email: Joi.string().pattern(emailRegexp).required(), 
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(), 
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required()
    .messages({
      'any.only':
        `The subscription must have one of the following values: 'starter', 'pro' or 'business'`,
    }),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
};

const User = model('user', userSchema);

module.exports = {
  User,
  schemas,
}