const {Schema, model} = require('mongoose');

const Joi = require('joi');

const {handleMongooseError} = require('../helpers');

//регулярний вираз для номера телефона:
// const phoneRegExp = /^\(\d{3}\)[\b]\d{3}-\d{2}-\d{2}$/ ;

const contactSchema = new Schema({
  name:{
      type: String,
      required: [true, 'Set name for contact'],
  },
  email: {
      type: String,
  },
  phone: {
      type: String,
      // match: phoneRegExp,
  },
  favorite: {
      type: Boolean,
      default: true,
  }
}, { versionKey: false, timestamps: true});

//обробка помилки валідації при запиті
contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  // phone: Joi.string().pattern(phoneRegExp).required(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  // phone: Joi.string().pattern(phoneRegExp),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required,
});

const schemas = {
  addSchema,
  updateSchema,
  updateFavoriteSchema,
}

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};