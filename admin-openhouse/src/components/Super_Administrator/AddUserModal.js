import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck, Button, InputGroup, Col } from 'react-bootstrap';

import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import "../../css/Super_Administrator/AddUserModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faEnvelope, faUserCircle } from '@fortawesome/free-regular-svg-icons'


export default class AddUserModal extends React.Component {
    constructor() {
        super();
        this.state = {
          administratorType: "",
          email: "",
          fullname: "",
          password: "",
          errors: {
            fullname: "",
            email: "",
            password: "",
          }
        };
      }
      updateInput = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };

      handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const validEmailRegex = 
        RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        
        let errors = this.state.errors;
      
        switch (name) {
            case 'fullname': 
                errors.fullname = value.length < 5
                ? 'Full Name must be 5 characters long!'
                : '';
            break;

            case 'email': 
                errors.email = validEmailRegex.test(value)
                ? ''
                : 'Email is not valid!';
            break;

          case 'password': 
            errors.password = value.length < 8
                ? 'Password must be 8 characters long!'
                : '';
            break;
          default:
            break;
        }
      
        this.setState({errors, [name]: value}, ()=> {
            console.log(errors)
        })
      }

      
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
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addUserModalTitle" className="w-100">
                        Add Administrator
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addUserModalBody">
                    <Form onSubmit={this.addUser}>
                        {/* Admin Name */}
                        <Form.Row className="justify-content-center addAdminFormRow">
                            <Col md="3"></Col>
                            
                            <Col md="1" className="addAdminFormCol text-right">
                                <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faAddressCard} />
                            </Col>

                            <Col md="5">
                                <Form.Control name="fullname" type="text" placeholder="Full Name*" className="addAdminFormText" required minLength={2} onChange={this.updateInput} value={this.state.fullname} />
                                {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                            </Col>

                            <Col md="3"></Col>
                        </Form.Row>

                        {/* Admin Email */}
                        <Form.Row className="justify-content-center addAdminFormRow">
                            <Col md="3"></Col>
                            
                            <Col md="1" className="addAdminFormCol text-right">
                                <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faEnvelope} />
                            </Col>

                            <Col md="5">
                                <Form.Control name="email" type="email" placeholder="Email*" className="addAdminFormText" required onChange={this.updateInput} value={this.state.email} />
                            </Col>

                            <Col md="3"></Col>
                        </Form.Row>

                        {/* Admin User Type */}
                        <Form.Row className="justify-content-center addAdminFormRow">
                            <Col md="3"></Col>
                            
                            <Col md="1" className="addAdminFormCol text-right">
                                <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faUserCircle} />
                            </Col>

                            <Col md="5">
                                <Form.Control as="select" name="administratorType" defaultValue="marketingAdmin" className="addAdminFormText" id="addAdminFormSelect" required onChange={this.updateInput} value={this.state.administratorType}>
                                    <option value="marketingAdmin" className="addAdminFormSelectOption">Marketing Administrator</option>
                                </Form.Control>
                            </Col>

                            <Col md="3"></Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center addAdminFormBtnRow">
                            <Col className="text-center">
                                <Button type="submit" id="addAdminFormBtn" onClick={this.props.onClick}>Submit</Button>
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>
                    
                    {/* <Modal.Body>
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
                    </Modal.Body> */}
            </div>
        )
    }
}