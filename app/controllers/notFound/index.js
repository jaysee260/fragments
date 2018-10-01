function NotFound(router) {

    router.get("/", (req, res) => {
        res.send("That page doesn't exist. Try going <a href='/'>here</a>.");
    });
}

module.exports = NotFound;