// import mysql from "mysql2";
// import dotenv from "dotenv";
// dotenv.config();

// const db =  mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER ||"root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME,
// });


// const connectDB = () => {
//   db.connect((err) => {
//     if (err) {
//       console.log("Database connection failed:", err);
//     } else {
//       console.log("Connected to the database.");
//     }
//   });
// }
// export { db, connectDB };
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool;

if (!global._dbPool) {
  global._dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

pool = global._dbPool;

export default pool;
