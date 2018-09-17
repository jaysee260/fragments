const mongoose = require("mongoose");
const { db:dbKeys } = require("../app.config.json");

const Database = {};

Database.Initialize = function(env = "dev") {
  mongoose.Promise = global.Promise;

  const options = { useNewUrlParser: true };
  const { connectionString } = env == "dev" ? dbKeys.local : dbKeys.remote;
  
  mongoose.connect(connectionString, options);
  const db = mongoose.connection;

  db.on("error", function(error) {
    console.log("Mongo connection error: %s", error);
    process.exit(1);
  });

  db.once("open", function() {
    console.log("Connection to %s database successful.", env == "dev" ? "local" : "remote");
  })
  
}

module.exports = { Database }