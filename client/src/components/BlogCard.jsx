import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import { BASE_URL, toastAlert } from "../utils";
import { apiEndPoints } from "../constant/apiEndPoints";
import axios from "axios";
import Cookies from "js-cookie";
const BlogCard = ({ blog, setIsRefresh, setSelectBlog, seteditBlogModal }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (editBlog) => {
    console.log("editBlog" , editBlog)
    console.log("Edit clicked");
    setSelectBlog(editBlog);
    seteditBlogModal((prev) => !prev);
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    console.log("Delete clicked", id);
    const blog_id = id;
    try {
      const api = `${BASE_URL}${apiEndPoints.delteBlog(blog_id)}`;
      const response = await axios.delete(api, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      console.log("Delete response:", response);
      toastAlert({
        type: "success",
        message: "Blog deleted successfully",
      });
      setIsRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toastAlert({
        type: "error",
        message: "Error deleting blog",
      });
    }
    handleMenuClose();
  };

  return (
    <Box mt={2}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          width: { xs: "95%", sm: "400px", md: "350px" },
          position: "relative",
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
          },
        }}
      >
        <IconButton
          size="medium"
          aria-label="more options"
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "grey.700",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
          }}
        >
          <MoreIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 1,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            color: "#2e7d32",
          }}
        >
          {blog?.title}
        </Typography>

        <Stack alignItems="center" mb={1}>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "#e8f5e9",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 500,
              color: "#1b5e20",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            📘 {blog?.subject}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          textAlign="justify"
          sx={{
            mt: 1,
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {blog?.description}
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              handleEdit(blog);
            }}
          >
            ✏️ Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(blog?.blog_id);
            }}
          >
            🗑️ Delete
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
};

export default BlogCard;
