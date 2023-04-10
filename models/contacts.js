const fs = require('fs/promises');
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

const getById = async (contactId) => {
  const contactsList = await listContacts();
  const contactById = contactsList.find( contact => contact.id === contactId);
  return contactById || null;
}

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  };
  const [result] = contactsList.splice(index, 1);
  await  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return result;
}

const addContact = async (body) => {
  const contactsList = await listContacts();
  const newContact = { 
    id: nanoid(10), 
    ...body
  };
  contactsList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2),'utf8');
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  };
  const oldContact = contactsList[index];
  contactsList[index] = {...oldContact, ...body};
  await  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return contactsList[index];
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
