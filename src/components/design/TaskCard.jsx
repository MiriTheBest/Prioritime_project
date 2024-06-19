import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import EditTaskModal from "./EditTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

const TaskCard = ({ task, onMarkDone, onSave, selected, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsModalOpen(true);
  };

  const handleMarkDone = () => {
    onMarkDone(task); // Call the provided onMarkDone prop to handle status change
  };

  const handleShowDetailsModal = () => {
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <Card sx={{ minWidth: 275, margin: 1, border: selected ? "4px solid green" : "none" }} onClick={() => onClick(task)}>
      <CardMedia
        sx={{ height: 50 }}
        image="/images/card-header-2.png"
        title="card-header"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {task.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {task.duration}
        </Typography>
        <Typography variant="body2">{task.description}</Typography>
      </CardContent>
      <CardActions>
      <Button size="small" onClick={handleShowDetailsModal} style={{ color: "#0AA1DD" }}>
          Show
        </Button>

        <Button size="small" onClick={handleOpenEditModal}>
          Edit
        </Button>
        
        <Button size="small" onClick={handleMarkDone} style={{ color: "#CA4E79" }}>
          Done
        </Button>
      </CardActions>
      {isModalOpen && (
        <EditTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={task}
          onSave={onSave}
          isFromCalendar={false}
        />
      )}
      {isDetailsModalOpen && (
        <TaskDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          task={task}
        />
      )}
    </Card>
  );
};

export default TaskCard;
