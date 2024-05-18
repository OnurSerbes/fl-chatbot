
// IMPORT React
import React from "react";

// IMPORT Style
import '../style/header.css'

const Header = ({ title }) => {
  return (
    <header>
      <div className="header">
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
