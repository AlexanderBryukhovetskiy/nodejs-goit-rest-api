
const {Contact} = require('../models/contact');

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
    const result = await Contact.find();
    console.log(result);
    res.json(result);
};

// const getById =  async (req, res) => {
//     const contactId = req.params.contactId;
//     const result = await contacts.getById(contactId);
//     if(!result){
//       throw HttpError(404, "Not found");
//     }
//     res.json(result);
// };

const add =  async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

// const updateById = async (req, res) => {
//     if(Object.keys(req.body).length === 0){
//       throw HttpError(400, "missing fields");
//     }

//     const {contactId} = req.params;
//     const result = await contacts.updateContact(contactId, req.body);
//     if(!result){
//       throw HttpError(404, "Not found");
//     }
//     res.status(200).json(result);
// };

// const deleteById = async (req, res) => {
//     const {contactId} = req.params;
//     const result = await contacts.removeContact(contactId);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.json({
//       "message": "contact deleted"
//     });
// };

module.exports = {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  // updateById: ctrlWrapper(updateById),
  // deleteById: ctrlWrapper(deleteById)
}