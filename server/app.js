import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createUser, loginUser } from "./controllers/user.js";
import { deleteBlog, getBlogs, getMyBlogs, postBlog, updateBlog } from "./controllers/blogs.js";
import { checkAuth } from "./middlewares/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// User routes
app.post("/api/users/signup", createUser);
app.post("/api/users/login", loginUser);

// Blog routes
app.post("/api/blogs/create", checkAuth, postBlog);
app.get("/api/blogs", getBlogs);
app.get("/api/myblogs", checkAuth, getMyBlogs);
app.delete("/api/blogs/:id", checkAuth, deleteBlog);
app.put("/api/blogs/:id", checkAuth, updateBlog);

app.get("/", (req, res) => {
  res.send("API is running....");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

export default app;
