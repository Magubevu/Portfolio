require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Initialize database table
async function initializeDatabase() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected successfully");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Database table ready");
  } catch (err) {
    console.error("❌ Database initialization error:", err.stack);
    process.exit(1);
  }
}

//root route handle

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index1.html"));
});

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Contact form endpoint
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// Start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  });
