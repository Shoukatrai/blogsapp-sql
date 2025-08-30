import pool from "../config/db.js";

// Create blog
export const postBlog = async (req, res) => {
  try {
    const { title, subject, description, private: isPrivate } = req.body;
    const user_id = req.user.id;

    if (!title || !subject || !user_id) {
      return res
        .status(400)
        .json({ message: "Title, subject, and user id are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO blogs (title, subject, user_id, description, private) VALUES (?, ?, ?, ?, ?)",
      [title, subject, user_id, description, isPrivate || 0]
    );

    return res.status(201).json({
      message: "Blog post created successfully",
      blogId: result.insertId,
    });
  } catch (err) {
    console.error("PostBlog Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all public blogs
export const getBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE private = 0");
    console.log("rows", rows);
    const response = rows.map((blog) => ({
      ...blog,
      private: blog.private === 1, // Convert to boolean
    }));
    console.log("response", response);
    
    
    return res.status(200).json(response);
  } catch (err) {
    console.error("GetBlogs Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get users blogs
export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT * FROM blogs WHERE user_id = ?", [userId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GetMyBlogs Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const [result] = await pool.query("DELETE FROM blogs WHERE blog_id = ?", [blogId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    return res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("blogId", blogId);
    const { title, subject, description, private: isPrivate } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    const [result] = await pool.query(
      "UPDATE blogs SET title = ?, subject = ?, description = ?, private = ? WHERE blog_id = ?",
      [title, subject, description, isPrivate || 0, blogId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    return res.status(200).json({ message: "Blog post updated successfully" });
  } catch (err) {
    console.error("UpdateBlog Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
