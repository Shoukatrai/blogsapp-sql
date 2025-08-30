import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, loginUser } from "./controllers/user.js";
import { postBlog, getBlogs, getMyBlogs, deleteBlog, updateBlog } from "./controllers/blogs.js";
import { checkAuth } from "./middlewares/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.post("/api/users/signup", createUser);
app.post("/api/users/login", loginUser);

// Blog routes
app.post("/api/blogs/create", checkAuth, postBlog);
app.get("/api/blogs", getBlogs);
app.get("/api/myblogs", checkAuth, getMyBlogs);
app.delete("/api/blogs/:id", checkAuth, deleteBlog);
app.put("/api/blogs/:id", checkAuth, updateBlog);

// Root
app.get("/", (req, res) => {
  res.send("API is running....");
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

export default app;
