import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Brochures.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faHeading } from '@fortawesome/free-solid-svg-icons';

async function savePicture(blobURL, folderName, fileName) {
    const pictureRef = storage.ref(`/Brochures/${folderName}`).child(fileName);
    const response = await fetch(blobURL);
    const blob = await response.blob(); //fetch blob object
    const snapshot = await pictureRef.put(blob); //upload
    const url = await snapshot.ref.getDownloadURL(); //url in storage
    console.log("File URL:", url);
    return url;
}

class EditStudentLifeBrochuresModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            description: this.props.description,
            brochureUrl: this.props.brochureUrl,
            document: "",
            onClickBrochures: "",
            //Below states are for the modals
            handleEdit: "",
        }
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log([e.target.name], e.target.value)
    };

   

    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="Brochures-modalTitle" className="w-100">Edit Brochures</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate>
                        <Form.Group>
                            <Form.Group as={Row} className="Brochures-formGroup">
                                <Form.Group as={Col} md="1" className="Brochures-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faHeading}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="Brochures-inputFields" type="text" name="description" placeholder="Description" defaultValue={this.props.description} onChange={this.updateInput} required noValidate></Form.Control>
                                    <div className="errorMessage"></div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="Brochures-formLabelGroup">
                                <Form.Group as={Col} md="6" style={{marginBottom: "-1%"}}>
                                    <Form.Label className="Brochures-formLabel">Brochure File: </Form.Label>
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Row} className="Brochures-formGroup">
                                <Form.Group as={Col} md="1" className="Brochures-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                </Form.Group> 
                                
                                <Form.Group as={Col} md="7">
                                    <Form.File name="brochureUrl" className="Brochures-imgFile" label={this.props.brochureUrl} onChange={this.handleFileUpload} onClick={() => this.setState({onClickBrochures: "brochures"})} custom required></Form.File>
                                    <div className="errorMessage"></div>
                                </Form.Group>
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row id="Brochures-editFooter">
                            <Col md={6} className="text-right Brochures-editFooterCol">
                                <Button id="Brochures-saveBtn" type="submit" onClick={() => this.handleSave()}>Save Changes</Button>
                            </Col>
                            <Col md={6} className="text-left Brochures-editFooterCol">
                                <Button id="Brochures-cancelBtn" onClick={() => this.props.handleEdit()}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}
export default EditStudentLifeBrochuresModal;