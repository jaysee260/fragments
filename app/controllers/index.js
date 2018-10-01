// Instantiate path specific Routers
const apiRouter = require("express").Router();

// Attach business logic to Routers
require("./api")(apiRouter);

// Catalog of Application Routes
function ApplicationControllers(router) {

  router.use("/api", apiRouter);

}

module.exports = { ApplicationControllers };