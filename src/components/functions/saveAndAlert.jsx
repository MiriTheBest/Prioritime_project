import { saveAutomateTask } from "../api/saveAutomateTask";
import sendData from "../api/sendData";

const saveAndAlert = async (formData, setAlertSeverity, setAlertMessage, setAlertOpen, token) => {
  try {
    let response;
    if (formData.status === "pending" || formData.type === "event") {//save events and non-automated tasks
      response = await sendData(formData, token);
      setAlertSeverity("success");
      setAlertMessage("Task/event saved successfully!");
    } else {
      if(formData.status === "active") //tasks that are sent for automation
      response = await saveAutomateTask(formData, token);
      setAlertSeverity("success");
      setAlertMessage("Task saved and automated successfully!");
    }
    setAlertOpen(true);

    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);

  } catch (error) {
    console.error("Error handling task/event save:", error);
    setAlertSeverity("error");
    setAlertMessage(
      error.response?.data?.message ||
      "Error saving task. Please try again later."
    );
    setAlertOpen(true);

    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
  }
};

export default saveAndAlert;
