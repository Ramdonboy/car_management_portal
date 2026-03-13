/* ======================================================
   SETUP SCRIPT — Initialize MySQL Database
   Run this once to create the database and tables:
   node setup.js
   ====================================================== */

const mysql = require("mysql2/promise");

async function setup() {

  const config = {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
  };

  try {

    const connection = await mysql.createConnection(config);
    console.log("✅ Connected to MySQL server...");

    // 1️⃣ Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS car_management_system`);
    console.log("✅ Database 'car_management_system' created or already exists.");

    // 2️⃣ Use Database
    await connection.query(`USE car_management_system`);

    console.log("Creating tables...");

    // USERS TABLE
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','owner','user') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // OWNERS TABLE
    await connection.query(`
      CREATE TABLE IF NOT EXISTS owners (
        owner_id INT PRIMARY KEY,
        place VARCHAR(100),
        license_image VARCHAR(255) NOT NULL,
        rc_book_image VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // CARS TABLE
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cars (
        car_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        reg_number INT NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        fuel VARCHAR(20),
        transmission VARCHAR(20),
        seats INT,
        price_per_day DECIMAL(10,2),
        status ENUM('available','rented','maintenance') DEFAULT 'available',
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // BOOKINGS TABLE
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        car_id INT NOT NULL,
        owner_id INT NOT NULL,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        total_price DECIMAL(10,2),
        status ENUM('pending','approved','rejected','completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("🎉 Database setup completed successfully!");

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setup();