const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Just try a simple query once to confirm startup
db.query("SELECT 1")
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

// Prevent unexpected PG errors from crashing the app
db.on("error", (err) => {
  console.error("⚠️ Unexpected PostgreSQL error:", err);
});

module.exports = db;
