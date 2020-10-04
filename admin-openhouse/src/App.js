import React, { Component } from "react";
import fire from "./config/firebase";
import "./App.css";
import Login from "./Login";
import Home from "./Home";

class App extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
