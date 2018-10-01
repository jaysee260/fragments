// Import Application dependencies
const express = require("express");
const path = require("path");

// Initialize Application instance
const app = express();

// Import Environment related variables
const { PORT:port = 8000 } = process.env;
const { NODE_ENV:env = "dev" } = process.env;

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

// Import reference to Database.
// Database will be initialized once Application starts
const { Database } = require("./db");

///////////////// <Routes> //////////////////////

function RegisterRoutes(app) {
  // Declare static routes
  app.use("/", express.static( path.join(__dirname, "views", "home") ));
  
  // Register routes
  const MasterRouter = require("express").Router();
  
  require("./controllers")
    .ApplicationControllers(MasterRouter);
  
  app.use("/", MasterRouter);
}

///////////////// </Routes> //////////////////////

// Start the Application.
(function Start(env, app, port){

  ConfigureAppMiddleware(app, env);
  RegisterRoutes(app);
  Database.Initialize(env);

  // Start server on specified port.
  app.listen(port, () => {
    console.log("Application running on http://localhost:%s", port);
    console.log("Use Ctrl + C to end the process."); 
  });

})(env, app, port);


