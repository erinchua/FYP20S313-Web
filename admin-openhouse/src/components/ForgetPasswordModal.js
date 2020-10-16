import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormCheck, Button, Col } from 'react-bootstrap';

import "../css/ForgetPasswordModal.css";
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

export default class ForgetPasswordModal extends React.Component {

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
        // this.handleChange = this.handleChange.bind(this);
    }



    render(){
        const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    {/* <Modal.Title id="forgetPasswordModalTitle" className="w-100">
                        Add Administrator
                    </Modal.Title> */}
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
                                <Form.Control name="fullname" type="text" placeholder="Full Name*" className="addAdminFormText" required onChange={this.handleChange} value={this.state.fullname} noValidate />
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
                                <Form.Control name="email" type="email" placeholder="Email*" className="addAdminFormText" required onChange={this.handleChange} value={this.state.email} />
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
                                <Form.Control as="select" name="administratorType" defaultValue="marketingAdmin" className="addAdminFormText" id="addAdminFormSelect" required onChange={this.handleChange} value={this.state.administratorType}>
                                    <option value="marketingAdmin" className="addAdminFormSelectOption">Marketing Administrator</option>
                                </Form.Control>
                            </Col>

                            <Col md="3"></Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center addAdminFormBtnRow">
                            <Col className="text-center">
                                <Button type="submit" id="addAdminFormBtn">Submit</Button>
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>
            </div>
        )
    }
}