// IMPORT React
import React from 'react';

// IMPORT Styling
import '../style/tutorial-modal.css';

const TutorialModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="tutorial-modal-overlay" onClick={onClose}>
      <div className="tutorial-modal-content" onClick={e => e.stopPropagation()}>
        <div className="tutorial-modal-header">
          <h4 className="tutorial-modal-title">Tutorial</h4>
          <button onClick={onClose} className="tutorial-modal-close-button">&times;</button>
        </div>
        <div className="tutorial-modal-body">
          <h2>Step 1: Upload Your Image</h2>
          <p>Click on the upload button and select an image to classify.</p>
          <h2>Step 2: Submit the Image</h2>
          <p>After uploading, review the image details and click the send button.</p>
          <h2>Step 3: View Results</h2>
          <p>Once the image is classified, you will see the results displayed in the chat window.</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
