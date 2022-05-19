const app = require("../app");

const apiRouter = require("express").Router();

const categoriesRouter = require("../routers/categories.routers");

const commentsRouter = require("../routers/comments.routers");

const reviewsRouter = require("../routers/reviews.routers");

const usersRouter = require("../routers/users.routers");

module.exports = apiRouter;