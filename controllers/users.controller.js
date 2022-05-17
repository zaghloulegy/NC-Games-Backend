const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  const { query } = req.query;
  selectUsers(query)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
