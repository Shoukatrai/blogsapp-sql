import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const db =  mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER ||"root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});


const connectDB = () => {
  db.connect((err) => {
    if (err) {
      console.log("Database connection failed:", err);
    } else {
      console.log("Connected to the database.");
    }
  });
}
export { db, connectDB };