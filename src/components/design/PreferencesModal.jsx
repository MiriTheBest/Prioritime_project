import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import { MenuItem, Select, Checkbox, FormControlLabel } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { API_URL } from "../api/config";
import { convertMinToDuration } from "../functions/convertMintoDuration";
import { convertDurationToMin } from "../functions/convertDurationToMin";
import { duration } from "moment";

const PreferencesModal = ({ open, onClose, token }) => {
  const [activities, setActivities] = useState([]);
  const [daysOff, setDaysOff] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: "",
    duration: "",
    daytime: "morning",
    days: [],
    description: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [newDayOff, setNewDayOff] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [startTime, setStartTime] = useState("08:00"); // default start time
  const [endTime, setEndTime] = useState("17:00"); // default end time

  useEffect(() => {
    if (open) {
      fetchPreferences();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      savePreferences(activities, daysOff);
    }
  }, [startTime, endTime]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(API_URL + '/get_preferences/', {
        headers: {
          Authorization: token,
        }
      });
      setActivities(response.data.preferences);
      setDaysOff(response.data.days_off);
      setStartTime(response.data.start_time || "08:00");
      setEndTime(response.data.end_time || "17:00");
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.name) {
      setSnackbarMessage("Name is required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    newActivity.duration = newActivity.duration ? convertDurationToMin(newActivity.duration) : newActivity.duration

    let updatedActivities;
    if (editIndex >= 0) {
      // Editing existing activity
      updatedActivities = activities.map((activity, index) =>
        index === editIndex ? newActivity : activity
      );
      setEditIndex(-1); // Reset edit index
    } else {
      // Adding new activity
      if (activities.some(activity => activity.name === newActivity.name)) {
        setSnackbarMessage("Name must be unique!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      updatedActivities = [...activities, newActivity];
    }

    // Update activities state using functional update pattern
    setActivities(updatedActivities);

    // Save preferences with the updated activities
    await savePreferences(updatedActivities, daysOff);

    // Reset form fields
    setNewActivity({ name: "", duration: "", daytime: "morning", days: [], description: "" });
  };

  const handleEditActivity = (index) => {
    setNewActivity({...activities[index], duration: activities[index].duration ? convertMinToDuration(activities[index].duration) : activities[index].duration});
    setEditIndex(index);
  };

  const handleDeleteActivity = async (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    await savePreferences(updatedActivities, daysOff);
  };

  const handleAddDayOff = async () => {
    if (newDayOff && !daysOff.includes(newDayOff)) {
      const updatedDaysOff = [...daysOff, newDayOff];
      setDaysOff(updatedDaysOff);

      // Wait for state to update and then save preferences
      await savePreferences(activities, updatedDaysOff);
      setNewDayOff("");
    }
  };

  const handleDeleteDayOff = async (day) => {
    const updatedDaysOff = daysOff.filter((d) => d !== day);
    setDaysOff(updatedDaysOff);
    await savePreferences(activities, updatedDaysOff);
  };

  const handleDayChange = (dayIndex) => {
    const updatedDays = newActivity.days.includes(dayIndex)
      ? newActivity.days.filter((day) => day !== dayIndex)
      : [...newActivity.days, dayIndex];
    setNewActivity({ ...newActivity, days: updatedDays });
  };

  const savePreferences = async (updatedActivities, updatedDaysOff) => {
    try {
      await axios.post(API_URL + '/update_preferences', {
        preferences: updatedActivities, 
        days_off: updatedDaysOff,
        start_time: startTime,
        end_time: endTime,
      }, {
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto"
        }}
      >
        <h2>Preferences</h2>

        <h3>Activities</h3>
        {activities.map((activity, index) => (
          <Box key={index} display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" width="100%">
              <Box flexGrow={1}>
                <p>
                  <strong>Name:</strong> {activity.name} <br />
                  <strong>Duration:</strong> {activity.duration ? convertMinToDuration(activity.duration) : activity.duration} <br />
                  <strong>Time of Day:</strong> {activity.daytime} <br />
                  <strong>Days:</strong> {activity.days.map(day => daysOfWeek[day]).join(", ")} <br />
                  <strong>Description:</strong> {activity.description}
                </p>
              </Box>
              <IconButton onClick={() => handleEditActivity(index)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteActivity(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          mb={2}
          sx={{ justifyContent: "space-between" }}
        >
          <TextField
            label="Name"
            value={newActivity.name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, name: e.target.value })
            }
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <TextField
            label="Duration"
            value={newActivity.duration}
            onChange={(e) =>
              setNewActivity({ ...newActivity, duration: e.target.value })
            }
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Select
            value={newActivity.daytime}
            onChange={(e) =>
              setNewActivity({ ...newActivity, daytime: e.target.value })
            }
            variant="outlined"
            size="small"
          >
            <MenuItem value="morning">Morning</MenuItem>
            <MenuItem value="afternoon">Afternoon</MenuItem>
            <MenuItem value="evening">Evening</MenuItem>
            <MenuItem value="night">Night</MenuItem>
          </Select>
        </Box>

        <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
          {daysOfWeek.map((day, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={newActivity.days.includes(index)}
                  onChange={() => handleDayChange(index)}
                />
              }
              label={day}
            />
          ))}
        </Box>

        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          value={newActivity.description}
          onChange={(e) =>
            setNewActivity({ ...newActivity, description: e.target.value })
          }
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Button
          onClick={handleAddActivity}
          variant="contained"
          color="primary"
          size="medium"
          sx={{ mb: 2 }}
        >
          {editIndex >= 0 ? "Update" : "Add"}
        </Button>

        <h3>Days Off</h3>
        <Box display="flex" flexWrap="wrap">
          {daysOff.map((day, index) => (
            <Chip
            key={index}
            label={day}
            onDelete={() => handleDeleteDayOff(day)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        mb={2}
        sx={{ justifyContent: "space-between" }}
      >
        <Select
          value={newDayOff}
          onChange={(e) => setNewDayOff(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
          placeholder="Choose a day"
        >
          <MenuItem value="Monday">Monday</MenuItem>
          <MenuItem value="Tuesday">Tuesday</MenuItem>
          <MenuItem value="Wednesday">Wednesday</MenuItem>
          <MenuItem value="Thursday">Thursday</MenuItem>
          <MenuItem value="Friday">Friday</MenuItem>
          <MenuItem value="Saturday">Saturday</MenuItem>
          <MenuItem value="Sunday">Sunday</MenuItem>
        </Select>

        <Button
          onClick={handleAddDayOff}
          variant="contained"
          color="primary"
          size="small"
        >
          Add
        </Button>
      </Box>

      <h3>Day Time</h3>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        mb={2}
        sx={{ justifyContent: "space-between" }}
      >
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          sx={{ mr: 2 }}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  </Modal>
);
};

export default PreferencesModal;
