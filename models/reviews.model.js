const db = require("../db/connection");

const selectReviewById = async (review_id) => {
  if (/\d+$/.test(review_id)) {
    const { rows: review } = await db.query(
      "SELECT * FROM reviews WHERE review_id = $1",
      [review_id]
    );

    if (review.length === 0) {
      return Promise.reject({ status: 404, message: "Review not found" });
    }

    const { rows: commentsOnReview } = await db.query(
      "SELECT * FROM comments WHERE review_id = $1",
      [review_id]
    );

    review[0].comment_count = commentsOnReview.length;
    return review[0];
  } else {
    return Promise.reject({ status: 400, message: "Invalid Review Id" });
  }
};

const updateReviewById = async (review_id, inc_votes) => {
  await selectReviewById(review_id);
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 404,
      message: "Incorrect key passed for Patched",
    });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      message: "inc_votes need to be a number",
    });
  }

  const { rows: updatedReview } = await db.query(
    `UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING *;`,
    [inc_votes, review_id]
  );
  return updatedReview[0];
};

const selectReview = async (
  sort_by = "review_id",
  order = "DESC",
  category,
  limit = 5,
  page = 1
) => {
  const validColumns = [
    "review_id",
    "title",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];
  const validCategories = {
    eurogame: "euro game",
    socialdeduction: "social deduction",
    dexterity: "dexterity",
    childrensgame: "children''s game",
    strategy: "strategy",
    "hidden-roles": "hidden-roles",
    dexterity: "dexterity",
    "push-your-luck": "push-your-luck",
    "roll-and-write": "roll-and-write",
    "deck-building": "deck-building",
    "engine-building": "engine-building",
  };

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: "Invalid 'sort by' term. It does not exist",
    });
  }
  if (order) {
    if (order !== "ASC" && order !== "DESC") {
      return Promise.reject({ status: 400, message: "Invalid order declared" });
    }
  }

  let queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_img_url,
    reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id`;

  const queryValues = [];

  if (category) {
    if (validCategories[category]) {
      queryStr += ` WHERE reviews.category = $1`;
      queryValues.push(validCategories[category]);
    } else {
      return Promise.reject({
        status: 400,
        message: "Invalid category declared",
      });
    }
  }

  queryStr += ` GROUP BY reviews.review_id`;
  queryStr += ` ORDER BY ${sort_by} ${order}`;

  const offset = (page - 1) * limit;

  if (queryValues.length > 0) {
    queryValues.push(limit);

    queryStr += ` LIMIT $2 `;
    if (page) {
      queryValues.push(offset);
      queryStr += `OFFSET $3`;
    }
  } else {
    queryValues.push(limit);
    queryValues.push(offset);
    queryStr += ` LIMIT $1 OFFSET $2`;
  }

  const { rows: reviews } = await db.query(queryStr, queryValues);

  return reviews;
};

const selectCommentsByReviewId = async (review_id) => {
  await selectReviewById(review_id);

  let queryStr = `SELECT * FROM comments WHERE review_id = $1`;
  const queryValues = [review_id];
  const { rows: comments } = await db.query(queryStr, queryValues);
  comments.forEach((comment) => {
    delete comment.review_id;
  });
  return comments;
};

const addComment = async (review_id, username, body) => {
  await selectReviewById(review_id);

  if (typeof username !== "string") {
    return Promise.reject({
      status: 400,
      message: "Invalid username key or value",
    });
  } else if (typeof body !== "string") {
    return Promise.reject({
      status: 400,
      message: "Invalid body key or value",
    });
  }
  let queryStr = `INSERT INTO comments
        (author, review_id, votes, created_at, body)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING*`;
  const queryValues = [username, review_id, 0, new Date(), body];
  const { rows: addedComment } = await db.query(queryStr, queryValues);
  delete addedComment[0].review_id;
  return addedComment[0];
};
module.exports = {
  updateReviewById,
  selectReviewById,
  selectReview,
  selectCommentsByReviewId,
  addComment,
};