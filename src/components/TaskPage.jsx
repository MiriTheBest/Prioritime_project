import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import TaskCard from "./design/TaskCard";
import sendUpdatedData from "./api/sendUpdatedData";
import {
  sortTasksByName,
  sortTasksByCategory,
  sortTasksByDuration,
  sortTasksByDeadline,
  sortTasksByTags,
} from "./functions/sortData";
import { API_URL } from "./api/config";
import axios from "axios";
import { convertMinToDuration } from "./functions/convertMintoDuration";
import { deleteData } from "./api/deleteData";

const TaskPage = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const [tasks, setTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecurringTasks, setShowRecurringTasks] = useState(false);
  const token = localStorage.getItem("token");
  const [searchText, setSearchText] = useState("");
  const [sortMethod, setSortMethod] = useState("name");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSelectingForAutomation, setIsSelectingForAutomation] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    setLoading(true);//show loading bar
    try {
      const response = await axios.get(API_URL + "/get_task_list/", {
        headers: {
          Authorization: token,
        },
      });
      const tasksWithConvertedDuration = response.data.task_list.map(task => ({
        ...task,
        id: task._id,
        duration: task.duration ? convertMinToDuration(task.duration) : "",
      }));//convert minutes to string in duration for better view
      setTasks(tasksWithConvertedDuration);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAlertSeverity("error");
      setAlertMessage("Error fetching tasks");
      setAlertOpen(true);
      setLoading(false);
    }
    fetchRecurringTasks();
  };

  const fetchRecurringTasks = async () => {//separate function to get recurring tasks
    setLoading(true);
    try {
      const response = await axios.get(API_URL + "/get_recurring_tasks", {
        headers: {
          Authorization: token,
        },
      });
      const tasksWithConvertedDuration = response.data.recurring_tasks.map(task => ({
        ...task,
        id: task._id,
        duration: task.duration ? convertMinToDuration(task.duration) : "",
      }));
      setRecurringTasks(tasksWithConvertedDuration);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recurring tasks:", error);
      setAlertSeverity("error");
      setAlertMessage("Error fetching recurring tasks");
      setAlertOpen(true);
      setLoading(false);
    }
  };


  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (method) => {
    setSortMethod(method);
    setSortAnchorEl(null);
  };

  const handleMarkDone = async (task) => {
    try {
      await deleteData(task.id, task.item_type);
      setTasks(tasks.filter((t) => t.id !== task.id));
      setAlertSeverity("success");
      setAlertMessage("Task deleted successfully");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error deleting task:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to delete task");
      setAlertOpen(true);
    }
    fetchTasks();
  };

  const handleSave = async (updatedTask) => {
    try {
      const apiUrl = `${API_URL}/update_task/${updatedTask.id}`;
      await sendUpdatedData(updatedTask, token, apiUrl);
      setAlertSeverity("success");
      setAlertMessage("Task updated successfully");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error updating task:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to update task");
      setAlertOpen(true);
    }
    fetchTasks();
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleAutomateClick = async () => {
    if (isSelectingForAutomation) {
      if (selectedTasks.length > 0) {//if at least one task is seslected for scheduling
        try {
          const response = await axios.post(
            API_URL + "/automatic_scheduling",
            { tasks: selectedTasks },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          const scheduledTasks = response.data.scheduled_tasks;
          const formattedMessage = scheduledTasks.map(task => {
            if (task.start_time) {
              return `"${task.name}" scheduled to ${task.start_time.replace('T',' ')}`;
            } else {
              return `"${task.name}" not scheduled`;
            }
          }).join("\n");

          setAlertSeverity("success");
          setAlertMessage(formattedMessage);
          setAlertOpen(true);
          setSelectedTasks([]);
          fetchTasks();
        } catch (error) {
          console.error("Error sending tasks for automation", error);
          setAlertSeverity("error");
          setAlertMessage("Failed to send tasks for automation");
          setSelectedTasks([]);
          setAlertOpen(true);
        }
      } else {
        setAlertSeverity("error");
        setAlertMessage("Please select at least one task to automate.");
        setAlertOpen(true);
      }
    }
    setIsSelectingForAutomation(!isSelectingForAutomation);//reset the UI
  };

  const handleTaskClick = (task) => {//adds green border for selected tasks
    if (!isSelectingForAutomation) return;

    const taskId = task.id;
    const newSelectedTasks = [...selectedTasks];
    const taskIndex = newSelectedTasks.indexOf(taskId);

    if (taskIndex !== -1) {
      newSelectedTasks.splice(taskIndex, 1);
    } else {
      newSelectedTasks.push(taskId);
    }
    setSelectedTasks(newSelectedTasks);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleToggleRecurringTasks = () => {
    setShowRecurringTasks(!showRecurringTasks);
  };

  const tasksToDisplay = showRecurringTasks ? recurringTasks : tasks;

  const filteredTasks = tasksToDisplay.filter(//unscheduled tasks have status pending for locating them
    (task) =>
      task.name.toLowerCase().includes(searchText.toLowerCase()) &&
      task.status === "pending"
  );

  let sortedTasks = filteredTasks;
  switch (sortMethod) {
    case "name":
      sortedTasks = sortTasksByName(sortedTasks);
      break;
    case "category":
      sortedTasks = sortTasksByCategory(sortedTasks);
      break;
    case "duration":
      sortedTasks = sortTasksByDuration(sortedTasks);
      break;
    case "deadline":
      sortedTasks = sortTasksByDeadline(sortedTasks);
      break;
    case "tags":
      sortedTasks = sortTasksByTags(sortedTasks);
      break;
    default:
      break;
  }

  return (
    <div style={{ padding: "3rem" }}>
      <h1>My tasks</h1>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs>
          <TextField
            label="Search Tasks"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearchChange}
            style={{ backgroundColor: "white", marginBottom: "15px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleSortMenuOpen}
            style={{ backgroundColor: "#0AA1DD", marginLeft: "1rem" }}
          >
            <SortIcon />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortMenuClose}
          >
            <MenuItem onClick={() => handleSortChange("name")}>
              Sort by Name
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("category")}>
              Sort by Category
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("duration")}>
              Sort by Duration
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("deadline")}>
              Sort by Deadline
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("tags")}>
              Sort by Tags
            </MenuItem>
          </Menu>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleAutomateClick}
            style={{
              backgroundColor: isSelectingForAutomation ? "green" : "#0AA1DD",
            }}
          >
            {isSelectingForAutomation ? "Submit" : "Automate"}
          </Button>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={showRecurringTasks}
                onChange={handleToggleRecurringTasks}
                color="primary"
              />
            }
            label="Recurring Tasks"
          />
        </Grid>
      </Grid>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {sortedTasks.map((task) => (
            <Grid item key={task.id} xs={12} md={6} lg={4}>
              <TaskCard //task card for each task
                task={task}
                onMarkDone={handleMarkDone}
                onSave={handleSave}
                selected={isSelectingForAutomation && selectedTasks.includes(task.id)}
                onClick={handleTaskClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%", whiteSpace: "pre-line" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TaskPage;
