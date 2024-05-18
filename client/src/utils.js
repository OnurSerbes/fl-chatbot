import axios from "axios";

// METHOD to send image data to the server as bytes
export const sendImageDataToServer = async (imageData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/predict-bytes", // Update port number to 5000
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      console.log("Image data sent successfully.", response.data);
      return response.data; // server response includes resulting analysis label and confidence
    } else {
      console.error("Error sending image data to server:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error sending image data to server:", error.message);
    return null;
  }
};
