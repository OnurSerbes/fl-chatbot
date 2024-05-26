
// IMPORT React
import React, { useState, useEffect } from 'react';

// IMPORT Styling
import '../style/storifier.css'; // Import CSS for styling

/**
 * [1] Sending Image
 * [2] Converting Image
 * [3] Processing Image
 * [4] Performing Classification
 * [5] Collecting Results
 */

/**
 * randomized step durations from the outside
 */
const CardStorifier = ({ durs }) => {
  
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStage(prevStage => {
        if (prevStage < durs.length - 1) {
          return prevStage + 1;
        } else {
          return prevStage; // Ensure the stage doesn't exceed the length of durs
        }
      });
    }, durs[stage]);
  
    return () => clearTimeout(timeout);
  }, [durs, stage]);
  

  return (
    <div className='card-storifier'>
      <div className="label-storifier">
        {stage === 0 && 'Sending Image'}
        {stage === 1 && 'Converting Image'}
        {stage === 2 && 'Processing Image'}
        {stage === 3 && 'Performing Classification'}
        {stage === 4 && 'Collecting Results'}
      </div>
      <div className="stage-animation">
        {stage === 0 &&
        <>
          <div id="l10" className="animation"></div>
        </>
        }
        {stage === 1 &&
        <>
          <div id="l27" className="animation"></div>
        </>
        }
        {stage === 2 &&
        <>
          <div id="l18" className="animation"></div>
        </>
        }
        {stage === 3 &&
        <>
          <div id="l29" className="animation"></div>
        </>
        }
        {stage === 4 &&
        <>
          <div id="l30" className="animation"></div>
        </>
        }
      </div>
      <div className="counter-storifier">
        {`${(stage + 1)}/${durs.length}`}
      </div>
    </div>
  );
};

export default CardStorifier;