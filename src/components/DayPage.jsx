import React, {useEffect, useState} from "react";
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

const DayPage = () => {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate; // Access state from location

    // State to store fetched events
  const [events, setEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);

  // State to store event names for display in the calendar
  const [eventNames, setEventNames] = useState([]);

  // State to control the visibility of the modals
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const handleAutomate = () => {
    // Your logic for re-automating
    console.log("Automating this day");
  };

  const handleDelete = () => {
    let idOrIdDateString;
    if (clickedEvent) {
      if (clickedEvent.allDay) {
        idOrIdDateString = clickedEvent.id;
      } else {
        const startDateString = clickedEvent.start.toISOString().split("T")[0];
        idOrIdDateString = `${id}/${startDateString}`;
      }
      deleteData(idOrIdDateString);
    console.log("Deleting this day");
    }
    fetchTasksAndEvents();
  };

  const fetchTasksAndEvents = async () => {
    try {
    const date = new Date(selectedDate).toISOString().split('T')[0];

    const taskResponse = await axios.get(`${API_URL}/get_task_list/${date}`); // Fetch tasks separately
    const taskData = taskResponse.data;

    const response = await axios.get(`${API_URL}/get_schedule/${date}`);
    const data = response.data;
    const eventList = data.get('event_list');

      // Transform tasks and events into FullCalendar's event format
      const transformedEvents = eventList.map(item => {
          return {
            id: item.id,
            title: item.name,
            start: item.start_time.toISOString(),
            end: item.end_time.toISOString(),
            duration: item.duration,
            category: item.category,
            description: item.details,
            location: item.location,
            frequency: item.frequency,
            reminders: item.reminders,
            tags: item.tags,
            allDay: false
          };

      }).filter(event => event !== null);

      const allDayTasks = taskData.task_list.filter(task => {
      }).map(task => ({
        id: task.id,
        title: task.name, // Use task name for all-day display
        allDay: true, // Mark as all-day task
        start: new Date(selectedDate).toISOString(), // Use deadline as start
        category: item.category,
        location: item.location,
        description: item.details,
        reminders: item.reminders,
        frequency: item.frequency,
        tags: item.tags,
        status: item.status,
      }));

      // Combine events and all-day tasks
      const combinedEvents = [...transformedEvents, ...allDayTasks];

      setEvents(combinedEvents);
      const extractedNames = combinedEvents.map(event => event.title);
      setEventNames(extractedNames);

    } catch (error) {
      console.error('Error fetching tasks and events:', error);
    }
  };

  useEffect(() => {
    fetchTasksAndEvents(); // Call the function to fetch data when the component mounts
  }, []);

  const handleEventClick = (info) => {
    // Store the clicked event in state
    setClickedEvent(info.event);
  };

  const handleEdit = () => {
    if (clickedEvent) {
      if (clickedEvent.allDay) {
        setIsEditTaskModalOpen(true);
      } else {
        setIsEditEventModalOpen(true);
      }
    }
    fetchTasksAndEvents();
  };
  const handleSave = async (updatedEvent) => {
    // Add oldDate attribute to updatedEvent
    const updatedEventWithOldDate = {
      ...updatedEvent,
      oldDate: selectedDate.toISOString(),
    };

    try {
      // Send updatedEventWithOldDate to backend
      let response;
      if (updatedItem.allDay) {
        // If it's a task (allDay is true), send a PUT request to the tasks endpoint
        response = await axios.put(API_URL + '/update_task', updatedItemWithOldDate);
     } else {
        // If it's an event (allDay is false), send a PUT request to the events endpoint
        response = await axios.put(API_URL + '/update_event', updatedItemWithOldDate);
      }
      if (response.status === 200) {
        // Update state if the request was successful
        setEvents(events.map(event => 
          (event.id === updatedEvent.id ? updatedEventWithOldDate : event)
        ));
        setIsEditEventModalOpen(false);
        setIsEditTaskModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
    fetchTasksAndEvents();
  };

  const handleSaveAndAutomate = (updatedEvent) => {
    console.log('Save & Automate clicked for event:', updatedEvent);
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
          ///events = {eventNames}
          events={[
            // Sample events (optional)
            { title: "Event 1", start: "2024-05-24T10:00:00" },
            { title: "Event 2", start: "2024-05-24T14:00:00" },
          ]}
        />
      </div>
      <DayIconColumn
        handleEdit={handleEdit}
        handleAutomate={handleAutomate}
        handleDeleteDay={handleDelete}
      />
      {clickedEvent && (
        <>
          <EditEventModal
            open={isEditEventModalOpen}
            onClose={() => setIsEditEventModalOpen(false)}
            event={clickedEvent}
            onSave={handleSave}
            onSaveAndAutomate={handleSaveAndAutomate}
          />
          <EditTaskModal
            open={isEditTaskModalOpen}
            onClose={() => setIsEditTaskModalOpen(false)}
            task={clickedEvent}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
};

export default DayPage;
