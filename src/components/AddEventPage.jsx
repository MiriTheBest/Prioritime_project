import React, { useState, useRef } from "react";
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
  Menu,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCommentIcon from "@mui/icons-material/AddComment";
import saveAndAlert from "./functions/saveAndAlert";
import AddAlert from "./design/AddAlert";
import dayjs from "dayjs";

const AddEventPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);//Initialize empty fields
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const detailsRef = useRef(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Once");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [reminder, setReminder] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagInput, setTagInput] = useState("");
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

  const handleReminderClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleReminderClose = () => {
    setAnchorEl(null);
  };

  const handleReminderSelect = (value) => {
    setReminder(value);
    handleReminderClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    nameRef.current.value = "";
    locationRef.current.value = "";
    detailsRef.current.value = "";
    setSelectedCategory("");
    setCustomCategory("");
    setIsRecurring(false);
    setFrequency("Once");
    setTags([]);
    setReminder("");
    setTagInput("");
  };

  const handleSave = async () => {
    // 1. Extract task data from form fields
    const name = nameRef.current.value;
    if (!name || !startDate || !endDate) {
      setMessage("Name and dates are required");
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 5000);
      return;
  }

    // Get date and time from date pickers and adjust them for backend in the right format
    let startDateValue = startDate ? startDate.toDate() : null;
    let startTimeValue = startTime ? startTime.toDate() : null;
    let endDateValue = endDate ? endDate.toDate() : null;
    let endTimeValue = endTime ? endTime.toDate() : null;


    if (startDateValue && startTimeValue) {
      startDateValue.setHours(startTimeValue.getHours());
      startDateValue.setMinutes(startTimeValue.getMinutes());
      startDateValue.setSeconds(startTimeValue.getSeconds());
    }

    if(startDateValue) {
      startDateValue = dayjs(startDateValue).format("YYYY-MM-DDTHH:mm:ss");
    }

    if (endDateValue && endTimeValue) {
      endDateValue.setHours(endTimeValue.getHours());
      endDateValue.setMinutes(endTimeValue.getMinutes());
      endDateValue.setSeconds(endTimeValue.getSeconds());
    }

    if(endDateValue) {
      endDateValue = dayjs(endDateValue).format("YYYY-MM-DDTHH:mm:ss");
    }

    const location = locationRef.current.value;
    const details = detailsRef.current.value;

    const finalSelectedCategory = selectedCategory === "Other" ? customCategory : selectedCategory;

    const eventData = {//create an object
      name,
      start_time: startDateValue,
      end_time: endDateValue,
      location,
      description: details,
      isRecurring,
      frequency: isRecurring ? frequency : "Once",
      category: finalSelectedCategory,
      tags,
      reminder,
      status: "active",
      type: "event",
    };

    await saveAndAlert(eventData, setAlertSeverity, setAlertMessage, setAlertOpen, token);
    handleReset();
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
        <h2>Add New Event</h2>
        <TextField
          required // Mark name field as required
          label="Name"
          id="name"
          name="name"
          placeholder="Enter event name"
          fullWidth
          inputRef={nameRef}
          sx={{ backgroundColor: "white", marginBottom: "1rem" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            className="date-time-pickers"
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <DatePicker
              label="Start Date"
              sx={{ backgroundColor: "white" }}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white" }}
                /> 
              )}
            />
            <TimePicker
              label="Start Time"
              sx={{ backgroundColor: "white" }}
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white" }}
                /> 
              )}
            />
          </div>
          <div
            className="date-time-pickers"
            style={{ display: "flex", gap: "1rem" }}
          >
            <DatePicker
              label="End Date"
              sx={{ backgroundColor: "white" }}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <TimePicker
              label="End Time"
              sx={{ backgroundColor: "white" }}
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white" }}
                />
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
            fullWidth
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "white",
            }}
          >
            <MenuItem value="Once">Select Frequency</MenuItem>
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
          displayEmpty
          sx={{ backgroundColor: "white", marginTop: "10px" }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Personal">Personal</MenuItem>
          <MenuItem value="Home">Home</MenuItem>
          <MenuItem value="Sport">Sport</MenuItem>
          <MenuItem value="School">School</MenuItem>
          <MenuItem value="Work">Work</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {selectedCategory === "Other" && (
          <TextField
            label="Custom Category"
            id="customCategory"
            name="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
        )}
        <TextField
          label="Location"
          id="location"
          name="location"
          placeholder="Enter location (optional)"
          inputRef={locationRef}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          label="Details"
          id="details"
          name="details"
          placeholder="Add additional details (optional)"
          inputRef={detailsRef}
          multiline
          rows={3}
          style={{ width: "100%", margin: "10px 0" }}
          sx={{ backgroundColor: "white" }}
        />
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            <AddCommentIcon fontSize="small" />
            <Button size="small" onClick={handleReminderClick}>
              {reminder ? `Reminder: ${reminder}` : "Add Reminder"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleReminderClose}
            >
              <MenuItem onClick={() => handleReminderSelect("15 min")}>
                15 min
              </MenuItem>
              <MenuItem onClick={() => handleReminderSelect("30 min")}>
                30 min
              </MenuItem>
              <MenuItem onClick={() => handleReminderSelect("1 hour")}>
                1 hour
              </MenuItem>
              <MenuItem onClick={() => handleReminderSelect("1 day")}>
                1 day
              </MenuItem>
            </Menu>
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
      </div>
      <div className="add-menu">
        <Button variant="contained" type="button" onClick={handleSave}>
        Save
        </Button>
        <Button variant="contained" type="button" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={10000}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
    </div>
  );
};

export default AddEventPage;
