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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { API_URL } from "../api/config";

const PreferencesModal = ({ open, onClose, token }) => {
  const [activities, setActivities] = useState([]);
  const [daysOff, setDaysOff] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: "",
    duration: "",
    daytime: "morning",
    days: []
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [newDayOff, setNewDayOff] = useState("");
  const [startOfDay, setStartOfDay] = useState("");
  const [endOfDay, setEndOfDay] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    if (open) {
      fetchPreferences();
    }
  }, [open]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(API_URL + '/get_preferences', {
        headers: {
          Authorization: token
        }
      });
      setActivities(response.data.activities);
      setDaysOff(response.data.daysOff);
      setStartOfDay(response.data.startOfDay);
      setEndOfDay(response.data.endOfDay);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const savePreferences = async (preferences) => {
    try {
      let startTimeString = startOfDay.toTimeString().slice(0, 8);
      let endTimeString = endOfDay.toTimeString().slice(0, 8);
      await axios.post(API_URL + '/update_preferences', {
        ...preferences,
        start_time: startTimeString,
        end_rime: endTimeString,
      }, {
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.name) {
      setSnackbarMessage("Name is required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
      return;
    }
    if (activities.some(activity => activity.name === newActivity.name)) {
      setSnackbarMessage("Name must be unique!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
      return;
    }
    let updatedActivities;
    if (editIndex >= 0) {
      updatedActivities = [...activities];
      updatedActivities[editIndex] = newActivity;
      setEditIndex(-1);
    } else {
      updatedActivities = [...activities, newActivity];
    }
    setActivities(updatedActivities);
    savePreferences({ activities: updatedActivities, daysOff });
    setNewActivity({ name: "", duration: "", timeOfDay: "morning", days: [] });
  };

  const handleEditActivity = (index) => {
    setNewActivity(activities[index]);
    setEditIndex(index);
  };

  const handleDeleteActivity = async (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    await savePreferences({ activities: updatedActivities, daysOff, startOfDay, endOfDay });
  };

  const handleAddDayOff = () => {
    if (newDayOff && !daysOff.includes(newDayOff)) {
      const updatedDaysOff = [...daysOff, newDayOff];
      setDaysOff(updatedDaysOff);
      savePreferences({ activities, daysOff: updatedDaysOff });
      setNewDayOff("");
    }
  };

  const handleDeleteDayOff = async (day) => {
    const updatedDaysOff = daysOff.filter((d) => d !== day);
    setDaysOff(updatedDaysOff);
    await savePreferences({ activities, daysOff: updatedDaysOff });
  };

  const handleDayChange = (dayIndex) => {
    const updatedDays = newActivity.days.includes(dayIndex)
      ? newActivity.days.filter((day) => day !== dayIndex)
      : [...newActivity.days, dayIndex];
    setNewActivity({ ...newActivity, days: updatedDays });
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
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <Box flexGrow={1}>
              <p>
                <strong>Name:</strong> {activity.name} <br />
                <strong>Duration:</strong> {activity.duration} <br />
                <strong>Time of Day:</strong> {activity.timeOfDay} <br />
                <strong>Days:</strong> {activity.days.map(day => daysOfWeek[day]).join(", ")}
              </p>
            </Box>
            <IconButton onClick={() => handleEditActivity(index)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteActivity(index)}>
              <DeleteIcon />
            </IconButton>
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
            required
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
            value={newActivity.timeOfDay}
            onChange={(e) =>
              setNewActivity({ ...newActivity, timeOfDay: e.target.value })
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

        <Button
          onClick={handleAddActivity}
          variant="contained"
          color="primary"
          size="medium"
          sx={{ mb: 2 }}
        >
          Add
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" flexDirection="column" mb={2}>
          <h3>Day Configuration</h3>
          <TimePicker
            label="Start of the Day"
            value={startOfDay}
            onChange={(newValue) => setStartOfDay(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            label="End of the Day"
            value={endOfDay}
            onChange={(newValue) => setEndOfDay(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        </LocalizationProvider>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default PreferencesModal;
