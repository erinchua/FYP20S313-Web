import React, { Component } from "react";
import fire from "../config/firebase";
import history from "../config/history";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

class Login extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      password: "",
      user: "",
    };
  }
  componentDidMount() {
    fire.auth().signOut();
  }
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();

        var getrole = db
          .collection("Administrators")
          .where("email", "==", user.email);
        getrole.get().then((snapshot) => {
          if (snapshot.empty) {
            alert("no such users");
          } else {
            snapshot.forEach((doc) => {
              if (doc.data().administratorType === "Super Administrator") {
                this.setState({ user: "Super Administrator" });
                history.push("/Home");
              } else if (
                doc.data().administratorType === "Marketing Administrator"
              ) {
                this.setState({ user: "Marketing Administrator" });
                history.push("/StudentProfile");
              } else {
                history.push("/Login");
              }
            });
          }
        });
      } else {
        this.setState({ user: null });
      }
    });
  }
  login(e) {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        this.authListener();
      })
      .catch((error) => {
        alert("Login Failure");
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  reset = () => {
    history.push("/ResetPassword");
  };
  render() {
    return (
      <div className="App">
        <form>
          <div className="col-and-6">
            <div class="form-group">
              <label for="exampleInputEmaill">Email address</label>
              <input
                value={this.state.email}
                onChange={this.handleChange}
                type="email"
                name="email"
                class="form-control"
                id="exampleInputEmaill"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                name="password"
                class="form-control"
                id="exampleInputPasswordl"
                placeholder="Password"
              />
            </div>
            <button type="submit" onClick={this.login} class="btn btn-primary">
              Login
            </button>
          </div>
        </form>
        <button
          type="submit"
          class="btn btn-warning"
          style={{ marginLeft: "25px" }}
          onClick={this.reset}
        >
          Reset Password
        </button>
      </div>
    );
  }
}
export default Login;
