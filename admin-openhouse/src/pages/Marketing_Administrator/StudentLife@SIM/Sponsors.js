import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Sponsors.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEdit, faEnvelopeOpen, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons';

const initialStates = {
    emailError: "",
    websiteError: "",
    descriptionError: "",
    applicationPeriodsError: "",
}

class Sponsors extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            id: "",
            description: "",
            email: "",
            website: "",
            applicationPeriods: "",
            previousPeriods: "",
            //Below states are for the functions
            sponsors: "",
            applicationPeriodsFunc: "",
            //Below states are for the modals
            editEmailModal: false,
            editWebsiteModal: false,
            editDescriptionModal: false,
            editApplicationPeriodsModal: false,
        };
    }

    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.data().administratorType === "Marketing Administrator") {
                            this.display();
                        } else {
                            history.push("/Login");
                        }
                    });
                });
            } else {
                history.push("/Login");
            }
        });
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
        db.collection("Scholarship").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.id == "scholarship-09") {
                    const applicationPeriods = [];
                    const sponsors = [];

                    for (var i = 0; i < doc.data().applicationPeriods.length; i++) {
                        const appData = {
                            applicationPeriods: doc.data().applicationPeriods[i]
                        }
                        applicationPeriods.push(appData);
                    }

                    const sponsorsData = {
                        description: doc.data().description,
                        email: doc.data().email,
                        website: doc.data().website,
                        id: doc.id,
                    }
                    sponsors.push(sponsorsData);

                    this.setState({
                        applicationPeriodsFunc: applicationPeriods,
                        sponsors: sponsors
                    });
                }
            });
        });
    }

    //Update functions for all edit modals
    updateSponsors = (parameter) => {
        const isEmailValid = this.validateEmail();
        const isWebsiteValid = this.validateWebsite();
        const isDescriptionValid = this.validateDescription();
        const isApplicationPeriodsValid = this.validateAppplicationPeriods();

        if (parameter == this.state.email) {
            if (isEmailValid) {
                this.setState(initialStates);

                db.collection("Scholarship").doc("scholarship-09")
                .update({
                    email: this.state.email
                })
                .then(() => {
                    console.log("Updated Email");
                    this.setState({
                        editEmailModal: false,
                    });
                    this.display();
                });
            }
        }

        if (parameter == this.state.website) {
            if (isWebsiteValid) {
                this.setState(initialStates);

                db.collection("Scholarship").doc("scholarship-09")
                .update({
                    website: this.state.website
                })
                .then(() => {
                    console.log("Updated Website");
                    this.setState({
                        editWebsiteModal: false,
                    });
                    this.display();
                });
            }
        }

        if (parameter == this.state.description) {
            if (isDescriptionValid) {
                this.setState(initialStates);

                db.collection("Scholarship").doc("scholarship-09")
                .update({
                    description: this.state.description
                })
                .then(() => {
                    console.log("Updated Description");
                    this.setState({
                        editDescriptionModal: false,
                    });
                    this.display();
                });
            }
        }

        if (parameter == this.state.applicationPeriods) {
            if (isApplicationPeriodsValid) {
                this.setState(initialStates);

                db.collection("Scholarship").doc("scholarship-09")
                .update({
                    applicationPeriods: firebase.firestore.FieldValue.arrayRemove(this.state.previousPeriods)
                })
                .then(() => {
                    console.log("Removed Application Periods");
                    db.collection("Scholarship").doc("scholarship-09")
                    .update({
                        applicationPeriods: firebase.firestore.FieldValue.arrayUnion(this.state.applicationPeriods)
                    }).then(() => {
                        console.log("Updated Application Periods")
                        this.setState({
                            editApplicationPeriodsModal: false,
                        });
                        this.display();
                    });
                });
            }
        }
    }

    //Edit Email
    handleEditEmail = (email) => {
        if (this.state.editEmailModal == false) {
            this.setState({
                editEmailModal: true,
                email: email,
            });
        }
        else {
            this.setState({
                editEmailModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Website
    handleEditWebsite = (website) => {
        if (this.state.editWebsiteModal == false) {
            this.setState({
                editWebsiteModal: true,
                website: website,
            });
        }
        else {
            this.setState({
                editWebsiteModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Description
    handleEditDescription = (description) => {
        if (this.state.editDescriptionModal == false) {
            this.setState({
                editDescriptionModal: true,
                description: description,
            });
        }
        else {
            this.setState({
                editDescriptionModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Application Periods
    handleEditApplicationPeriods = (period) => {
        if (this.state.editApplicationPeriodsModal == false) {
            this.setState({
                editApplicationPeriodsModal: true,
                applicationPeriods: period,
                previousPeriods: period,
            });
        }
        else {
            this.setState({
                editApplicationPeriodsModal: false
            });
            this.setState(initialStates);
        }
    }

    validateEmail = () => {
        let emailError = "";

        if (!this.state.email.includes('@')) {
            emailError = "Please enter a valid email address.";
        }

        if (emailError) {
            this.setState({emailError});
            return false;
        }

        return true;
    }

    validateWebsite = () => {
        let websiteError = "";

        if (!this.state.website) {
            websiteError = "Please enter a valid website.";
        }

        if (websiteError) {
            this.setState({websiteError});
            return false;
        }

        return true;
    }

    validateDescription = () => {
        let descriptionError = "";

        if (!this.state.description) {
            descriptionError = "Please enter a valid description.";
        }

        if (descriptionError) {
            this.setState({descriptionError});
            return false;
        }

        return true;
    }

    validateAppplicationPeriods = () => {
        let applicationPeriodsError = "";

        if (!this.state.applicationPeriods) {
            applicationPeriodsError = "Please select a valid application period.";
        }

        if (applicationPeriodsError) {
            this.setState({applicationPeriodsError});
            return false;
        }

        return true;
    }

    render() {
        return (
            <div>
                <Container fluid className="Sponsors-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Sponsors-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Sponsors-topContentContainer">
                                        <Row id="Sponsors-firstRow">
                                            <Col md={12} className="text-left" id="Sponsors-firstRowCol">
                                                <h4 id="Sponsors-title">Sponsors</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Sponsors-secondRow">
                                            <Col md={12} className="text-center" id="Sponsors-secondRowCol">
                                                <Table responsive="sm" bordered id="Sponsors-tableContainer">
                                                    <thead id="Sponsors-tableHeader">
                                                        <tr>
                                                            <th colSpan="2">SAFRA-SIM GE Sponsorship</th>
                                                            <th id="Sponsors-editHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                        {this.state.sponsors && this.state.sponsors.map((sponsor) => {
                                                            return (
                                                                <tbody id="Sponsors-tableBody">
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Email</b></td>
                                                                        <td className="text-left">{sponsor.email}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn" onClick={() => this.handleEditEmail(sponsor.email)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Website</b></td>
                                                                        <td className="text-left">{sponsor.website}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn" onClick={() => this.handleEditWebsite(sponsor.website)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Description</b></td>
                                                                        <td className="text-left">{sponsor.description}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn" onClick={() => this.handleEditDescription(sponsor.description)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="2"><b>Application Period</b></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    {this.state.applicationPeriodsFunc && this.state.applicationPeriodsFunc.map((appPeriod) => {
                                                                        return (
                                                                            <tr>
                                                                                <td colSpan="2">{appPeriod.applicationPeriods}</td>
                                                                                <td><Button size="sm" id="Sponsors-editBtn" onClick={() => this.handleEditApplicationPeriods(appPeriod.applicationPeriods)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            )
                                                        })}
                                                        
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {/* Email Edit Modal */}
                {this.state.editEmailModal == true ? 
                    <Modal show={this.state.editEmailModal} onHide={this.handleEditEmail} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Sponsors-modalTitle" className="w-100">Edit Sponsors Enquiry's Email</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Sponsors-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Sponsors-inputFields" type="text" name="email" placeholder="Sponsors Enquiry's Email" required defaultValue={this.state.email} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.emailError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Sponsors-editFooter">
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-saveBtn" type="submit" onClick={() => this.updateSponsors(this.state.email)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-cancelBtn" onClick={this.handleEditEmail}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Website Edit Modal */}
                {this.state.editWebsiteModal == true ? 
                    <Modal show={this.state.editWebsiteModal} onHide={this.handleEditWebsite} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Sponsors-modalTitle" className="w-100">Edit Sponsors' Website</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Sponsors-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faInternetExplorer}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Sponsors-inputFields" type="text" name="website" placeholder="Sponsors' Website" required defaultValue={this.state.website} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.websiteError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Sponsors-editFooter">
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-saveBtn" type="submit" onClick={() => this.updateSponsors(this.state.website)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-cancelBtn" onClick={this.handleEditWebsite}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Description Edit Modal */}
                {this.state.editDescriptionModal == true ? 
                    <Modal show={this.state.editDescriptionModal} onHide={this.handleEditDescription} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Sponsors-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Sponsors-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="2x" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Sponsors-textAreas" as="textarea" rows="4" type="text" name="description" placeholder="Sponsors' Description" required defaultValue={this.state.description} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.descriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Sponsors-editFooter">
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-saveBtn" type="submit" onClick={() => this.updateSponsors(this.state.description)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-cancelBtn" onClick={this.handleEditDescription}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Application Periods Edit Modal */}
                {this.state.editApplicationPeriodsModal == true ? 
                    <Modal show={this.state.editApplicationPeriodsModal} onHide={this.handleEditApplicationPeriods} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Sponsors-modalTitle" className="w-100">Edit Application Period</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Sponsors-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Sponsors-inputFields" name="applicationPeriods" as="select" required defaultValue={this.state.applicationPeriods} onChange={this.updateInput} noValidate>
                                                    <option value="">Select a Period</option>
                                                    <option value="January">January</option>
                                                    <option value="February">February</option>
                                                    <option value="March">March</option>
                                                    <option value="April">April</option>
                                                    <option value="May">May</option>
                                                    <option value="June">June</option>
                                                    <option value="July">July</option>
                                                    <option value="August">August</option>
                                                    <option value="September">September</option>
                                                    <option value="October">October</option>
                                                    <option value="November">November</option>
                                                    <option value="December">December</option>
                                                </Form.Control>
                                                <div className="errorMessage">{this.state.applicationPeriodsError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Sponsors-editFooter">
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-saveBtn" type="submit" onClick={() => this.updateSponsors(this.state.applicationPeriods)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Sponsors-editCol">
                                            <Button id="Sponsors-cancelBtn" onClick={this.handleEditApplicationPeriods}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

            </div>

        );
    }
}
export default Sponsors;
