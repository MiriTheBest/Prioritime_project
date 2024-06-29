import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { API_URL } from './api/config';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Alert from "@mui/material/Alert";

const defaultTheme = createTheme();

export default function SignInSide({ onAuthorization }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState({ message: "", severity: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({ message: "Email and password are required.", severity: "error" });
      setTimeout(() => {
        setAlert({ message: "", severity: "" });
      }, 5000);
      return;
    }

    try {
      const endpoint = API_URL + '/login';
      const response = await axios.post(endpoint, formData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      onAuthorization(true);//set flag that the user is authorized succesfully
    } catch (error) {
      setAlert({ message: error.response?.data?.error || "An error occurred while saving.", severity: "error" });
      setTimeout(() => {
        setAlert({ message: "", severity: "" });
      }, 5000);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/images/login.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {alert.message && (
            <Alert severity={alert.severity} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          )}
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <RouterLink to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </RouterLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
