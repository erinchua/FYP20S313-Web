import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import history from "./config/history";

import App from "./App";
import Login from "./pages/Login";
import Home from "./Home";
import ResetPassword from "./ResetPassword";
import StudentProfile from "./StudentProfile";
import ChangePassword from "./ChangePassword";

import "../css/index.css";

ReactDOM.render(
  <Router history={history}>
    <Route exact path="/" component={App} />
    <Route path="/Login" component={Login} />
    <Route path="/Home" component={Home} />
    <Route path="/ResetPassword" component={ResetPassword} />
    <Route path="/StudentProfile" component={StudentProfile} />
    <Route path="/ChangePassword" component={ChangePassword} />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
