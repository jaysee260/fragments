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
  const hbs = require("express-handlebars");

  if (env === "dev") {
    const logger = require("morgan");
    app.use(logger("dev"));
  }

  app.use(favicon( path.join(__dirname, "public", "favicon.ico") ));
  app.use(express.static( path.join(__dirname, "public") ));
  app.use( express.static( path.join(__dirname, "views") ) );
  // app.use("/", express.static( path.join(__dirname, "views", "home") ));
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  let engineSettings = {};
  engineSettings.extname = "hbs";
  engineSettings.defaultLayout = "layout";
  engineSettings. layoutsDir = path.join(__dirname, "views", "shared");
  app.engine("hbs", hbs(engineSettings));
  app.set("views", path.join( __dirname, "views" ));
  app.set("view engine", "hbs");

}

// Import reference to Database.
// Database will be initialized once Application starts
const { Database } = require("./db");

///////////////// <Routes> //////////////////////

// Declare Routes to be registered upon Application start.
function RegisterRoutes(app) {
  const home = path.join(__dirname, "views", "home");
  const Fragment = require("./models/Fragments");

  app.get("/webtest", (req, res) => {
    res.render("webtest");
  });

  /**
   * @method GET
   * @name /
   * @description
   * Home Route.
   */
  app.get("/", (req, res) => {    
    // res.sendFile("index.html", { root: home });
    res.render("home");
  });

  /**
   * @method GET
   * @name /api/fragments/health
   * @description
   * Fragments API health check route.
   */
  app.get("/api/fragments/health", (req, res) => {
    res.status(200).send(true);
  });

  app.post("/api/fragments/test", (req, res) => {
    let body = req.body;
    console.log("Got this from the client");
    console.log(body);
    res.json(body);
  })
  
  /**
   * @method GET
   * @name /api/fragments
   * @description
   * Returns all available fragments
   */
  app.get("/api/fragments", async (req, res) => {
  
    try {
  
      // Get all fragments from DB.
      let fragments = await Fragment.find({});
      
      if (fragments.length === 0) {
  
        // If no fragments have been created yet,
        // notify client and show how a fragment
        // should be structured.
        let model = require("mongoose").model("Fragment").schema.obj;
  
        res.status(404).json({
          message: "No fragments have been created yet.",
          status: "NOT FOUND",
          suggestion: "You can create fragments by making a POST request to /api/fragments",
          model,
          fragments
        });
  
      } else {
  
        // Otherwise, return all available fragments.
        res.status(200).json({
          status: "SUCCESS",
          count: fragments.length,
          fragments
        });
  
      }
      
    } catch (dbError) {
  
      // If an error occurs while trying to retrieve all fragments,
      // notify client of error and log dbError in server console.
  
      // Have not run into the situation yet so will handle it as we go.
      let message = "Something wen't wrong while trying to retrieve all fragments";
      console.log(message);
      console.log(dbError);
  
      res.status(500).json({
        message,
        status: "INTERNAL SERVER ERROR",
        suggestion: "Check the server console."
      })
    }
  
  });
  
  /**
   * @method GET
   * @name /api/:fragment_id
   * @description
   * Finds and returns a fragment by _id.
   */
  app.get("/api/:fragment_id", async (req, res) => {
    // check for _id
    // do stuff
  });
  
  /**
   * @method POST
   * @name /api/fragments
   * @description
   * Creates a new Fragment object
   * and saves it into the database.
   */
  app.post("/api/fragments", async (req, res) => {
      // Grab payload from request's body
      let data = req.body;
  
      // Check for empty payload
      if (Object.keys(data).length === 0) {
          // If empty terminate response with 
          // 400 - Bad Request status code.
          res.status(400).json({
            message: "Request body cannot be empty.",
            status: "BAD REQUEST"
          });
  
      } else {
          // Otherwise attempt to store fragment in DB.
          let fragment;
          try {

            fragment = await Fragment.create(data);
            
            // End response with 200 - OK status code 
            res.status(200).json({
              message: "Fragment created.",
              status: "SUCCESS",
              fragment
            });
  
          } catch (dbError) {
  
            // If fragment creation and storage fails,
            // notify client but DON'T end process.          
            res.status(400).json({
              status: "BAD REQUEST",
              error: {
                message: dbError._message,
                kind: dbError.name,
                reason: dbError.errors.body.message
              }
            });
  
          }
      }
      
  });
  
  /**
   * @method PUT
   * @name /api/:fragment_id
   * @description
   * Updates fragment of given _id
   */
  app.put("/api/:fragment_id", async (req, res) => {
    // check for _id
    // do stuff
    const { fragment_id } = req.params;

    // check if _id was provided
    if (fragment_id == "null" || fragment_id == "undefined") {

      res.status(400).json({
        error: {
          message: "No _id provided.",
          status: "BAD REQUEST",
          reason: "fragment _id was null or undefined",
          prvided_id: fragment_id
        }
      });

    } else {

      // Attempt to query to DB with provided _id value
      try {

        // Fetch fragment from DB.
        const result = await Fragment.findById(fragment_id);

        // Check if result was found and handle response accordingly.
        if (!result) {

          res.status(404).json({
            message: "Fragment not found. It's possible it might not exist.",
            status: "NOT FOUND",
            fragment: result
          });

        } else {

          // return fragment

        }
        
      } catch (dbError) {
        // Notify client if provided _id value was invalid
        console.log(dbError);
        res.send(dbError);

        res.status(500).json({
          message: "The provided _id caused an error while attempting to lookup fragment."
        });
      }

    }
  });
  
  /**
   * @method DELETE
   * @name /api/:fragment_id
   * @description
   * Deletes fragment of given _id
   */
  app.delete("/api/fragments/:fragment_id", async (req, res) => {
    
    
    const { fragment_id } = req.params;

    // check if an _id was provided
    if (fragment_id == "null" || fragment_id == "undefined") {

      res.status(400).json({
        error: {
          message: "No _id provided.",
          status: "BAD REQUEST",
          reason: "fragment_id was null or undefined",
          prvided_id: fragment_id
        }
      });

    } else {

      // Attempt to delete fragment with provided _id value
      try {

        // Delete fragment from DB.
        const result = await Fragment.deleteOne({ _id: fragment_id });

        // Check if DELETE operation succeeded and handle response accordingly.
        if (result.n == 0) {

          res.status(404).json({
            message: "Fragment not found. It's possible it might not exist.",
            status: "NOT FOUND",
            fragment_id
          });

        } else {

          // Notify client of successful delete.
          if (result.ok == 1) {

            res.status(200).json({
              message: "Fragment deleted",
              status: "SUCCESS",
              count: result.n,
              fragment_id
            });
            
          } else {

            /**
             * If a delete operation is successful, result.ok will equal 1.
             * If a delete operation fails, the catch block will handle the exception.
             * Therefore, it's likely THIS else block will NEVER run because, as already
             * stated, if the delete operation succeeds, result.ok should not be any value
             * other than 1. However, I'm adding this block just in case an unforeseen
             * situation is ever encountered which causes this block to run.
             * @author Juan C. Gonzalez
             */
            res.status(500).json({
              message: "Something went wrong... Something unforeseen happened!",
              status: "INTERNAL SERVER ERROR"
            });

          }

        }
        
      } catch (dbError) {

        // Notify client if provided _id value was invalid
        res.status(500).json({
          message: "The provided _id caused an error during DELETE operation.",
          status: "INTERNAL SERVER ERROR",
          reason: "The provided fragment_id may be invalid.",
          provided_fragment_id: {
            value: fragment_id,
            type: typeof fragment_id
          },
          expected: dbError.kind
        });

      }

    }

  });
  
  app.get("*", (req, res) => {
    let message = "That page doesn't exist. Try going <a href='/'>here</a>"
    res.status(404).send(message);
  });

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


