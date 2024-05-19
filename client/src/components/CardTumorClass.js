import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../style/card-tumor-class.css"; // Import CSS for styling

const foregroundIntensityFactor = 0.6;
const backgroundIntensityFactor = 0.4;
const confidenceThreshold = 0; // TODO REPLACE WITH ACTUAL THRESHOLD LATER ON

const CardTumorClass = ({ text, label, confidence }) => {
  const isClean = label === "None";

  const backgroundIntensity =
    (7.5 + (confidence * 100) - confidenceThreshold) /
    ((100 - confidenceThreshold) / backgroundIntensityFactor);

  const foregroundIntensity =
    (12.5 + (confidence * 100) - confidenceThreshold) /
    ((100 - confidenceThreshold) / foregroundIntensityFactor);

  const foregroundColor = isClean
    ? `rgba(0, 255, 0, ${foregroundIntensity})`
    : `rgba(255, 0, 0, ${foregroundIntensity})`;

  const backgroundColor = isClean
    ? `rgba(0, 255, 0, ${backgroundIntensity})`
    : `rgba(255, 0, 0, ${backgroundIntensity})`;

  return (
    <div className="card-tumor-class" style={{ backgroundColor }}>
      <div className="title">{text}</div>
      <div className="info">
        <div className="classification-info">
          <div className="subtext">{"was classified as"}</div>
          <div className="label">{label}</div>
        </div>
        <div className="confidence-container">
          <div className="subtext">{"with"}</div>
          <div className="confidence-wheel">
            <CircularProgressbar
              value={ confidence * 100 }
              text={`${ confidence * 100 }%`} // FIX TEMPORARY IMPLEMENTATION FEASIBLE
              strokeWidth={15}
              styles={buildStyles({
                strokeLinecap: "butt",
                textSize: "24px",
                pathColor: foregroundColor,
                textColor: "#fff",
                backgroundColor: backgroundColor,
                pathTransitionDuration: "20",
              })}
            />
          </div>
          <div className="subtext">{"confidence"}</div>
        </div>
      </div>
    </div>
  );
};

export default CardTumorClass;
