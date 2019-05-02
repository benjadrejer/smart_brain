import React from 'react';

import placeholder from './face-placeholder.gif';
import './faceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="input-image" src={imageUrl || placeholder} alt="to be recognized" width="300px" height="auto" />
        {boxes.map(box => <div key={box.topRow + box.rightCol} className="bounding-box" style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}} />)}
      </div>
    </div>
  )
}

export default FaceRecognition;
