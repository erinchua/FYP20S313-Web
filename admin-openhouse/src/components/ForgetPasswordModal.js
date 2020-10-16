import React from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';

import "../css/ForgetPasswordModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


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

        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    /* Forget Password Modal Validations */
    handleEmailChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        
        let errors = this.state.errors;
        
        switch (name) {
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
                <Modal.Header closeButton className="justify-content-center"></Modal.Header>
                
                <Modal.Body>
                    <Form noValidate onSubmit={this.resetPassword} >
                        <Form.Row className="justify-content-center">
                            <Col size="12" className="text-center forgetPasswordModalImgCol">
                                <FontAwesomeIcon id="registeredEmail_logo" size="3x" icon={faPaperPlane} />
                            </Col>
                        </Form.Row>
                        
                        <Form.Row className="justify-content-center">
                            <Col size="12" className="text-center">
                                <h5 id="forgetPasswordModalText">Please enter your registered email</h5>
                            </Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center">
                            <Col size="12" className="text-center forgetPasswordModalCol">
                                <p id="forgetPasswordModalSubText">An email will be sent to your registered email shortly.</p>
                            </Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center forgetPasswordModalEmailRow">
                            <Col size="12" className="text-left forgetPasswordModalEmailCol">
                                <Form.Control name="email" type="email" placeholder="Email*" className="forgetPasswordFormText" required onFocus={this.handleEmailChange} onChange={this.handleEmailChange} value={this.state.email} noValidate />
                                {errors.email.length > 0 && <span className='error errorText'>{errors.email}</span>}
                            </Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center">
                            <Col size="12" className="text-center forgetPasswordModalCol">
                                {/* Add Send Email onclick function here */}
                                <Button id="forgetPasswordModalSendEmailBtn" type="submit"> {/* onClick={ } */}
                                    Send Email
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Modal.Body>
            </div>
        )
    }
}