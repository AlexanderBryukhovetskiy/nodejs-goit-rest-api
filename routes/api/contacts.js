const express = require('express');
const Joi = require('joi');

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
});

router.get('/', async (req, res, next) => {
  try{
    const result = await contacts.listContacts();
    res.json(result);
  }
  catch(error){
    next(error)
    // res.status(500).json({
    //   message: "Server Error"
    // })
  }
});

router.get('/:contactId', async (req, res, next) => {
  try{
    const contactId = req.params.contactId;
    const result = await contacts.getContactById(contactId);
    if(!result){
      throw HttpError(404, "Not found");
      // const error = new Error("Not found");
      // error.status = 404;
      // throw error;
    }
    res.json(result);
  }
  catch(error){
    next(error)
    // const { status = 500, message = "Server Error"} = error;
    // res.status(status).json({
    //   message,
    // })
  }
});

router.post('/', async (req, res, next) => {
  try{
    const {error} = addSchema.validate(req.body);
    console.log(error);
    if (error){
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  }
  catch(error){
    next(error)
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try{
    const {contactId} = req.params;
    console.log("req.contactId :", contactId);

    const result = await contacts.removeContact(contactId);
    console.log(" contacts.removeContact(contactId) : ", result);

    if (!result) {
      throw new HttpError(400, error.message);
    }
    res.status({
      "message": "contact deleted"
    });
  }
  catch(error){
    next(error)
  }
});

router.put('/:contactId', async (req, res, next) => {
  try{
    const {error} = addSchema.validate(req.body);
    if (error){
      throw HttpError(400, error.message);
    }
    const {contactId} = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if(!result){
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  }
  catch(error){
    next(error)
  }
});

module.exports = router;
