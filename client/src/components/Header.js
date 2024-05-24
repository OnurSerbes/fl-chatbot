
// IMPORT React
import React from "react";

// IMPORT Style
import '../style/header.css'

const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="section-label">
        <div className="appname">
          {title}
        </div>
        {/* TODO: EGER CREDENTIAL YAPARSAK BURAYA HASTANE + DOKTOR ADI BASARIZ */}
        <div className="hos-doc">
          <div className="hospital">

          </div>
          <div className="doctor">

          </div>
        </div>
      </div>
      {/* BUTTON CONTAINER FOR TUTORIAL MODAL AND ACCESSIBILITY SETTINGS */}
      <div className="section-buttons">
        {/* FEDERATED LEARNING STATUS */}
        <div className="buttonbox">
          <button className="">
            Info
          </button>
          <button>
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
