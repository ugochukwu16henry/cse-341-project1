const db = require("../models");
const Contact = db.contacts;

// IMPORTANT: For production, this should be stored securely and retrieved from the environment.
const apiKey =
  "T+Y6WRZMY3E8MM77/NVex3EdE+E8UhGuy6txSb7qArokm0TYlfynSX2ezn+bDSfUBpBxD5pS6SAZsB0NS4XOUQ==";

/**
 * 🚀 Create (POST) a new Contact.
 * ALL fields are required. Returns the new contact ID.
 */
exports.create = (req, res) => {
  /*
    #swagger.description = 'Create a new contact'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Contact information',
      required: true,
      schema: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        favoriteColor: 'Purple',
        birthday: '1990-01-01'
      }
    }
  */

  // 1. Requirement: Check that ALL required fields are present
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.favoriteColor ||
    !req.body.birthday
  ) {
    
    return res.status(400).send({
      message:
        "All contact fields (firstName, lastName, email, favoriteColor, birthday) are required!",
    });
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
      // 2. Requirement: Return the new contact id in the response body.
      // 201 Created status is typically used for successful POST requests.
      res.status(201).send({ insertedId: data._id });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contact.",
      });
    });
};

/**
 * 🔍 Retrieve (GET) all Contacts. Requires API Key.
 */
exports.findAll = (req, res) => {
  /*
    #swagger.description = 'Get all contacts. API Key required in header.'
  */
  if (req.header("apiKey") === apiKey) {
    Contact.find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving contacts.",
        });
      });
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

/**
 * 🔎 Retrieve (GET) a single Contact with id. Requires API Key.
 */
exports.findOne = (req, res) => {
  /*
    #swagger.description = 'Get a single contact by ID. API Key required in header.'
  */
  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Contact.findById(id)
      .then((data) => {
        if (!data)
          res.status(404).send({ message: "Not found Contact with id " + id });
        else res.send(data);
      })
      .catch(() => {
        // Catching common Mongoose CastError for invalid IDs
        res.status(500).send({
          message: "Error retrieving Contact with id=" + id,
        });
      });
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

/**
 * ✍️ Update (PUT) a Contact with id. Requires API Key.
 * Returns a 204 No Content on successful completion.
 */
exports.update = (req, res) => {
  /*
    #swagger.description = 'Update a contact by ID. API Key required in header.'
    #swagger.parameters['id'] = { description: 'Contact ID' }
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Contact information to update (partial or full)',
      schema: {
        firstName: 'Jane',
        email: 'new.email@example.com'
      }
    }
  */
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    // The { new: true } option ensures the returned document is the updated one.
    // However, the assignment only asks for an HTTP status code, so we don't need it.
    // { runValidators: true } ensures the updated fields comply with the schema.
    Contact.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      runValidators: true,
    })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Contact with id=${id}. Maybe Contact was not found!`,
          });
        } else {
          // Requirement: Return an http status code representing the successful completion of the request.
          // 204 No Content is the standard response for a successful PUT/DELETE that doesn't return a body.
          res.status(204).send();
        }
      })
      .catch((err) => {
        // This catches validation errors (e.g., if we try to update a required field to be empty)
        res.status(500).send({
          message: err.message || "Error updating Contact with id=" + id,
        });
      });
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

/**
 * 🗑️ Delete a Contact with id. Requires API Key.
 * Returns a 204 No Content on successful completion.
 */
exports.delete = (req, res) => {
  /*
    #swagger.description = 'Delete a contact by ID. API Key required in header.'
    #swagger.parameters['id'] = { description: 'Contact ID' }
  */
  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Contact.findByIdAndRemove(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`,
          });
        } else {
          // Requirement: Return an http status code representing the successful completion of the request.
          // 204 No Content is the standard response for a successful PUT/DELETE that doesn't return a body.
          res.status(204).send();
        }
      })
      .catch(() => {
        // Catching common Mongoose CastError for invalid IDs
        res.status(500).send({
          message: "Could not delete Contact with id=" + id,
        });
      });
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};
