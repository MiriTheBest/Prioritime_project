import axios from 'axios';
import { API_URL } from "./config";; // Assuming you have API_URL defined in your configuration file

const deleteData = async (idOrIdDateString) => {
    try {
        let response;
        if (idOrIdDateString.includes('/')) {
            response = await axios.delete(`${API_URL}/delete_event/` + idOrIdDateString);
        } else {
            response = await axios.delete(`${API_URL}/delete_task/` + idOrIdDateString);
        }
        
        // Check response here
        console.log("Response:", response.data);
        
        // Return data or handle it as needed
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error("Error deleting:", error);
        throw error; // Throw the error for handling in the calling component
    }
};

export { deleteData};
