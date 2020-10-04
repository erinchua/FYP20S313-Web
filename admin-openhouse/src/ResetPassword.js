import React, { Component } from "react";
import fire from "./config/firebase";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import history from "./config/history";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
    };
  }
  ResetPassword = (e) => {
    e.preventDefault();
    var actionCodeSettings = {
      // After password reset, the user will be give the ability to go back
      // to this page.
      url: "http://localhost:3000/",
      handleCodeInApp: false,
    };

    var auth = fire.auth();

    auth
      .sendPasswordResetEmail(this.state.email, actionCodeSettings)
      .then(function () {
        alert("OK");
        history.push("/Home");
      })
      .catch(function (error) {
        alert("No Such Email");
      });
  };
  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div className="ResetPassword">
        <div></div>

        <h1>Reset Password Page</h1>
        <form onSubmit={this.ResetPassword}>
          <div class="form-group">
            <label for="exampleInputPassword1">Email: </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={this.updateInput}
              value={this.state.email}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
export default ResetPassword;
