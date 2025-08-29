import express from "express";
import { connectDB } from "./config/db.js";
import { createUser, loginUser } from "./controllers/user.js";
import dotenv from "dotenv";
import cors from "cors";
import {
  deleteBlog,
  getBlogs,
  getMyBlogs,
  postBlog,
  updateBlog,
} from "./controllers/blogs.js";
import { checkAuth } from "./middlewares/auth.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//user
app.post("/api/users/signup", createUser);
app.post("/api/users/login", loginUser);
//blogs
app.post("/api/blogs/create", checkAuth, postBlog);
app.get("/api/blogs", getBlogs);
app.get("/api/myblogs", checkAuth, getMyBlogs);
app.delete("/api/blogs/:id", checkAuth, deleteBlog);
app.put("/api/blogs/:id", checkAuth, updateBlog);

app.get("/", (req, res) => {
  res.send("API is running....");
});
try {
  await connectDB();
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed", err);
}

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`server running on http://localhost:${PORT}`)
  );
}

export default app;
