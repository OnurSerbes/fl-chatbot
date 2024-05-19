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
import { sendImageDataToServer, startFederatedLearning } from "./utils";

// COMPONENT App.js
const App = () => {
  // VARIABLE Header title
  const headerTitle = "Brain Tumor Classifier";

  // TEST DUMMY Labels
  const dummyLabel = () => {
    const dummyLabels = ["Menengioma", "Glioma", "Pituatuary", "None"];
    const index = Math.floor(Math.random() * dummyLabels.length);
    return dummyLabels[index];
  };

  // TEST DUMMY Confidence
  const dummyConfidence = () => {
    return 60 + Math.random() * 40;
  };

  // STATES utilized within App.js
  const [messages, setMessages] = useState([]);
  const [userLogged, setUserLogged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  // TEST STATES SYSTEM MESSAGE PROMPTING
  const [reqFL, setReqFL] = useState(false);
  const [readyFL, setReadyFL] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  // STATES utilized within InputContainer
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState("");
  const fileInputRef = useRef(null);

  // OBJECT states to be passed down to child components
  const statesInput = {
    inputText, setInputText,
    imageFile, setImageFile,
    blobUrl, setBlobUrl,
    busy, setBusy,
    fileInputRef
  };

  const statesFL = {
    reqFL, setReqFL,
    readyFL, setReadyFL,
  };

  const uploadImage = (imageFile) => {
    if (imageFile) {
      const newUploadMessage = {
        sender: "user",
        imageFile: imageFile,
        temp: true,
      };
      setMessages((prevMessages) => [...prevMessages, newUploadMessage]);
    }
  };

  const cancelImage = async () => {
    setMessages((prevMessages) => prevMessages.filter(message => !message.temp));
  };

  const printMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async (text, imageFile) => {
    setBusy(true);

    if (imageFile) {
      console.log('imageFile: ', imageFile);

      let currImageName = '';

      const dummyAnalysisStageDelays = Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000) + 1000);
      const dummyAnalysisTotalDelay = dummyAnalysisStageDelays.reduce((acc, curr) => acc + curr, 0);

      const formData = new FormData();
      formData.append("file", imageFile);

      console.log('Sending image data to server');
      const imageDataResponse = await sendImageDataToServer(formData);
      console.log('imageDataResponse: ', imageDataResponse);

      if (true) {
        const fakeDataResponse = {};
        fakeDataResponse.label = dummyLabel();
        fakeDataResponse.probability = dummyConfidence();

        const finalResponse = (imageDataResponse ? imageDataResponse : fakeDataResponse);

        const newUserMessage = {
          text: text || "Image uploaded.",
          sender: "user",
          imageFile: imageFile,
        };

        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        currImageName = newUserMessage.imageFile.name;

        const resultLabel = finalResponse.label;
        const resultConfidence = finalResponse.probability.toFixed(2);

        const newStorifierMessage = {
          sender: "bot",
          temp: true,
          durs: dummyAnalysisStageDelays,
        };
        setMessages((prevMessages) => [...prevMessages, newStorifierMessage]);

        setTimeout(() => {
          const newBotMessage = {
            text: currImageName,
            label: resultLabel,
            confidence: resultConfidence,
            sender: "bot",
          };

          setMessages((prevMessages) => prevMessages.filter(message => !message.temp).concat(newBotMessage));

          setBusy(false);

          if (isFirst) {
            printMessage(
              {
                sender: 'system',
                label: 'FL calibration complete!',
                text: 'You can now start uploading MRI scans for FL supported analysis',
              }
            );
            setIsFirst(false);
            console.log('Starting Federated Learning...');
            startFederatedLearning();
          }

        }, dummyAnalysisTotalDelay);

      } else {
        setBusy(false);
      }
    }
  };

  const addUser = (nameSurname) => {
    const userId = Math.floor(Math.random() * 1000);
    const user = { nameSurname, userId };
    setUserInfo(user);
    setUserLogged(true);
  };

  const handleEditMessage = (index, editedText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = editedText;
    setMessages(updatedMessages);
  };

  const handleDeleteMessage = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    if (newMessages[index]?.sender === "bot") {
      newMessages.splice(index, 1);
    }
    setMessages(newMessages);
  };

  const handlersInput = {
    handleChange: (e) => {
      setInputText(e.target.value);
    },

    handleFileChange: (e) => {
      const file = e.target.files[0];
      const imagePath = URL.createObjectURL(file);
      console.log("Image path:", imagePath);
      setImageFile(file);
      setBlobUrl(imagePath);
    },

    handleUploadImage: () => {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    },

    handleCancelImage: () => {
      setInputText("");
      setImageFile(null);
      setBlobUrl("");
    },

    handleSubmit: async (e) => {
      e.preventDefault();
      if (inputText.trim() !== "" || imageFile !== null) {
        await sendMessage(inputText, imageFile, blobUrl);
        setInputText("");
        setImageFile(null);
        setBlobUrl("");
      }
    },
  };

  useEffect(() => {
    setUserLogged(false);
  }, []);

  useEffect(() => {
    if (userLogged) {
      if (reqFL) {
        printMessage(
          {
            sender: 'system',
            label: 'FL calibration pending',
            text: 'Please submit an initial MRI to calibrate federated learning',
          }
        );
      }
    }
  }, [reqFL]);

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
      {!userLogged && <LoginModal
        state={statesFL}
        addUser={addUser}
      />}
    </div>
  );
};

export default App;