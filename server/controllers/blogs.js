import pool from "../config/db.js";

export const postBlog = (req, res) => {
  const { title, subject, description, private: isPrivate } = req.body;
  const user_id = req.user.id;
  if (!title || !subject || !user_id) {
    return res
      .status(400)
      .json({ message: "Title, subject, and user id are required" });
  }

  pool.query(
    "INSERT INTO blogs (title, subject, user_id, description, private) VALUES (?, ?, ?, ?, ?)",
    [title, subject, user_id, description, isPrivate],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
        console.log("err", err);
      }
      console.log("result", result);
      return res.status(201).json({
        message: "Blog post created successfully",
        blogId: result.insertId,
      });
    }
  );
};

export const getBlogs = (req, res) => {
  const query = "SELECT * FROM blogs WHERE private = 0";
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

export const deleteBlog = (req, res) => {
  const blog_id = req.params.id;
  console.log("blog_id", blog_id);
  pool.query("DELETE FROM blogs WHERE blog_id = ?", [blog_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
      console.log(err , "error")
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Blog post not found" });
    } else {
      res.status(200).json({ message: "Blog post deleted successfully" });
    }
  });
};

export const updateBlog = (req, res) => {
  const blogId = req.params.id;
  const { title, subject, description, private: isPrivate } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ message: "Title and subject are required" });
  }

  pool.query(
    "UPDATE blogs SET title = ?, subject = ?, description = ?, private = ? WHERE id = ?",
    [title, subject, description, isPrivate, blogId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      return res
        .status(200)
        .json({ message: "Blog post updated successfully" });
    }
  );
};

export const getMyBlogs = (req, res) => {
  const userId = req.user.id;
  const query = "SELECT * FROM blogs WHERE user_id = ?";
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};
