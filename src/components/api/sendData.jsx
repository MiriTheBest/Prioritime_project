import axios from "axios";
import { API_URL } from "./config";

const sendData = async (newData, token) => {
  try {
    let response;

    if (newData.type === 'event') {
      // Send data to event endpoint
      response = await axios.post(
        `${API_URL}/add_event`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            // Add any other headers here if needed
          },
        },
      );
    } else {
      // Send data to task endpoint
      response = await axios.post(
        `${API_URL}/add_task`,
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

    console.log("Data saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error; // Throw the error for the calling component to handle
  }
};

export default sendData;
