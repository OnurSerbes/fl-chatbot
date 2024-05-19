
// IMPORT React
import React, { useState, useEffect } from 'react';

// IMPORT Styling
import '../style/card-sysinfo.css'; // Import CSS for styling

const CardSysinfo = ({ label, text, type, color }) => {
  return(
  <div className="card-sysinfo">
    <div className="labelbox">
      <div className="sys-label">
        {label}
      </div>
      <div className="sys-text">
        {text}
      </div>
    </div>
  </div>
  )
};

export default CardSysinfo;