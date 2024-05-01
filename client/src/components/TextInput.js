// TextInput.js

import React, { useState, useRef } from "react";

const TextInput = ({ sendMessage }) => {
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(""); // State to store the Blob URL
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

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Trigger click event on file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== "" || imageFile !== null) {
      // Call sendMessage with input text and image URL
      await sendMessage(inputText, imageFile, blobUrl);
      setInputText("");
      setImageFile(null);
      setBlobUrl(""); // Clear the Blob URL after sending the message
    }
  };

  return (
    <form className="text-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={inputText}
        onChange={handleChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input
      />
      <button
        type="button"
        className="upload-button"
        onClick={handleUploadButtonClick}
      >
        UP
      </button>
      <button type="submit">SEND</button>
    </form>
  );
};

export default TextInput;
