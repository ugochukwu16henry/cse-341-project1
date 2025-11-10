const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

// GET all contacts
const getAll = async (req, res) => {
  try {
    console.log("🔍 GET all contacts called");
    const result = await mongodb
      .getDb()
      .db("contactsDB")
      .collection("contacts")
      .find()
      .toArray();

    console.log(`✅ Found ${result.length} contacts`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ GET all error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET single contact by id
const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "Must use a valid contact id to find a contact." });
      return;
    }

    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db("contactsDB")
      .collection("contacts")
      .findOne({ _id: contactId });

    if (!result) {
      res.status(404).json({ message: "Contact not found." });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new contact
const createContact = async (req, res) => {
  try {
    // Validate required fields
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      res.status(400).json({
        message:
          "All fields are required: firstName, lastName, email, favoriteColor, birthday",
      });
      return;
    }

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
    };

    const result = await mongodb
      .getDb()
      .db("contactsDB")
      .collection("contacts")
      .insertOne(contact);

    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create contact." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update contact
const updateContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "Must use a valid contact id to update a contact." });
      return;
    }

    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      res.status(400).json({
        message:
          "All fields are required: firstName, lastName, email, favoriteColor, birthday",
      });
      return;
    }

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
    };

    const result = await mongodb
      .getDb()
      .db("contactsDB")
      .collection("contacts")
      .updateOne({ _id: contactId }, { $set: contact });

    if (result.modifiedCount > 0) {
      res.status(204).send();
    } else if (result.matchedCount === 0) {
      res.status(404).json({ message: "Contact not found." });
    } else {
      res.status(200).json({ message: "No changes made to contact." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE contact
const deleteContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res
        .status(400)
        .json({ message: "Must use a valid contact id to delete a contact." });
      return;
    }

    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db("contactsDB")
      .collection("contacts")
      .deleteOne({ _id: contactId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Contact deleted successfully." });
    } else {
      res.status(404).json({ message: "Contact not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
