
// IMPORT AXIOS
import axios from "axios";

// TODO! Ensure wheter latest change 'null' -> 'false' in function returns dont mess up anything else

// METHOD to send image data to the server as bytes
export const sendImageDataToServer = async (imageData) => {

  // TODO* TESTLOG: sending image to server
  console.log('---SUBMIT IMAGE TO SERVER---');

  try {
    const response = await axios.post(
      "http://localhost:5001/predict-bytes",
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
      return false;
    }
  } catch (error) {
    console.error("Error sending image data to server:", error.message);
    return false;
  }

};

// METHOD to start federated learning and get the results
export const startFederatedLearning = async () => {

  try {
    const response = await axios.get("http://localhost:5001/start-fl");
    if (response.status === 200) {
      console.log("Federated Learning started successfully.", response.data);
      return response.data; // server response includes federated learning results
    } else {
      console.error("Error starting Federated Learning:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error starting Federated Learning:", error.message);
    return false;
  }
  
};