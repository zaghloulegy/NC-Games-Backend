const db = require("../db/connection");

exports.selectReviewWithID = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((result) => {
      const review = result.rows;
      const secondQuery = db.query(
        "SELECT * FROM comments WHERE review_id = $1;",
        [review_id]
      );
      return Promise.all([secondQuery, review[0]]);
    })
    .then((results) => {
      const reviewRes = results[1];

      if (!reviewRes) {
        return Promise.reject({
          status: 404,
          msg: `No review found with review_id: ${review_id}`,
        });
      }
      const commentsCount = results[0].rowCount;
      reviewRes.comment_count = commentsCount;
      return reviewRes;
    });
};

exports.updateReviewVotes = (review_id, votes) => {
  if (typeof votes !== "number" && votes !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `The inc_votes value: '${votes}' is not a valid input!`,
    });
  }
  let newVotes = votes;
  if (votes === undefined) newVotes = 0;
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;",
      [newVotes, review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found with the review_id: ${review_id}`,
        });
      }
      return result.rows[0];
    });
};
