import axios from "axios";
import { API_URL } from "./config";

const sendData = async (newData, token) => {
  try {
    let response;

    if (newData.type === 'event') {
      response = await axios.post(
        `${API_URL}/add_event/`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
    } else {
      response = await axios.post(
        `${API_URL}/add_task`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
    }

    console.log("Data saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

export default sendData;
