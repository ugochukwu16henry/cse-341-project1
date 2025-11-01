const express = require("express");
const router = express.Router();
const { getDatabase } = require("../db/connect");
const { ObjectId } = require("mongodb");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const database = getDatabase();
    const contacts = await database.collection("contacts").find().toArray();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single contact by ID
router.get("/:id", async (req, res) => {
  try {
    const contactId = req.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const database = getDatabase();
    const contact = await database
      .collection("contacts")
      .findOne({ _id: new ObjectId(contactId) });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
