import axios from "axios";
import { API_URL } from "./config";

const automateMonthOrDay = async (token, date) => {
try {
    const response = await axios.post(
      `${API_URL}/re_automate/${date}`,
      {},
      {
        headers: {
          Authorization: `${token}`
        }
      }
    );
  } catch (error) {
    console.error("Error re-automating:", error);
  }
}

export {automateMonthOrDay};