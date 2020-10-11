import React, { Component, useReducer } from "react";
import history from "../../config/history";

import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

const firebase = require("firebase");

class ChangePassword extends Component {
  constructor() {
    super();
    this.handleChangecurrentpassword = this.handleChangecurrentpassword.bind(
      this
    );
    this.handleChangenewpassword = this.handleChangenewpassword.bind(this);
    this.handleChangeverifynewpassword = this.handleChangeverifynewpassword.bind(
      this
    );

    this.state = {
      email: "",
      currentpassword: "",
      newpassword: "",
      verifynewpassword: "",
      error: "",
    };
  }
  componentDidMount() {
    this.authListener();
  }
  handleChangecurrentpassword = async function (e) {
    await this.setState({ currentpassword: e.target.value });
    console.log(this.state.currentpassword);
  };

  handleChangenewpassword = async function (e) {
    await this.setState({ newpassword: e.target.value });
    this.check();
  };

  handleChangeverifynewpassword = async function (e) {
    await this.setState({ verifynewpassword: e.target.value });
    this.check();
  };
  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.firestore();
        this.setState({ email: user.email });

        var getrole = db
          .collection("Administrators")
          .where("email", "==", user.email);
        getrole.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().administratorType === "Super Administrator") {
            } else if (
              doc.data().administratorType === "Marketing Administrator"
            ) {
            } else {
              history.push("/Login");
            }
          });
        });
      } else {
        history.push("/Login");
      }
    });
  }
  check() {
    if (this.state.newpassword == this.state.verifynewpassword) {
      this.setState({
        error: "Password OK.",
      });
    } else {
      this.setState({
        error: "Password is different from Verify New Password.",
      });
    }
  }
  ChangePassword = () => {
    if (this.state.error == "Password OK.") {
      var currentpassword = this.state.currentpassword;
      var newpassword = this.state.newpassword;
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentpassword
      );
      user
        .reauthenticateWithCredential(credential)
        .then(function () {
          //alert("ayuth"); Update password in authentication
          user
            .updatePassword(newpassword)
            .then(function () {
              const db = firebase.firestore();
              var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email)
                .get()
                .then((query) => {
                  const thing = query.docs[0];
                  thing.ref.update({ password: newpassword });
                });
              alert("Updated"); //Update password in Firestore table
              history.push("/Login");
            })
            .catch(function (error) {});
        })
        .catch(function (error) {
          alert(error[Object.keys(error)[1]]);
        });
    } else {
      alert("check your fields");
    }
  };

  render() {
    return (
      <div className="ChangePassword">
        <form>
          <div className="col-and-6">
            {/* Old password */}
            <div class="form-group">
              <label for="currentpassword">Current Password</label>
              <input
                value={this.state.currentpassword}
                onChange={(e) => {
                  this.handleChangecurrentpassword(e);
                }}
                type="text"
                class="form-control"
                id="currentpassword"
                placeholder="Password"
                required
              />
            </div>
            {/* New password */}

            <div class="form-group">
              <label for="newpassword">New Password</label>
              <input
                value={this.state.newpassword}
                onChange={(e) => {
                  this.handleChangenewpassword(e);
                }}
                type="text"
                class="form-control"
                id="newpassword"
                aria-describedby="emailHelp"
                placeholder="Password"
                required
              />
              <small id="emailHelp" class="form-text text-muted">
                {this.state.error}
              </small>
            </div>
            {/* Verify new password */}

            <div class="form-group">
              <label for="verifynewpassword">Verify New Password</label>
              <input
                value={this.state.verifynewpassword}
                onChange={(e) => {
                  this.handleChangeverifynewpassword(e);
                }}
                type="text"
                class="form-control"
                id="verifynewpassword"
                placeholder="Password"
              />
            </div>
          </div>
        </form>
        <button
          onClick={(e) => {
            this.ChangePassword();
          }}
          class="btn btn-primary"
        >
          Change Password
        </button>
      </div>
    );
  }
}
export default ChangePassword;
