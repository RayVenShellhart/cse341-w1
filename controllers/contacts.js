const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    //#swagger.tag=['Contacts']
    const contacts = await mongodb
      .getDatabase()
      .db()
      .collection('Contacts')
      .find()
      .toArray();

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching contacts' });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tag=['Contacts']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use valid contact id to find a contact');
  }

  try {
    const contactId = new ObjectId(req.params.id);
    const contact = await mongodb
      .getDatabase()
      .db()
      .collection('Contacts')
      .findOne({ _id: contactId });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching contact' });
  }
};

const createContact = async (req, res) => {
  //#swagger.tag=['Contacts']
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    Email: req.body.Email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('Contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error creating contact' });
  }
};

const updateContact = async (req, res) => {
  //#swagger.tag=['Contacts']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use valid id to update');
  }

  const contactId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    Email: req.body.Email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('Contacts')
      .replaceOne({ _id: contactId }, contact);

    if (response.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: 'No contact found to update or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating contact' });
  }
};

const deleteContact = async (req, res) => {
  //#swagger.tag=['Contacts']
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json('Must use a valid contact id to delete a contact.');
  }

  const contactId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('Contacts')
      .deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      return res.status(204).send();
    } else {
      res.status(404).json({ message: 'No contact found to delete' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error deleting contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
