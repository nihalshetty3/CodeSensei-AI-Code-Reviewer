const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then((client) => {
    console.log("PostgreSQL connected");
    client.release();
  })
  .catch((err) => {
    console.error("PostgreSQL Connection Error:", err.message);
  });

module.exports = pool;