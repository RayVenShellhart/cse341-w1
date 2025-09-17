const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tag=['Contacts']
    mongodb
        .getDatabase()
        .db()
        .collection('Contacts')
        .find()
        .toArray((err, contacts) => {
        if (err) {
            res.status(400).json({ message: err })
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts)
    });
};

const getSingle = async (req, res) => {
    //#swagger.tag=['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use valid contact id to find a contact')
    }
    const contactId = new ObjectId(req.params.id);
    mongodb
        .getDatabase()
        .db()
        .collection('Contacts')
        .find({ _id: contactId })
        .toArray((err, contacts) => {
            if (err) {
                res.status(400).json({ message: err })
            }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};

const createContact = async (req, res) => {
    //#swagger.tag=['Contacts']
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        Email: req.body.Email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('Contacts').insertOne(contact);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Soem error has occured while updating the user.")
    }
};


const updateContact = async (req, res) => {
    //#swagger.tag=['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use valid id to update')
    }
    const contactId = new ObjectId(req.params.id)
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        Email: req.body.Email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('Contacts').replaceOne({ _id: contactId }, contact);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error has occured while updating the contact.")
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tag=['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to delete a contact.');
    }
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('Contacts').deleteOne({ _id: contactId });
    if (response.deleteCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Soem error has occured while updating the contact.")
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
}