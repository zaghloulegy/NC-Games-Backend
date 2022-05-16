const { selectCategories } = require("../models/categories.model");
const res = require("express/lib/response");
const { param } = require("../app.js");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};
