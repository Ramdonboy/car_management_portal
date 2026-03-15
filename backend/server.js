const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const SECRET_KEY = "rentacar_secret";


/* -------- MIDDLEWARE -------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// multer for create and place image to the folder name uploads 
const storage = multer.diskStorage({

destination: function(req,file,cb){

cb(null,"uploads/car_image");

},

filename: function(req,file,cb){

const uniqueName = Date.now() + "-" + file.originalname;

cb(null,uniqueName);

}

});

// config multer for license



const licenseStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/license");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }

});

const uploadLicense = multer({
  storage: licenseStorage,
  fileFilter: (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }

  }
});


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


const carStorage = multer.diskStorage({

  destination: function(req, file, cb){

    if(file.fieldname === "car_image"){
      cb(null, "uploads/car_image");
    }
    else if(file.fieldname === "rc_book"){
      cb(null, "uploads/rc_book");
    }
    else{
      cb(null, "uploads");
    }

  },

  filename: function(req, file, cb){

    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);

  }

});

const fileFilter = (req,file,cb)=>{

const allowedTypes = /jpeg|jpg|png/;

const extname = allowedTypes.test(
path.extname(file.originalname).toLowerCase()
);

const mimetype = allowedTypes.test(file.mimetype);

if(extname && mimetype){
return cb(null,true);
}else{
cb(new Error("Only image files allowed"));
}

};
const uploadCarImage = multer({
  storage: carStorage,
  fileFilter: fileFilter
});



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


app.post("/api/register", uploadCarImage.single("license"),async (req, res) => {
  try {
   let { name, email, phone, password } = req.body;

    //  safe trim
    name = name?.trim();
    email = email?.trim();
    phone = phone?.trim();
    password = password?.trim();


    //  MySQL syntax
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    await pool.query(
  "INSERT INTO users (name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
  [name, email, phone, password, "user", "approved"]
);
    

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// register onwer 

app.post("/api/register/owner",
uploadLicense.single("license"),
async (req,res)=>{

try{

const { name,email,address,phone,password, } = req.body;

if(!req.file){
return res.status(400).json({message:"License image required"});
}

const licenseImage = req.file.filename;

const [userResult] = await pool.query(
"INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
[name, email, phone, password, "owner"]
);

/* 2️⃣ Get inserted user id */
const userId = userResult.insertId;

/* 3️⃣ Insert into owners */
await pool.query(
"INSERT INTO owners (owner_id, address, license_image) VALUES (?, ?, ?)",
[userId, address, licenseImage]
);

res.json({message:"Owner registration submitted"});

}catch(err){
console.error(err);
res.status(500).json({message:"Server error"});
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
      "SELECT id, name, email, role, status FROM users WHERE email = ? AND password = ?",
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
        status: rows[0].status,
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

//view car details for owner (all  details)

app.get("/api/view/car", async (req, res)=>{
  try{
    

    const [rows] =  await pool.query(
      "SELECT * FROM cars"
    );

    if (rows.length === 0) return res.status(404).json({ message: "No owner found" });

    res.json(rows);


  }catch(err){
    console.error(err);
    res.status(500).json({ message: "server error "})
  }
});
// owner add car (owner)

app.post(
"/api/add/car",
verifyToken,
uploadCarImage.fields([
  { name: "car_image", maxCount: 1 },
  { name: "rc_book", maxCount: 1 }
]),
async (req, res) => {

try {

const userid = req.userid;

const { reg_number, name, type, fuel, transmission, seats, price_per_day, status } = req.body;

const carImage = req.files.car_image ? req.files.car_image[0].filename : null;
const rcBook = req.files.rc_book ? req.files.rc_book[0].filename : null;

const [existing] = await pool.query(
"SELECT * FROM cars WHERE reg_number = ?",
[reg_number]
);

if (existing.length > 0) {
return res.status(400).json({ message: "Car already exists" });
}

await pool.query(
`INSERT INTO cars 
(owner_id, reg_number, name, type, fuel, transmission, seats, price_per_day, status, image, rc_book) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
[
userid,
reg_number,
name,
type,
fuel,
transmission,
seats,
price_per_day,
status,
carImage,
rcBook
]
);

res.status(201).json({ message: "Car added successfully" });

} catch (err) {

console.error("Add car error:", err);
res.status(500).json({ message: "Server error" });

}

});

// view car details (owner)

app.get("/api/view/owner/cars", verifyToken, async (req, res) => {

  try {

    const ownerId = req.userid;

    const [rows] = await pool.query(
      "SELECT * FROM cars WHERE owner_id = ?",
      [ownerId]
    );

    res.json(rows);

  } catch (err) {

    console.error("Fetch owner cars error:", err);
    res.status(500).json({ message: "Server error" });

  }

});

// update the car details from the id (owner)


app.put("/update-car/:id", verifyToken, (req,res)=>{

const carId = req.params.id;
const ownerId = req.userId;

const {name,fuel,seats,price_per_day} = req.body;

const sql = `
UPDATE cars
SET name=?, fuel=?, seats=?, price_per_day=?
WHERE car_id=? AND owner_id=?
`;

db.query(sql,
[name,fuel,seats,price_per_day,carId,ownerId],
(err,result)=>{

 if(err) return res.json(err);

 if(result.affectedRows === 0){
  return res.json({message:"Not authorized"});
 }

 res.json({message:"Car updated successfully"});

});

});

// delete the car using car id (admin, owner )
app.delete("/delete-car/:id", verifyToken, (req,res)=>{

const carId = req.params.id;
const ownerId = req.userId;

const sql = `
DELETE FROM cars
WHERE car_id=? AND owner_id=?
`;

db.query(sql,[carId,ownerId],(err,result)=>{

 if(err) return res.json(err);

 if(result.affectedRows === 0){
  return res.json({message:"Not authorized"});
 }

 res.json({message:"Car deleted successfully"});

});

});

/* -------- SERVER -------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
