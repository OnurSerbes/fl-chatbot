// IMPORT React
import React, { useState, useEffect } from "react";

// IMPORT Style
import '../style/modal.css'

const Modal = ({ state, addUser }) => {

  // Validate the input name
  const nameRegex = /^[\p{L}\p{M}\p{Pd}\p{Zs}\.']+$/u;

  const [nameSurname, setNameSurname] = useState(""); // State variable for name and surname input
  const [nameValid, setNameValid] = useState(true);

  useEffect(() => {
    console.log("effect: nameSurname, regex input validation"); // TESTLOG
    // Check the validity of the current entered text
    setNameValid(nameRegex.test(nameSurname));
  }, [nameSurname]);

  const handleSubmit = (e) => {
    console.log("call handleSubmit"); // TESTLOG
    e.preventDefault();
    if (nameSurname.trim() !== "" && nameValid) {
      // Call the addUser function passed from the parent component
      addUser(nameSurname);
    }
    // REQUEST FL
    state.setReqFL(true);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="label">Enter Name and Surname</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name and surname"
            value={nameSurname}
            onChange={(e) => setNameSurname(e.target.value)}
          />
          {!nameValid && (
            <p className="validation-message">
              Please enter a valid full name to proceed.
            </p>
          )}
          <button type="submit">
            Proceed
            </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
