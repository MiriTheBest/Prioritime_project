import axios from 'axios';
import { API_URL } from "./config";; // Assuming you have API_URL defined in your configuration file

const deleteData = async (idOrIdDateString) => {
    try {
        let response;
        const token = localStorage.getItem('token')
        if (idOrIdDateString.includes('/')) {
            response = await axios.delete(`${API_URL}/delete_event/` + idOrIdDateString,
            {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                  // Add any other headers here if needed
                },
              },
            );
        } else {
            response = await axios.delete(`${API_URL}/delete_task/` + idOrIdDateString,
            {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                  // Add any other headers here if needed
                },
              },
            );
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
