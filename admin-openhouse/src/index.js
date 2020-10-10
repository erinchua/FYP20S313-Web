import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Login from "./Login";
import Home from "./Home";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";
import history from "./config/history";
import ResetPassword from "./ResetPassword";
import StudentProfile from "./StudentProfile";
import ChangePassword from "./ChangePassword";

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
