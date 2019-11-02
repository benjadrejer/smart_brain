import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';

import './App.css';

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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    name: '',
    entries: 0,
    joined: '',
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
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
      fetch('http://localhost:3000/imageurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: this.state.imageUrl,
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(res => res.json())
          .then(count => {
            this.setState(prevState => {
              return {
                user: {
                  ...prevState.user,
                  entries: count,
                }
              }
            })
          })
          .catch(err => console.log('failed to update image count'))
        }
        this.calculateFaceLocation(response);
      })
      .catch(err => {
        console.log(err);
      });
    })
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState);
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
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        }
        {this.state.route === 'register' &&
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        }
        {this.state.route === 'home' &&
          <React.Fragment>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes} />
          </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
