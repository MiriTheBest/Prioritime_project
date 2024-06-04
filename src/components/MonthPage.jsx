import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "antd";
import MonthIconColumn from "./design/MonthIconColumn";
import { API_URL } from "./api/config";
import axios from "axios";
import moment from "moment";

const MonthPage = () => {
  const eventData = [
    { id: 1, title: "Task 1", date: "2024-05-25", type: "task" },
    { id: 2, title: "Event 2", date: "2024-05-25", type: "event" },
    { id: 3, title: "Event 3", date: "2024-05-25", type: "event" },
    // Add more events as needed
  ];

  //const [eventData, setEventData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [eventList, setEventData] = useState([]);
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Generate current year and month in YY-MM format
        const currentYearMonth = moment().format("YY-MM");

        const response = await axios.get(
          `${API_URL}/get_monthly_schedule/${currentYearMonth}`
        );
        setEventData(response.data); // Update event data state with fetched data
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const onPanelChange = (value, mode) => {
    // Clear selected date on mode change (optional)
    setSelectedDate(null);
  };

  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    console.log("Selected date:", formattedDate);
  };

  const handleReAutomate = () => {
    // Your logic for re-automating
    console.log("Re-automating this month");
    fetchEventData();
  };

  const handleSetDayOff = () => {
    if (selectedDate) {
      setDisabledDates((prevDisabledDates) => [
        ...prevDisabledDates,
        selectedDate,
      ]);
      setSelectedDate(null); // Clear selected date after setting day off
      console.log("Disabled dates:", disabledDates);
      fetchEventData();
    }
  };

  // Cell renderer that displays badges in month view and placeholder in year view
  const cellRender = (date, mode) => {
    if (mode === "year") {
      return <span>...</span>; // Placeholder content in year view
    } else {
      const formattedDate = date.format("YYYY-MM-DD");
      const eventsOnDate = eventData.filter(
        (event) => event.date === formattedDate
      );

      // Create an array of Badge components wrapped in divs for vertical display
      if (eventsOnDate.length > 0) {
        return eventsOnDate.map((event) => (
          <div key={event.id} style={{ marginBottom: "8px" }}>
            <Badge
              status={event.type === "task" ? "success" : "warning"}
              text={event.title}
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
