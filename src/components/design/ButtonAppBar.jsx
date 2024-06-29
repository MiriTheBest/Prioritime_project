import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MainDrawer from "./MainDrawer";
import PreferencesModal from "./PreferencesModal";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar({ isAuthenticated, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePreferencesOpen = () => {
    setPreferencesOpen(true);
    handleClose(); // Close menu when opening preferences
  };

  const handlePreferencesClose = () => {
    setPreferencesOpen(false);
  };

  const handleProfileOpen = () => {
    setProfileOpen(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerOpen = () => setIsOpen(true);
  const handleDrawerClose = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    onLogout();
    handleClose();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated ? ( // Render MenuIcon only if authenticated
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerOpen} // Trigger drawer open on button click
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <div style={{ width: 40, height: 40 }} /> // Placeholder for disabled icon
          )}

          <MainDrawer open={isOpen} onClose={handleDrawerClose} />

          <Typography
            id="prioritime-heading"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Prioritime
          </Typography>

          {isAuthenticated ? ( // Render AccountCircle only if authenticated
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          ) : (
            <div style={{ width: 40, height: 40 }} /> // Placeholder for disabled icon
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
            <MenuItem onClick={handlePreferencesOpen}>Preferences</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <PreferencesModal open={preferencesOpen} onClose={handlePreferencesClose} token={token} />
      <ProfileModal open={profileOpen} onClose={handleProfileClose} token={token} />
    </Box>
  );
}
