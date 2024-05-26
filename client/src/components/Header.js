
// IMPORT React
import React from "react";

// IMPORT Style
import '../style/header.css'

const Header = ({ title, popTutorial }) => {
  return (
    <header className="header">
      <div className="section-label">
        <div className="appname">
          {title}
        </div>
      </div>
      {/* BUTTON CONTAINER FOR TUTORIAL MODAL AND ACCESSIBILITY SETTINGS */}
      <div className="section-buttons">
        <div className="buttonbox">
          <button onClick={popTutorial}>
            How to use
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
