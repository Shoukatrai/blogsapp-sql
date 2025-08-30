import React from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
const AuthRoute = () => {
  const token = Cookies.get("token");
  if (token) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};
export default AuthRoute;


