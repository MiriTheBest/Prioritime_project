import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { API_URL } from "../api/config";

const ProfileModal = ({ open, onClose, token }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [alert, setAlert] = useState({ message: "", severity: "" });

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(API_URL + '/get_user_info', {
        headers: {
          Authorization: token
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const saveProfile = async () => {
    if (!profile.firstName || !profile.lastName || !profile.email) {
      setAlert({ message: "All fields are required.", severity: "error" });
      setTimeout(() => setAlert({ message: "", severity: "" }), 5000);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(profile.email)) {
      setAlert({ message: "Please enter a valid email address.", severity: "error" });
      setTimeout(() => setAlert({ message: "", severity: "" }), 5000);
      return;
    }

    try {
      await axios.put(API_URL + '/update_user_info', profile, {
        headers: {
          Authorization: token
        }
      });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving profile:", error);
      setAlert({ message: error.response?.data?.message || "An error occurred while saving.", severity: "error" });
      setTimeout(() => setAlert({ message: "", severity: "" }), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setAlert({ message: "", severity: "" }); // Clear any previous alerts when the user starts typing
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Profile</h2>
        {alert.message && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <TextField
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            onClick={saveProfile}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileModal;