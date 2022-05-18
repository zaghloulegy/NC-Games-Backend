const express = require("express");
const app = express();
app.use(express.json());

const { getCategories } = require("./controllers/categories.controller.js");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
} = require("./controllers/reviews.controller.js");

const { getAllUsers } = require("./controllers/users.controller.js");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/users", getAllUsers);


const {
  handleRouter404s,
  handleCustomErrors,
  handle500s,
} = require("./errors");

app.use(handleRouter404s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
