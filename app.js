const express = require("express");
const app = express();
app.use(express.json());

const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
  deleteCommentById,
  getCategories,
  getAllUsers,
  getEndPoints,
} = require("./controllers/controllers");


app.get("/api", getEndPoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
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
