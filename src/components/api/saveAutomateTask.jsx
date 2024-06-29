import axios from "axios";
import { API_URL } from "./config";

const saveAutomateTask = async (newData, token) => {
  try {
    const response = await axios.post(
      API_URL + '/save_and_automate',
      newData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );

  } catch (error) {
    console.error("Error saving task:", error);
    throw error; // Throw the error for the calling component to handle
};
}

export {saveAutomateTask};
