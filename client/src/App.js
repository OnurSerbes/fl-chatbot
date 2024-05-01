import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import TextInput from "./components/TextInput";
import Modal from "./components/Modal";
import "./index.css";
import { sendBlobUrlToServer, getImagePathsFromServer } from "./utils";

const DUMMY_IMAGE_RESPONSES = ["Human👶", "Cat 😺", "Tree 🌲"];

const App = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true); // State variable to control modal visibility
  const [userInfo, setUserInfo] = useState(null); // State to hold user information
  const headerTitle = "ChatGPT"; // Title for the header

  const sendMessage = (text, imageFile, blobUrl) => {
    console.log("Image file:", imageFile);
    // Send Blob URL to the server
    sendBlobUrlToServer(blobUrl);

    // Add user's message
    const newUserMessage = { text, sender: "user", imageFile };

    let dummyResponse;
    if (imageFile) {
      // Generate random dummy response for image
      const randomIndex = Math.floor(
        Math.random() * DUMMY_IMAGE_RESPONSES.length
      );
      dummyResponse = DUMMY_IMAGE_RESPONSES[randomIndex];
    } else {
      // Sentiment analysis and response for text messages
      const sentimentScore = analyzeSentiment(text); // Replace with actual sentiment analysis logic
      let sentiment, emoji;
      if (sentimentScore < 0.3) {
        sentiment = "sad";
        emoji = "😔";
      } else if (sentimentScore < 0.7) {
        sentiment = "neutral";
        emoji = "😐";
      } else {
        sentiment = "happy";
        emoji = "😀";
      }

      const confidenceRate = Math.round(sentimentScore * 100);

      // Construct the response message
      dummyResponse = (
        <div>
          <span>{`This message is mostly ${sentiment} ${emoji}.`}</span>
          <br />
          <span
            style={{ fontSize: "0.8em" }}
          >{`Confidence rate: ${confidenceRate}%.`}</span>
        </div>
      );
    }

    // Add bot's response
    const newBotMessage = { text: dummyResponse, sender: "bot" };

    // Update messages state with both user's message and bot's response
    setMessages((prevMessages) => [
      ...prevMessages,
      newUserMessage,
      newBotMessage,
    ]);
  };

  // Function to analyze sentiment (replace with actual implementation)
  const analyzeSentiment = (text) => {
    // Implement your sentiment analysis logic here. This is a placeholder.
    // You can explore libraries like Google Cloud Natural Language API or spaCy.
    console.warn("Sentiment analysis not implemented. Returning random score.");
    return Math.random(); // Placeholder, replace with actual sentiment score
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
