const express = require('express');
const dotenv = require('dotenv');
const { initDb } = require('./db/connects');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/contacts', require('./routes/contacts'));

// Basic route
app.get('/', (req, res) => {
  res.send('Contacts API - Use /contacts to access the API');
});

// Initialize database and start server
initDb((err) => {
  if (err) {
    console.log('Error connecting to database:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database connected successfully`);
    });
  }
});
