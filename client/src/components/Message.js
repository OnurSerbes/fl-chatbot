// IMPORT React
import React, { useState } from "react";

// IMPORT Component
import CardTumorClass from "./CardTumorClass";
import CardStorifier from "./CardStorifier";

// IMPORT Style
import '../style/message.css'

const Message = ({ message, onEdit, onDelete, busy }) => {
  const { sender, imageFile, text, label, confidence, temp, durs, onLoad } = message || {};
  const isUser = sender === "user";

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState("");

  const handleEdit = () => {
    console.log("call handleEdit"); // TESTLOG
    setIsEditing(true);
    setEditedText(text); // Set the initial text value for editing
  };

  const handleCancelEdit = () => {
    console.log("call handleCancelEdit"); // TESTLOG
    setIsEditing(false);
    setEditedText(""); // Clear the edited text
  };

  const handleSaveEdit = () => {
    console.log("call handleSaveEdit"); // TESTLOG
    onEdit(editedText); // Pass the edited text to the parent component
    setIsEditing(false);
    setEditedText(""); // Clear the edited text
  };

  const handleDelete = () => {
    console.log("call handleDelete"); // TESTLOG
    setIsDeleting(true); // Set deleting state to true
  };

  const handleConfirmDelete = () => {
    console.log("call handleConfirmDelete"); // TESTLOG
    onDelete(); // Pass the delete request to the parent component
    setIsDeleting(false); // Reset deleting state
  };

  const handleCancelDelete = () => {
    console.log("call handleCancelDelete"); // TESTLOG
    setIsDeleting(false); // Reset deleting state
  };

  return (
    <div>
      {isUser ? (
        <div className="message user">
          { !temp && (
            <div className="info-part">
              {/* Edit & Delete Operations */}
              { !busy &&
                <div className="message-edit-buttons">
                  {isEditing ? (
                    <>
                      <button className='edit-confirm' onClick={handleSaveEdit}>Confirm</button>
                      <button className='edit-cancel' onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : isDeleting ? (
                    <>
                      <span className="warning-delete">Are you sure?<br/>Deleted messages cannot be recovered.</span>
                      <button className='delete-confirm' onClick={handleConfirmDelete}>Confirm</button>
                      <button className='delete-cancel' onClick={handleCancelDelete}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className='edit' onClick={handleEdit} disabled={busy}>Edit</button>
                      <button className='delete' onClick={handleDelete} disabled={busy}>Delete</button>
                    </>
                  )}
                </div>
              }
              {isEditing ? (
                <div className="message-info">
                  <div className="filename">{message.imageFile.name}</div>
                  <textarea className="edit-area" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                </div>
              ) : (
                <div className="message-info">
                  <div className="filename">{message.imageFile.name}</div>
                  <div><p>{text && text}</p></div>
                </div>
              )}
            </div>
          )}
          {imageFile && (
            <img className="message-image" src={URL.createObjectURL(imageFile)} alt="Uploaded" onLoad={onLoad} />
          )}
        </div>
      ) : (
        <div className="message bot">
          {temp ? (
            <CardStorifier durs={durs} />
          ) : (
            <CardTumorClass text={text} label={label} confidence={confidence} />
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
