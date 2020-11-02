import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/ArtsAndCulture.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileImage, faSwimmer } from '@fortawesome/free-solid-svg-icons';

class AddClubsAndCouncilsModal extends Component {
    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="ArtsCulture-modalTitle" className="w-100">Add Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={this.addGuidedTour}>
                        <Form.Group>
                            <Form.Group as={Row} className="ArtsCulture-formGroup">
                                <Form.Group as={Col} md="1" className="ArtsCulture-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faSwimmer}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="ArtsCulture-inputFields" type="text" name="clubsAndCouncilTitle" placeholder="Name of Club/Council: e.g. Dance Art" required onChange={this.updateInput} noValidate></Form.Control>
                                        <div className="errorMessage"></div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="ArtsCulture-formGroup">
                                <Form.Group as={Col} md="1" className="ArtsCulture-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="ArtsCulture-inputFields" type="text" name="clubsAndCouncilDescription" placeholder="Description" required onChange={this.updateInput} noValidate></Form.Control>
                                    <div className="errorMessage"></div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="ArtsCulture-formGroup">
                                <Form.Group as={Col} md="1" className="ArtsCulture-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileImage}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.File name="imgFile" className="ArtsCulture-imgFile" label={"Logo File"} onChange={() => console.log("Set State")} custom required></Form.File>
                                    <div className="errorMessage"></div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row id="ArtsCulture-addFooter">
                            <Col md={12} className="ArtsCulture-addFooterCol">
                                <Button id="ArtsCulture-submitBtn" type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}
export default AddClubsAndCouncilsModal;