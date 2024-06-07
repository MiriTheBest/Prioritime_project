import { saveAutomateTask } from "../api/saveAutomateTask";
import sendData from "../api/sendData";

const saveAndAlert = async (formData, setAlertSeverity, setAlertMessage, setAlertOpen) => {
  try {
    if(formData.type == "pending") {
      const response = await sendData(formData);
      setAlertSeverity("success");
      setAlertMessage("Task saved successfully!");
      setAlertOpen(true);
    }
    else{
      const response = await saveAutomateTask(formData);
      setAlertSeverity("success");
      setAlertMessage("Task saved and automated successfully!");
      setAlertOpen(true);
    }
    
  } catch (error) {
    console.error("Error handling task save:", error);
    setAlertSeverity("error");
    setAlertMessage(
      error.response.data.message ||
        "Error saving task. Please try again later.",
    );
    setAlertOpen(true);
  }
};

export default saveAndAlert;
