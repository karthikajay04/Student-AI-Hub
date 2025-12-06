const pg = require("pg");
require("dotenv").config(); // Load env vars for standalone usage and ensure they are present

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,

});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

module.exports = db;
