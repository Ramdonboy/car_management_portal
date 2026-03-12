const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "rentacar_secret";
/* -------- MIDDLEWARE -------- */
app.use(cors());
app.use(express.json());

// jwt middleware 

function verifyToken(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({message: "Token missing"});
  }

  const token = authHeader.split(" ")[1];
  console.log(req.headers.authorization);

  try{
    const decoded = jwt.verify(token, SECRET_KEY);

    req.userid = decoded.userid;

    next();

  }catch(err){
    return res.status(401).json({message: "Invalid token"})

  }
}

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
    const user = rows[0];

    // create jwt 
    const token = jwt.sign(
      { userid: user.id},
      SECRET_KEY,
      { expiresIn: "2d" }
    );


    res.json({
      message: "Login successful",
      token: token,
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

app.get("/api/profile", verifyToken, async (req , res) =>{
  try{
    const userid = req.userid;
    const [rows] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userid]
    );

    if(rows.length === 0){
      return res.status(404).json({ message: "User not found"});
    }
    res.json({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      phone: rows[0].phone
    });


  }catch{
    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

} );
// update profile 

app.put("/api/updateprofile", verifyToken, async (req, res) => {
  try {

    const userid = req.userid;
    const { fullName, phone } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ message: "Name and phone required" });
    }

    await pool.query(
      "UPDATE users SET name = ?, phone = ? WHERE id = ?",
      [fullName, phone, userid]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
});

/* -------- SERVER -------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
