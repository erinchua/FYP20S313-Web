import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/StudentLife.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileImage, faFolderOpen, faSwimmer } from '@fortawesome/free-solid-svg-icons';

async function savePicture(blobURL, category, imageName) {
    const storage = fire.storage();
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

class AddClubsAndCouncilsModal extends Component {

    state = initialStates;

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            categoryType: "",
            clubsAndCouncilDescription: "",
            clubsAndCouncilTitle: "",
            clubsAndCouncilsLogo: "",
            url: "",
            //Below states are for the modals
            handleClose: "",
        };
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

    addClubsCouncils = async() => {
        const db = fire.firestore();
        const isValid = this.validate();
        var category = "";
        var title = "";
        var capsTitle = "";

        if (this.state.clubsAndCouncilsLogo.startsWith("blob:")) {

            if(this.state.categoryType === "Arts & Culture"){
                category = "ArtsCulture";
                const words = this.state.clubsAndCouncilTitle.split(" ");
                for (let i = 0; i < words.length; i++) {
                    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                }
                capsTitle = words.join(" ");
                title = capsTitle.replace(/\s/g, '');

                const url = await savePicture(this.state.clubsAndCouncilsLogo, category, title);
                this.setState({
                    url: url
                });
            } else {
                const words = this.state.clubsAndCouncilTitle.split(" ");
                for (let i = 0; i < words.length; i++) {
                    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                }
                capsTitle = words.join(" ");
                title = capsTitle.replace(/\s/g, '');

                const url = await savePicture(this.state.clubsAndCouncilsLogo, this.state.categoryType, title);
                this.setState({
                    url: url
                });
            }
        }

        if (isValid) {
            this.setState(initialStates);

            db.collection("ClubsAndCouncils").orderBy('id','desc').limit(1).get()
            .then((snapshot) =>  {
                snapshot.forEach((doc) => {
                    var docid = "";
                    var res = doc.data().id.substring(8, 5);
                    var id = parseInt(res);
                    id += 1;

                    if (id.toString().length == 1) {
                        docid = "club-00" + (id)
                    } else if (id.toString().length == 2) {
                        docid = "club-0" + (id) 
                    } else {
                        docid = "club-" + (id) 
                    }

                    if (this.state.categoryType === "StudentLife"){
                        this.setState({
                            categoryType: "Arts & Culture"
                        });
                    } 

                    db.collection("ClubsAndCouncils").doc(docid)
                    .set({
                        categoryType: this.state.categoryType,
                        clubsAndCouncilTitle: this.state.clubsAndCouncilTitle,
                        clubsAndCouncilDescription: this.state.clubsAndCouncilDescription,
                        clubsAndCouncilsLogo: this.state.url,
                        id: docid,
                    })
                    .then(dataSnapshot => {
                        console.log("Added the Club/Council");
                        this.props.handleClose();
                    });
                })
            });
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
                    <Modal.Title id="StudentLife-modalTitle" className="w-100">Add Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFolderOpen}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.Control id="StudentLife-inputFields" name="categoryType" as="select" required value={this.state.categoryType} onChange={this.updateInput} noValidate>
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
                                    <Form.Control id="StudentLife-inputFields" type="text" name="clubsAndCouncilTitle" placeholder="Name of Club/Council: e.g. Dance Art" required value={this.state.clubsAndCouncilTitle} onChange={this.updateInput} noValidate></Form.Control>
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
                                    <Form.Control id="StudentLife-textAreas" as="textarea" rows="4" name="clubsAndCouncilDescription" placeholder="Description" required value={this.state.clubsAndCouncilDescription} onChange={this.updateInput} noValidate></Form.Control>
                                    <div className="errorMessage">{this.state.clubsAndCouncilDescriptionError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                        <Form.Group>
                            <Form.Group as={Row} className="StudentLife-formGroup">
                                <Form.Group as={Col} md="1" className="StudentLife-formGroup">
                                    <FontAwesomeIcon size="lg" icon={faFileImage}/>
                                </Form.Group> 
                                <Form.Group as={Col} md="7">
                                    <Form.File name="imgFile" className="StudentLife-imgFile" label={this.state.clubsAndCouncilsLogo} onChange={this.handleFileUpload} custom required></Form.File>
                                    <div className="errorMessage">{this.state.clubsAndCouncilsLogoError}</div>
                                </Form.Group>
                            </Form.Group>                     
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row id="StudentLife-addFooter">
                            <Col md={12} className="StudentLife-addFooterCol">
                                <Button id="StudentLife-submitBtn" type="submit" onClick={this.addClubsCouncils}>Submit</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}
export default AddClubsAndCouncilsModal;