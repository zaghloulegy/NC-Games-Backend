const app = require("../app");

const { getEndPoints } = require("../controllers/controllers");

const categoriesRouter = require("./categories.routers");

const commentsRouter = require("./comments.routers");

const reviewRouter = require("./review.routers");

const usersRouter = require("./users.routers");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndPoints);

apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
