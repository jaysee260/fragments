
const fragmentsRouter = require("express").Router();

require("./fragments")(fragmentsRouter);

function API(router) {

    router.use("/fragments", fragmentsRouter);

}

module.exports = API;