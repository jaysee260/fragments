const fragmentsRouter = require("express").Router();

require("./fragments")(fragmentsRouter);

function ApplicationControllers(router) {

  router.use("/api/fragments", fragmentsRouter);

}

module.exports = { ApplicationControllers };