import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormCheck, Button, Col, Row } from 'react-bootstrap';

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
          errors: {
            email: "",
          }
        };
    }


    render(){
        const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                </Modal.Header>
                
                <Modal.Body>
                    <Row className="justify-content-center">
                        <Col size="12" className="text-center forgetPasswordModalCol">
                            {/* <img id="forgetPasswordModalIcon" src={DeleteAdmin} /> */}
                        </Col>
                    </Row>
                    
                    <Row className="justify-content-center">
                        <Col size="12" className="text-center forgetPasswordModalCol">
                            <h5 id="forgetPasswordModalText">Are you sure you want to remove this administrator?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col size="6" className="text-right forgetPasswordModalCol">
                            {/* Add DeleteUser onclick function here */}
                            <Button id="confirmDeleteAdminModalBtn"> {/* onClick={ (e) => {DeleteUser(e, user.id);} } */}
                                Confirm
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}