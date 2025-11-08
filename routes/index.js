const routes = require("express").Router();
const contact = require("./contacts");

routes.use("/", require("./swagger"));
routes.use("/contacts", contact);
routes.use(
  "/",
  (docData = (req, res) => {
    let docData = {
      documentationURL: "https://nathanbirch.github.io/nathan-byui-api-docs",
    };
    res.send(docData);
  })
);

module.exports = routes;
