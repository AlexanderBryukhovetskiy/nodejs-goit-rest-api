const {Schema, model} = require('mongoose');

const Joi = require('joi');

const {handleMongooseError} = require('../helpers');

//регулярний вираз для номера телефона у форматі: (123)-123-1234:
const phoneRegExp = /^\(\d{3}\)-\d{3}-\d{4}$/ ;

const contactSchema = new Schema({
  name:{
      type: String,
      required: true,
  },
  email: {
      type: String,
  },
  phone: {
      type: String,
      match: phoneRegExp,
  },
  favorite: {
      type: Boolean,
      default: true,
  }
}, { versionKey: false, timestamps: true});

//обробка помилки валідації при запиті
contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  favorite: Joi.boolean(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string().pattern(phoneRegExp),
  favorite: Joi.boolean(),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean(),
});

const schemas = {
  addSchema,
  updateSchema,
  updateStatusSchema,
}

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};