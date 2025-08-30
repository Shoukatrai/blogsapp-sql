import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, toastAlert } from "../../utils";
import { apiEndPoints } from "../../constant/apiEndPoints";
import axios from "axios";
import Cookies from "js-cookie";
const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Login data:", data);
    try {
      setLoading(true);
      const api = `${BASE_URL}${apiEndPoints.login}`;
      console.log("api", api);
      const response = await axios.post(api, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,  
        },
      });
      console.log("response", response.data.user.id);
      const id = response.data.user.user_id;
      Cookies.set("id", id);
      toastAlert({
        type: "success",
        message: response?.data?.message,
      });
      setLoading(false);
      Cookies.set("token", response?.data?.token);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toastAlert({
        type: "error",
        message:
          response?.data?.message || error.message || "something went wrong",
      });
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh">
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          width: { xs: "90%", sm: "400px" },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#002900",
              textTransform: "uppercase",
              letterSpacing: 2,
              textAlign: "center",
              mb: 2,
            }}
          >
            Login
          </Typography>
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              fontSize: "16px",
              backgroundColor: "#002900",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
          >
            {loading ? "logging in" :"Login"}
          </Button>
          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#002900",
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Login;
