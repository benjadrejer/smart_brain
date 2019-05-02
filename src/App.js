import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';

import './App.css';

const KEY = 'YOU OWN CLARIFAI KEY HERE';

const app = new Clarifai.App({
  apiKey: KEY,
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 300,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 2
    },
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
    };
  }

  calculateFaceLocation = data => {
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    const newBoxes = [];
    data.outputs[0].data.regions.forEach(region => {
      const bounding_box = region.region_info.bounding_box;
      newBoxes.push({
          leftCol: bounding_box.left_col * width,
          topRow: bounding_box.top_row * height,
          rightCol: width - (bounding_box.right_col * width),
          bottomRow: height - (bounding_box.bottom_row * height), 
      });
    });
    this.setState({
      boxes: newBoxes,
    });
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  }

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input,
    }, () => {
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
      .then(response => {
        this.calculateFaceLocation(response);
      })
      .catch(err => {
        console.log(err);
      });
    })
  }

  onRouteChange = (event, route) => {
    event.preventDefault();
    if (route === 'signin') {
      this.setState({
        isSignedIn: false,
      })
    } else if (route === 'home') {
      this.setState({
        isSignedIn: true,
      })
    }
    this.setState({
      route,
    });
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles"
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {this.state.route === 'signin' &&
          <Signin onRouteChange={this.onRouteChange} />
        }
        {this.state.route === 'register' &&
          <Register onRouteChange={this.onRouteChange} />
        }
        {this.state.route === 'home' &&
          <React.Fragment>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes} />
          </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
