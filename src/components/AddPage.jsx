import React, { useState, useRef } from "react";
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

const AddPage = () => {
  const [selectedDate, setSelectedDate] = useState(null); // State for date
  const [selectedTime, setSelectedTime] = useState(null); // State for time
  const durationRef = useRef(null); // Use ref for non-controlled duration input
  const locationRef = useRef(null); // Use ref for non-controlled location input
  const detailsRef = useRef(null); // Use ref for non-controlled details input
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("once");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]); // State for tags
  const [tagInput, setTagInput] = useState(""); // State for tag input
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

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
    setSelectedDate(null);
    setSelectedTime(null);
    durationRef.current.value = "";
    locationRef.current.value = "";
    detailsRef.current.value = "";
    setIsRecurring(false);
    setFrequency("once");
    setTags([]);
    setReminder("");
    setTagInput("");
  };

  const handleSave = async (status) => {
    const nameInput = document.getElementById("name");
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
        // If name is empty, show an error message and return without saving
        alert("Name is required.");
        return;
    }

    const selectedDateValue = selectedDate ? selectedDate.toDate() : null; 
    const selectedTimeValue = selectedTime ? selectedTime.toDate() : null; 
    
    const durationElement = document.getElementById("duration").value;
    const duration = durationElement ? durationElement.value : null;

    if(duration) 
      duration = convertDurationToMin(duration);
    
    const locationElement = document.getElementById("location");
    const location = locationElement ? locationElement.value : null;

    const detailsElement = document.getElementById("details").value;
    const details = detailsElement ? detailsElement.value : null;

    const isRecurringElement = document.getElementById("isRecurring").checked;
    const isRecurring = isRecurringElement ? isRecurringElement.checked : null;

    const frequency = isRecurring
      ? document.getElementById("frequency").value
      : "once";
    const selectedCategoryElement = document.getElementById("selectedCategory").value;
    const selectedCategory = selectedCategoryElement ? selectedCategoryElement.value : null;

    const tags = [...tags];

    const selectedDateTime = selectedDateValue ? new Date(selectedDateValue) : null;

    if (selectedDateTime && selectedTimeValue) {
      selectedDateTime.setHours(selectedTimeValue.getHours());
      selectedDateTime.setMinutes(selectedTimeValue.getMinutes());
      selectedDateTime.setSeconds(selectedTimeValue.getSeconds());
    }

    if(selectedDateTime) {
      selectedDateTime = selectedDateTime.toISOString;
    }
    
    // 2. Validate data (optional)
    // ... perform validation checks (e.g., required fields, valid date/time format)

    // 3. Prepare data for database
    const taskData = {
      name,
      selectedDateTime,
      duration,
      location,
      details,
      frequency,
      selectedCategory,
      tags,
      status,
      type: "task",
    };

    await saveAndAlert(taskData, setAlertSeverity, setAlertMessage, setAlertOpen);
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
          fullWidth
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          label="Duration"
          id="duration"
          name="duration"
          placeholder="Enter duration (e.g., 1 hour)"
          inputRef={durationRef}
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
          inputRef={locationRef}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
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
        <div style={{ display: "flex", alignItems: "center" }}>
  <div style={{ marginRight: "10px" }}>
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
