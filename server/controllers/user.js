import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
  const { name, email, password, type } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }
  );
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  db.query(
    "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, type],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
        console.log("err", err);
      }
      console.log("result", result);
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
      });
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const user_id = user.user_id;
      console.log("user", user.user_id);
      const token = jwt.sign(
        { id: user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      const code = jwt.decode(token, process.env.JWT_SECRET);
      console.log("code", code);

      res.status(200).json({ message: "Login successful", token, user });
    }
  );
};

export { createUser, loginUser };
