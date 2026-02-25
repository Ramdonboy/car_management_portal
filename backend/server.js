const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* -------- MIDDLEWARE -------- */
app.use(cors());
app.use(express.json());

/* test for db ios connected proper and working well*/ 
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Database connected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* -------- REGISTER API -------- */


app.post("/api/register", async (req, res) => {
  try {
   let { name, email, phone, password } = req.body;

    // ✅ safe trim
    name = name?.trim();
    email = email?.trim();
    phone = phone?.trim();
    password = password?.trim();


    // ✅ MySQL syntax
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    await pool.query(
  "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
  [name, email, phone, password, "user"]
);

    

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- LOGIN API -------- */
app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();
   console.log("LOGIN INPUT:",email,password);
   const [checkEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("EMAIL QUERY RESULT:", checkEmail);
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role, // 👈 IMPORTANT
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* -------- SERVER -------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
