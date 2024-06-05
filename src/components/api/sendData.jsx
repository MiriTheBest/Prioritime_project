import axios from "axios";
import { API_URL } from "./config";

const URL_task = axios.create({
  baseURL: API_URL + "/add_task",
});
const URL_event = axios.create({
  baseURL: API_URL + "/add_event",
});

const sendData = async (newData) => {
  try {
    // Your logic to check if the task already exists
    //if its event check that possible to add
    // if (taskAlreadyExists(newData)) {
    //   throw new Error("Error adding task/event");
    // }

    const token = localStorage.getItem('token')
    if(newData.type == 'event') {
      const response = await axios.post(
        URL_event,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            // Add any other headers here if needed
          },
        },
      );
    }

    else{

    const response = await axios.post(
      URL_task,
      newData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // Add any other headers here if needed
        },
      },
    );
  }
    console.log("Task saved successfully:", response.data);
  } catch (error) {
    console.error("Error saving task:", error);
    throw error; // Throw the error for the calling component to handle
  }

};

export default sendData;
