import React from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  Chip,
} from "@mui/material"; 

const TaskDetailsModal = ({ open, onClose, task }) => {
  const categories = ["Personal", "Home", "Sport", "School", "Work", "Other"];

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          p: 4,
          borderRadius: 10,
          padding: 30,
        }}
      >
        <Typography variant="h6" id="task-details-modal-title">
          Task Details
        </Typography>
        <TextField
          label="Name"
          id="name"
          value={task.name}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Duration"
          id="duration"
          value={task.duration}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Deadline"
          id="deadline"
          value={task.deadline}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Location"
          id="location"
          value={task.location}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Description"
          id="description"
          value={task.description}
          multiline
          rows={3}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Category"
          id="category"
          value={categories.includes(task.category) ? task.category : "Other"}
          fullWidth
          margin="normal"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        {task.category && !categories.includes(task.category) && (
          <TextField
            label="Custom Category"
            id="customCategory"
            value={task.category}
            fullWidth
            margin="normal"
            size="small"
            InputProps={{
              readOnly: true,
            }}
          />
        )}
        <div>
          {task.tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              style={{ marginRight: "5px", backgroundColor: "#79DAE8" }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
