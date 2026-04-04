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

/* -------- MULTER STORAGE -------- */

const carStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "car_image") {
      cb(null, "uploads/car_image");
    } else if (file.fieldname === "rc_book") {
      cb(null, "uploads/rc_book");
    } else {
      cb(null, "uploads");
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/license");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"));
  }
};

const uploadCarImage = multer({
  storage: carStorage,
  fileFilter: fileFilter,
});

const uploadLicense = multer({
  storage: licenseStorage,
  fileFilter: fileFilter,
});

/* -------- JWT VERIFY -------- */

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userid = decoded.userid;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* -------- TEST DATABASE -------- */

app.get("/api/test-db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ message: "Database connected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* -------- USER REGISTER -------- */

app.post("/api/register", async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    name = name?.trim();
    email = email?.trim();
    phone = phone?.trim();
    password = password?.trim();

    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    await pool.query(
      "INSERT INTO users (name,email,phone,password,role,status) VALUES (?,?,?,?,?,?)",
      [name, email, phone, password, "user", "approved"]
    );

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- OWNER REGISTER -------- */

app.post(
  "/api/register/owner",
  uploadLicense.single("license"),
  async (req, res) => {
    try {
      const { name, email, address, phone, password } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "License image required" });
      }

      const licenseImage = req.file.filename;

      const [userResult] = await pool.query(
        "INSERT INTO users (name,email,phone,password,role,status) VALUES (?,?,?,?,?,?)",
        [name, email, phone, password, "owner", "pending"]
      );

      const userId = userResult.insertId;

      await pool.query(
        "INSERT INTO owners (owner_id,address,license_image) VALUES (?,?,?)",
        [userId, address, licenseImage]
      );

      res.json({ message: "Owner registration submitted" });

    } catch (err) {
      
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------- LOGIN -------- */

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    //  Get user
    const [rows] = await pool.query(
      "SELECT id, name, email, role, status, password FROM users WHERE email=?",
      [email]
    );

    //  User not found
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    //  Password mismatch
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  Normalize status (VERY IMPORTANT)
    const status = user.status?.toLowerCase();

    //  OWNER STATUS CHECK
  //  OWNER LOGIN CONTROL
if (user.role === "owner") {

  if (user.status === "pending") {
    return res.status(403).json({
      message: "Your account is pending admin approval",
    });
  }

  if (user.status === "rejected") {
    return res.status(403).json({
      message: "Your registration was rejected by admin",
    });
  }

  //  Extra safety (very important)
  if (user.status !== "approved") {
    return res.status(403).json({
      message: "You are not approved by admin",
    });
  }
}

    //  Generate token
    const token = jwt.sign(
      { userid: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "2d" }
    );

    //  Remove password before sending response
    delete user.password;

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
});
// -------- ADMIN REVENUE ANALYTICS --------
app.get("/api/admin/revenue", async (req, res) => {
  try {
    const [total] = await pool.query(`
      SELECT COALESCE(SUM(total_price),0) AS totalRevenue
      FROM bookings
      WHERE status IN ('completed','approved')
    `);

    const [monthly] = await pool.query(`
      SELECT 
        DATE_FORMAT(pickup_date, '%Y-%m') AS month,
        COALESCE(SUM(total_price),0) AS revenue
      FROM bookings
      WHERE status IN ('completed','approved')
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      totalRevenue: total[0].totalRevenue,
      monthlyRevenue: monthly,
      totalBookings: monthly.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching revenue" });
  }
});
// -------- ADMIN FETCH ALL BOOKINGS --------
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        b.booking_id,
        b.pickup_date,
        b.return_date,
        b.total_price,
        LOWER(b.status) AS status,

        u.name AS user_name,
        o.name AS owner_name,
        c.name AS car_name

      FROM bookings b

      --  USER (who booked)
      JOIN users u ON b.user_id = u.id

      --  CAR (important)
      JOIN cars c ON b.car_id = c.car_id

      --   FIXED: OWNER FROM CARS TABLE (NOT bookings)
      JOIN users o ON c.owner_id = o.id

      ORDER BY b.booking_id DESC
    `);

    console.log("BOOKINGS DATA:", rows); // debug

    res.json(rows);
  } catch (err) {
    console.error("ERROR FETCHING BOOKINGS:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
// -------- ADMIN UPDATE USER STATUS --------
app.put("/api/admin/user-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET status=? WHERE id=? AND role='user'",
      [status, userId]
    );

    res.json({ message: "User status updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// -------- ADMIN FETCH USERS --------
app.get("/api/admin/users", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.status,
        COUNT(b.booking_id) AS bookings,
        IFNULL(SUM(b.total_price), 0) AS total_spent
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
    `);

    console.log("USERS DATA:", rows); // 🔥 ADD THIS

    res.json(rows);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});
//----------ADMIN FETCH API-------------
app.get("/api/admin/owner-requests", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.status,
        o.address AS place,
        o.license_image
      FROM users u
      LEFT JOIN owners o ON u.id = o.owner_id
      WHERE u.role = 'owner'
    `);

    console.log("OWNER REQUESTS:", rows); // 🔥 DEBUG

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching owner requests" });
  }
});
//---------ADMIN ACCEPT/REJECT----------
app.put("/api/admin/update-owner-status/:id", async (req, res) => {
  try {
    let { status } = req.body;
    const id = req.params.id;

    //  convert to lowercase
    status = status.toLowerCase();

    console.log("Updating ID:", id);
    console.log("New Status:", status);

    const [result] = await pool.query(
      "UPDATE users SET status=? WHERE id=?",
      [status, id]
    );

    console.log("Affected rows:", result.affectedRows);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* -------- ADMIN VIEW ALL CARS -------- */

app.get("/api/admin/cars", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.car_id,
        TRIM(c.name) AS name,

        --  FIX TYPE ISSUE
        CASE 
          WHEN c.type IS NULL OR c.type = '' OR c.type = 'undefined'
          THEN 'SUV'
          ELSE c.type
        END AS type,

        --  FIX FUEL
        CASE 
          WHEN c.fuel IS NULL OR c.fuel = '' OR c.fuel = 'undefined'
          THEN 'Petrol'
          ELSE c.fuel
        END AS fuel,

        --  FIX SEATS
        IFNULL(c.seats, 4) AS seats,

        --  FIX PRICE
        IFNULL(c.price_per_day, 0) AS price_per_day,

        c.image,
        u.name AS owner_name,

        --  REAL-TIME STATUS
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.car_id = c.car_id 
            AND b.status IN ('pending','accepted')
          )
          THEN 'booked'
          ELSE 'available'
        END AS status

      FROM cars c
      JOIN users u ON c.owner_id = u.id

      --  SOFT DELETE FILTER
      WHERE c.is_deleted = FALSE

      ORDER BY c.car_id DESC
    `);

    console.log("Cars Data:", rows);

    res.json(rows);

  } catch (err) {
    console.error("FETCH CARS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------User Booking--------
app.post("/api/book-car", verifyToken, async (req, res) => {
  try {
    const userId = req.userid;
    const { car_id, owner_id, pickup, returnDate, total } = req.body;

    //  Check car status
    const [car] = await pool.query(
      "SELECT status FROM cars WHERE car_id=?",
      [car_id]
    );

    if (car[0].status === "booked") {
      return res.status(400).json({
        message: "Car already booked"
      });
    }

    //  Check accepted booking
    const [existing] = await pool.query(
      "SELECT * FROM bookings WHERE car_id=? AND status='accepted'",
      [car_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Car already booked"
      });
    }

    await pool.query(
      `INSERT INTO bookings 
      (user_id, car_id, owner_id, pickup_date, return_date, total_price, status)
      VALUES (?,?,?,?,?,?,?)`,
      [userId, car_id, owner_id, pickup, returnDate, total, "pending"]
    );

    res.json({ message: "Booking request sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------Owner View Bookings----------
app.get("/api/owner/bookings", verifyToken, async (req, res) => {
  try {
    const ownerId = req.userid;

    const [rows] = await pool.query(
      `SELECT b.*, u.name AS user_name, c.name AS car_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN cars c ON b.car_id = c.car_id
       WHERE c.owner_id = ?`,
      [ownerId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//------Accept/Reject Bookings---------
app.put("/api/booking/status/:id", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const [rows] = await pool.query(
      "SELECT car_id FROM bookings WHERE booking_id=?",
      [bookingId]
    );

    const carId = rows[0].car_id;

    console.log("Booking ID:", bookingId);
    console.log("Car ID:", carId);
    console.log("Status:", status);

    await pool.query(
      "UPDATE bookings SET status=? WHERE booking_id=?",
      [status, bookingId]
    );

    if (status === "accepted") {
      console.log("Updating car to BOOKED...");
      await pool.query(
        "UPDATE cars SET status='booked' WHERE car_id=?",
        [carId]
      );
    }

    res.json({ message: "Status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
//---------User View Bookkings---------
app.get("/api/user/bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.userid;

    const [rows] = await pool.query(
      `SELECT b.*, c.name AS car_name, c.image
       FROM bookings b
       JOIN cars c ON b.car_id = c.car_id
       WHERE b.user_id=?`,
      [userId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// --------- USER CANCEL BOOKING ---------
app.put("/api/booking/cancel/:id", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.userid;

    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE booking_id=? AND user_id=?",
      [bookingId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const carId = rows[0].car_id;

    if (rows[0].status !== "pending") {
      return res.json({ message: "Cannot cancel now" });
    }

    await pool.query(
      "UPDATE bookings SET status=? WHERE booking_id=?",
      ["cancelled", bookingId]
    );

    //  Make car available again
    await pool.query(
      "UPDATE cars SET status=? WHERE car_id=?",
      ["available", carId]
    );

    res.json({ message: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/* -------- PROFILE -------- */

app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const userid = req.userid;

    const [rows] = await pool.query(
      "SELECT id,name,email,phone FROM users WHERE id=?",
      [userid]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- UPDATE PROFILE -------- */

app.put("/api/updateprofile", verifyToken, async (req, res) => {
  try {
    const userid = req.userid;
    const { fullName, phone } = req.body;

    await pool.query(
      "UPDATE users SET name=?, phone=? WHERE id=?",
      [fullName, phone, userid]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- VIEW ALL CARS -------- */

app.get("/api/view/car", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,

        --  REAL-TIME STATUS (VERY IMPORTANT)
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.car_id = c.car_id
            AND b.status IN ('pending','accepted')
          )
          THEN 'booked'
          ELSE 'available'
        END AS status

      FROM cars c

      --  HIDE DELETED CARS
      WHERE c.is_deleted = FALSE

      ORDER BY c.car_id DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



/* -------- OWNER ADD CAR () -------- */
app.post(
  "/api/add/car",
  verifyToken,
  uploadCarImage.fields([
    { name: "car_image", maxCount: 1 },
    { name: "rc_book", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userid = req.userid;

      let {
        reg_number,
        name,
        type,
        fuel,
        transmission,
        seats,
        price_per_day,
        status,
      } = req.body;

      //  TRIM INPUTS
      reg_number = reg_number?.trim().toUpperCase();
      name = name?.trim();
      type = type?.trim();
      fuel = fuel?.trim();
      transmission = transmission?.trim();
      status = status?.trim();

      //  DEFAULT VALUES (fix undefined bug)
      if (!type || type === "undefined") type = "SUV";
      if (!fuel || fuel === "undefined") fuel = "Petrol";
      if (!transmission || transmission === "undefined") transmission = "Manual";
      if (!status || status === "undefined") status = "available";

      //  NUMBER CONVERSION
      seats = parseInt(seats) || 4;
      price_per_day = parseFloat(price_per_day) || 0;

      //  FORCE LOWERCASE STATUS
      status = status.toLowerCase();

      //  FILES
      const carImage = req.files?.car_image?.[0]?.filename || null;
      const rcBook = req.files?.rc_book?.[0]?.filename || null;

      //  BASIC VALIDATION
      if (!reg_number || !name) {
        return res.status(400).json({
          message: "Car name and registration number are required",
        });
      }

      //  REGISTRATION NUMBER VALIDATION (🔥 IMPORTANT)
      const regPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

      if (!regPattern.test(reg_number)) {
        return res.status(400).json({
          message: "Invalid registration format (Example: KL07AB1234)",
        });
      }

      //  CHECK DUPLICATE
      const [existing] = await pool.query(
          "SELECT * FROM cars WHERE reg_number = ?",
          [reg_number]
        );

        if (existing.length > 0) {
          return res.status(400).json({
            message: "Car already exists",
          });
        }

      //  INSERT DATA
      await pool.query(
        `INSERT INTO cars
        (owner_id, reg_number, name, type, fuel, transmission, seats, price_per_day, status, image, rc_book)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
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
          rcBook,
        ]
      );

      res.status(201).json({
        message: "Car added successfully",
      });

    } catch (err) {
      console.error("ADD CAR ERROR:", err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


/* -------- OWNER VIEW CARS -------- */

app.get("/api/view/owner/cars", verifyToken, async (req, res) => {
  try {
    console.log("USER ID:", req.userid); // 

    const ownerId = req.userid;

    const [cars] = await pool.query(
      "SELECT * FROM cars WHERE owner_id = ? AND is_deleted = FALSE",
      [ownerId]
    );

    res.json(cars);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- UPDATE CAR -------- */

app.put("/update-car/:id", verifyToken, async (req, res) => {
  try {
    const carId = req.params.id;
    const ownerId = req.userid;

    const { name, fuel, seats, price_per_day } = req.body;

    const [result] = await pool.query(
      `UPDATE cars
       SET name=?,fuel=?,seats=?,price_per_day=?
       WHERE car_id=? AND owner_id=?`,
      [name, fuel, seats, price_per_day, carId, ownerId]
    );

    if (result.affectedRows === 0) {
      return res.json({ message: "Not authorized" });
    }

    res.json({ message: "Car updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- DELETE CAR -------- */

app.delete("/delete-car/:id", verifyToken, async (req, res) => {
  try {
    const carId = req.params.id;

    //  Check booking status
    const [bookings] = await pool.query(
      `SELECT * FROM bookings 
       WHERE car_id = ? AND status IN ('pending','accepted')`,
      [carId]
    );

    //  If booked or pending → block delete
    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Car is booked. Cannot delete."
      });
    }

    //  Soft delete allowed
    await pool.query(
      "UPDATE cars SET is_deleted = TRUE WHERE car_id = ?",
      [carId]
    );

    res.json({ message: "Car deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- SERVER -------- */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});