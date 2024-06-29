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
import dayjs from 'dayjs';
import moment from 'moment';
import sendUpdatedData from "./api/sendUpdatedData";
import { automateMonthOrDay } from "./api/automateMonthOrDay";
import { convertMinToDuration } from "./functions/convertMintoDuration";
import { Alert, Snackbar } from "@mui/material";

const DayPage = () => {
  const location = useLocation();
  const initialSelectedDate = location.state?.selectedDate || new Date(); // Default to current date if not provided
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [yearViewOpen, setYearViewOpen] = useState(false); // State to track if yearView is open
  const token = localStorage.getItem('token');
  
  // State to store fetched events
  const [events, setEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [clickedEventId, setClickedEventId] = useState(null);

  // State to control the visibility of the modals
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false); // State to control alert visibility

  const handleAutomate = async () => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    try {
      await automateMonthOrDay(token, "?date=" + formattedDate);
      // Fetch updated event data after re-automation
      await fetchTasksAndEvents(formattedDate);
    } catch (error) {
      console.error("Error re-automating month:", error);
    }
  };

  function createStringForUrl(clickedEvent, originalEvent) {//create a string for url depending on type
    let idOrIdDateString;
    if (clickedEvent.allDay) {
      idOrIdDateString = clickedEvent.id;
    } else {
      idOrIdDateString = `${clickedEvent.id}/${originalEvent.start}`;
    }
    return idOrIdDateString;
  }

  const handleDelete = async () => {
    try {
      if (clickedEvent) {
        const formattedStart = dayjs(clickedEvent.start).format("YYYY-MM-DDTHH:mm:ss");//make sure the string is in right format
        const urlConcatStr = createStringForUrl(clickedEvent, { ...clickedEvent, start: formattedStart });
        await deleteData(urlConcatStr, clickedEvent.extendedProps.type);
        fetchTasksAndEvents(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleAutomateTask = async () => {
    try {
      if (clickedEvent) {
        if (clickedEvent.allDay) {
          const formattedStart = dayjs(clickedEvent.start).format("YYYY-MM-DDTHH:mm:ss");
          const selectedTasks = [clickedEvent.id]
          await axios.post(
            API_URL + "/automatic_scheduling",
            { 
              tasks: selectedTasks,
              start_date: formattedStart,
              end_date: formattedStart
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          fetchTasksAndEvents(selectedDate);//fetch data after successful automation
        } else {
          setAlertOpen(true);
        }
      }
    } catch (error) {
      console.error("Error automating task:", error);
   }
  };

  const fetchTasksAndEvents = async (date) => {
    try {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const taskResponse = await axios.get(
        `${API_URL}/get_task_list/?date=${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      ); // Fetch tasks separately
      const taskData = taskResponse.data;

      const response = await axios.get(
        `${API_URL}/get_schedule/${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const eventList = response.data.event_list;

      // Transform tasks and events into FullCalendar's event format
      // Although there are fields that we need to be like in original object, them we put inside extendedProps
      const transformedEvents = eventList.map(item => {
        return {
          id: item._id,
          title: item.name,
          start: item.start_time,
          end: item.end_time,
          extendedProps: {duration: item.duration},
          category: item.category,
          description: item.description,
          location: item.location,
          frequency: item.frequency,
          reminders: item.reminders,
          tags: item.tags,
          type: item.item_type,
          allDay: false,
          backgroundColor: item.backgroundColor || '',
          borderColor: item.borderColor || '',
        };
      }).filter(event => event !== null);

      const allDayTasks = taskData.task_list.map(task => ({
        id: task._id,
        title: task.name, // Use task name for all-day display
        extendedProps: {duration: task.duration ? convertMinToDuration(task.duration) : '', deadline: task.deadline},
        allDay: true, // Mark as all-day task
        start: task.deadline, // Use deadline as start
        category: task.category,
        location: task.location,
        description: task.description,
        reminders: task.reminders,
        frequency: task.frequency,
        tags: task.tags,
        type: task.item_type,
        status: task.status,
        backgroundColor: task.backgroundColor || '',
        borderColor: task.borderColor || '',
      }));

      // Combine events and all-day tasks
      const combinedEvents = [...transformedEvents, ...allDayTasks];

      setEvents(combinedEvents);
    } catch (error) {
      console.error('Error fetching tasks and events:', error);
    }
  };

  useEffect(() => {
    fetchTasksAndEvents(selectedDate); // fetch data when selectedDate changes
  }, [selectedDate]);

  const handleEventClick = (info) => {
    console.log('Event clicked:', info.event);
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
    console.log('Edit clicked:', clickedEvent);
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
      if (!updatedEvent.allDay) {//if event is saved
        apiUrl = `${API_URL}/update_event/${urlConcatStr}`;
        response = await axios.put(apiUrl, updatedEvent, {
          headers: {
            Authorization: token
          }
        });
      } else {//if task is saved
        apiUrl = `${API_URL}/update_task/${urlConcatStr}`;
        response = await sendUpdatedData(updatedEvent, token, apiUrl);
      }
      if (response.status === 200) {
        // Remove event from current view if the date is changed
        if (originalEvent.start !== updatedEvent.start) {
          setEvents(events.filter(event => event.id !== updatedEvent.id));
        } else {
          setEvents(events.map(event =>
            (event.id === updatedEvent.id ? updatedEvent : event)
          ));
        }
        setIsEditEventModalOpen(false);
        setIsEditTaskModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
    fetchTasksAndEvents(selectedDate);
  };

  const handleSaveAndAutomate = (updatedTask) => {
    console.log('Save & Automate task:', updatedTask);
    saveAutomateTask(updatedTask, token);
    fetchTasksAndEvents(selectedDate);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <div className="day-container">
      <div className="day-calendar-wrapper">
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
          datesSet={(dateInfo) => {
            const newSelectedDate = dayjs(dateInfo.start).format('YYYY-MM-DD');
            setSelectedDate(newSelectedDate);
          }} // Update selectedDate on date change
        />
      </div>
      <DayIconColumn
        handleEdit={handleEdit}
        handleAutomate={handleAutomate}
        handleDeleteDay={handleDelete}
        handleAutomateTask={handleAutomateTask}
        yearViewOpen={yearViewOpen}
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
          isFromCalendar={true}
        />
      )}
      <Snackbar open={alertOpen} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">
          This task/event is already scheduled.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DayPage;
