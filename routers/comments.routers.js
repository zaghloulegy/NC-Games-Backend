// const app = require("../app");
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/controllers");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
