import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/ArtsAndCulture.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileImage, faSwimmer } from '@fortawesome/free-solid-svg-icons';

class EditClubsAndCouncilsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handleEdit: "",
        }
    }

    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="ArtsCulture-modalTitle" className="w-100">Edit Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate>
                        <Form.Group>
                            <Form.Group as={Row} className="ArtsCulture-formGroup">
                                <Form.Group as={Col} md="1" className="ArtsCulture-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faSwimmer}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="ArtsCulture-inputFields" type="text" name="clubsAndCouncilTitle" placeholder="Name of Club/Council: e.g. Dance Art" onChange={this.updateInput} required defaultValue="" noValidate></Form.Control>
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
                                    <Form.Control id="ArtsCulture-inputFields" type="text" name="clubsAndCouncilDescription" placeholder="Description" onChange={this.updateInput} required defaultValue="" noValidate></Form.Control>
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
                        <Row id="ArtsCulture-editFooter">
                            <Col md={6} className="text-right ArtsCulture-editFooterCol">
                                <Button id="ArtsCulture-saveBtn" type="submit">Save Changes</Button>
                            </Col>
                            <Col md={6} className="text-left ArtsCulture-editFooterCol">
                                <Button id="ArtsCulture-cancelBtn" onClick={() => this.props.handleEdit()}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}
export default EditClubsAndCouncilsModal;