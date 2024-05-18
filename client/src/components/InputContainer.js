// IMPORT React
import React, { useState, useRef, useEffect } from "react";

// IMPORT Style
import '../style/input-container.css';

// COMPONENT InputContainer
const InputContainer = ({ state, handler }) => {
  const [fileDetails, setFileDetails] = useState('');

  const isSendDisabled = state.inputText.trim() === "" && !state.imageFile;

  useEffect(() => {
    console.log("effect, imageFile, parse image details"); // TESTLOG
    if (state.imageFile) {
      let split = state.imageFile.name.split('.');
      split[1] = `.${split[1]}`;
      setFileDetails(split);
    }
    console.log('fileDetails:', fileDetails ? fileDetails : 'none');
  }, [state.imageFile]);

  return (
    /* MAIN INPUTS CONTAINER */
    <div className="input-container">
      {/* INPUT SUBMISSION FORM */}
      <form onSubmit={handler.handleSubmit}>
        {/* FORM CONTAINER */}
        <div className="form-container">
          {/* TEXT SUBPART */}
          <div className="text-part">
            {/* INPUT CONTAINER */}
            <div className="text-input">
              {/* INPUT COMPONENT */}
              <input
                className="input-field"
                type="text"
                placeholder="Please provide details..."
                value={state.inputText}
                onChange={handler.handleChange}
                disabled={!state.imageFile}
              />
            </div>
          </div>
          {/* IMAGE SUBPART */}
          <div className="image-part">
            {state.imageFile && (
              <div className="image-label">
                <p className="image-name">{`${fileDetails[0]}`}</p>
                <p className="file-type">{`${fileDetails[1]}`}</p>
                <p className="file-size">{`(${(state.imageFile.size / 1024).toFixed(2)} KB)`}</p>
              </div>
            )}
            {/* FILENAME DISPLAYER */}
            <input
              ref={state.fileInputRef}
              type="file"
              accept="image/*"
              onChange={handler.handleFileChange}
              style={{ display: "none" }} // Hide the file input
            />
            {/* IMAGE BUTTONS CONTAINER */}
            <div className="image-buttons">
              {state.imageFile ? (
                // Cancel Button
                <button
                  className="button-cancel"
                  type="button"
                  onClick={handler.handleCancelImage}
                  disabled={state.loading || state.busy} // Disable cancel button if loading
                >
                  Cancel
                </button>
              ) : (
                // Upload Button
                <button
                  className="button-upload"
                  type="button"
                  onClick={handler.handleUploadImage}
                  disabled={state.loading || state.busy} // Disable upload button if loading
                >
                  Upload Image
                </button>
              )}
              {/* SEND BUTTON */}
              {state.imageFile && (
                <button
                  type="submit"
                  className="button-send"
                  disabled={isSendDisabled || state.loading || state.busy} // Disable button if no input or image, or if loading
                >
                  <div className="submit-button-text">
                    {state.loading ? "Submit Image..." : "Submit Image"}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputContainer;
