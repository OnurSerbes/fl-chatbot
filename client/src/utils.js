
// IMPORT Axios
import axios from 'axios';

// METHOD to send image data to the server as bytes
export const sendImageDataToServer = async (imageData) => {
  try {
    const response = await axios.post("http://localhost:5001/predict-bytes", imageData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 200) {
      console.log("Image data sent successfully.");
      return response.data; // server response includes resulting analysis label and confidence
    } else {
      console.error("Error sending image data to server:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending image data to server:", error.message);
  }
};
