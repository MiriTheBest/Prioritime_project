import { saveAutomateTask } from "../api/saveAutomateTask";
import sendData from "../api/sendData";

const saveAndAlert = async (formData, setAlertSeverity, setAlertMessage, setAlertOpen, token) => {
  try {
    let response;
    if (formData.status === "pending") {
      response = await sendData(formData, token);
      setAlertSeverity("success");
      setAlertMessage("Task saved successfully!");
    } else {
      response = await saveAutomateTask(formData, token);
      setAlertSeverity("success");
      setAlertMessage("Task saved and automated successfully!");
    }

    setAlertOpen(true);

    // Automatically close the alert after 5 seconds
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);

  } catch (error) {
    console.error("Error handling task save:", error);
    setAlertSeverity("error");
    setAlertMessage(
      error.response?.data?.message ||
      "Error saving task. Please try again later."
    );
    setAlertOpen(true);

    // Automatically close the alert after 5 seconds
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
  }
};

export default saveAndAlert;
