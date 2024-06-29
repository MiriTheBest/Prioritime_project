import axios from 'axios';
import { API_URL } from "./config";

const deleteData = async (idOrIdDateString, type) => {
    try {
        let response;
        const token = localStorage.getItem('token')
        if (idOrIdDateString.includes('/')) {//identify event by '/' in string
          response = await axios.delete(
            `${API_URL}/delete_event/${idOrIdDateString}?type=${type}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            },
          );
        } else {
          response = await axios.delete(
            `${API_URL}/delete_task/${idOrIdDateString}?type=${type}`, 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            },
          );
        }
        console.log("Response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error deleting:", error);
        throw error; // Throw the error for handling in the calling component
    }
};

export {deleteData};