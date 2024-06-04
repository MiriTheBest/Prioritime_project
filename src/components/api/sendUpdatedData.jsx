import axios from "axios";
import { API_URL } from "./config";

const sendUpdatedData = async (updatedTask) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit_task/${updatedTask.id}`,
      updatedTask,
    );
    console.log("Task updated successfully:", response.data);
    // Handle success (e.g., show success message, refresh data, etc.)
    return response.data; // Return response data if needed in the calling component
  } catch (error) {
    console.error("Error updating task:", error);
    throw error; // Throw the error for the calling component to handle
  }
};

export default sendUpdatedData;
