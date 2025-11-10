const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ObjectId } = require("mongodb");

async function debugDatabase() {
  const uri = process.env.MONGODB_URI;
  let client;

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("contactsDB");
    const collection = db.collection("contacts");

    // 1. Check total documents
    const count = await collection.countDocuments();
    console.log(`📊 Total contacts in database: ${count}\n`);

    // 2. Fetch all documents
    console.log("📄 All contacts in database:");
    console.log("=".repeat(80));
    const allContacts = await collection.find().toArray();

    if (allContacts.length === 0) {
      console.log("❌ No contacts found! Database is empty.");
    } else {
      allContacts.forEach((contact, index) => {
        console.log(`\nContact ${index + 1}:`);
        console.log(JSON.stringify(contact, null, 2));
      });
    }

    console.log("\n" + "=".repeat(80));

    // 3. Test specific ID lookup
    console.log("\n🔍 Testing ID lookups:");
    const testIds = [
      "690673ba6d74c47c1a4139bc",
      "6906745d6d74c47c1a4139be",
      "6906746e6d74c47c1a4139bf",
    ];

    for (const id of testIds) {
      console.log(`\nTesting ID: ${id}`);

      // Check if valid ObjectId
      if (!ObjectId.isValid(id)) {
        console.log("  ❌ Invalid ObjectId format");
        continue;
      }

      try {
        const contact = await collection.findOne({ _id: new ObjectId(id) });
        if (contact) {
          console.log(`  ✅ Found: ${contact.firstName} ${contact.lastName}`);
        } else {
          console.log("  ❌ Not found with this ID");
        }
      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
      }
    }

    // 4. Check for duplicate 'id' field
    console.log('\n\n🔎 Checking for duplicate "id" field issue:');
    const withIdField = await collection
      .find({ id: { $exists: true } })
      .toArray();
    if (withIdField.length > 0) {
      console.log(
        '⚠️  WARNING: Found documents with "id" field (without underscore)'
      );
      console.log(
        '   This might cause confusion. MongoDB uses "_id" by default.'
      );
      console.log(`   Affected documents: ${withIdField.length}`);
    } else {
      console.log('✅ No duplicate "id" field found. Good!');
    }

    // 5. Test DELETE operation
    console.log("\n\n🗑️  Testing DELETE capability:");
    console.log("Creating a test contact to delete...");

    const testContact = {
      firstName: "Test",
      lastName: "User",
      email: "test@delete.com",
      favoriteColor: "yellow",
      birthday: "2000-01-01",
    };

    const insertResult = await collection.insertOne(testContact);
    const testId = insertResult.insertedId;
    console.log(`✅ Test contact created with ID: ${testId}`);

    // Try to delete it
    const deleteResult = await collection.deleteOne({ _id: testId });
    if (deleteResult.deletedCount > 0) {
      console.log("✅ DELETE operation works correctly!");
    } else {
      console.log("❌ DELETE operation failed!");
    }

    // 6. Final recommendations
    console.log("\n\n💡 RECOMMENDATIONS:");
    console.log("=".repeat(80));

    if (allContacts.length === 0) {
      console.log("1. Your database appears empty. Add contacts first.");
      console.log(
        "2. Make sure you're connecting to the right database (contactsDB)."
      );
      console.log(
        "3. Check if contacts are in a different collection or database."
      );
    } else {
      console.log("1. ✅ Database has contacts");
      console.log("2. ✅ Connection is working");
      console.log("3. Check your API controller code:");
      console.log(
        "   - Ensure you're using db('contactsDB').collection('contacts')"
      );
      console.log(
        "   - Verify ObjectId conversion: new ObjectId(req.params.id)"
      );
      console.log("4. Test your API with the actual _id values from above");
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

debugDatabase();
