import axios from "axios";
import { API_URL } from "./config";

const automateMonthorDay = async (token, date) => {
try {
    const response = await axios.post(
      `${API_URL}/re-automate/${date}`,
      {
        headers: {
          Authorization: `${token}` // Add token to Authorization header
        }
      }
    );
  } catch (error) {
    console.error("Error re-automating:", error);
  }
}

export {automateMonthOrDay};