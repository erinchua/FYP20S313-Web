import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import history from "./config/history";

import App from "./App";
import Login from "./pages/Login";
import SAHome from "./pages/Super_Administrator/SAHome";
import ResetPassword from "./pages/Marketing_Administrator/ResetPassword";
import StudentProfile from "./pages/Marketing_Administrator/StudentProfile";
import ChangePassword from "./pages/Marketing_Administrator/ChangePassword";
import CampusFacilitiesMap from "./pages/Marketing_Administrator/CampusFacilitiesMap";
import Openhouse from "./pages/Marketing_Administrator/Openhouse";
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Router history={history}>
    <Switch>
    <Route exact path="/" component={App} />
    <Route path="/Login" component={Login} />
    <Route path="/ResetPassword" component={ResetPassword} />

    {/* Routes for Super Admin */}
    <Route path="/SAHome" component={SAHome} />

    {/* Routes for Marketing Admin */}
    <Route path="/StudentProfile" component={StudentProfile} />
    <Route path="/ChangePassword" component={ChangePassword} />
    <Route path="/CampusFacilitiesMap" component={CampusFacilitiesMap} />
    <Route path="/Openhouse" component={Openhouse} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
