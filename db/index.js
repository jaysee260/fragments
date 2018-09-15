const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/";
const dbName = "fragments";

const Database = {};

Database.Initialize = function() {
  mongoose.Promise = global.Promise;

  const options = { useNewUrlParser: true };
  const connectionString = url + dbName;
  mongoose.connect(connectionString, options);

  const db = mongoose.connection;

  db.once("open", function() {
    console.log("Connection to %s established", connectionString);
  })
}

module.exports = { Database }