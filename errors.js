const handleRouter404s = (req, res, next) => {
  res.status(404).send({ message: "Path does not exist" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

const handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Unknown error" });
};

module.exports = { handleRouter404s, handleCustomErrors, handle500s };
