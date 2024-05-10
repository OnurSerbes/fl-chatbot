import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import TextInput from "./components/TextInput";
import Modal from "./components/Modal";
import { sendImageDataToServer } from "./utils";
import "./index.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const headerTitle = "ChatGPT";

  const sendMessage = async (text, imageFile, blobUrl) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      // Send the image data using the utility function from utils.js
      const imageDataResponse = await sendImageDataToServer(formData);
      if (imageDataResponse) {
        const newUserMessage = {
          text: text || "Image uploaded.",
          sender: "user",
          imageFile
        };

        // Assuming the server response includes label and probability
        const predictionText = `Predicted: ${imageDataResponse.label}, Probability: ${imageDataResponse.probability.toFixed(2)}%`;
        const newBotMessage = {
          text: predictionText,
          sender: "bot"
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage, newBotMessage]);
      }
    } else {
      const newUserMessage = { text, sender: "user" };
      const newBotMessage = { text: "Text received.", sender: "bot" };
      setMessages(prevMessages => [...prevMessages, newUserMessage, newBotMessage]);
    }
  };

  const addUser = (nameSurname) => {
    const userId = Math.floor(Math.random() * 1000);
    const user = { nameSurname, userId };
    setUserInfo(user);
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

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
