// IMPORT React
import React, { useState, useEffect, useRef } from "react";

// IMPORT Components
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import InputContainer from "./components/InputContainer";
import LoginModal from "./components/LoginModal";
import TutorialModal from "./components/TutorialModal";

// IMPORT Styling
import "./index.css";

// IMPORT Utilities
import { sendImageDataToServer, startFederatedLearning } from "./utils";

// CONSTANT Default Application Title
const DEFAULT_TITLE = "Brain Tumor Classifier";

const FL_DEVICES = 4;

/**
 * @const DUMMY_ANALYSIS whether dummy analysis results to be produced or not
 */
const DUMMY_ANALYSIS = false;

/**
 * @const DUMMY_LABELS an array of dummy labels for local dummy response simulation
 */
const DUMMY_LABELS = ["menengioma_tumor", "glioma_tumor", "pituatuary_tumor", "None"];

// List of acceptable MIME types for image files
/**
 * @const ACCEPTABLE_MIME_TYPES for file format validation
 */
const ACCEPTABLE_MIME_TYPES = ['image/jpeg', 'image/png'];

// COMPONENT App.js
const App = () => {

  // VARIABLE Header title
  const headerTitle = DEFAULT_TITLE;

  // STATES within App.js
  const [messages, setMessages] = useState([]); // STATE of current chatbox messaging history
  const [userLogged, setUserLogged] = useState(false); // STATE for login status
  const [userInfo, setUserInfo] = useState(null); // STATE for handling user info
  const [busy, setBusy] = useState(false); // STATE for handling input control (buttons)
  const [subError, setSubError] = useState(false); // STATE to track whether any error occured during upload
  const [tutorial, setTutorial] = useState(false); // STATE of tutorial display

  // STATES System Status Flags
  const [reqFL, setReqFL] = useState(false); // STATE when calibration upload for FL init should be requested
  const [readyFL, setReadyFL] = useState(false); // STATE when federated learning is primed and ready
  const [isInitialSubmission, setIsInitialSubmission] = useState(true); // STATE when current image to be submitted is the first

  // STATES within InputContainer
  const [imageFile, setImageFile] = useState(null); // STATE of currently uploaded image
  const [inputText, setInputText] = useState(""); // STATE of current user info text
  const [blobUrl, setBlobUrl] = useState(""); // STATE of current uploaded image URL
  const fileInputRef = useRef(null); // STATE for current file input ref

  // OBJECT for input operations
  const statesInput = {
    inputText, setInputText,
    imageFile, setImageFile,
    blobUrl, setBlobUrl,
    busy, setBusy,
    fileInputRef
  };

  // OBJECT for federated learning state tracking
  const statesFL = {
    reqFL, setReqFL,
    readyFL, setReadyFL,
  };

  // POP tutorial
  const popTutorial = () => {
    setTutorial(true);
  }

  // CLOSE tutorial
  const closeTutorial = () => {
    setTutorial(false);
  }

  /**
   * @method submitImage operations for when user submits an uploaded image
   * @param {*} text user text input for the submitted image
   * @param {*} imageFile 
   */
  const submitImage = async (text, imageFile) => {

    // set busy true for input control locking buttons and input field in meanwhile
    setBusy(true);

    // check if image file found
    if (imageFile) {

      // TODO* TESTLOG: image file
      console.log('imageFile: ', imageFile);

      // collect current image name for later display
      let currImageName = '';

      // TODO? this is an optional user experience adjustment
      // TODO* SIMULATION: analysis delays for storification
      const currStageDelays = DummyAnalysis.stageDelays();
      const currTotalDelay = DummyAnalysis.totalDelay(currStageDelays);

      // construct to be submitted form data and append image file
      const formData = new FormData();
      formData.append("file", imageFile);

      // asynch utility method call to send image to server and collect results
      const serverDataResponse = await sendImageDataToServer(formData);

      // TODO* TESTLOG: collected results (if successfully)
      console.log('serverDataResponse: ', (serverDataResponse));

      // track whether results were successfully collected from the server
      setSubError(!serverDataResponse);

      // convert incoming label and confidence into appropriate formats
      if (serverDataResponse) {
        serverDataResponse.label = convertLabel(serverDataResponse.label)
        serverDataResponse.probability = convertConfidence(serverDataResponse.probability, FL_DEVICES);
      }

      // TODO* TESTLOG: print newly converted value
      console.log(`Actual confidence level: ${serverDataResponse.probability}%`)

      // TODO? this is a testing utility to be excluded from deployment
      let fakeDataResponse;
      // generate dummy data response if submission failed and dummy analysis in place
      if (subError && DUMMY_ANALYSIS) {
        if (DUMMY_ANALYSIS) {
          const dummyDataResponse = {
            label: DummyAnalysis.label(),
            probability: DummyAnalysis.confidence()
          };
          fakeDataResponse = dummyDataResponse;
        }
      }

      // proceed with diyplaying results if submission successful or dummy display allowed
      // TODO* TESTLOG if proceeding
      console.log(`Proceed to display results: ${(!subError || DUMMY_ANALYSIS)}`)
      if (!subError || DUMMY_ANALYSIS) {

        // collect response (from server or dummy) to be processed
        const finalResponse = (serverDataResponse ?? fakeDataResponse);

        // APPEND user image submission message
        appendMessage(
          {
            text: text || "Image uploaded.",
            sender: "user",
            imageFile: imageFile,
          }, setMessages
        );

        // APPEND temporary storifier element message
        appendMessage(
          {
            sender: "bot",
            temp: true,
            durs: currStageDelays,
          }, setMessages
        );

        // declare variables of results to be displayed
        currImageName = imageFile.name;
        const resultLabel = finalResponse.label;
        const resultConfidence = finalResponse.probability;

        // define timeout duration interval for displaying storifier
        setTimeout(() => {
          
          // clear temporary storifier element
          clearTempMessage(setMessages);

          // APPEND actual bot response to messages history
          appendMessage(
            {
              text: currImageName,
              label: resultLabel,
              confidence: resultConfidence,
              sender: "bot",
            }, setMessages
          );

          // toggle systems status to re-allow button and text inputs
          setBusy(false);

          // TODO* TESTLOG display whether current is initial submission
          console.log(`Initial submission: ${isInitialSubmission}`)

          // INITIATE FEDERATED LEARNING IF FIRST TIME UPLOAD
          if (isInitialSubmission) {
            appendMessage(
              {
                sender: 'system',
                label: 'FL calibration complete!',
                text: 'You can now start uploading MRI scans for FL supported analysis',
              }, setMessages
            );
            setIsInitialSubmission(false);
            console.log('Starting Federated Learning...');
            startFederatedLearning();
          }

        }, currTotalDelay);

      } else {
        // print network error message (if not producing dummy analysis)
        if (!DUMMY_ANALYSIS) {
          appendMessage(
            {
              sender: 'system',
              label: 'Network Error',
              text: 'Your image could not be submitted due to a network error',
            }, setMessages
          );
        }
        // toggle systems status to re-allow button and text inputs
        setBusy(false);
      }
    }
  };

  /**
   * @method addUser to the system
   * @param {*} nameSurname of current user
   */
  const addUser = (nameSurname) => {
    const userId = Math.floor(Math.random() * 1000);
    const user = { nameSurname, userId };
    setUserInfo(user);
    setUserLogged(true);
  };

  /**
   * @method handleEditMessage
   * dictates what happens to system state when user edits a message
   * @param {*} index of currently edited message
   * @param {*} editedText content of currently edited image text
   */
  const handleEditMessage = (index, editedText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = editedText;
    setMessages(updatedMessages);
  };

  /**
   * @method handleDeleteMessage
   * dictates what happens to system state when user deletes a message
   * @param {*} index of deleted message
   */
  const handleDeleteMessage = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    if (newMessages[index]?.sender === "bot") {
      newMessages.splice(index, 1);
    }
    setMessages(newMessages);
  };

  /**
   * @object handlersInput
   * containing handler methods utilized
   * within the input container
   */
  const handlersInput = {

    /**
     * @method handleChange
     * @param {*} e input field
     */
    handleChange: (e) => {
      setInputText(e.target.value);
    },

    /**
         * @method handleFileChange
         * @param {*} e current file selection
         */
    handleFileChange: (e) => {
      const file = e.target.files[0];

      // Validate file type
      if (!file || !ACCEPTABLE_MIME_TYPES.includes(file.type)) {
        alert('Invalid file type. Please upload a JPEG or PNG file.');
        setImageFile(null);
        setBlobUrl('');
        return;
      }

      const imagePath = URL.createObjectURL(file);
      console.log("Image path:", imagePath);
      setImageFile(file);
      setBlobUrl(imagePath);
    },

    /**
     * @method handleUploadImage
     */
    handleUploadImage: () => {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    },

    /**
     * @method handleCancelImage
     */
    handleCancelImage: () => {
      setInputText("");
      setImageFile(null);
      setBlobUrl("");
    },

    /**
     * @method handleSubmit
     * @param {*} e current input
     */
    handleSubmit: async (e) => {
      e.preventDefault();
      if (inputText.trim() !== "" || imageFile !== null) {
        await submitImage(inputText, imageFile, blobUrl);
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
        appendMessage(
          {
            sender: 'system',
            label: 'FL calibration pending',
            text: 'Please submit an initial MRI to calibrate federated learning',
          }, setMessages
        );
      }
    }
  }, [reqFL]);

  return (
    <div className="app">
      <Header
        title={headerTitle}
        popTutorial={popTutorial}
      />
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
      <TutorialModal
        show={tutorial}
        onClose={closeTutorial}
      />
    </div>
  );
};

