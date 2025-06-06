require("dotenv").config({ path: require("path").resolve(__dirname, ".env") }); // Load environment variables from .env file

const { Pool } = require("pg");

// Validate environment variables before creating pool
if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST ||
  !process.env.DB_NAME ||
  !process.env.DB_PORT
) {
  console.log(process.env);
  throw new Error("❌ Missing required environment variables");
}

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD, // No default for security
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Test connection
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  });

module.exports = pool;
