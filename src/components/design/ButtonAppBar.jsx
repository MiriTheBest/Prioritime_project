import React, { useState } from "react"; // Import only useState hook
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

export default function ButtonAppBar({ isAuthenticated, token }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false); // State for PreferencesModal

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

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerOpen = () => setIsOpen(true);
  const handleDrawerClose = () => setIsOpen(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handlePreferencesOpen}>Preferences</MenuItem> {/* Open PreferencesModal on click */}
            <MenuItem onClick={handleClose}>Log Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <PreferencesModal open={preferencesOpen} onClose={handlePreferencesClose} token={token} /> {/* Add PreferencesModal */}
    </Box>
  );
}
