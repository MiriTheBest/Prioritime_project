import React from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";

const TaskDetailsModal = ({ open, onClose, task }) => {
  const categories = ["Personal", "Home", "Sport", "School", "Work", "Other"];

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="task-details-modal-title"
      aria-describedby="task-details-modal-content"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          backgroundColor: "#f5f5f5",
          boxShadow: 24,
          padding: 30,
          border: "4px solid #0AA1DD", // Custom wide border
          borderRadius: 10,
          padding: 30, 
        }}
      >
        <Typography variant="h6" id="task-details-modal-title">
          Task Details
        </Typography>
        <div style={{ marginBottom: 20 }}>
          <img
            src="images/wave-border.png"
            alt="Wave Border"
            style={{ width: "100%", height: "auto", borderRadius: 5 }}
          />
        </div>
        <Typography variant="subtitle1">Name: {task.name}</Typography>
        <Typography variant="body1">Duration: {task.duration}</Typography>
        <Typography variant="body1">Category: {task.category}</Typography>
        <Typography variant="body1">Location: {task.location}</Typography>
        <Typography variant="body1">Details: {task.description}</Typography>
        <Typography variant="body1">
          Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "Not specified"}
        </Typography>
        <Typography variant="body1">Recurring: {task.frequency}</Typography>
        <Typography variant="body1">Tags: {task.tags.join(", ")}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginTop: 20 }}
          onClick={handleClose}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
