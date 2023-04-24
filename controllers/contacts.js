const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  //user-owner of collection:
  const {_id: owner} = req.user;
  //get parameters of request:
  const {page = 1, limit = 20, favorite} = req.query; 
  const skip = (page-1) * limit;
  const result = await Contact.find(
    {owner, favorite: true}, "-createdAt -updatedAt", {skip, limit})
    .populate("owner", "email subscription");
  res.json(result);
};

const getById =  async (req, res) => {
  const {contactId} = req.params;
  const result = await Contact.findById(contactId);
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const {contactId} = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  if (Object.keys(req.body).length === 0){
    throw HttpError(400, "missing field favorite");
  }
  const {contactId} = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const {contactId} = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    "message": "contact deleted"
  });
};


module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
}