import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Link, Grid, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#0aa1dd",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
    marginTop: "20px",
  };

  return (
    <footer style={footerStyle}>
      <Container maxWidth="md">
        <Grid container spacing={2} alignItems="center">
          {/* Column for links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">Learn more:</Typography>
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/faq"
                color="inherit"
                style={{ marginRight: 10 }}
              >
                FAQ
              </Link>{" "}
              |
              <Link
                href="#"
                color="inherit"
                style={{ marginLeft: 10, marginRight: 10 }}
              >
                About
              </Link>{" "}
              |
              <Link href="#" color="inherit" style={{ marginLeft: 10 }}>
                Contact Us
              </Link>
            </Typography>
          </Grid>
          {/* Center content */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">Maximize productivity</Typography>
            <Typography variant="body2">
              © {new Date().getFullYear()} Prioritime
            </Typography>
          </Grid>
          {/* Column for social media icons */}
          <Grid item xs={12} sm={4}>
            <Grid container justifyContent="center">
              <IconButton href="#" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <LinkedInIcon />
              </IconButton>
            </Grid>
            <Typography variant="body2">
              <Link href="#" color="inherit">
                Terms of Service
              </Link>{" "}
              |{" "}
              <Link href="#" color="inherit">
                Privacy Policy
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
