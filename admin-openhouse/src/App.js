import React, { Component } from "react";
import fire from "./config/firebase";

// import "./css/App.css";
import "./css/Login.css";
import Login from "./pages/Login";
import SAHome from "./pages/Super_Administrator/SAHome";

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
