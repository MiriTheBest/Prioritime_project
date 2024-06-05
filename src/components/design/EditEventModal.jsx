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
  Menu,
  Chip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import AddCommentIcon from "@mui/icons-material/AddComment";
import dayjs from "dayjs";

const EditEventModal = ({ open, onClose, event, onSave, onSaveAndAutomate }) => {
  const [name, setName] = useState(event.name || "");
  const [duration, setDuration] = useState(event.duration || "");
  const [startDate, setStartDate] = useState(event.start_time ? dayjs(event.start_time).format('YYYY-MM-DD') : null);
  const [startTime, setStartTime] = useState(event.start_time ? dayjs(event.start_time) : null);
  const [endDate, setEndDate] = useState(event.end_time ? dayjs(event.end_time).format('YYYY-MM-DD') : null);
  const [endTime, setEndTime] = useState(event.end_time ? dayjs(event.end_time) : null);
  const [location, setLocation] = useState(event.location || "");
  const [details, setDetails] = useState(event.description || "");
  const [isRecurring, setIsRecurring] = useState(event.isRecurring || false);
  const [frequency, setFrequency] = useState(event.frequency || "");
  const [selectedCategory, setSelectedCategory] = useState(event.selectedCategory || "");
  const [tags, setTags] = useState(event.tags || []);
  const [reminder, setReminder] = useState(event.reminder || "");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [type, setType] = useState(event.item_type || "");

  // Update isRecurring state if task.isRecurring changes
  useEffect(() => {
    setIsRecurring(event.isRecurring || false);
  }, [event.isRecurring]);

  const handleSave = async () => {
    const updatedEvent = {
      ...event,
      name,
      duration,
      start_time,
      end_time,
      location,
      description: details,
      isRecurring,
      frequency,
      selectedCategory,
      tags,
      reminder,
      type,
    };

    try {
      await sendUpdatedData(updatedEvent); // Call sendUpdatedTask function with updatedTask
    } catch (error) {
      console.error("Error handling event update:", error);
    }

    onSave(updatedEvent);
    onClose();
  };

  // Handle functions for reminders
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
      aria-labelledby="edit-event-modal-title"
      aria-describedby="edit-event-modal-content"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          backgroundColor: "#f5f5f5",
          boxShadow: 24,
          p: 4,
          borderRadius: 10,
          padding: 20,
        }}
      >
        <Typography variant="h6" id="edit-event-modal-title">
          Edit Event
        </Typography>
        <TextField
          label="Name"
          id="name"
          name="name"
          placeholder="Enter event name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          sx={{ backgroundColor: "white" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="date-time-pickers">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(dayjs(newValue).format('YYYY-MM-DD'))}
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
          <div className="date-time-pickers">
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(dayjs(newValue).format('YYYY-MM-DD'))}
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
            size="small"
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 10 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="green"
            style={{ marginLeft: 10 }}
            onClick={onSaveAndAutomate}
          >
            Save & Automate
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;