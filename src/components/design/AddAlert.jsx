import React, { useState, useEffect } from "react";
import { Alert } from "@mui/material";

const AddAlert = ({ open, severity, message }) => {
  const [alertOpen, setAlertOpen] = useState(open);

  useEffect(() => {
    setAlertOpen(open);
    if (open) {
      setTimeout(() => {
        setAlertOpen(false);
      }, 5000);
    }
  }, [open]);

  return (
    <Alert
      variant="filled"
      severity={severity}
      sx={{ position: "fixed", top: "6rem", right: "8rem" }}
      open={alertOpen}
    >
      {message}
    </Alert>
  );
};

export default AddAlert;
