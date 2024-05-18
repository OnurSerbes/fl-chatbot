
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
  const headerTitle = "Brain Tumor Classifier"; // Title for the header

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
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  // STATES utilized within InputContainer
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState("");
  const fileInputRef = useRef(null);

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
      console.log("imageFile exists"); // TESTLOG
      console.log(`imageFile: ${imageFile}`); // TESTLOG
      const newUploadMessage = {
        sender: "user",
        imageFile: imageFile,
        temp: true,
      };
      setMessages((prevMessages) => [...prevMessages, newUploadMessage]);
      console.log('messages:'); // TESTLOG
      console.log(messages); // TESTLOG
    }
  }

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

    console.log(busy); // TESTLOG

    // TESTLOG imageFile
    console.log(`imageFile:`)
    console.log(imageFile);

    // LET name of current image to be displayed later
    let currImageName = '';

    // DUMMY storifier delay durations
    const dummyAnalysisStageDelays = Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000) + 1000);
    const dummyAnalysisTotalDelay = dummyAnalysisStageDelays.reduce((acc, curr) => acc + curr, 0);

    // DUMMY upload delay
    const delayUpload = Math.floor(Math.random() * 1000) + 2000;

    // FLAG for image uploading interval
    console.log("set: loading = true"); // TESTLOG
    setLoading(true); // intended to remain true during upload interval

    // DATA of image to be sent to the server
    const formData = new FormData();
    formData.append("file", imageFile);
    console.log("formData:"); // TESTLOG
    console.log(formData); // TESTLOG

    // TESTLOG imageFile name
    console.log(`imageFile name: ${imageFile.name}`);

    // SEND image data via 'sendImageDataToServer'
    const imageDataResponse = await sendImageDataToServer(formData);

    // TESTLOG imageDataResponse
    console.log(`imageDataRespomse: ${imageDataResponse}`);

    // CONDITION if response received successfull
    if (true) { // TODO: put imageDataResponse back here

      console.log(busy); // TESTLOG

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

      // TESTLOG new user message
      console.log("newUserMessage");
      console.log(newUserMessage);

      // PUSH new user message to history
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      // SAVE image file name for later display
      currImageName = newUserMessage.imageFile.name;

      // COLLECT label and confidence
      const resultLabel = finalResponse.label;
      const resultConfidence = finalResponse.probability.toFixed(2);
      /*
      const predictionText = `Predicted: ${imageDataResponse.label}, Probability: ${imageDataResponse.probability.toFixed(2)}%`;
      */

      // CREATE temporary waiting message (animated storifier)
      const newStorifierMessage = {
        sender: "bot",
        temp: true,
        durs: dummyAnalysisStageDelays,
      };
      setMessages((prevMessages) => [...prevMessages, newStorifierMessage]);

      setTimeout(() => {

        console.log(busy); // TESTLOG

        // TESTLOG temporary message
        console.log(newStorifierMessage);

        // CREATE bot response message
        const newBotMessage = {
          text: currImageName,
          label: resultLabel,
          confidence: resultConfidence,
          sender: "bot",
        };

        // TESTLOG new bot message
        console.log(newBotMessage);
        
        // POP temporary message then PUSH new bot message to history
        setMessages((prevMessages) => prevMessages.filter(message => !message.temp).concat(newBotMessage));
        
        // UNFLAG loading state after process is done
        setLoading(false);

        // TESTLOG current message history
        console.log(messages);

        console.log(busy); // TESTLOG

        setBusy(false);

        console.log(busy); // TESTLOG

      }, dummyAnalysisTotalDelay)

    } else {
      setBusy(false);
    }

  }

};

  // FUNCTION Add user with applied proper user name input validation loop
  const addUser = (nameSurname) => {
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
    console.log("call: handleEditMessage"); // TESTLOG
    // Update the messages array with the edited text
    const updatedMessages = [...messages];
    updatedMessages[index].text = editedText;
    setMessages(updatedMessages);
  };

  // FUNCTION Handle image deletion
  const handleDeleteMessage = (index) => {
    console.log("call: handleDeleteMessage"); // TESTLOG
    const newMessages = [...messages];
    // Remove user message
    newMessages.splice(index, 1);
    // Check if there's a corresponding bot response to delete
    if (newMessages[index]?.sender === "bot") {
      newMessages.splice(index, 1); // Remove the bot response
    }
    setMessages(newMessages);
  };

  // SET user login status to show or hide modal
  useEffect(() => {
    console.log("effect: null, show login modal"); // TESTLOG
    setUserLogged(false);
  }, []); // Empty dependency array to only run once when component mounts

  const handlersInput = 
  {

    handleChange: (e) => {
      console.log("call: handleChange"); // TESTLOG
      setInputText(e.target.value);
    },

    handleFileChange: (e) => {
      console.log("call: handleFileChange"); // TESTLOG
      const file = e.target.files[0];
      const imagePath = URL.createObjectURL(file); // Get the path of the uploaded image
      console.log("Image path:", imagePath); // Log the image path to the console
      setImageFile(file); // Store the file object in state
      setBlobUrl(imagePath); // Store the Blob URL in state
      // uploadImage(imagePath); TODO: ask this later on
    },
  
    handleUploadImage: () => {
      console.log("call: handleUploadImage"); // TESTLOG
      fileInputRef.current.value = null; // Clear the file input value
      fileInputRef.current.click(); // Trigger click event on file input
    },
  
    handleCancelImage: () => {
      console.log("call: handleCancelImage"); // TESTLOG
      setInputText(""); // Clear the input text
      setImageFile(null); // Clear the selected image file
      setBlobUrl(""); // Clear the Blob URL
    },
  
    handleSubmit: async (e) => {
      console.log("call: handleSubmit"); // TESTLOG
      e.preventDefault();
      if (inputText.trim() !== "" || imageFile !== null) {
        setLoading(true); // Set loading state to true during submission
        // call: sendMessage with input text and image URL
        await sendMessage(inputText, imageFile, blobUrl);
        setInputText("");
        setImageFile(null);
        setBlobUrl(""); // Clear the Blob URL after sending the message
        setLoading(false); // Set loading state to false after submission
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