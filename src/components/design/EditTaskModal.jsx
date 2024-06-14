import React, { useState, useEffect } from "react";
import sendUpdatedData from "../api/sendUpdatedData";
import {
  Modal,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  Menu,
  Chip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import { convertMinToDuration } from "../functions/convertMintoDuration";
import { convertDurationToMin } from "../functions/convertDurationToMin";

const EditTaskModal = ({ open, onClose, task, onSave, onSaveAndAutomate }) => {
  const settings = { collapseExtendedProps: true };
  task = task.toPlainObject(settings);

  const [name, setName] = useState(task.name || ""); // State for name, pre-populated with existing name or empty string
  const taskDuration  = convertMinToDuration(task.duration);
  console.log("Duration: ", taskDuration);
  const [duration, setDuration] = useState( taskDuration|| ""); // Pre-populate with existing duration
  const [selectedDate, setSelectedDate] = useState(task.deadline?.date || null); // Pre-populate with existing deadline date
  const [selectedTime, setSelectedTime] = useState(task.deadline?.time || null); // Pre-populate with existing deadline time
  const [location, setLocation] = useState(task.location || ""); // Pre-populate with existing location
  const [details, setDetails] = useState(task.description || ""); // Pre-populate with existing description
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false); // Initialize based on task property
  const [frequency, setFrequency] = useState(task.frequency || "");
  const [selectedCategory, setSelectedCategory] = useState(
    task.selectedCategory || "",
  );
  const [tags, setTags] = useState(task.tags || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagInput, setTagInput] = useState("");

  // Update isRecurring state if task.isRecurring changes
  useEffect(() => {
    setIsRecurring(task.isRecurring || false);
  }, [task.isRecurring]);

  const handleSave = async (automate) => {
    duration = convertDurationToMin(duration);
    const updatedTask = {
      ...task,
      title: name,
      duration: duration,
      deadline: {
        date: selectedDate,
        time: selectedTime,
      },
      location,
      description: details,
      isRecurring,
      frequency,
      selectedCategory: selectedCategory,
      tags,
      type,
    };

    if(automate)
      onSaveAndAutomate(updatedTask);

    else
      onSave(updatedTask);

    onClose();
  };


  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]); // Use tagInput.trim() here
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleTagInput = (event) => {
    setTagInput(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-task-modal-title"
      aria-describedby="edit-task-modal-content"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          backgroundColor: "#f5f5f5", // Set background color (optional)
          boxShadow: 24,
          p: 4,
          borderRadius: 10, // Rounded corners
          padding: 20,
        }}
      >
        <Typography variant="h6" id="edit-task-modal-title">
          Edit Task
        </Typography>
        <TextField
          label="Name"
          id="name"
          name="name"
          placeholder="Enter task name"
          value={name} // Use state variable for name
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          label="Duration"
          id="duration"
          name="duration"
          placeholder="Enter duration (e.g., 1 hour)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          sx={{ backgroundColor: "white" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <DatePicker
              label="Deadline (Date)"
              value={selectedDate}
              sx={{ backgroundColor: "white", marginRight: 1 }} // Add margin for spacing
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <TimePicker
              label="Deadline (Time)"
              value={selectedTime}
              sx={{ backgroundColor: "white", marginRight: 1 }} // Add margin for spacing
              onChange={(newValue) => setSelectedTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
              }
              label="Recurring"
            />
          </div>
        </LocalizationProvider>
        {isRecurring && (
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            displayEmpty
            size="small"
            fullWidth
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "white",
            }}
          >
            <MenuItem value="">Select Frequency</MenuItem>
            <MenuItem value="Every Day">Every Day</MenuItem>
            <MenuItem value="Every Week">Every Week</MenuItem>
            <MenuItem value="Every 2 Weeks">Every 2 Weeks</MenuItem>
            <MenuItem value="Every Month">Every Month</MenuItem>
          </Select>
        )}

        <Select
          label="Category"
          value={selectedCategory}
          placeholder="Select Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          size="small"
          displayEmpty
          sx={{ backgroundColor: "white", marginTop: "10px" }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="home">Home</MenuItem>
          <MenuItem value="sport">Sport</MenuItem>
          <MenuItem value="school">School</MenuItem>
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
        {selectedCategory === "other" && (
          <TextField
            label="Custom Category"
            id="customCategory"
            name="customCategory"
            size="small"
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
        )}
        <TextField
          label="Location"
          id="location"
          name="location"
          placeholder="Enter location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          size="small"
          margin="normal"
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          id="outlined-multiline-static"
          label="Details"
          multiline
          rows={2}
          size="small"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          style={{ width: "100%", margin: "10px 0" }}
          sx={{ backgroundColor: "white" }}
        />
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          {/* Add Tag */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <AddIcon />
            <TextField
              placeholder="Add Tag"
              size="small"
              value={tagInput}
              onChange={handleTagInput}
              onBlur={handleAddTag}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
          </div>
        </div>
        {/* Tags Display */}
        <div style={{ marginTop: "10px" }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              onDelete={() => handleDeleteTag(index)}
              style={{ marginRight: "5px", backgroundColor: "#79DAE8" }}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSave(false)}>
            Save
          </Button>
          <Button
            onClick={() => {handleSave(true)}}
            variant="contained"
            color="secondary"
            size="small"
          >
            Save & Automate
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 10 }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
