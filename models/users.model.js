const db = require("../db/connection");

const selectUsers = async () => {
  const { rows: users } = await db.query(`SELECT username FROM users`);
  return users;
};

module.exports = { selectUsers };
