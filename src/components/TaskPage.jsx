import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import TaskCard from "./design/TaskCard";
import sendUpdatedData from "./api/sendUpdatedData";
import {
  sortTasksByName,
  sortTasksByCategory,
  sortTasksByDuration,
  sortTasksByTags,
} from "./functions/sortData";
import { API_URL } from "./api/config";
import axios from "axios";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const [searchText, setSearchText] = useState("");
  const [sortMethod, setSortMethod] = useState("name"); // Default sort by name
  const [sortAnchorEl, setSortAnchorEl] = useState(null); // Anchor element for sort menu
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSelectingForAutomation, setIsSelectingForAutomation] = useState(false);

  useEffect(() => {
    // Fetch tasks from API when component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL + '/get_task_list', {
          headers: {
            Authorization: token,
          }
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget); // Open sort menu
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null); // Close sort menu
  };

  const handleSortChange = (method) => {
    setSortMethod(method); // Update the sortMethod state
  };

  const handleMarkDone = async (task) => {
    try {
      // Construct the URL with the task ID
      const url = `${API_URL}/delete_task/${task.id}`;
      // Call the delete_task API endpoint with the constructed URL
      await axios.delete(url);
      // Update the local state to remove the deleted task
      setTasks(tasks.filter((t) => t.id !== task.id));
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
    fetchTasks();
  };
  const handleSave = (updatedTask) => {
    // Find the task to update based on its ID
    const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
    const apiUrl = `${API_URL}/update_task/${updatedTask.id}`;
    const response = sendUpdatedData(updatedTask, token, apiUrl);

    if (response.status === 200) {
    if (taskIndex !== -1) {
      // Update the task in the state
      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      setTasks(newTasks);
    } else {
      console.error("Task with ID", updatedTask.id, "not found");
    }
    fetchTasks();
  }
  };

  // Filter tasks based on search text and status
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchText.toLowerCase()) &&
      task.status === "pending",
  );

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Sort tasks based on the selected sort method
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
    case "tags":
      sortedTasks = sortTasksByTags(sortedTasks);
      break;
    default:
      break;
  }

  const handleAutomateClick = async () => {
    if (isSelectingForAutomation) {
      if (selectedTasks.length > 0) {
        // If already selecting and there are selected tasks
        try {
          await axios.post(API_URL + '/automate_task', { tasks: selectedTasks });
          alert("Tasks sent for automation");
          setSelectedTasks([]); // Clear selected tasks after sending
        } catch (error) {
          console.error("Error sending tasks for automation", error);
          alert("Failed to send tasks for automation");
        }
      } else {
        alert("Please select at least one task to automate.");
      }
    }
    setIsSelectingForAutomation(!isSelectingForAutomation);
  };

  const handleTaskClick = (task) => {
    if (!isSelectingForAutomation) return; // Don't handle click if not in selection mode

    const taskId = task.id;
    const newSelectedTasks = [...selectedTasks];
    const taskIndex = newSelectedTasks.indexOf(taskId);

    if (taskIndex !== -1) {
      newSelectedTasks.splice(taskIndex, 1);
    } else {
      newSelectedTasks.push(taskId);
    }
    setSelectedTasks(newSelectedTasks);
    console.log("Selected tasks: ", newSelectedTasks);
  };


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
            style={{ backgroundColor: "white", marginBottom: "15px" }} // Style search bar
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
      </Grid>
      <Grid container spacing={2}>
        {sortedTasks.map((task) => (
          <Grid item key={task.id} xs={12} md={6} lg={4}>
            <TaskCard
              task={task}
              onMarkDone={handleMarkDone}
              onSave={handleSave}
              selected={selectedTasks.includes(task.id)}
              onClick={handleTaskClick}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TaskPage;
