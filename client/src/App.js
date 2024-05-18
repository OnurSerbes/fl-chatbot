
// IMPORT React
import React, { useState, useEffect, useRef } from "react";

// IMPORT Components
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import InputContainer from "./components/InputContainer";
import LoginModal from "./components/LoginModal";

// IMPORT Styling
import "./index.css";

// IMPORT Utilities
import { sendImageDataToServer } from "./utils";

// COMPONENT App.js
const App = () => {

  // VARIABLE Header title
  const headerTitle = "Brain Tumor Classifier";

  // TEST DUMMY Labels
  const dummyLabel = () => {
    const dummyLabels = ["Type 1", "Type 2", "Type 3", "Type 4", "None"]
    const index = Math.floor(Math.random() * 6);
    return dummyLabels[index];
   }

  // TEST DUMMY Confidence
  const dummyConfidence = () => { return 60 + ((Math.random() * 100) * 0.4) };

  // STATES utilized within App.js
  const [messages, setMessages] = useState([]);
  const [userLogged, setUserLogged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  // STATES utilized within InputContainer
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState("");
  const fileInputRef = useRef(null);

  // OBJECT states to be passed down to child components
  const statesInput =
  {
    inputText, setInputText,
    imageFile, setImageFile,
    blobUrl, setBlobUrl,
    busy, setBusy,
    fileInputRef
  }

  /**
   * TODO: tried to implement post-upload image display but got:
   * 'Failed to execute 'CreateObjectURL' on 'URL':
   * Overload Resolution Failed
   */ 
  const uploadImage = (imageFile) => {
    console.log("call: uploadImage"); // TESTLOG
    if (imageFile) {
      console.log('imageFile: ', imageFile ? imageFile : 'none'); // TESTLOG
      const newUploadMessage = {
        sender: "user",
        imageFile: imageFile,
        temp: true,
      };
      console.log("|ADD MSG|", newUploadMessage); // TESTLOG
      setMessages((prevMessages) => [...prevMessages, newUploadMessage]);
      console.log(messages); // TESTLOG
    }
  }

  // FUNCTION cancel image
  const cancelImage = async () => {
    console.log("call: cancelImage"); // TESTLOG
    setMessages((prevMessages) => prevMessages.filter(message => !message.temp))
  }

/**
 * FUNCTION Send Message
 * sends message to server
 * @param {*} text
 * @param {*} imageFile
 */
const sendMessage = async (text, imageFile) => {
  console.log("call: sendMessage"); // TESTLOG

  setBusy(true);

  // CONDITION if an image was uploaded
  if (imageFile) {

    // TESTLOG imageFile
    console.log('imageFile: ', imageFile);

    // LET name of current image to be displayed later
    let currImageName = '';

    // DUMMY storifier delay durations
    const dummyAnalysisStageDelays = Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000) + 1000);
    const dummyAnalysisTotalDelay = dummyAnalysisStageDelays.reduce((acc, curr) => acc + curr, 0);

    // DUMMY upload delay
    const delayUpload = Math.floor(Math.random() * 1000) + 2000;

    // FLAG for image uploading interval

    // DATA of image to be sent to the server
    const formData = new FormData();
    formData.append("file", imageFile);
    console.log(formData); // TESTLOG

    // TESTLOG imageFile name
    console.log('imageFile.name', imageFile.name); // TESTLOG

    // SEND image data via 'sendImageDataToServer'
    const imageDataResponse = await sendImageDataToServer(formData);

    // TESTLOG imageDataResponse
    console.log('imageDataResponse: ', imageDataResponse); // TESTLOG

    // CONDITION if response received successfull
    if (true) { // TODO: put imageDataResponse back here

      // TEST DUMMY Response
      const fakeDataResponse = {};
        fakeDataResponse.label = dummyLabel();
        fakeDataResponse.probability = dummyConfidence();

      const finalResponse = ( imageDataResponse ? imageDataResponse : fakeDataResponse )

      // CREATE user message instance
      const newUserMessage = {
        text: text || "Image uploaded.",
        sender: "user",
        imageFile: imageFile,
      };
      console.log("|ADD MSG|", newUserMessage); // TESTLOG

      // TESTLOG new user message
      console.log('newUserMessage: ', newUserMessage);

      // PUSH new user message to history
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      console.log("|ADD MSG|", newUserMessage); // TESTLOG

      // SAVE image file name for later display
      currImageName = newUserMessage.imageFile.name;

      // COLLECT label and confidence
      const resultLabel = finalResponse.label;
      const resultConfidence = finalResponse.probability.toFixed(2);

      // CREATE temporary waiting message (animated storifier)
      const newStorifierMessage = {
        sender: "bot",
        temp: true,
        durs: dummyAnalysisStageDelays,
      };
      console.log("|ADD MSG|", newStorifierMessage); // TESTLOG
      setMessages((prevMessages) => [...prevMessages, newStorifierMessage]);

      setTimeout(() => {

        // TESTLOG temporary message
        console.log(newStorifierMessage); // TESTLOG

        // CREATE bot response message
        const newBotMessage = {
          text: currImageName,
          label: resultLabel,
          confidence: resultConfidence,
          sender: "bot",
        };
        console.log("|ADD MSG|", newBotMessage); // TESTLOG

        // TESTLOG new bot message
        console.log(newBotMessage); // TESTLOG
        
        // POP temporary message then PUSH new bot message to history
        console.log("|RMV MSG| temp"); // TESTLOG
        setMessages((prevMessages) => prevMessages.filter(message => !message.temp).concat(newBotMessage));

        // TESTLOG current message history
        console.log('Messages: ', messages);

        setBusy(false);

      }, dummyAnalysisTotalDelay)

    } else {
      setBusy(false);
    }

  }

};

  // FUNCTION Add user with applied proper user name input validation loop
  const addUser = (nameSurname) => {
    console.log("---ADDING USER---"); // TESTLOG
    console.log("call: addUser"); // TESTLOG
    // GENERATE random ID
    const userId = Math.floor(Math.random() * 1000);
    // CREATE user instance
    const user = { nameSurname, userId };
    // SET user as current state
    setUserInfo(user);
    // CLOSE modal
    setUserLogged(true);
    // TESTLOG current user information
    console.log("User information:", user);
  };


  // FUNCTION Handle image text editing
  const handleEditMessage = (index, editedText) => {
    console.log("---EDITING MESSAGE---"); // TESTLOG
    console.log("call: handleEditMessage"); // TESTLOG
    // Update the messages array with the edited text
    const updatedMessages = [...messages];
    updatedMessages[index].text = editedText;
    setMessages(updatedMessages);
    console.log(`|UPDATED| message {id: ${index}} `, updatedMessages[index]); // TESTLOG
  };

  // FUNCTION Handle image deletion
  const handleDeleteMessage = (index) => {
    console.log("---DELETED MESSAGE---"); // TESTLOG
    console.log("call: handleDeleteMessage"); // TESTLOG
    const newMessages = [...messages];
    // Remove user message
    console.log(`|DELETED| message {id: ${index}}`, ); // TESTLOG
    newMessages.splice(index, 1);
    // Check if there's a corresponding bot response to delete
    if (newMessages[index]?.sender === "bot") {
      console.log(`|DELETED| message {id: ${index}}`, ); // TESTLOG
      newMessages.splice(index, 1); // Remove the bot response
    }
    setMessages(newMessages);
  };

  // SET user login status to show or hide modal
  useEffect(() => {
    setUserLogged(false);
    console.log("---SHOW LOGIN---"); // TESTLOG
    console.log("effect: null, show login modal"); // TESTLOG
  }, []); // Empty dependency array to only run once when component mounts

  const handlersInput = 
  {

    handleChange: (e) => {
      setInputText(e.target.value);
    },

    handleFileChange: (e) => {
      console.log("---CHANGED FILE---")
      console.log("call: handleFileChange"); // TESTLOG
      const file = e.target.files[0];
      const imagePath = URL.createObjectURL(file); // Get the path of the uploaded image
      console.log("Image path:", imagePath); // Log the image path to the console
      setImageFile(file); // Store the file object in state
      setBlobUrl(imagePath); // Store the Blob URL in state
      // uploadImage(imagePath); TODO: ask this later on
    },
  
    handleUploadImage: () => {
      console.log("---SELECTING IMAGE---")
      console.log("call: handleUploadImage"); // TESTLOG
      fileInputRef.current.value = null; // Clear the file input value
      fileInputRef.current.click(); // Trigger click event on file input
    },
  
    handleCancelImage: () => {
      console.log("---CANCELLED IMAGE---")
      console.log("call: handleCancelImage"); // TESTLOG
      setInputText(""); // Clear the input text
      setImageFile(null); // Clear the selected image file
      setBlobUrl(""); // Clear the Blob URL
    },
  
    handleSubmit: async (e) => {
      console.log("---SUBMITTING IMAGE---")
      console.log("call: handleSubmit"); // TESTLOG
      e.preventDefault();
      if (inputText.trim() !== "" || imageFile !== null) {
        // call: sendMessage with input text and image URL
        await sendMessage(inputText, imageFile, blobUrl);
        setInputText("");
        setImageFile(null);
        setBlobUrl(""); // Clear the Blob URL after sending the message
      }
    },

  }

  // RENDER App.js
  return (
    <div className="app">
      <Header title={headerTitle} />
      <ChatContainer
        state={statesInput}
        messages={messages}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
      <InputContainer
        state={statesInput}
        handler={handlersInput}
      />
      {!userLogged && <LoginModal addUser={addUser} />}
    </div>
  );
};

export default App;