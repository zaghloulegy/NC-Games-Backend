const express = require("express");
const app = express();
app.use(express.json());

const {
  getCategories,
  getMessage,
} = require("./controllers/categories.controller.js");


app.get("/api", getMessage);
app.get("/api/categories", getCategories);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "route is not found" });
});
app.use("/api", (err, req, res, next) => {
  console.log(err.code);
});
app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
