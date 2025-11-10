const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

async function checkConnection() {
  const uri = process.env.MONGODB_URI;

  console.log("🔍 CHECKING YOUR MONGODB CONNECTION STRING\n");
  console.log("=".repeat(80));

  if (!uri) {
    console.log("❌ ERROR: MONGODB_URI not found in .env file!");
    console.log("\nMake sure you have a .env file with:");
    console.log(
      "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/databasename?retryWrites=true&w=majority"
    );
    return;
  }

  // Hide password for security
  const safeUri = uri.replace(/:([^:@]{3})[^:@]*@/, ":$1***@");
  console.log("📡 Connection string (password hidden):");
  console.log(safeUri);
  console.log();

  // Parse the connection string
  try {
    let dbName = "";

    // Extract database name from connection string
    const match = uri.match(/\.net\/([^?]+)/);
    if (match && match[1]) {
      dbName = match[1];
      console.log(`📂 Database specified in connection string: "${dbName}"`);
    } else {
      console.log("⚠️  No database specified in connection string");
      console.log("   Will use default database name");
    }

    // Check for common issues
    console.log("\n🔎 Checking for common issues:");

    if (dbName.includes(".")) {
      console.log("❌ PROBLEM FOUND: Database name contains a period (.)");
      console.log(`   Current database name: "${dbName}"`);
      console.log(`   Database names cannot contain: / \\ . " $ * < > : | ?`);
      console.log("\n💡 SOLUTION:");
      console.log("   Change your database name to something like: contactsDB");
      console.log("   Update your connection string to:");
      console.log(
        "   mongodb+srv://user:pass@cluster.mongodb.net/contactsDB?retryWrites=true&w=majority"
      );
    } else {
      console.log("✅ Database name looks good");
    }

    if (!uri.includes("mongodb+srv://") && !uri.includes("mongodb://")) {
      console.log(
        "❌ Connection string missing protocol (mongodb:// or mongodb+srv://)"
      );
    } else {
      console.log("✅ Connection protocol is correct");
    }

    if (!uri.includes("@")) {
      console.log("❌ Connection string missing @ symbol (credentials issue)");
    } else {
      console.log("✅ Connection string format looks correct");
    }
  } catch (err) {
    console.log("❌ Error parsing connection string:", err.message);
  }

  // Try to connect
  console.log("\n⏳ Attempting to connect to MongoDB...\n");

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    // Try to access a specific database
    const db = client.db("contactsDB");
    const collections = await db.listCollections().toArray();

    console.log(`\n📊 Database "contactsDB" info:`);
    console.log(`   Collections found: ${collections.length}`);

    if (collections.length > 0) {
      console.log("   Collection names:");
      for (const col of collections) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        console.log(`   - ${col.name} (${count} documents)`);

        // If this is the contacts collection, show a sample
        if (col.name === "contacts" && count > 0) {
          console.log("\n   📄 Sample contact:");
          const sample = await collection.findOne();
          console.log(
            "   ",
            JSON.stringify(sample, null, 2).replace(/\n/g, "\n   ")
          );
        }
      }
    } else {
      console.log(
        "   ⚠️  No collections found. Database is empty or doesn't exist yet."
      );
    }

    console.log("\n💡 NEXT STEPS:");
    console.log(
      "1. If no contacts collection exists, create it by adding a contact via POST"
    );
    console.log(
      '2. Make sure your API is using db("contactsDB").collection("contacts")'
    );
    console.log(
      "3. If contacts are in a different database, update your connection string"
    );
  } catch (error) {
    console.log("❌ Connection failed!");
    console.log("Error:", error.message);
    console.log("\n💡 TROUBLESHOOTING:");
    console.log("1. Check your username and password in the connection string");
    console.log(
      "2. Whitelist your IP address in MongoDB Atlas (Network Access)"
    );
    console.log("3. Make sure your cluster is active and running");
    console.log(
      "4. Verify the connection string is copied correctly from MongoDB Atlas"
    );
  } finally {
    if (client) {
      await client.close();
    }
  }

  console.log("\n" + "=".repeat(80));
}

checkConnection();
