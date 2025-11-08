const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.temples = require("./temple.model.js")(mongoose);
db.contacts = require("./contact.js")(mongoose); // Add this line

module.exports = db;
