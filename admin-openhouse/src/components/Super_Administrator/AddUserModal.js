import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck, Button, InputGroup, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import "../../css/Super_Administrator/AddUserModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faEnvelope, faUserCircle } from '@fortawesome/free-regular-svg-icons'


export default class AddUserModal extends React.Component {

    render(){
        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addUserModalTitle" className="w-100">
                        Add Administrator
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addUserModalBody">
                    <Form>
                        {/* Admin Name */}
                        <Form.Row className="justify-content-center addAdminFormRow">
                            <Col md="3"></Col>
                            
                            <Col md="1" className="addAdminFormCol text-right">
                                <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faAddressCard} />
                            </Col>

                            <Col md="5">
                                <Form.Control type="text" placeholder="Name*" className="addAdminFormText" required minLength={2} />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                                <Form.Control type="email" placeholder="Email*" className="addAdminFormText" required />
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
                                <Form.Control as="select" defaultValue="marketingAdmin" className="addAdminFormText" id="addAdminFormSelect">
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
            </div>
        )
    }
}