import React from 'react';
import { Modal, Form, Button, Col } from 'react-bootstrap';

import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import "../../css/Super_Administrator/AddUserModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope, faUserCircle } from '@fortawesome/free-regular-svg-icons';


const validEmailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

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
        this.handleChange = this.handleChange.bind(this);
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
      
    addUser = (e) => {
        console.log("Added admin")

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
                    // alert("Added");
                    window.location.reload();
                });

            this.setState({
                fullname: "",
                email: "",
            });
        });
    };
    
    /* Add User Modal Validations */
    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        
        let errors = this.state.errors;
        
        switch (name) {
            case 'fullname': 
                errors.fullname = value.length < 2
                    ? 'Please enter a valid full name!'
                    : '';
                break;

            case 'email': 
                errors.email = validEmailRegex.test(value)
                    ? ''
                    : 'Please enter a valid email!';
                break;

            default:
                break;
        }
        
        this.setState({errors, [e.target.name]: e.target.value}, ()=> {
            console.log(errors)
        })
    
    }


    render(){
        const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addUserModalTitle" className="w-100">
                        Add Administrator
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addUserModalBody">
                    <Form noValidate onSubmit={this.addUser}>
                        {/* Admin Name */}
                        <Form.Row className="justify-content-center addAdminFormRow">
                            <Col md="3"></Col>
                            
                            <Col md="1" className="addAdminFormCol text-right">
                                <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faAddressCard} />
                            </Col>

                            <Col md="5">
                                <Form.Control name="fullname" type="text" placeholder="Full Name*" className="addAdminFormText" required onFocus={this.handleChange} onChange={this.handleChange} value={this.state.fullname} noValidate />
                                {errors.fullname.length > 0 && <span className='error errorText'>{errors.fullname}</span>}
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
                                <Form.Control name="email" type="email" placeholder="Email*" className="addAdminFormText" required onFocus={this.handleChange} onChange={this.handleChange} value={this.state.email} noValidate />
                                {errors.email.length > 0 && <span className='error errorText'>{errors.email}</span>}
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
                                <Form.Control as="select" name="administratorType" defaultValue="marketingAdmin" className="addAdminFormText" id="addAdminFormSelect" required onFocus={this.handleChange} onChange={this.handleChange} value={this.state.administratorType} noValidate>
                                    <option value="marketingAdmin" className="addAdminFormSelectOption">Marketing Administrator</option>
                                </Form.Control>
                            </Col>

                            <Col md="3"></Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center addAdminFormBtnRow">
                            <Col className="text-center">
                                <Button type="submit" id="addAdminFormBtn">Add Administrator</Button>
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