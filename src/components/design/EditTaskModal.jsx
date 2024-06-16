import React, { useState, useEffect } from "react";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import { convertMinToDuration } from "../functions/convertMintoDuration";
import { convertDurationToMin } from "../functions/convertDurationToMin";

const EditTaskModal = ({ open, onClose, task, onSave, onSaveAndAutomate, isFromCalendar }) => {
  if(isFromCalendar) {
    const settings = { collapseExtendedProps: true };
    task = task.toPlainObject(settings);
  }
  const categories = ["personal", "home", "sport", "school", "work", "other"];
  const [name, setName] = useState(task.title || task.name); // State for name, pre-populated with existing name or empty string
  const [duration, setDuration] = useState(task.duration || ""); // Pre-populate with existing duration

  const [selectedDate, setSelectedDate] = useState(task.deadline?.date || null); // Pre-populate with existing deadline date
  const [selectedTime, setSelectedTime] = useState(task.deadline?.time || null); // Pre-populate with existing deadline time
  const [location, setLocation] = useState(task.location || ""); // Pre-populate with existing location
  const [details, setDetails] = useState(task.description || ""); // Pre-populate with existing description
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false); // Initialize based on task property
  const [frequency, setFrequency] = useState(task.frequency || "");
  const [category, setCategory] = useState(() => {
    if (task.category && !categories.includes(task.category)) {
      return task.category;
    }
    return "";
  });
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState("");
  

  // Update isRecurring state if task.isRecurring changes
  useEffect(() => {
    setIsRecurring(task.isRecurring || false);
  }, [task.isRecurring]);

  const handleSave = async (automate) => {
    let durationInMin = convertDurationToMin(duration);

    const updatedTask = {
      ...task,
      title: name,
      duration: durationInMin,
      deadline: {
        date: selectedDate,
        time: selectedTime,
      },
      location,
      description: details,
      isRecurring,
      frequency,
      category: category,
      tags,
    };

    if (automate) {
      onSaveAndAutomate(updatedTask);
    } else {
      onSave(updatedTask);
    }

    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleTagInput = (event) => {
    setTagInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategory(value);

    if (value === "other") {
      // Initialize custom category with current task's category if it's not one of the predefined ones
      setCustomCategory(task.category || "");
    }
  };

  const [customCategory, setCustomCategory] = useState("");

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
          width: 700,
          backgroundColor: "#f5f5f5",
          boxShadow: 24,
          p: 4,
          borderRadius: 10,
          padding: 30,
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
          value={name}
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
              sx={{ backgroundColor: "white", marginRight: 1 }}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <TimePicker
              label="Deadline (Time)"
              value={selectedTime}
              sx={{ backgroundColor: "white", marginRight: 1 }}
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
          value={category}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          fullWidth
          size="small"
          displayEmpty
          sx={{ backgroundColor: "white", marginTop: "10px" }}
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
          {category && !categories.includes(category) && (
            <MenuItem disabled value={category}>
              {category} (Custom)
            </MenuItem>
          )}
        </Select>
        {category === "other" && (
          <TextField
            label="Custom Category"
            id="customCategory"
            name="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
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
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
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

        <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: 10 }}>
          <Button variant="contained" color="primary" onClick={() => handleSave(false)}>
            Save
          </Button>
          <Button
            onClick={() => handleSave(true)}
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

export default EditTaskModal;
