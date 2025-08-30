import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, type || "user"]
    );

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("CreateUser Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // Find user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.user_id, name: user.name, email: user.email, type: user.type }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
