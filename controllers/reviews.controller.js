const {
  selectReviewWithID,
  updateReviewVotes,
} = require("../models/reviews.model");

exports.getReviewWithID = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewWithID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewVotes(review_id, inc_votes)
    .then((review) => {
    
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
