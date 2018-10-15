const mongoose = require("mongoose");
const { db:dbKeys } = require("../../app.config.json");

const Database = {};

Database.Initialize = function(target_db) {
  mongoose.Promise = global.Promise;

  const options = { useNewUrlParser: true };
  const { connectionString } = target_db == "dev" ? dbKeys.local : dbKeys.remote;
  
  mongoose.connect(connectionString, options);
  const db = mongoose.connection;

  db.on("error", function(error) {
    console.log("Mongo connection error: %s", error);
    process.exit(1);
  });

  db.once("open", function() {
    console.log("Connection to %s database successful.", target_db == "dev" ? "local" : "remote");
  })
  
}

module.exports = { Database }