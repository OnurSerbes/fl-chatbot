
// IMPORT React
import React, { useState, useRef } from "react";

// IMPORT Style
import '../style/input-container.css'

// COMPONENT InputContainer
const InputContainer = ({ sendMessage }) => {

  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(""); // State to store the Blob URL
  const [loading, setLoading] = useState(false); // State for loading status
  const fileInputRef = useRef(null); // Ref for file input

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const imagePath = URL.createObjectURL(file); // Get the path of the uploaded image
    console.log("Image path:", imagePath); // Log the image path to the console
    setImageFile(file); // Store the file object in state
    setBlobUrl(imagePath); // Store the Blob URL in state
  };

  const handleUploadImage = () => {
    fileInputRef.current.value = null; // Clear the file input value
    fileInputRef.current.click(); // Trigger click event on file input
  };

  const handleCancelImage = () => {
    setInputText(""); // Clear the input text
    setImageFile(null); // Clear the selected image file
    setBlobUrl(""); // Clear the Blob URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== "" || imageFile !== null) {
      setLoading(true); // Set loading state to true during submission
      // Call sendMessage with input text and image URL
      await sendMessage(inputText, imageFile, blobUrl);
      setInputText("");
      setImageFile(null);
      setBlobUrl(""); // Clear the Blob URL after sending the message
      setLoading(false); // Set loading state to false after submission
    }
  };

  const isSendDisabled = inputText.trim() === "" && !imageFile;

  return (

    /* MAIN INPUTS CONTAINER */
    <div className="input-container">

      {/* INPUT SUBMISSION FORM */}
      <form onSubmit={handleSubmit}>

        {/* FORM CONTAINER */}
        <div className="form-container">
          <div className="text-part">
            <div className="text-input">
            <input
            className="input-field"
            type="text"
            placeholder="Please provide details..."
            value={inputText}
            onChange={handleChange}
            disabled={!imageFile}
            />
            </div>
          </div>
          {/* SEPARATION */}
          <div className="image-part">
            <div className="image-label">
              {imageFile ? (
                <input
                  className="input-field"
                  type="text"
                  value={`${imageFile.name} (${(imageFile.size / 1024).toFixed(
                    2
                  )} KB)`}
                  disabled
                />
              ) : (
                <input
                  className="input-field"
                  type="text"
                  placeholder="Please upload an image..."
                  value={inputText}
                  onChange={handleChange}
                  disabled
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the file input
            />
            <div className="image-buttons">
              {imageFile ? (
                // Cancel Button
                <button
                  className="button-cancel"
                  type="button"
                  onClick={handleCancelImage}
                  disabled={loading} // Disable cancel button if loading
                >
                  Cancel
                </button>
              ) : (
                // Upload Button
                <button
                  className="button-upload"
                  type="button"
                  onClick={handleUploadImage}
                  disabled={loading} // Disable upload button if loading
                >
                  Upload
                </button>
              )}
              <button
                type="submit"
                className="button-send"
                disabled={isSendDisabled || loading} // Disable button if no input or image, or if loading
              >
              {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputContainer;
