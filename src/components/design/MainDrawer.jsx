import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskIcon from "@mui/icons-material/Task";
import MoreTimeIcon from "@mui/icons-material/MoreTime";

function MainDrawer({ open, onClose }) {
  const navigate = useNavigate();

  const handleListItemClick = (text) => {
    onClose(); // Close the drawer after selection

    switch (text) {
      case "Month":
        navigate("/month");
        break;
      case "Day":
        const today = new Date().toISOString().split("T")[0]; // Get today's date string
        navigate(`/day`, { state: { selectedDate: today } }); // Pass today's date
        break;
      case "Tasks":
        navigate("/tasks");
        break;

      case "Add Task":
        navigate("/add");
        break;

      case "Add Event":
        navigate("/add_event");
        break;

      case "Tasks":
        navigate("/tasks");
        break;

      default:
        console.warn("Unexpected item clicked:", text);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {["Month", "Day", "Tasks"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleListItemClick(text)}>
              <ListItemIcon>
                {index === 0 && <CalendarMonthIcon />} 
                {index === 1 && <CalendarTodayIcon />}
                {index === 2 && <TaskIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Add Task", "Add Event"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleListItemClick(text)}>
              <ListItemIcon>
                {index % 2 === 0 ? <AddTaskIcon /> : <MoreTimeIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer open={open} onClose={onClose}>
      {DrawerList}
    </Drawer>
  );
}

export default MainDrawer;
