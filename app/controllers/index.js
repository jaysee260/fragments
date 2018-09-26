const fragments = require("express").Router();

require("./fragments")(fragments);

function ApplicationControllers(router) {
  
  router.use("/api/fragments", fragments);

}

module.exports = { ApplicationControllers };