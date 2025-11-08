module.exports = (app) => {
  const contacts = require("../controllers/contacts.js");

  // Create a new Contact
  app.post("/contacts", contacts.create);

  // Retrieve all Contacts
  app.get("/contacts", contacts.findAll);

  // Retrieve a single Contact with id
  app.get("/contacts/:id", contacts.findOne);

  // Update a Contact with id
  app.put("/contacts/:id", contacts.update);

  // Delete a Contact with id
  app.delete("/contacts/:id", contacts.delete);
};
