const fs = require("fs/promises");

const {
  selectReviewById,
  updateReviewById,
  selectReview,
  selectCommentsByReviewId,
  addComment,
  removeCommentById,
  selectUsers,
  selectCategories,
  selectEndPoints,
} = require("../models/models");

const getReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await selectReviewById(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

const patchReviewById = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const { review_id } = req.params;
    const updatedReview = await updateReviewById(review_id, inc_votes);
    res.status(201).send({ updatedReview });
  } catch (err) {
    next(err);
  }
};

const getReviews = async (req, res, next) => {
  try {
    let { sort_by, order, category, limit, page } = req.query;
    if (order) order = order.toUpperCase();
    const reviews = await selectReview(sort_by, order, category, limit, page);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

const getCommentsByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comments = await selectCommentsByReviewId(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

const postCommentByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { username, body } = req.body;
    const addedComment = await addComment(review_id, username, body);
    res.status(201).send({ addedComment });
  } catch (err) {
    next(err);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await removeCommentById(comment_id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};

const getCategories = async (req, res) => {
  const categories = await selectCategories();
  res.status(200).send({ categories });
};

const getEndPoints = async (req, res, next) => {
  const endPoints = await fs.readFile("./endpoints.json", "utf-8");
  res.status(200).send(JSON.parse(endPoints));
};

module.exports = {
  getReviewById,
  getAllUsers,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
  deleteCommentById,
  getCategories,
  getEndPoints,
};
