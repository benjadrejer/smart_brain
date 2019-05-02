import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain-64x64.png';

import './logo.css';

const Logo = props => {
  return (
    <div className="ma4 mt0">
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150, display: 'flex', justifyContent: 'center', alignItem: 'center' }} >
        <div className="Tilt-inner pa3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={brain} alt="logo" style={{ width: '100px', height: '100px' }} />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
