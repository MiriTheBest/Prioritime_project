import axios from "axios";

const sendUpdatedData = async (updatedTask, token, apiUrl) => {
  try {
    const response = await axios.put(apiUrl, updatedTask, {
      headers: {
        Authorization: token,
      }
    }
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
