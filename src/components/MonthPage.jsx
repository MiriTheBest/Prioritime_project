import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "antd";
import MonthIconColumn from "./design/MonthIconColumn";
import { API_URL } from "./api/config";
import { automateMonthOrDay } from "./api/automateMonthOrDay";
import axios from "axios";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MonthPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventList, setEventData] = useState([]);
  const [currentYearMonth, setCurrentYearMonth] = useState(moment().format("YYYY-MM"));
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const token = localStorage.getItem('token');

  const fetchEventData = async (yearMonth) => {
    try {
      console.log(yearMonth);
      const response = await axios.get(
        `${API_URL}/get_monthly_schedule/${yearMonth}`,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      const fetchedDays = response.data.days;
      setEventData(fetchedDays); // Update event data state with fetched data
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEventData(currentYearMonth);
  }, [currentYearMonth]); // Fetch data whenever currentYearMonth changes

  const onPanelChange = (value, mode) => {
    if (mode === "month") {
      const newYearMonth = value.format("YYYY-MM");
      setCurrentYearMonth(newYearMonth);
    }
    setSelectedDate(null);
  };

  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");//make sure the format is right
    setSelectedDate(formattedDate);
    console.log("Selected date:", formattedDate);
  };

  const handleReAutomate = async () => {
    try {
      console.log("Re-automating this month");
      await automateMonthOrDay(token, "?month=" + currentYearMonth);
      // Fetch updated event data after re-automation
      await fetchEventData(currentYearMonth);
      setAlertSeverity("success");
      setAlertMessage("Month re-automated successfully.");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error re-automating month:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to re-automate month.");
      setAlertOpen(true);
    }
  };

  const setDayOff = async (date, isDayOff) => {
    try {
      const response = await axios.put(
        `${API_URL}/set_day_off/${date}`,
        { day_off: isDayOff },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data);
      setAlertSeverity("success");
      setAlertMessage("Day off status updated successfully.");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error setting day off:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to set day off.");
      setAlertOpen(true);
    }
  };

  const handleSetDayOff = () => {
    if (selectedDate) {//find the right day
      const dayData = eventList.find(day => `${currentYearMonth}-${String(day.date).padStart(2, '0')}` === selectedDate);
      const newDayOffStatus = !dayData?.day_off;
      setDayOff(selectedDate, newDayOffStatus).then(() => {
        fetchEventData(currentYearMonth); // Refresh the data to update UI
      });
    } else {
      setAlertSeverity("error");
      setAlertMessage("Please select a date first.");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const cellRender = (date, mode) => {
    if (mode === "year") {
      return <span>...</span>; //handle the year view to be free of tasks and events
    } else {
      const dayOfMonth = date.date();
      const isCurrentMonth = date.format("YYYY-MM") === currentYearMonth;
  
      // Only render events for the current month
      if (!isCurrentMonth) {
        return null;
      }
  
      const dayData = eventList.find(day => day.date === dayOfMonth);
      const eventsOnDate = dayData?.event_list || [];
      const isDayOff = dayData?.day_off || false;
  
      return (
        <div>
          {eventsOnDate.length > 0 && eventsOnDate.map((event) => (
            <div key={event._id} style={{ marginBottom: "8px" }}>
              <Badge
                status={event.item_type === "task" ? "success" : "warning"}
                text={event.name}
                style={{ marginRight: "8px" }}
              />
            </div>
          ))}
          {isDayOff && <Badge status="error" text="Day Off" />}
        </div>
      );
    }
  };

  return (
    <div className="month-page">
      <div className="month-calendar-wrapper">
        <div className="month-calendar">
          <Calendar
            onSelect={onSelect}
            cellRender={cellRender}
            onPanelChange={onPanelChange}
          />
        </div>
      </div>
      <MonthIconColumn
        handleSetDayOff={handleSetDayOff}
        handleReAutomate={handleReAutomate}
        selectedDate={selectedDate}
        setAlertSeverity={setAlertSeverity}
        setAlertMessage={setAlertMessage}
        setAlertOpen={setAlertOpen}
      />

      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MonthPage;
