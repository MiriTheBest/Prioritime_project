import axios from "axios";
import { API_URL } from "./config";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYzYjdjMTdkOGQ5Mzc4ODBjZDAzYjM3IiwiZXhwIjoxNzE1NzQ3OTI2fQ.IR3D_qk2XpG8r7h3SR1lNXXIi9cwvwuvQ-HIQ29jEYw";

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

    if(newData.type == 'event') {
      const response = await axios.post(
        URL_event,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: JWT,
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
          Authorization: JWT,
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
