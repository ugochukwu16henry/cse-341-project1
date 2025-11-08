const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./db/connect");

// This will Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API - Use /contacts to access the API");
});

// This will Initialize my database and start server
initDb((err) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Database connected successfully");

    // to Load routes AFTER my database is connected
    require("./routes/contacts.js")(app);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
