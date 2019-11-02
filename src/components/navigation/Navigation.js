import React from 'react';

const Navigation = ({ isSignedIn, onRouteChange }) => {
  let component = null;
  if(isSignedIn) {
    component = (
      <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signin')}> Sign Out </p>
    )
  } else {
    component = (
      <React.Fragment>
        <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signin')}> Sign In </p>
        <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('register')}> Register </p>
      </React.Fragment>
    )
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end'}}>
     {component}
    </nav>
  );
}

export default Navigation;
