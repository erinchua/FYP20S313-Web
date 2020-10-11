import React, { Component } from "react";
import fire from "./config/firebase";

import "./css/App.css";
import Login from "./pages/Login";
import Home from "./pages/Super_Administrator/Home";

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
