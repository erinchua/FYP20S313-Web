import React, { Component, useReducer } from "react";
import history from "../config/history";
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';
import { db, auth } from "../config/firebase";
import firebase from 'firebase';

import "../css/Marketing_Administrator/ChangePasswordModal.css";


const bcrypt = require('bcryptjs')

const initialStates = {
  currentPwdError: "",
  newPwdError: "",
  confirmNewPwdError: ""
}

export default class ChangePasswordModal extends React.Component {
  state = initialStates;

  constructor() {
    super();
    this.handleChangeCurrentPassword = this.handleChangeCurrentPassword.bind(this);
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
    this.handleChangeVerifyNewPassword = this.handleChangeVerifyNewPassword.bind(this);

    this.state = {
      email: "",
      previousPassword: "",
      currentPassword: "",
      newPassword: "",
      verifyNewPassword: "",
      error: "",

      // Props
      showModal: "",
      hideModal: "",
      changePwdBtn: ""
    };
  }

  componentDidMount() {
    this.authListener();
  }

  handleChangeCurrentPassword = async function (e) {
    await this.setState({ currentPassword: e.target.value });
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
    auth.onAuthStateChanged((user) => {
      if (user) {
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
              window.location.reload();
            }
          });
        });
      } else {
        history.push("/Login");
        window.location.reload();
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
    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);
      if (this.state.error == "Password OK.") {
        var currentpassword = this.state.currentPassword;
        var newPassword = this.state.newPassword;
        var user = auth.currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(user.email, currentpassword);

        // Hash password
        const passwordHash = bcrypt.hashSync(newPassword, 10);

        user
        .reauthenticateWithCredential(credential)
        .then(function () {
          user
          .updatePassword(newPassword)
          .then(function () {
            db
            .collection("Administrators")
            .where("email", "==", user.email)
            .get()
            .then((query) => {
              const thing = query.docs[0];
              thing.ref.update({ password: passwordHash });
            });
            history.push("/Login");
            window.location.reload();
          })
          .catch(function (error) {});
        })
        .catch(() => {
            this.setState({
                currentPwdError: "Please enter your current password!",
            });
        });
      } else {
      }
    }
  };

  //Validations for the Forms in Modals
  validate = () => {
    let currentPwdError = "";
    let newPwdError = "";
    let confirmNewPwdError = "";

    const validPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    if ( !(this.state.currentPassword || validPassword.test(this.state.currentPassword)) ) {
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
          onHide={() => {this.props.hideModal(); this.resetForm()}}
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
                  <Form.Control type="password" name="currentPassword" value={this.state.currentPassword} onChange={(e) => {this.handleChangeCurrentPassword(e);}} required noValidate className="currentPasswordForm_Text" placeholder="Current Password*" />                                       
                  
                  <div className="errorMessage text-left">{this.state.currentPwdError}</div>
                </Col>
              </Form.Row>

              {/* New Password */}
              <Form.Row className="justify-content-center changePasswordFormRow">
                <Col md="10">
                  <Form.Label className="changePasswordFormLabel">New Password</Form.Label>
                  <Form.Control type="password" name="newPassword" required noValidate className="currentPasswordForm_Text" placeholder="New Password*" onChange={(e) => {this.handleChangeNewPassword(e);}}/>                                       
                 
                  <div className="errorMessage text-left">{this.state.newPwdError}</div>
                </Col>
              </Form.Row>

              {/* Confirm New Password */}
              <Form.Row className="justify-content-center changePasswordFormRow">
                <Col md="10">
                  <Form.Label className="changePasswordFormLabel">Confirm New Password</Form.Label>
                  <Form.Control type="password" name="verifyNewPassword" required noValidate className="currentPasswordForm_Text" placeholder="Confirm New Password*" onChange={(e) => {this.handleChangeVerifyNewPassword(e);}}/>                                       
                
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
                  <Button id="confirmChangePasswordFormBtn" onClick={(e) => {this.ChangePassword()}}>Change Password</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelChangePasswordFormBtn" onClick={() => {this.props.cancelBtn(); this.resetForm()}}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}