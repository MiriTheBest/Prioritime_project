import React, { useState } from "react";
import saveAndAlert from "./functions/saveAndAlert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAlert from "./design/AddAlert";
import { convertDurationToMin } from "./functions/convertDurationToMin";
import dayjs from 'dayjs';

const AddPage = () => {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // State for date
  const [selectedTime, setSelectedTime] = useState(null); // State for time
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("once");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]); // State for tags
  const [tagInput, setTagInput] = useState(""); // State for tag input
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const token = localStorage.getItem('token');

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
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

  const handleReset = () => {
    setName("");
    setSelectedDate(null);
    setSelectedTime(null);
    setDuration("");
    setLocation("");
    setDetails("");
    setIsRecurring(false);
    setFrequency("once");
    setSelectedCategory("");
    setTags([]);
    setTagInput("");
  };

  const handleSave = async (status) => {
    if (!name) {
      // If name is empty, show an error message and return without saving
      alert("Name is required.");
      return;
    }

    const selectedDateValue = selectedDate ? selectedDate.toDate() : null;
    const selectedTimeValue = selectedTime ? selectedTime.toDate() : null;

    let durationInMin = duration ? convertDurationToMin(duration) : null;

    let selectedDateTime = selectedDateValue ? new Date(selectedDateValue) : null;
    if (selectedDateTime && selectedTimeValue) {
      selectedDateTime.setHours(selectedTimeValue.getHours());
      selectedDateTime.setMinutes(selectedTimeValue.getMinutes());
      selectedDateTime.setSeconds(selectedTimeValue.getSeconds());
    }

    if (selectedDateTime) {
      selectedDateTime = selectedDateTime.toISOString();
    }

    // Prepare data for database
    const taskData = {
      name,
      selectedDateTime,
      duration: durationInMin,
      location,
      details,
      frequency: isRecurring ? frequency : "once",
      selectedCategory,
      tags,
      status: status,
      type: "task",
    };

    await saveAndAlert(taskData, setAlertSeverity, setAlertMessage, setAlertOpen, token);
  };

  return (
    <div className="add-wrapper">
      {alertOpen && (
        <AddAlert
          open={alertOpen}
          severity={alertSeverity}
          message={alertMessage}
        />
      )}
      <div className="input-container">
        <h2>Add New Task</h2>
        <TextField
          required // Mark name field as required
          label="Name"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
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
          sx={{ backgroundColor: "white" }}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline (Date)"
              value={selectedDate}
              sx={{ backgroundColor: "white" }}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <TimePicker
              label="Deadline (Time)"
              value={selectedTime}
              sx={{ backgroundColor: "white" }}
              onChange={(newValue) => {
                setSelectedTime(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Checkbox
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                id="isRecurring"
              />
            }
            label="Recurring"
          />
        </div>
        {isRecurring && (
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            displayEmpty
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
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
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
          margin="normal"
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          label="Details"
          id="details"
          name="details"
          placeholder="Add additional details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          multiline
          rows={3}
          style={{ width: "100%", margin: "10px 0" }}
          sx={{ backgroundColor: "white" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>
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
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                onDelete={() => handleDeleteTag(index)}
                style={{ marginRight: "5px", marginBottom: "5px", backgroundColor: "#79DAE8" }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="add-menu">
        <Button variant="contained" type="button" onClick={() => handleSave("pending")}>
          Save
        </Button>
        <Button variant="contained" type="button" onClick={() => handleSave("active")}>
          Save & Automate
        </Button>
        <Button variant="contained" type="button" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AddPage;
