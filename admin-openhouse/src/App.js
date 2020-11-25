import React, { Component } from "react";

import "./css/Login.css";
import Login from "./pages/Login";

class App extends Component {
  constructor() {
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
