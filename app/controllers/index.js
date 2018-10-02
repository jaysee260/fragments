// Instantiate path specific Routers
const apiRouter   = require("express").Router();
const notFound    = require("express").Router();

// Attach business logic to Routers (by reference)
require("./api")(apiRouter);
require("./notFound")(notFound);

// Catalog of Application Routes
function ApplicationControllers(router) {

  router.use("/api", apiRouter);

  router.use("*", notFound);

}

module.exports = { ApplicationControllers };