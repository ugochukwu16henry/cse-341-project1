
const db = require('../models');
const Contact = db.contacts;

const apiKey = 'T+Y6WRZMY3E8MM77/NVex3EdE+E8UhGuy6txSb7qArokm0TYlfynSX2ezn+bDSfUBpBxD5pS6SAZsB0NS4XOUQ=='; // Replace with my generated key

exports.create = (req, res) => {
  /*
    #swagger.description = 'Create a new contact', apiKey: T+Y6WRZMY3E8MM77/NVex3EdE+E8UhGuy6txSb7qArokm0TYlfynSX2ezn+bDSfUBpBxD5pS6SAZsB0NS4XOUQ=='
  */
  if (!req.body.firstName || !req.body.lastName) {
    res.status(400).send({ message: "First name and last name are required!" });
    return;
  }

  const contact = new Contact({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  });

  contact
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contact.",
      });
    });
};

exports.findAll = (req, res) => {
  /*
    #swagger.description = 'Get all contacts. API Key required in header.'
  */
  console.log(req.header('apiKey'));
  if (req.header('apiKey') === apiKey) {
    Contact.find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving contacts.',
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

exports.findOne = (req, res) => {
  /*
    #swagger.description = 'Get a single contact by ID. API Key required in header.'
  */
  const id = req.params.id;
  
  if (req.header('apiKey') === apiKey) {
    Contact.findById(id)
      .then((data) => {
        if (!data)
          res.status(404).send({ message: 'Not found Contact with id ' + id });
        else res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Contact with id=' + id,
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

exports.update = (req, res) => {
  /*
    #swagger.description = 'Update a contact by ID. API Key required in header.'
  */
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;

  if (req.header('apiKey') === apiKey) {
    Contact.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Contact with id=${id}. Maybe Contact was not found!`,
          });
        } else res.send({ message: 'Contact was updated successfully.' });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Contact with id=' + id,
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

exports.delete = (req, res) => {
  /*
    #swagger.description = 'Delete a contact by ID. API Key required in header.'
  */
  const id = req.params.id;

  if (req.header('apiKey') === apiKey) {
    Contact.findByIdAndRemove(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`,
          });
        } else {
          res.send({
            message: 'Contact was deleted successfully!',
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete Contact with id=' + id,
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};