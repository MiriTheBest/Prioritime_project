import axios from "axios";
import { API_URL } from "./config";

const automateMonth = async (token, yearMonth) => {
try {
    const response = await axios.post(
      `${API_URL}/re-automate/${yearMonth}`,
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

export {automateMonth};