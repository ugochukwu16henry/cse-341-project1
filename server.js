const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./db/connect");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/contacts", require("./routes/contacts"));

// Initialize database and start server
initDb((err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
  } else {
    app.listen(PORT, () => {
      console.log(`Database connected. Server running on port ${PORT}`);
    });
  }
});
