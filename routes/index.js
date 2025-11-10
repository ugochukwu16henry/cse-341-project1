const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Henry's Contacts API!",
    documentation: "/api-docs",
    endpoints: {
      "GET /contacts": "Get all contacts",
      "GET /contacts/:id": "Get contact by ID",
      "POST /contacts": "Create new contact",
      "PUT /contacts/:id": "Update contact",
        "DELETE /contacts/:id": "Delete contact",
      "Swagger Docs" : "/api-docs",
    },
  });
});

router.use("/", require("./swagger"));
router.use("/contacts", require("./contacts"));

module.exports = router;
