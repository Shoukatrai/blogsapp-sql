import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Stack, Typography } from "@mui/material";
import BlogCard from "../components/BlogCard";
import { BASE_URL } from "../utils";
import { apiEndPoints } from "../constant/apiEndPoints";
import axios from "axios";
import Cookies from "js-cookie";

const MyBlogs = () => {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const fetchBlogs = async () => {
    try {
      const api = `${BASE_URL}${apiEndPoints.getMyBlogs}`;
      const response = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const blogs = response.data.data || response.data || [];
      setData(blogs);
      setFilteredData(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [isRefresh]);

  // ✅ Filter blogs when searching
  const handleSearch = (query) => {
    if (!query) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <Stack
        sx={{
          background: "linear-gradient(to right, #4caf50, #81c784)",
          p: 2,
          minHeight: "fit-content",
          maxHeight: "100vh",
          overflowY: "auto",
        }}
        flexDirection={"row"}
        flexWrap={"wrap"}
        gap={2}
      >
        {filteredData.length > 0 ? (
          filteredData.map((blog) => (
            <BlogCard
              key={blog._id || blog.id}
              blog={blog}
              setIsRefresh={setIsRefresh}
            />
          ))
        ) : (
          <Typography variant="h6" color="white" mt={4}>
            🚀 No blogs found!
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default MyBlogs;
