// File: db/connect.js (or similar)

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

/**
 * 🔗 Connects to the MongoDB database using Mongoose.
 * The connection URL is pulled from the MONGODB_URI environment variable.
 */
const connectDb = async () => {
  try {
    // 1. Use the Mongoose connection method
    await mongoose.connect(process.env.MONGODB_URI, {
      // 2. These options are standard best practices for Mongoose v6+
      // They are often implied but good to be explicit
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
    });

    // Log success and return the Mongoose object
    console.log("✅ Connected to MongoDB!");
    return mongoose;
  } catch (error) {
    console.error("❌ Could not connect to the database!", error.message);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDb;

// Note: To use this, your main server.js would change from the old
// db.mongoose.connect(...) to calling this function:
//
// const connectDb = require('./db/connect.js');
// connectDb().then(() => {
//     // Start Express server ONLY after the database is connected
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// });
