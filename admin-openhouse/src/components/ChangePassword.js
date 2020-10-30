import React, { Component, useReducer } from "react";
import history from "../config/history";
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import "../css/Marketing_Administrator/ChangePasswordModal.css";


const firebase = require("firebase");

const initialStates = {
  emailError: "",
  currentPwdError: "",
  newPwdError: "",
  confirmNewPwdError: ""
}

export default class ChangePasswordModal extends React.Component {
  state = initialStates;

  constructor() {
    super();
    this.handleChangeCurrentPassword = this.handleChangeCurrentPassword.bind(
      this
    );
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
    this.handleChangeVerifyNewPassword = this.handleChangeVerifyNewPassword.bind(
      this
    );

    this.state = {
      email: "",
      currentPassword: "",
      newPassword: "",
      verifyNewPassword: "",
      error: "",

      // Props
      showModal: "",
      hideModal: ""
    };
  }

  componentDidMount() {
    this.authListener();
  }

  handleChangeCurrentPassword = async function (e) {
    await this.setState({ currentPassword: e.target.value });
    console.log(this.state.currentPassword);
  };

  handleChangeNewPassword = async function (e) {
    await this.setState({ newPassword: e.target.value });
    this.check();
  };

  handleChangeVerifyNewPassword = async function (e) {
    await this.setState({ verifyNewPassword: e.target.value });
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
            } 
            else if (doc.data().administratorType === "Marketing Administrator") {
            } 
            else {
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
    if (this.state.newPassword == this.state.verifyNewPassword) {
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
    console.log("ChangePassword Btn Clicked")

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      if (this.state.error == "Password OK.") {
        var currentpassword = this.state.currentPassword;
        var newPassword = this.state.newPassword;
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
          .updatePassword(newPassword)
          .then(function () {
            const db = firebase.firestore();
            var getrole = db
            .collection("Administrators")
            .where("email", "==", user.email)
            .get()
            .then((query) => {
              const thing = query.docs[0];
              thing.ref.update({ password: newPassword });
            });
            // alert("Updated"); //Update password in Firestore table
            history.push("/Login");
          })
          .catch(function (error) {});
        })
        .catch(function (error) {
          alert(error[Object.keys(error)[1]]);
        });
      } else {
        // alert("check your fields");
      }
    }
    this.resetForm();
  };

  //Validations for the Forms in Modals
  validate = () => {
    let currentPwdError = "";
    let newPwdError = "";
    let confirmNewPwdError = "";

    const validPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    if ( !(this.state.currentPassword && validPassword.test(this.state.currentPassword)) ) {
      currentPwdError = "Please enter a valid password!";
    } 

    if (! (this.state.newPassword && validPassword.test(this.state.newPassword) && (this.state.newPassword !== this.state.currentPassword)) ) {
      newPwdError = "Please enter your new password! Password should have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!";
    }

    if (! (this.state.verifyNewPassword && validPassword.test(this.state.verifyNewPassword) && (this.state.verifyNewPassword === this.state.newPassword)) ) {
      confirmNewPwdError = "Passwords do not match!";
    }

    if (currentPwdError || newPwdError || confirmNewPwdError ) {
        this.setState({
          currentPwdError, newPwdError, confirmNewPwdError
        });
        return false;
    } 

    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState(initialStates);
    this.setState({
      currentPassword: '', 
      newPassword: '', 
      verifyNewPassword: '', 
    })
  }



  render() {
    return (
      <div>
        <Modal 
          show={this.props.showModal}
          onHide={this.props.hideModal}
          aria-labelledby="changePasswordModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
          className="changePasswordModal"
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="changePasswordModalTitle" className="w-100">
              Change Password
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="changePasswordModalBody">
            <Form noValidate onSubmit={this.ChangePassword}>
              {/* Current Password */}
              <Form.Row className="justify-content-center changePasswordFormRow">
                <Col md="10">
                  <Form.Label className="changePasswordFormLabel">Current Password</Form.Label>
                  <FormControl type="password" name="currentPassword" value={this.state.currentPassword} required noValidate className="currentPasswordForm_Text" placeholder="Current Password*" />                                       
                  
                  <div className="errorMessage text-left">{this.state.currentPwdError}</div>
                </Col>
              </Form.Row>

              {/* New Password */}
              <Form.Row className="justify-content-center changePasswordFormRow">
                <Col md="10">
                  <Form.Label className="changePasswordFormLabel">New Password</Form.Label>
                  <FormControl type="password" name="newPassword" value={this.state.newPassword} required noValidate className="currentPasswordForm_Text" placeholder="New Password*" />                                       
                 
                  <div className="errorMessage text-left">{this.state.newPwdError}</div>
                </Col>
              </Form.Row>

              {/* Confirm New Password */}
              <Form.Row className="justify-content-center changePasswordFormRow">
                <Col md="10">
                  <Form.Label className="changePasswordFormLabel">Confirm New Password</Form.Label>
                  <FormControl type="password" name="verifyNewPassword" value={this.state.verifyNewPassword} required noValidate className="currentPasswordForm_Text" placeholder="Confirm New Password*" />                                       
                
                  <div className="errorMessage text-left">{this.state.confirmNewPwdError}</div>
                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Change Password Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="confirmChangePasswordFormBtn" onClick={(e) => {this.ChangePassword();}}>Change Password</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelChangePasswordFormBtn" onClick={this.props.cancelBtn}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>








        {/* <form>
          <div className="col-and-6"> */}
            {/* Old password */}
            {/* <div class="form-group">
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
            </div> */}
            {/* New password */}
            {/* <div class="form-group">
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
            </div> */}

            {/* Verify new password */}
            {/* <div class="form-group">
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
        </button> */}
      </div>
    );
  }
}
