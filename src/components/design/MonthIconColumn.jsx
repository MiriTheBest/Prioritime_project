import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AlarmOffIcon from "@mui/icons-material/AlarmOff";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModalConfirm from "./ModalConfirm";

const MonthIconColumn = ({
  handleSetDayOff,
  handleReAutomate,
  selectedDate,
  setAlertSeverity,
  setAlertMessage,
  setAlertOpen
}) => {
  const [isDayOffModalOpen, setIsDayOffModalOpen] = useState(false);
  const [isReAutomateModalOpen, setIsReAutomateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDayOffConfirmation = () => {
    setIsDayOffModalOpen(true);
  };

  const handleReAutomateConfirmation = () => {
    setIsReAutomateModalOpen(true);
  };

  const handleEditClick = () => {
    if (selectedDate) {
      console.log("Selected date:", selectedDate);
      navigate(`/day`, { state: { selectedDate } });
    } else {
      setAlertSeverity("error");
      setAlertMessage("Please select a date first.");
      setAlertOpen(true);
    }
  };

  return (
    <div className="month-icon-column">
      <ModalConfirm
        isOpen={isDayOffModalOpen}
        actionName="set/cancel a day off"
        onClose={() => setIsDayOffModalOpen(false)}
        onConfirm={() => {
          setIsDayOffModalOpen(false);
          handleSetDayOff();
        }}
        className="modal"
      />
      <ModalConfirm
        isOpen={isReAutomateModalOpen}
        actionName="re-automate this month"
        onClose={() => setIsReAutomateModalOpen(false)}
        onConfirm={() => {
          setIsReAutomateModalOpen(false);
          handleReAutomate();
        }}
        className="modal"
      />
      <Tooltip title="Edit">
        <IconButton
          sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}
          onClick={handleEditClick}
        >
          <EditCalendarIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Set a Day Off" onClick={handleDayOffConfirmation}>
        <IconButton sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}>
          <AlarmOffIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Re-Automate This Month"
        onClick={handleReAutomateConfirmation}
      >
        <IconButton sx={{ backgroundColor: "#0AA1DD", margin: "10px" }}>
          <AutorenewRoundedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MonthIconColumn;
