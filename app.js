const express = require("express");
const cors = require("cors");


const {
  handleRouter404s,
  handleCustomErrors,
  handle500s,
} = require("./errors");

const apiRouter = require("./routers/api.routers");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleRouter404s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
