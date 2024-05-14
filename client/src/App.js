
// IMPORT React
import React, { useState, useEffect } from "react";

// IMPORT Components
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import InputContainer from "./components/InputContainer";
import Modal from "./components/Modal";

// IMPORT Styling
import "./index.css";

// IMPORT Utilities
import { sendImageDataToServer } from "./utils";

// COMPONENT App.js
const App = () => {

  // VARIABLE Header title
  const headerTitle = "Brain Tumor Classifier"; // Title for the header

  // STATES
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true); // to control modal visibility
  const [userInfo, setUserInfo] = useState(null); // to hold user information
  const [loading, setLoading] = useState(false); // to track loading state

  /**
   * FUNCTION Send Message
   * sends message to server
   * @param {*} text
   * @param {*} imageFile
   */
  const sendMessage = async (text, imageFile) => {

    // CONDITION if an image was uploaded
    if (imageFile) {

      // TESTLOG imageFile
      console.log(`imageFile:`)
      console.log(imageFile);

      // LET name of current image to be displayed later
      let currImageName = '';

      /**
       * [1] VALIDATION of provided image and text input
       * TODO: we should perform the following verifications:
       * - that an input image have been uploaded/provided
       * - that provided input image is in an acceptable format and dimensions
       * - that the text input is within a certain size
       * - that the text input includes only legal characters
       */

      // DUMMY storifier delay durations
      const dummyAnalysisStageDelays = Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000) + 1000);
      const dummyAnalysisTotalDelay = dummyAnalysisStageDelays.reduce((acc, curr) => acc + curr, 0);

      // DUMMY upload delay
      const delayUpload = Math.floor(Math.random() * 1000) + 2000;

      // FLAG for image uploading interval
      setLoading(true); // intended to remain true during upload interval

      // DATA of image to be sent to the server
      const formData = new FormData();
      formData.append("file", imageFile);

      // TESTLOG imageFile name
      console.log(`imageFile name:`);
      console.log(imageFile.name);

      // SEND image data via 'sendImageDataToServer'
      const imageDataResponse = await sendImageDataToServer(formData);

      // TESTLOG imageDataResponse
      console.log(`imageDataRespomse:`);
      console.log(imageDataResponse);

      // CONDITION if response received successfull
      if (imageDataResponse) {

        // CREATE user message instance
        const newUserMessage = {
          text: text || "Image uploaded.",
          sender: "user",
          imageFile: imageFile,
        };

        // TESTLOG new user message
        console.log("newUserMessage");
        console.log(newUserMessage);

        // PUSH new user message to history
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        // SAVE image file name for later display
        currImageName = newUserMessage.imageFile.name;

        // COLLECT label and confidence
        const resultLabel = imageDataResponse.label;
        const resultConfidence = imageDataResponse.probability.toFixed(2);
        /*
        const predictionText = `Predicted: ${imageDataResponse.label}, Probability: ${imageDataResponse.probability.toFixed(2)}%`;
        */

        // CREATE temporary waiting message (animated storifier)
        const temporaryMessage = {
          sender: "bot",
          temp: true,
          durs: dummyAnalysisStageDelays,
        };

        // TESTLOG temporary message
        console.log(temporaryMessage);
        
        // SIMULATE dummy delay with loading animations of storifier
        setTimeout(async () => {

          // CREATE bot response message
          const newBotMessage = {
            text: currImageName,
            label: resultLabel,
            confidence: resultConfidence,
            sender: "bot"
          };
          /*
          const newBotMessage = {
            text: predictionText,
            sender: "bot"
          };
          */
    
          // TESTLOG new bot message
          console.log(newBotMessage);
          
          // POP temporary message then PUSH new bot message to history
          setMessages((prevMessages) => prevMessages.filter(message => !message.temp).concat(newBotMessage));
          
          // UNFLAG loading state after process is done
          setLoading(false);
    
          // TESTLOG current message history
          console.log(messages);
    
        }, dummyAnalysisTotalDelay)

      } else {
        /**
         * NOTE: code representing behaviour deprecated in previous GUI developments
         *   const newUserMessage = { text, sender: "user" };
         *   const newBotMessage = { text: "Text received.", sender: "bot" };
         *   setMessages(prevMessages => [...prevMessages, newUserMessage, newBotMessage]);
        */
      }

    }

  };

  // FUNCTION Add user
  const addUser = (nameSurname) => {
    // GENERATE random ID
    const userId = Math.floor(Math.random() * 1000);
    // CREATE user instance
    const user = { nameSurname, userId };
    // SET user as current state
    setUserInfo(user);
    // CLOSE modal
    setShowModal(false);
    // TESTLOG current user information
    console.log("User information:", user);
  };

  // FUNCTION Handle image text editing
  const handleEditMessage = (index, editedText) => {
    // Update the messages array with the edited text
    const updatedMessages = [...messages];
    updatedMessages[index].text = editedText;
    setMessages(updatedMessages);
  };

  // FUNCTION Handle image deletion
  const handleDeleteMessage = (index) => {
    const newMessages = [...messages];
    // Remove user message
    newMessages.splice(index, 1);
    // Check if there's a corresponding bot response to delete
    if (newMessages[index]?.sender === "bot") {
      newMessages.splice(index, 1); // Remove the bot response
    }
    setMessages(newMessages);
  };

  // SHOW
  useEffect(() => {
    // Show the modal when the component is mounted
    setShowModal(true);
  }, []); // Empty dependency array to only run once when component mounts

  // RENDER App.js
  return (
    <div className="app">
      <Header title={headerTitle} />
      <ChatContainer
        messages={messages}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
      <InputContainer sendMessage={sendMessage} loading={loading} />
      {showModal && <Modal addUser={addUser} />}
    </div>
  );
};

export default App;
