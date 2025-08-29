import * as React from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  CircularProgress,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { apiEndPoints } from "../constant/apiEndPoints";
import { BASE_URL, toastAlert } from "../utils";
import Cookies from "js-cookie";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", sm: 420, md: 500 },
  maxHeight: "90vh", // ✅ keeps modal within screen
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 8,
  p: { xs: 2, sm: 4 },
  border: "none",
  outline: "none",
  overflowY: "auto", // ✅ adds scroll if content overflows
};

export const AddBlogModal = ({ open, setOpen, isRefresh, setIsRefresh }) => {
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => setOpen(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      private: false,
    },
  });

  const onSubmit = async (obj) => {
    try {
      setLoading(true);
      const api = `${BASE_URL}${apiEndPoints.createBlog}`;
      const response = await axios.post(api, obj, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      toastAlert({ type: "success", message: response.data.message });
      setIsRefresh(!isRefresh);
      handleClose();
      reset();
    } catch (error) {
      console.error("Error creating blog:", error);
      toastAlert({
        type: "error",
        message: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Stack
            gap={2}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <Typography
              variant="h5"
              align="center"
              fontWeight={700}
              sx={{
                color: "#002900",
                fontSize: { xs: "1.5rem", sm: "2rem" }, // ✅ responsive heading
                mb: 2,
              }}
            >
              Create Blog
            </Typography>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Blog Title"
                  fullWidth
                  required
                  size="small"
                  {...field}
                />
              )}
            />

            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Blog Subject"
                  fullWidth
                  required
                  size="small"
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Blog Description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  size="small"
                  {...field}
                />
              )}
            />

            <Controller
              name="private"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} {...field} />}
                  label="Private Blog"
                  sx={{ mt: 1 }}
                />
              )}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth // ✅ makes button responsive
              sx={{
                mt: 2,
                color: "white",
                backgroundColor: "#002900",
                "&:hover": { backgroundColor: "#005000" },
                py: 1.2,
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Create Blog"
              )}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
