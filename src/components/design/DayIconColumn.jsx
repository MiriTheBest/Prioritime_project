import React, { useState } from "react";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModalConfirm from "./ModalConfirm";

const DayIconColumn = ({ handleEdit, handleAutomate, handleDeleteDay }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);

  const handleDeleteConfirmation = () => {
    setIsDeleteModalOpen(true);
  };

  const handleAutomateConfirmation = () => {
    setIsAutomateModalOpen(true);
  };

  return (
    <div className="icon-column">
      <ModalConfirm
        isOpen={isDeleteModalOpen}
        actionName="delete this task/event"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDeleteDay();
        }}
      />
      <ModalConfirm
        isOpen={isAutomateModalOpen}
        actionName="automate this day"
        onClose={() => setIsAutomateModalOpen(false)}
        onConfirm={() => {
          setIsAutomateModalOpen(false);
          handleAutomate();
        }}
      />{" "}
      {/* IconColumn with flexbox */}
      <Tooltip title="Edit Task/Event">
        <IconButton sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}
        onClick={handleEdit}>
          <EditCalendarIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Task/Event">
        <IconButton
          sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}
          onClick={handleDeleteConfirmation}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Automate">
        <IconButton
          sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}
          onClick={handleAutomateConfirmation}
        >
          <AutorenewRoundedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default DayIconColumn;
