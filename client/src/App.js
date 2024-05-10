import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import TextInput from "./components/TextInput";
import Modal from "./components/Modal";
import "./index.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true); // State variable to control modal visibility
  const [userInfo, setUserInfo] = useState(null); // State to hold user information
  const headerTitle = "ChatGPT"; // Title for the header

  const sendMessage = (text, imageFile, blobUrl) => {
    console.log("Image file:", imageFile);
  
    // Check if there is an image file to send
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile); // Assuming imageFile is the actual File object
  
      // Send the image to the server for prediction
      axios.post('http://localhost:5001/predict-bytes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        console.log('Predicted Label:', response.data.label);
        console.log('Probability:', response.data.probability);
  
        // Construct message from user with text or default text
        const userMessageText = text || "Image uploaded.";
        const newUserMessage = { text: userMessageText, sender: "user", imageFile };
  
        // Construct the bot's response using the prediction results
        const predictionText = `Predicted: ${response.data.label}, Probability: ${(response.data.probability * 100).toFixed(2)}%`;
        const newBotMessage = { text: predictionText, sender: "bot" };
  
        // Update messages state with both user's message and bot's response
        setMessages((prevMessages) => [
          ...prevMessages,
          newUserMessage,
          newBotMessage,
        ]);
      }).catch(error => {
        console.log("Error uploading image:", error);
        // Handle the error by sending a message back to the user
        const errorResponse = { text: "Failed to process image.", sender: "bot" };
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: text || "Image upload attempt.", sender: "user", imageFile },
          errorResponse
        ]);
      });
    } else if (text) {
      // Handle text messages here...
      // Assuming you have some logic to handle text as well
  
      // This is a placeholder to show how text might be processed.
      const newUserMessage = { text, sender: "user" };
      const newBotMessage = { text: "Text received.", sender: "bot" }; // Dummy response for text
  
      setMessages((prevMessages) => [
        ...prevMessages,
        newUserMessage,
        newBotMessage,
      ]);
    }
  };
  

  const addUser = (nameSurname) => {
    // Generate random ID
    const userId = Math.floor(Math.random() * 1000);
    // Construct user object with name, surname, and ID
    const user = { nameSurname, userId };
    // Set user information in state
    setUserInfo(user);
    // Close the modal
    setShowModal(false);
    // Log user information in terminal
    console.log("User information:", user);
  };

  useEffect(() => {
    // Show the modal when the component is mounted
    setShowModal(true);
  }, []); // Empty dependency array to only run once when component mounts

  return (
    <div className="app">
      <Header title={headerTitle} />
      <ChatContainer messages={messages} />
      <TextInput sendMessage={sendMessage} />
      {showModal && <Modal addUser={addUser} />}
    </div>
  );
};

export default App;
