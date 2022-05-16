const { selectCategories } = require("../models/categories.model");

exports.getMessage = (req, res) => {
  res.status(200).send({ message: "all ok" });
};

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};