/**
 * @method appendMessage to concatenate a message to a message history
 * @param {*} message to concatenate
 * @param {*} setState method updating message history state
 */
const appendMessage = (message, setState) => {
  setState((prevMessages) => [...prevMessages, message]);
}

/**
 * @method appendMessage clears temporary messages from chat history
 * @param {*} setState method updating message history state
 */
const clearTempMessage = (setState) => {
  setState((prevMessages) => prevMessages.filter(message => !message.temp));
}

/**
 * @object DummyAnalysis
 * purposed for simulating incoming analysis results
 * when the server response is absent due any reason
 * @method dummyLabel returns a random label
 * @method dummyConfidence returns a random confidence level
 * @method
 * @method
 */
const DummyAnalysis = {
    // Dummy Labels
    label: () => {
      const index = Math.floor(Math.random() * DUMMY_LABELS.length);
      return DUMMY_LABELS[index];
    },
    // Dummy Confidence
    confidence: () => {
      return 0.6 + Math.random() * 0.4;
    },
    // Dummy Stage Delays Duration Matrix
    stageDelays: () => {
      return Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000) + 1000)
    },
    // Calculation of Total Delay from Delays Matrix
    totalDelay: (stageDelays) => {
      return stageDelays.reduce((acc, curr) => acc + curr, 0)
    }
}

// TODO consider migrating this to utils.js if fitting, not crucial otherwise
function convertLabel(label) {

  // replace all underscores with spaces
  let modifiedString = label.replace(/_/g, ' ');
  
  // split the string into words, capitalize each word, and join them back together
  return modifiedString.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

}

// TODO consider migrating this to utils.js if fitting, not crucial otherwise
const convertConfidence = (confidence, devices) => {
  // TODO: this currently scales the confidence to 0-100 instead of 0-1
  return (100 - (confidence - (1 / devices)) * 100).toFixed(0);
}

export default App;
