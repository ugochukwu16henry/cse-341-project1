const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./db/connect");

// Load environment variables
dotenv.config();

const app = express(); // Define app FIRST before using it
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes - Choose ONE method
require("./routes/contacts.js")(app); // This registers all your contact routes

// Basic route
app.get("/", (req, res) => {
  res.send("Contacts API - Use /contacts to access the API");
});

// Initialize database and start server
initDb((err) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database connected successfully`);
    });
  }
});
