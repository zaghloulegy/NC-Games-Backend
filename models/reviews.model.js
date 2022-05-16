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