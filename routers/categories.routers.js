const express = require("express");
const app = express();
app.use(express.json());
const categoriesRouter = require("express").Router();

const {
  getCategories,
  getReviewById,
  patchReviewById,
  getAllUsers,
} = require("../controllers/controllers");

categoriesRouter.route("/").get(getCategories);



app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/users", getAllUsers);

app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route is not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.msg);
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




module.exports = categoriesRouter; 