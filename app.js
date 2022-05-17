const express = require("express");
const app = express();
app.use(express.json());

const { getCategories } = require("./controllers/categories.controller.js");
const {
  getReviewWithID,
  patchReviewVotes,
} = require("./controllers/reviews.controller.js");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewWithID);
app.patch("/api/reviews/:review_id", patchReviewVotes);


app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route is not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.msg );
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send("Invalid request input!");
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
