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
import { convertDurationToMin } from "../functions/convertDurationToMin";
import dayjs from "dayjs";

const EditTaskModal = ({ open, onClose, task, onSave, isFromCalendar }) => {
  if(isFromCalendar) {
    const settings = { collapseExtendedProps: true };
    task = task.toPlainObject(settings);
  }
  const categories = ["Personal", "Home", "Sport", "School", "Work", "Other"];
  const [name, setName] = useState(task.title || task.name); // State for name, pre-populated with existing name or empty string
  const [duration, setDuration] = useState(task.duration || ""); // Pre-populate with existing duration

  const [selectedDate, setSelectedDate] = useState(dayjs(task.deadline) || null); // Pre-populate with existing deadline date
  const [selectedTime, setSelectedTime] = useState(dayjs(task.deadline) || null); // Pre-populate with existing deadline time
  const [location, setLocation] = useState(task.location || ""); // Pre-populate with existing location
  const [details, setDetails] = useState(task.description || ""); // Pre-populate with existing description
  const [isRecurring, setIsRecurring] = useState((task.frequency != "Once") || false); // Initialize based on task property
  const [frequency, setFrequency] = useState(task.frequency || "");
  const [customCategory, setCustomCategory] = useState(task.category && !categories.includes(task.category) ? task.category : "");
  const [category, setCategory] = useState(() => {
    if (task.category && !categories.includes(task.category)) {
      setCustomCategory(task.category);
      return "Other";
    }
    return task.category || "";
  });
  
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState("");

  // useEffect(() => {
  //   setIsRecurring(task.isRecurring || false);
  // }, [task.isRecurring]);

  // useEffect to update state when task changes
  useEffect(() => {
    if(task) {
    setName(task.title || task.name);
    setDuration(task.duration || "");
    setSelectedDate(dayjs(task.deadline) ? dayjs(task.deadline) : null);
    setSelectedTime(dayjs(task.deadline) ? dayjs(task.deadline) : null);
    setLocation(task.location || "");
    setDetails(task.description || "");
    setIsRecurring((task.frequency != "Once") || false);
    setFrequency(task.frequency || "");
    if (task.category && !categories.includes(task.category)) {
      setCustomCategory(task.category);
      setCategory("Other");
    } else {
      setCategory(task.category || "");
      setCustomCategory("");
    }
    setTags(task.tags || []);
    }
  }, [task]);

  // Function to combine date and time into a single string
  const formatDeadline = (date, time) => {
    if (!date || !time) return null;
    const combined = `${date.format("YYYY-MM-DD")}T${time.format("HH:mm:ss")}`;
    return combined;
  };

  const handleSave = async () => {
    let durationInMin = convertDurationToMin(duration);
    const deadline = formatDeadline(selectedDate, selectedTime);

    const updatedTask = {
      ...task,
      title: name,
      duration: durationInMin,
      deadline: deadline,
      location: location,
      description: details,
      frequency: isRecurring ? frequency : "Once",
      category: category === "Other" ? customCategory : category,
      tags: tags,
    };
    
    onSave(updatedTask);
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

    if (value !== "Other") {
      setCustomCategory("");
    }
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
            <MenuItem value="Once">Select Frequency</MenuItem>
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
        {category === "Other" && (
          <TextField
            label="Custom Category"
            id="customCategory"
            name="customCategory"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
            sx={{ backgroundColor: "white" }}
          />
        )}

        <TextField
          label="Location"
          id="location"
          name="location"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          sx={{ backgroundColor: "white" }}
        />

        <TextField
          label="Details"
          id="details"
          name="details"
          placeholder="Enter details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          size="small"
          sx={{ backgroundColor: "white" }}
        />
        <div>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={handleTagInput}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
            fullWidth
            margin="normal"
            size="small"
            sx={{ backgroundColor: "white" }}
          />
          <Button
            variant="contained"
            onClick={handleAddTag}
            startIcon={<AddIcon />}
            fullWidth
          >
            Add Tag
          </Button>
          <div style={{ marginTop: "10px" }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(index)}
                style={{ marginRight: "5px", marginTop: "5px" }}
              />
            ))}
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          fullWidth
          style={{ marginTop: "10px" }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default EditTaskModal;