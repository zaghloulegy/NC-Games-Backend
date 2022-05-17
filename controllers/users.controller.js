const { selectUsers } = require("../models/users.model");

const getAllUsers = async (req, res, next) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};

module.exports = { getAllUsers };
