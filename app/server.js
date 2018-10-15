// Import Application dependencies
const express = require("express");
const path = require("path");

// Initialize Application instance
const app = express();

// Import Environment related variables
const { PORT:port = 8000 } = process.env;             // if no value is specified, default to port 8000
const { NODE_ENV:env = "dev" } = process.env;         // if no value is specified, default to "dev"
const { TARGET_DB:target_db = "dev" } = process.env;  // default connection to dev db if not explicitly specified

///////////////// <Middleware> //////////////////////

// Declare middleware to be configured upon Application start.
function ConfigureAppMiddleware(app, env) {
  const bodyParser = require("body-parser");
  const favicon = require("serve-favicon");

  if (env === "dev") {
    const logger = require("morgan");
    app.use(logger("dev"));
  }

  app.use(favicon( path.join(__dirname, "public", "favicon.ico") ));
  app.use(express.static( path.join(__dirname, "public") ));
  app.use( express.static( path.join(__dirname, "views") ));
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}

///////////////// </Middleware> //////////////////////

///////////////// <Database> //////////////////////

// Import reference to Database.
// Database connection will be initialized once application starts
const { Database } = require("./db");

///////////////// </Database> //////////////////////

///////////////// <Routes> //////////////////////

function RegisterRoutes(app) {
  // Declare static routes
  app.use("/", express.static( path.join(__dirname, "views", "home") ));
  
  const MasterRouter = require("express").Router();
  
  // Attach API business logic to MasterRouter (by reference)
  require("./controllers")
    .ApplicationControllers(MasterRouter);
  
  // Use MasterRouter to route all requests coming through root endpoint
  app.use("/", MasterRouter);
}

///////////////// </Routes> //////////////////////

// Start the Application.
(function Start(env, app, port, target_db){

  ConfigureAppMiddleware(app, env);
  RegisterRoutes(app);
  Database.Initialize(target_db);

  // Start server on specified port.
  app.listen(port, () => {
    console.log("Application running on http://localhost:%s", port);
    console.log("Use Ctrl + C to end the process."); 
  });

})(env, app, port, target_db);


