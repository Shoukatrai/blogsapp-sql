export const apiEndPoints = {
  signup: "/users/signup",
  login: "/users/login",
  getBlogs: "/blogs",
  createBlog: "/blogs/create",
  getMyBlogs: "/myblogs",
  delteBlog: (id) => `/blogs/${id}`, 
  updateBlog: (id) => `/blogs/${id}`, 
};
