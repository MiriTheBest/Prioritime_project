import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "antd";
import MonthIconColumn from "./design/MonthIconColumn";
import { API_URL } from "./api/config";
import axios from "axios";
import moment from "moment";

const MonthPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [eventList, setEventData] = useState([]);
  const [currentYearMonth, setCurrentYearMonth] = useState(moment().format("YYYY-MM"));

  const fetchEventData = async (yearMonth) => {
    try {
      console.log(yearMonth)
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_URL}/get_monthly_schedule/${yearMonth}`,
        {
          headers: {
            Authorization: `${token}` // Add token to Authorization header
          }
        }
      );
      setEventData(response.data.days); // Update event data state with fetched data
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
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    console.log("Selected date:", formattedDate);
  };

  const handleReAutomate = () => {
    console.log("Re-automating this month");
    fetchEventData(currentYearMonth);
  };

  const handleSetDayOff = () => {
    if (selectedDate) {
      setDisabledDates((prevDisabledDates) => [
        ...prevDisabledDates,
        selectedDate,
      ]);
      setSelectedDate(null); // Clear selected date after setting day off
      console.log("Disabled dates:", disabledDates);
      fetchEventData(currentYearMonth);
    }
  };

  const cellRender = (date, mode) => {
    if (mode === "year") {
      return <span>...</span>; // Placeholder content in year view
    } else {
      const dayOfMonth = date.date();
      const isCurrentMonth = date.format("YYYY-MM") === currentYearMonth;

      // Only render events for the current month
      if (!isCurrentMonth) {
        return null;
      }

      const eventsOnDate = eventList.find(day => day.date === dayOfMonth)?.event_list || [];
      //console.log("Date:", dayOfMonth, "Events:", eventsOnDate); // Debugging statement

      if (eventsOnDate.length > 0) {
        return eventsOnDate.map((event) => (
          <div key={event._id} style={{ marginBottom: "8px" }}>
            <Badge
              status={event.item_type === "task" ? "success" : "warning"}
              text={event.name}
              style={{ marginRight: "8px" }}
            />
          </div>
        ));
      }

      return null; // Return null for empty dates to avoid unnecessary elements
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
            disabledDate={(current) =>
              disabledDates.includes(current.format("YYYY-MM-DD"))
            }
          />
        </div>
      </div>
      <MonthIconColumn
        handleSetDayOff={handleSetDayOff}
        handleReAutomate={handleReAutomate}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default MonthPage;