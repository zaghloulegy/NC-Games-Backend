const { Pool } = require('pg');
// const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
console.log(process.env.DATABASE_URL);
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};
module.exports = new Pool(config);
// module.exports = new Pool();
