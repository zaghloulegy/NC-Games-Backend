const { selectCategories } = require("../models/categories.model");

const getCategories = async (req, res) => {
  const categories = await selectCategories();
  res.status(200).send({ categories });
};

module.exports = { getCategories };
