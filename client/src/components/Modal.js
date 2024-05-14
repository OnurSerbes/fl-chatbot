
// IMPORT React
import React, { useState } from "react";

// IMPORT Style
import '../style/modal.css'

const Modal = ({ addUser }) => {
  const [nameSurname, setNameSurname] = useState(""); // State variable for name and surname input

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameSurname.trim() !== "") {
      // Call the addUser function passed from the parent component
      addUser(nameSurname);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Name and Surname</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name and surname"
            value={nameSurname}
            onChange={(e) => setNameSurname(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
