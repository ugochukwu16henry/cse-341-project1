const { getDatabase } = require("../db/connect");

const db = {};

db.getCollection = (collectionName) => {
  return getDatabase().collection(collectionName);
};

module.exports = db;
