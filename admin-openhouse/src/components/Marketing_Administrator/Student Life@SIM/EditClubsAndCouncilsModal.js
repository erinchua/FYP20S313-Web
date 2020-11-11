import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/StudentLife.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileImage, faSwimmer, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

async function savePicture(blobURL, category, imageName) {
    const pictureRef = storage.ref(`/ClubsAndCouncil/${category}`).child(imageName);
    const response = await fetch(blobURL);
    const blob = await response.blob(); //fetch blob object
    const snapshot = await pictureRef.put(blob); //upload
    const url = await snapshot.ref.getDownloadURL(); //url in storage
    console.log("image URL:", url);
    return url;
}

const initialStates = {
    categoryTypeError: "",
    clubsAndCouncilDescriptionError: "",
    clubsAndCouncilTitleError: "",
    clubsAndCouncilsLogoError: "",
}

class EditClubsAndCouncilsModal extends Component {

    state = initialStates;

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            categoryType: this.props.categoryType,
            clubsAndCouncilDescription: this.props.clubsAndCouncilDescription,
            clubsAndCouncilTitle: this.props.clubsAndCouncilTitle,
            clubsAndCouncilsLogo: this.props.clubsAndCouncilsLogo,
            url: "",
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
            const homeURL = URL.createObjectURL(file);

            console.log("Create:", homeURL);
            this.setState({
                clubsAndCouncilsLogo: homeURL,
            })
        }
    };

    handleSave = async() => {
        const isValid = this.validate();
        var category = "";
        var title = "";
        var res = "";
        var extension = "";
        var fileName = "";

        if (this.state.clubsAndCouncilsLogo.startsWith("blob:")) {

            if (this.state.categoryType === "Arts & Culture"){
                category = "ArtsCulture";

                title = this.props.clubsAndCouncilsLogo.split(/\%2..*%2F(.*?)\?alt/)[1].split(".")[0]
                res = this.props.clubsAndCouncilsLogo.split("?alt=")[0];
                extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    fileName = title;
                    const url = await savePicture(this.state.clubsAndCouncilsLogo, category, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    fileName = title + extension;
                    const url = await savePicture(this.state.clubsAndCouncilsLogo, category, fileName);
                    this.setState({
                        url: url
                    });
                }
            } else {
                title = this.props.clubsAndCouncilsLogo.split(/\%2..*%2F(.*?)\?alt/)[1].split(".")[0]
                res = this.props.clubsAndCouncilsLogo.split("?alt=")[0];
                extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    fileName = title;
                    const url = await savePicture(this.state.clubsAndCouncilsLogo, this.state.categoryType, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    fileName = title + extension;
                    const url = await savePicture(this.state.clubsAndCouncilsLogo, this.state.categoryType, fileName);
                    this.setState({
                        url: url
                    });
                }
            }            

            if (isValid) {
                this.setState(initialStates);

                db.collection("ClubsAndCouncils").doc(this.props.id)
                .update({
                    id: this.props.id,
                    categoryType: this.state.categoryType,
                    clubsAndCouncilDescription: this.state.clubsAndCouncilDescription,
                    clubsAndCouncilTitle: this.state.clubsAndCouncilTitle,
                    clubsAndCouncilsLogo: this.state.url,
                })
                .then(dataSnapshot => {
                    console.log("Updated the Club/Council");
                    this.props.handleEdit();
                });
            }
            
        } else {
            if (isValid) {
                this.setState(initialStates);
                db.collection("ClubsAndCouncils").doc(this.props.id)
                .update({
                    id: this.props.id,
                    categoryType: this.state.categoryType,
                    clubsAndCouncilDescription: this.state.clubsAndCouncilDescription,
                    clubsAndCouncilTitle: this.state.clubsAndCouncilTitle,
                })
                .then(dataSnapshot => {
                    console.log("Updated the Club/Council");
                    this.props.handleEdit();
                });
            }
        }
    }

    validate = () => {
        let categoryTypeError = "";
        let clubsAndCouncilDescriptionError = "";
        let clubsAndCouncilTitleError = "";
        let clubsAndCouncilsLogoError = "";

        if (!this.state.categoryType) {
            categoryTypeError = "Please select a category.";
        }

        if (!this.state.clubsAndCouncilDescription) {
            clubsAndCouncilDescriptionError = "Please enter a valid description for the club/council.";
        }

        if (!this.state.clubsAndCouncilTitle) {
            clubsAndCouncilTitleError = "Please enter a valid club/council name. E.g. Dance Art";
        }

        if (!this.state.clubsAndCouncilsLogo) {
            clubsAndCouncilsLogoError = "Please browse a logo for the club/council.";
        }

        if (categoryTypeError || clubsAndCouncilDescriptionError || clubsAndCouncilTitleError || clubsAndCouncilsLogoError) {
            this.setState({categoryTypeError, clubsAndCouncilDescriptionError, clubsAndCouncilTitleError, clubsAndCouncilsLogoError});
            return false;
        } 

        return true;
    }

    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="StudentLife-modalTitle" className="w-100">Edit Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFolderOpen}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="StudentLife-inputFields" name="categoryType" as="select" required defaultValue={this.props.categoryType} onChange={this.updateInput} noValidate>
                                        <option value="">Select a Category</option>
                                        <option value="Arts & Culture">Arts & Culture</option>
                                        <option value="InternationalStudent">International Students Clubs</option>
                                        <option value="StudentCouncil">Student Councils</option>
                                        <option value="SpecialInterest">Special Interest Clubs</option>
                                        <option value="SportsFitness">Sports & Fitness</option>
                                    </Form.Control>
                                    <div className="errorMessage">{this.state.categoryTypeError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faSwimmer}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="StudentLife-inputFields" type="text" name="clubsAndCouncilTitle" placeholder="Name of Club/Council: e.g. Dance Art" defaultValue={this.props.clubsAndCouncilTitle} onChange={this.updateInput} required noValidate></Form.Control>
                                    <div className="errorMessage">{this.state.clubsAndCouncilTitleError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="StudentLife-textAreas" as="textarea" rows="4" name="clubsAndCouncilDescription" placeholder="Description" defaultValue={this.props.clubsAndCouncilDescription} onChange={this.updateInput} required noValidate></Form.Control>
                                    <div className="errorMessage">{this.state.clubsAndCouncilDescriptionError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <img height="100px" width="100px" src={this.state.clubsAndCouncilsLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileImage}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.File name="imgFile" className="StudentLife-imgFile" label={this.props.clubsAndCouncilsLogo} onChange={this.handleFileUpload} custom required></Form.File>
                                    <div className="errorMessage">{this.state.clubsAndCouncilsLogoError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row id="StudentLife-editFooter">
                            <Col md={6} className="text-right StudentLife-editFooterCol">
                                <Button id="StudentLife-saveBtn" type="submit" onClick={() => this.handleSave()}>Save Changes</Button>
                            </Col>
                            <Col md={6} className="text-left StudentLife-editFooterCol">
                                <Button id="StudentLife-cancelBtn" onClick={() => this.props.handleEdit()}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}
export default EditClubsAndCouncilsModal;