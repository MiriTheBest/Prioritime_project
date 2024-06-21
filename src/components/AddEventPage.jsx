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

const AddEventPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
  const [tags, setTags] = useState([]); // State for tags
  const [reminder, setReminder] = useState(""); // State for reminder
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for reminder menu
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
    setIsRecurring(false);
    setFrequency("");
    setTags([]);
    setReminder("");
    setTagInput("");
  };

  const handleSave = async () => {
    // 1. Extract task data from form fields
    const name = nameRef.current.value;
    if (!name || !startDate || !endDate) {
      setMessage("Name and dates are required");
      setSnackbarOpen(true); // Show the snackbar alert
      setTimeout(() => setSnackbarOpen(false), 5000);
      return;
  }

    // Get date and time from date pickers (assuming using @mui/x-date-pickers)
    const startDateValue = startDate ? startDate.toDate() : null;
    const startTimeValue = startTime ? startTime.toDate() : null;
    const endDateValue = endDate ? endDate.toDate() : null;
    const endTimeValue = endTime ? endTime.toDate() : null;


    if (startDateValue && startTimeValue) {
      startDateValue.setHours(startTimeValue.getHours());
      startDateValue.setMinutes(startTimeValue.getMinutes());
      startDateValue.setSeconds(startTimeValue.getSeconds());
    }

    if(startDateValue) {
      startDateValue = startDateValue.toISOString;
    }

    if (endDateValue && endTimeValue) {
      endDateValue.setHours(endTimeValue.getHours());
      endDateValue.setMinutes(endTimeValue.getMinutes());
      endDateValue.setSeconds(endTimeValue.getSeconds());
    }

    if(endDateValue) {
      endDateValue = endDateValue.toISOString;
    }

    const location = locationRef.current.value;
    const details = detailsRef.current.value;
    const isRecurring = isRecurring;
    const frequency = isRecurring ? frequency : "Once";

    const selectedCategory = selectedCategory;

    // Extract tags from state array
    const tags = [...tags]; // Create a copy to avoid mutation

    // Set reminder to "once" if not chosen
    const reminder = reminder ? reminder : "Once";

    // 3. Prepare data for database
    const eventData = {
      name,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      details,
      isRecurring,
      frequency,
      selectedCategory,
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
          sx={{ backgroundColor: "white", marginBottom: "1rem" }} // Added styling for white background
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
                /> // Added styling for white background
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
                /> // Added styling for white background
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
                /> // Added styling for white background
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
                /> // Added styling for white background
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
            <MenuItem value="">Select Frequency</MenuItem>
            <MenuItem value="everyDay">Every Day</MenuItem>
            <MenuItem value="everyWeek">Every Week</MenuItem>
            <MenuItem value="every2Weeks">Every 2 Weeks</MenuItem>
            <MenuItem value="everyMonth">Every Month</MenuItem>
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
            fullWidth
            sx={{ backgroundColor: "white", marginTop: "10px" }}
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
          sx={{ backgroundColor: "white" }} // Added styling for white background
        />
        <TextField // Replaced TextareaAutosize with TextField
          label="Details"
          id="details"
          name="details"
          placeholder="Add additional details (optional)"
          inputRef={detailsRef}
          multiline // Enables multiline input
          rows={3} // Sets the initial number of rows
          style={{ width: "100%", margin: "10px 0" }}
          sx={{ backgroundColor: "white" }} // White background for details
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
          {/* Add Reminder */}
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
