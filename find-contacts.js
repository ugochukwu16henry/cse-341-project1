const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

async function findContacts() {
  const uri = process.env.MONGODB_URI;
  let client;

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    // First, let's check what the connection string looks like
    console.log("🔍 Checking connection details...\n");

    // Try to get the default database from the connection string
    const url = new URL(
      uri.replace("mongodb+srv://", "http://").replace("mongodb://", "http://")
    );
    const defaultDb = url.pathname.substring(1).split("?")[0];
    console.log(`📌 Default database from connection string: "${defaultDb}"\n`);

    // List all databases (with error handling)
    let databases;
    try {
      const adminDb = client.db().admin();
      databases = await adminDb.listDatabases();
    } catch (err) {
      console.log(
        "⚠️  Cannot list all databases (might need admin privileges)"
      );
      console.log("   Checking default database only...\n");
      databases = { databases: [{ name: defaultDb || "contactsDB" }] };
    }

    console.log("🗄️  SEARCHING ALL DATABASES FOR YOUR CONTACTS:\n");
    console.log("=".repeat(80));

    let foundContacts = false;

    // Search each database
    for (const dbInfo of databases.databases) {
      const dbName = dbInfo.name;

      // Skip system databases
      if (dbName === "admin" || dbName === "local" || dbName === "config") {
        continue;
      }

      console.log(`\n📂 Database: ${dbName}`);
      const db = client.db(dbName);

      // List all collections in this database
      const collections = await db.listCollections().toArray();

      for (const collInfo of collections) {
        const collName = collInfo.name;
        const collection = db.collection(collName);
        const count = await collection.countDocuments();

        console.log(`  📁 Collection: ${collName} (${count} documents)`);

        // Check if this collection has contacts with the structure we expect
        if (count > 0) {
          const sample = await collection.findOne();

          // Check if it looks like a contact
          if (sample.firstName && sample.lastName && sample.email) {
            console.log(`  ✅ FOUND CONTACTS HERE!`);
            console.log(
              `  🎯 Database: "${dbName}" | Collection: "${collName}"\n`
            );

            foundContacts = true;

            // Show all contacts in this collection
            const allContacts = await collection.find().toArray();
            console.log("  📄 Contacts found:");
            allContacts.forEach((contact, idx) => {
              console.log(
                `    ${idx + 1}. ${contact.firstName} ${
                  contact.lastName
                } (_id: ${contact._id})`
              );
            });
            console.log();
          }
        }
      }
    }

    console.log("=".repeat(80));

    if (foundContacts) {
      console.log("\n💡 SOLUTION:");
      console.log(
        "Update your code to use the correct database and collection names shown above."
      );
      console.log("\nIn your controllers/contacts.js file, change:");
      console.log("  .db('contactsDB')  ← Wrong");
      console.log("  .collection('contacts')  ← Verify this too");
      console.log("\nTo match the database/collection names shown above.");
    } else {
      console.log("\n❌ NO CONTACTS FOUND in any database!");
      console.log("\n💡 POSSIBLE REASONS:");
      console.log("1. You might be connected to a different MongoDB cluster");
      console.log(
        "2. The contacts were added to MongoDB Compass/Atlas but not saved"
      );
      console.log(
        "3. The connection string in .env might be different from where you added contacts"
      );
      console.log("\n📝 NEXT STEPS:");
      console.log(
        "1. Check which MongoDB cluster you're viewing in MongoDB Atlas"
      );
      console.log("2. Verify your MONGODB_URI in .env matches that cluster");
      console.log("3. Or, add contacts using your API: POST /contacts");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (client) {
      await client.close();
      console.log("\n🔌 Connection closed");
    }
  }
}

findContacts();
