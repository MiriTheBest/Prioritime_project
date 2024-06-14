import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DayIconColumn from "./design/DayIconColumn";
import { API_URL } from "./api/config";
import EditTaskModal from "./design/EditTaskModal";
import EditEventModal from "./design/EditEventModal";
import { deleteData } from "./api/deleteData";
import { saveAutomateTask } from "./api/saveAutomateTask";
import axios from "axios";
import moment from 'moment';
import sendUpdatedData from "./api/sendUpdatedData";
import { automateMonthOrDay } from "./api/automateMonthOrDay";

const DayPage = () => {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate; // Access state from location
  const token = localStorage.getItem('token');
  // State to store fetched events
  const [events, setEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [clickedEventId, setClickedEventId] = useState(null); // State to track clicked event ID

  // State to control the visibility of the modals
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const handleAutomate = async () => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    try {
      await automateMonthOrDay(token, formattedDate);
      // Fetch updated event data after re-automation
      await fetchTasksAndEvents();
    } catch (error) {
      console.error("Error re-automating month:", error);
    }
  };

  function createStringForUrl(clickedEvent, originalEvent) {
    let idOrIdDateString;
    if (clickedEvent.allDay) {
      idOrIdDateString = clickedEvent.id;
    } else {
      //const startDateString = clickedEvent.start.toISOString().split("T")[0];
      idOrIdDateString = `${clickedEvent.id}/${originalEvent.start}`;
    }
    return idOrIdDateString;
  }

  const handleDelete = async () => {
    let idOrIdDateString;
    if (clickedEvent) {
      idOrIdDateString = createStringForUrl(clickedEvent, clickedEvent);
      await deleteData(idOrIdDateString, clickedEvent.type);
      console.log("Deleting this day");
    }
    fetchTasksAndEvents();
  };

  const fetchTasksAndEvents = async () => {
    try {
      console.log(selectedDate)
      const date = new Date(selectedDate).toISOString().split('T')[0];
      const taskResponse = await axios.get(
        `${API_URL}/get_task_list/?date=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      ); // Fetch tasks separately
      const taskData = taskResponse.data;

      const response = await axios.get(
        `${API_URL}/get_schedule/${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const eventList = response.data.event_list;

      // Transform tasks and events into FullCalendar's event format
      const transformedEvents = eventList.map(item => {
        return {
          id: item._id,
          title: item.name,
          start: item.start_time,
          end: item.end_time,
          duration: item.duration,
          category: item.category,
          description: item.details,
          location: item.location,
          frequency: item.frequency,
          reminders: item.reminders,
          tags: item.tags,
          type: item.item_type,
          allDay: false,
          backgroundColor: item.backgroundColor || '', // Use existing color or default
          borderColor: item.borderColor || '', // Use existing color or default
        };
      }).filter(event => event !== null);

      const allDayTasks = taskData.task_list.map(task => ({
        id: task._id,
        title: task.name, // Use task name for all-day display
        allDay: true, // Mark as all-day task
        start: task.deadline, // Use deadline as start
        category: task.category,
        location: task.location,
        description: task.details,
        reminders: task.reminders,
        frequency: task.frequency,
        tags: task.tags,
        status: task.status,
        backgroundColor: task.backgroundColor || '', // Use existing color or default
        borderColor: task.borderColor || '', // Use existing color or default
      }));

      // Combine events and all-day tasks
      const combinedEvents = [...transformedEvents, ...allDayTasks];

      setEvents(combinedEvents);
    } catch (error) {
      console.error('Error fetching tasks and events:', error);
    }
  };

  useEffect(() => {
    fetchTasksAndEvents(); // Call the function to fetch data when the component mounts
  }, [selectedDate]);

  const handleEventClick = (info) => {
    // If clicked event ID matches the currently selected one, deselect it
    if (clickedEventId === info.event.id) {
      setEvents(
        events.map((event) => ({
          ...event,
          backgroundColor: event.defaultBackgroundColor || "",
          borderColor: event.defaultBorderColor || "",
        }))
      );
      setClickedEvent(null);
      setClickedEventId(null);
    } else {
      // Update state to reflect newly selected event and color it green
      setClickedEvent(info.event);
      setClickedEventId(info.event.id);
      setEvents(
        events.map((event) =>
          event.id === info.event.id
            ? { ...event, backgroundColor: "green", borderColor: "green" }
            : { ...event, backgroundColor: event.defaultBackgroundColor || "", borderColor: event.defaultBorderColor || "" }
        )
      );
    }
  };
  

  const handleEdit = () => {
    if (clickedEvent) {
      if (clickedEvent.allDay) {
        setIsEditTaskModalOpen(true);
      } else {
        setIsEditEventModalOpen(true);
      }
    }
  };

  const handleSave = async (updatedEvent) => {
    const originalEvent = events.find(event => event.id === updatedEvent.id);
    let urlConcatStr = createStringForUrl(updatedEvent, originalEvent);

    try {
      let response;
      let apiUrl;
      if (!updatedEvent.allDay) {
        apiUrl = `${API_URL}/update_event/${urlConcatStr}`;
        response = await axios.put(apiUrl, updatedEvent, {
          headers: {
            Authorization: token
          }
        }
        );
      } else {
        apiUrl = `${API_URL}/update_task/${urlConcatStr}`;
        response = sendUpdatedData(updatedEvent, token, apiUrl);
      }
      if (response.status === 200) {
      // Remove event from current view if the date is changed
      if (originalEvent.start !== updatedEvent.start) {
        setEvents(events.filter(event => event.id !== updatedEvent.id));
      } else {
        setEvents(events.map(event => 
          (event.id === updatedEvent.id ? updatedEventData : event)
        ));
      }
      setIsEditEventModalOpen(false);
      setIsEditTaskModalOpen(false);
    }
    } catch (error) {
      console.error('Error updating event:', error);
    }
    fetchTasksAndEvents();
  };

  const handleSaveAndAutomate = (updatedTask) => {
    console.log('Save & Automate task:', updatedEvent);
    saveAutomateTask(updatedTask, token);
    fetchTasksAndEvents();
  };

  return (
    <div className="day-container">
      <div className="day-calendar-wrapper">
        {" "}
        {/* New wrapper div */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          slotDuration="00:30:00"
          slotMinTime="00:00:00"
          slotMaxTime="23:59:00"
          initialDate={selectedDate}
          height="100%"
          eventClick={handleEventClick}
          events={events}
        />
      </div>
      <DayIconColumn
        handleEdit={handleEdit}
        handleAutomate={handleAutomate}
        handleDeleteDay={handleDelete}
      />
       {(clickedEvent && isEditEventModalOpen) && (
      <EditEventModal
        open={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        event={clickedEvent}
        onSave={handleSave}        
      />
    )}
    {(clickedEvent && isEditTaskModalOpen) && (
      <EditTaskModal
        open={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={clickedEvent}
        onSave={handleSave}
        onSaveAndAutomate={handleSaveAndAutomate}
      />
    )}
    </div>
  );
};

export default DayPage;
