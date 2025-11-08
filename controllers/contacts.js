
const { getDatabase } = require("../db/connect");
const { ObjectId } = require("mongodb");

const apiKey =
  "T+Y6WRZMY3E8MM77/NVex3EdE+E8UhGuy6txSb7qArokm0TYlfynSX2ezn+bDSfUBpBxD5pS6SAZsB0NS4XOUQ=="; // Replace with your generated API key

exports.create = async (req, res) => {
  /*
    #swagger.description = 'Create a new contact'
  */
  if (!req.body.firstName || !req.body.lastName) {
    res.status(400).send({ message: "First name and last name are required!" });
    return;
  }

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  try {
    const db = getDatabase();
    const result = await db.collection("contacts").insertOne(contact);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Contact.",
    });
  }
};

exports.findAll = async (req, res) => {
  /*
    #swagger.description = 'Get all contacts'
  */
  if (req.header("apiKey") === apiKey) {
    try {
      const db = getDatabase();
      const contacts = await db.collection("contacts").find({}).toArray();
      res.send(contacts);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contacts.",
      });
    }
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

exports.findOne = async (req, res) => {
  /*
    #swagger.description = 'Get a single contact by ID'
  */
  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    try {
      const db = getDatabase();
      const contact = await db
        .collection("contacts")
        .findOne({ _id: new ObjectId(id) });

      if (!contact) {
        res.status(404).send({ message: "Not found Contact with id " + id });
      } else {
        res.send(contact);
      }
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Contact with id=" + id,
      });
    }
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

exports.update = async (req, res) => {
  /*
    #swagger.description = 'Update a contact by ID'
  */
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    try {
      const db = getDatabase();
      const result = await db
        .collection("contacts")
        .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

      if (result.matchedCount === 0) {
        res.status(404).send({
          message: `Cannot update Contact with id=${id}. Maybe Contact was not found!`,
        });
      } else {
        res.send({ message: "Contact was updated successfully." });
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Contact with id=" + id,
      });
    }
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

exports.delete = async (req, res) => {
  /*
    #swagger.description = 'Delete a contact by ID'
  */
  const id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    try {
      const db = getDatabase();
      const result = await db
        .collection("contacts")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).send({
          message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`,
        });
      } else {
        res.send({
          message: "Contact was deleted successfully!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Contact with id=" + id,
      });
    }
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};