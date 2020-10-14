import React from 'react';
import { Navbar, Nav, Container, Modal } from 'react-bootstrap';
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import "../../css/Super_Administrator/AddUserModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'


export default class AddUserModal extends React.Component {
    constructor() {
        super();
        this.state = {
          administratorType: "",
          email: "",
          fullname: "",
          password: "",
          addUserModal: false,
        };
      }
      updateInput = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };
    addUser = (e) => {
        e.preventDefault();
        firecreate
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((useraction) => {
            const db = fire.firestore();
    
            const userRef = db
              .collection("Administrators")
              .add({
                administratorType: this.state.administratorType,
                email: this.state.email,
                name: this.state.fullname,
                password: this.state.password,
              })
              .then(function () {
                alert("Added");
                window.location.reload();
              });
            this.setState({
              fullname: "",
              email: "",
            });
          });
      };
    render(){
        return (
            <div>
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Add A User
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                         <form onSubmit={this.addUser}>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  onChange={this.updateInput}
                  value={this.state.fullname}
                  required
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={this.updateInput}
                  value={this.state.email}
                  required
                />
                <input
                  type="text"
                  name="administratorType"
                  placeholder="Type of User"
                  onChange={this.updateInput}
                  value={this.state.administratorType}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.updateInput}
                  value={this.state.password}
                  required
                />
                <button type="submit">Add User</button>
              </form>
              

            
                    </p>
                </Modal.Body>
            </div>
        )
    }
}