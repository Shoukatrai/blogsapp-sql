import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../constant/apiEndPoints";
import axios from "axios";
import { BASE_URL, toastAlert } from "../../utils";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      type: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("signup data:", data);
    try {
      setLoading(true);
      data.type = "admin";
      const api = `${BASE_URL}${apiEndPoints.signup}`;
      console.log("api", api);
      const response = await axios.post(api, data);
      console.log("response", response);
      toastAlert({
        type: "success",
        message: response?.data?.message,
      });
      setLoading(false);
      navigate("/login");
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
            Sign up
          </Typography>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
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
            {loading ? "signing up" : "Signup"}
          </Button>
          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#002900",
              }}
            >
              login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Signup;
