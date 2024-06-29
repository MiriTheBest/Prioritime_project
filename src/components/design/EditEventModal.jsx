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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AddIcon from "@mui/icons-material/Add";
import AddCommentIcon from "@mui/icons-material/AddComment";
import dayjs from "dayjs";

const EditEventModal = ({ open, onClose, event, onSave }) => {
  const settings = { collapseExtendedProps: true }; //transform FullCalendar object to a regular one
  event = event.toPlainObject(settings);
  console.log('event', event);

  const categories = ["Personal", "Home", "Sport", "School", "Work", "Other"];

  const [name, setName] = useState(event.title || "");

  const startDateTime = event.start ? dayjs(event.start) : new Date();
  const endDateTime = event.end ? dayjs(event.end) : new Date();

  const [startDateTimeValue, setStartDateTimeValue] = useState(startDateTime);
  const [endDateTimeValue, setEndDateTimeValue] = useState(endDateTime);

  const [location, setLocation] = useState(event.location || "");
  const [details, setDetails] = useState(event.description || "");
  const [isRecurring, setIsRecurring] = useState((event.frequency != "Once") || false);
  const [frequency, setFrequency] = useState(event.frequency || "");
  const [tags, setTags] = useState(event.tags || []);
  const [reminder, setReminder] = useState(event.reminders || "");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [customCategory, setCustomCategory] = useState(event.category && !categories.includes(event.category) ? event.category : "");
  const [category, setCategory] = useState(() => {
    if (event.category && !categories.includes(event.category)) {
      setCustomCategory(event.category);
      return "Other";
    }
    return event.category || "";
  });

  const handleSave = async () => {
    const updatedEvent = {
      ...event,
      title: name,
      start: dayjs(startDateTimeValue).format("YYYY-MM-DDTHH:mm:ss"),
      end: dayjs(endDateTimeValue).format("YYYY-MM-DDTHH:mm:ss"),
      location: location,
      description: details,
      frequency: isRecurring ? frequency : "Once",
      category: category === "Other" ? customCategory : category,
      tags: tags,
      reminders: reminder,
    };

    onSave(updatedEvent);
    onClose();
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

    if (value !== "Other") {
      setCustomCategory("");
    }
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
          width: 700,
          backgroundColor: "#f5f5f5",
          boxShadow: 24,
          p: 4,
          borderRadius: 10,
          padding: 30,
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
          <div className="date-time-pickers" style={{ marginTop: "10px" }} >
            <DateTimePicker
              label="Start Date & Time"
              value={startDateTimeValue}
              onChange={(newValue) => setStartDateTimeValue(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Start Date & Time"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <DateTimePicker
              label="End Date & Time"
              value={endDateTimeValue}
              onChange={(newValue) => setEndDateTimeValue(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="End Date & Time"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: "white", marginLeft: "10px" }}
                />
              )}
            />
          </div>
        </LocalizationProvider>
        <FormControlLabel
          control={
            <Checkbox
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
          }
          label="Recurring"
        />
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
            <MenuItem value="Once">Once</MenuItem>
            <MenuItem value="Every Day">Every Day</MenuItem>
            <MenuItem value="Every Week">Every Week</MenuItem>
            <MenuItem value="Every 2 Weeks">Every 2 Weeks</MenuItem>
            <MenuItem value="Every Month">Every Month</MenuItem>
          </Select>
        )}
        <Select
          label="Category"
          value={category}
          placeholder="Select Category"
          onChange={handleCategoryChange}
          fullWidth
          size="small"
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
        {category === "Other" && (
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
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
        />
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(index)}
              sx={{ marginRight: "5px", marginBottom: "5px" }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={handleTagInput}
            size="small"
            sx={{ flex: 1, marginRight: "10px", backgroundColor: "white" }}
          />
          <Button
            onClick={handleAddTag}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
          >
            Add Tag
          </Button>
        </div>
        <Button
          onClick={handleReminderClick}
          variant="contained"
          color="primary"
          size="small"
          sx={{ marginTop: "10px" }}
          startIcon={<AddCommentIcon />}
        >
          Add Reminder
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleReminderClose}
        >
          <MenuItem onClick={() => handleReminderSelect("5 minutes before")}>
            5 minutes before
          </MenuItem>
          <MenuItem onClick={() => handleReminderSelect("10 minutes before")}>
            10 minutes before
          </MenuItem>
          <MenuItem onClick={() => handleReminderSelect("15 minutes before")}>
            15 minutes before
          </MenuItem>
          <MenuItem onClick={() => handleReminderSelect("30 minutes before")}>
            30 minutes before
          </MenuItem>
        </Menu>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Typography variant="body1">Selected Reminder: {reminder}</Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            size="small"
          >
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
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
