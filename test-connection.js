const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  console.log("🔍 Testing MongoDB Connection...\n");

  if (!uri) {
    console.error("❌ ERROR: MONGODB_URI not found in .env file");
    console.log(
      "Please create a .env file with your MongoDB connection string"
    );
    process.exit(1);
  }

  // Hide password in logs
  const safeUri = uri.replace(/:([^:@]{8})[^:@]*@/, ":****@");
  console.log("📡 Connecting to:", safeUri);

  let client;

  try {
    // Create a new MongoClient
    client = new MongoClient(uri);

    // Connect to MongoDB
    console.log("⏳ Attempting to connect...\n");
    await client.connect();

    console.log("✅ SUCCESS: Connected to MongoDB!");

    // Test database access
    const db = client.db("contactsDB");
    console.log('✅ Database "contactsDB" accessed successfully');

    // Test collection access
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collection(s):`);
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    // Check if contacts collection exists
    const hasContacts = collections.some((col) => col.name === "contacts");
    if (hasContacts) {
      const contactsCollection = db.collection("contacts");
      const count = await contactsCollection.countDocuments();
      console.log(`✅ "contacts" collection found with ${count} document(s)`);

      // Show sample document if exists
      if (count > 0) {
        const sample = await contactsCollection.findOne();
        console.log("\n📄 Sample document:");
        console.log(JSON.stringify(sample, null, 2));
      }
    } else {
      console.log(
        '⚠️  "contacts" collection not found - it will be created when you add your first contact'
      );
    }

    console.log("\n🎉 MongoDB is ready to use!");
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED:");
    console.error("Error:", error.message);

    console.log("\n🔧 Troubleshooting tips:");
    console.log("1. Check your MONGODB_URI in .env file");
    console.log("2. Verify your MongoDB username and password");
    console.log("3. Ensure your IP address is whitelisted in MongoDB Atlas");
    console.log("4. Check if your cluster is active and running");
    console.log("5. Verify network connectivity");
  } finally {
    // Close connection
    if (client) {
      await client.close();
      console.log("\n🔌 Connection closed");
    }
  }
}

// Run the test
testConnection();
