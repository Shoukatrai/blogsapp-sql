import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button, Stack, Typography } from "@mui/material";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import { BASE_URL } from "../utils";
import { apiEndPoints } from "../constant/apiEndPoints";
import { AddBlogModal } from "../components/AddBlogModal";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { EditBlogModal } from "../components/EditBlogModal";

const Home = () => {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [addBlogModal, setAddBlogModal] = React.useState(false);
  const [editBlogModal, seteditBlogModal] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [selectBlog, setSelectBlog] = React.useState(null);

  const token = Cookies.get("token");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const api = `${BASE_URL}${apiEndPoints.getBlogs}`;
      const response = await axios.get(api);
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
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        {filteredData.length > 0 ? (
          filteredData.map((blog) => (
            <BlogCard
              key={blog._id || blog.id}
              blog={blog}
              setIsRefresh={setIsRefresh}
              setSelectBlog={setSelectBlog}
              seteditBlogModal={seteditBlogModal}
            />
          ))
        ) : (
          <Typography variant="h6" color="white" mt={4}>
            🚀 No blogs found!
          </Typography>
        )}
      </Stack>

      {token && (
        <Button
          variant="contained"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            borderRadius: "50%",
            minWidth: 56,
            minHeight: 56,
            boxShadow: 3,
            zIndex: 1000,
            backgroundColor: "#002900",
            "&:hover": { backgroundColor: "#005000" },
          }}
          onClick={() => setAddBlogModal(true)}
        >
          <Add fontSize="large" />
        </Button>
      )}

      {addBlogModal && (
        <AddBlogModal
          open={addBlogModal}
          setOpen={setAddBlogModal}
          isRefresh={isRefresh}
          setIsRefresh={setIsRefresh}
        />
      )}

      {editBlogModal && (
        <EditBlogModal
          open={editBlogModal}
          setOpen={seteditBlogModal}
          isRefresh={isRefresh}
          setIsRefresh={setIsRefresh}
          selectBlog={selectBlog}
        />
      )}
    </>
  );
};

export default Home;
