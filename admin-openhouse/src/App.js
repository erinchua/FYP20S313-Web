import React from 'react';
//import logo from './logo.svg';
import './App.css';
import firebase from './firebase';

class App extends React.Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    firebase.firestore();
  }

  render() {
    return(<div>Hello World.</div>);
  }
}

export default App;
