// In your server.js (or app.js)

const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./db/connect"); // Assuming you saved the new file here

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ... [Middleware and Swagger setup] ...

// ... [Routes] ...

// 🚀 Database connection and Server Start
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
