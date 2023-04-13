const {Schema, model} = require('mongoose');

const Joi = require('joi');

const {handleMongooseError} = require('../helpers');

//регулярний вираз для номера телефона:

const phoneRegExp = /^\'('\d{3}'\')[\b]\d{3}-\d{2}-\d{2}$/ ;

const contactSchema = new Schema({
  name:{
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
  },
  phone: {
      type: String,
      match: phoneRegExp,
      required: true,
  },
  favorite: {
      type: Boolean,
      default: true,
  }
}, { versionKey: false, timestamps: true});

contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  favorite: Joi.boolean().required(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string().pattern(phoneRegExp),
  favorite: Joi.boolean(),
});



const schemas = {
  addSchema,
  updateSchema,
  //--- another schemas
}

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};