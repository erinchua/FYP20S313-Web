import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
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
    return url;
}

const initialStates = {
    descriptionError: "",
    brochureUrlError: "",
    imageUrlError: "",
}

class EditStudentLifeBrochuresModal extends Component {

    state = initialStates;

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            description: this.props.description,
            brochureUrl: this.props.brochureUrl,
            document: "",
            //Below states are for the modals
            handleEdit: "",
        }
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleFileUpload = (e) => {
        if (e.target.files?.length > 0){
            const file = e.target.files?.item(0);
            const fileURL = URL.createObjectURL(file);

            this.setState({
                brochureUrl: fileURL,
            });            
        }
    };

    //When click on "Save Changes" in edit modal
    handleSave = async() => {
        var brochureTitle = "";
        var brochureRes = "";
        var brochureExtension = "";
        var brochureName = "";
        const isValid = this.validate();

        //When upload a new brochure and state will starts with "blob:"
        if (this.state.brochureUrl.startsWith("blob:")) {   

            brochureTitle = this.props.brochureUrl.split(/\%2..*%2F(.*?)\?alt/)[1].split(".")[0]
            brochureRes = this.props.brochureUrl.split("?alt=")[0];
            brochureExtension = brochureRes.substr(brochureRes.length - 4);

            if (!brochureExtension.includes('.pdf') && !brochureExtension.includes('.PDF')) {
                brochureName = brochureTitle;
                const document = await savePicture(this.state.brochureUrl, "Study", brochureName);
                this.setState({
                    document: document
                });
            } else {
                brochureName = brochureTitle + brochureExtension;
                const document = await savePicture(this.state.brochureUrl, "Study", brochureName);
                this.setState({
                    document: document
                });
            } 

            if (isValid) {
                this.setState(initialStates);

                db.collection("Brochures").doc(this.props.id)
                .update({
                    description: this.state.description,
                    brochureUrl: this.state.document,
                })
                .then(() => {
                    this.props.handleEdit();
                });
            }

        //When never upload a new brochure and edit description only
        } else {
            if (isValid) {
                this.setState(initialStates);

                db.collection("Brochures").doc(this.props.id)
                .update({
                    description: this.state.description,
                })
                .then(() => {
                    this.props.handleEdit();
                });
            }
        }

    }

    //Validations for the edit modal fields
    validate = () => {
        let descriptionError = "";
        let brochureUrlError = "";

        if (!this.state.description) {
            descriptionError = "Please enter a valid description name for the brochure.";
        }

        if (!this.state.brochureUrl) {
            brochureUrlError = "Please browse a valid brochure document.";
        }

        if (descriptionError || brochureUrlError) {
            this.setState({descriptionError, brochureUrlError});
            return false;
        } 

        return true;
    }

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
                                    <Form.Control readOnly id="Brochures-inputFields" type="text" name="description" placeholder="Description" defaultValue={this.props.description} onChange={this.updateInput} required noValidate></Form.Control>
                                    <div className="errorMessage">{this.state.descriptionError}</div>
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
                                    <Form.File name="brochureUrl" className="Brochures-imgFile" label={this.props.brochureUrl} onChange={this.handleFileUpload} custom required></Form.File>
                                    <div className="errorMessage">{this.state.brochureUrlError}</div>
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