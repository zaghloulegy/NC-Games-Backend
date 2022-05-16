const express = require("express");
const app = express();
app.use(express.json());

const {
  getCategories
} = require("./controllers/categories.controller.js");


app.get("/api/categories", getCategories);

app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route is not found" });
})

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
