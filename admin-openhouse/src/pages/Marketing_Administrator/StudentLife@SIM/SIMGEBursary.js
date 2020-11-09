import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Bursary.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEnvelopeOpen, faFileAlt, faLocationArrow, faPhone, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons';

class SIMGEBursary extends Component {
    constructor() {
        super();
        this.state = {
            //Value and Tenure of Bursary
            valueId: "",
            valueDescription: "",
            //Eligibility
            eligibilityId: "",
            eligibilityContent: "",
            //Repayment
            repaymentId: "",
            repaymentDescription: "",
            //How to Apply
            applyId: "",
            applySteps: "",
            applyDescription: "",
            applyApplicationPeriod: "",
            applyClosingDate: "",
            applyNotificationPeriod: "",
            applyProcessingPeriod: "",
            //Required Supporting Documents
            supportDocsId: "",
            supportDocsSimPdpaPolicy: "",
            supportDocsDescription: "",
            supportDocsTitle: "",
            //Things to Note
            noteId: "",
            noteContent: "",
            //Contact Information
            contactInfoId: "",
            contactInfoEmail: "",
            //Below states are for the functions
            valueTenureBursary: "",
            eligibility: "",
            repayment: "",
            howToApply: "",
            howToApplyContent: "",
            requiredSupportingDocs: "",
            requiredSupportingDocsContent: "",
            thingsToNote: "",
            contactInformation: "",
            //Below states are for the modals
            valueTenureEditModal: false,
            eligibilityEditModal: false,
            repaymentEditModal: false,
            howToApplyEditModal: false,
            supportingDocsEditModal: false,
            thingsToNoteEditModal: false,
            contactInfoEditModal: false,
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
        db.collection("Bursary").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {

                //Get Value and Tenure Bursary
                if (doc.id === "bursary-01") {
                    const valueTenureBursary = [];

                    const data = {
                        valueId: doc.id,
                        valueDescription: doc.data().description,
                    }
                    valueTenureBursary.push(data);
                    this.setState({
                        valueTenureBursary: valueTenureBursary
                    });
                }

                //Get Eligibility
                if (doc.id === "bursary-02") {
                    const eligibility = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            eligibilityId: doc.id,
                            eligibilityContent: doc.data().content[i],
                        }
                        eligibility.push(data);
                    }
                    this.setState({
                        eligibility: eligibility
                    });
                }

                //Get Repayment
                if (doc.id === "bursary-03") {
                    const repayment = [];

                    const data = {
                        repaymentId: doc.id,
                        repaymentDescription: doc.data().description,
                    }
                    repayment.push(data);
                    this.setState({
                        repayment: repayment
                    });
                }

                //Get How to Apply
                if (doc.id === "bursary-04") {
                    const applyContent = [];
                    const applyOthers = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            applyApplicationPeriod: doc.data().content[i].applicationPeriod,
                            applyClosingDate: doc.data().content[i].closingDate,
                            applyNotificationPeriod: doc.data().content[i].notificationPeriod,
                            applyProcessingPeriod: doc.data().content[i].processingPeriod,
                        }
                        applyContent.push(data);
                    }

                    const otherData = {
                        applyId: doc.id,
                        applyDescription: doc.data().description,
                        applySteps: doc.data().steps,
                    }
                    applyOthers.push(otherData);

                    this.setState({
                        howToApply: applyOthers,
                        howToApplyContent: applyContent
                    });
                }

                //Get Required Supporting Documents
                if (doc.id === "bursary-05") {
                    const supportOthers = [];
                    const supportContent = [];

                    const otherData = {
                        supportDocsId: doc.id,
                        supportDocsSimPdpaPolicy: doc.data().simPdpaPolicy,
                    }
                    supportOthers.push(otherData);

                    for (var i = 0; i < doc.data().content.length; i++) {
                        for (var j = 0; j < doc.data().content[i].description.length; j++) {
                            const data = {
                                supportDocsDescription: doc.data().content[i].description[j],
                                supportDocsTitle: doc.data().content[i].title,
                            }
                            supportContent.push(data);
                        }
                    }

                    this.setState({
                        requiredSupportingDocs: supportOthers,
                        requiredSupportingDocsContent: supportContent
                    });
                }

                //Get Things to Note
                if (doc.id === "bursary-06") {
                    const thingsToNote = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            noteId: doc.id,
                            noteContent: doc.data().content[i],
                        }
                        thingsToNote.push(data);
                    }
                    
                    this.setState({
                        thingsToNote: thingsToNote
                    });
                }

                //Get Contact Information
                if (doc.id === "bursary-07") {
                    const contactInfo = [];

                    const data = {
                        contactInfoId: doc.id,
                        contactInfoEmail: doc.data().email,
                    }
                    contactInfo.push(data);

                    this.setState({
                        contactInformation: contactInfo
                    });
                }
            });
        });
    }

    // handleFileUpload = (files) => {
    //     this.setState({
    //         files: files,
    //     });
    // };

    // handleSave = (mapImage) => {
    //     const parentthis = this;

    //     if (this.state.files !== undefined) {
    //         const foldername = "Bursary";
    //         const file = this.state.files[0];
    //         const storageRef = storage.ref(foldername);
    //         const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
    //         fileRef.on("state_changed", function (snapshot) {
    //             fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
    //                 console.log("File available at", downloadURL);

    //                 const userRef = db.collection("Bursary").doc("simGlobalEducationBursary")
    //                 .update({
    //                     faqFile: downloadURL,
    //                 })
    //                 .then(function () {
    //                     alert("Updated");
    //                     window.location.reload();
    //                 });
    //             });
    //             const progress = Math.round(
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //             );
    //             if (progress != "100") {
    //                 parentthis.setState({ progress: progress });
    //             } else {
    //                 parentthis.setState({ progress: "Uploaded!" });
    //             }
    //         });
    //         console.log();
    //     } else {
    //         alert("No Files Selected");
    //     }
    // };

    //Edit Venue and Tenure of Bursary
    handleValueTenureEditModal = (valueTenure) => {
        if (this.state.valueTenureEditModal == false) {
            this.setState({
                valueTenureEditModal: true,
                valueId: valueTenure.valueId,
                valueDescription: valueTenure.valueDescription,
            });
        }
        else {
            this.setState({
                valueTenureEditModal: false
            });
        }
    }

    //Edit Eligibility
    handleEligibilityEditModal = (eligibility) => {
        if (this.state.eligibilityEditModal == false) {
            this.setState({
                eligibilityEditModal: true,
                eligibilityId: eligibility.eligibilityId,
                eligibilityContent: eligibility.eligibilityContent,
            });
        }
        else {
            this.setState({
                eligibilityEditModal: false
            });
        }
    }

    //Edit Repayment
    handleRepaymentEditModal = (repayment) => {
        if (this.state.repaymentEditModal == false) {
            this.setState({
                repaymentEditModal: true,
                repaymentId: repayment.repaymentId,
                repaymentDescription: repayment.repaymentDescription,
            });
        }
        else {
            this.setState({
                repaymentEditModal: false
            });
        }
    }

    //Edit How to Apply
    handleApplyEditModal = (apply) => {
        if (this.state.howToApplyEditModal == false) {
            this.setState({
                howToApplyEditModal: true,
                applyId: apply.applyId,
                applyDescription: apply.applyDescription,
                applySteps: apply.applySteps,
            });
        }
        else {
            this.setState({
                howToApplyEditModal: false
            });
        }
    }

    //Edit Required Supporting Documents
    handleSupportingDocsEditModal = () => {
        if (this.state.supportingDocsEditModal == false) {
            this.setState({
                supportingDocsEditModal: true,
            });
        }
        else {
            this.setState({
                supportingDocsEditModal: false
            });
        }
    }

    //Edit Things to Note
    handleThingsToNoteEditModal = () => {
        if (this.state.thingsToNoteEditModal == false) {
            this.setState({
                thingsToNoteEditModal: true,
            });
        }
        else {
            this.setState({
                thingsToNoteEditModal: false
            });
        }
    }

    //Edit Contact Information
    handleContactInfoEditModal = () => {
        if (this.state.contactInfoEditModal == false) {
            this.setState({
                contactInfoEditModal: true,
            });
        }
        else {
            this.setState({
                contactInfoEditModal: false
            });
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="Bursary-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Bursary-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Bursary-topContentContainer">
                                        <Row id="Bursary-firstRow">
                                            <Col md={12} className="text-left" id="Bursary-firstRowCol">
                                                <h4 id="Bursary-title">SIM GE Bursary</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Bursary-secondRow">
                                            <Col md={12} id="Bursary-secondRowCol">
                                                <Accordion defaultActiveKey="valueTenureBursary">
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="valueTenureBursary">Value and Tenure of Bursary</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="valueTenureBursary">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.valueTenureBursary && this.state.valueTenureBursary.map((valueTenure) => {
                                                                            return (
                                                                                <tbody id="Bursary-tableBody" key={valueTenure.valueId}>
                                                                                    <tr>
                                                                                        <td className="text-left">{valueTenure.valueDescription}</td>
                                                                                        <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleValueTenureEditModal(valueTenure)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="eligibility">Eligibility</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="eligibility">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th>Content</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.eligibility && this.state.eligibility.map((eligibility) => {
                                                                            return (
                                                                                <tbody id="Bursary-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{eligibility.eligibilityContent}</td>
                                                                                        <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleEligibilityEditModal(eligibility)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="repayment">Repayment</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="repayment">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.repayment && this.state.repayment.map((repayment) => {
                                                                            return (
                                                                                <tbody id="Bursary-tableBody" key={repayment.repaymentId}>
                                                                                    <tr>
                                                                                        <td className="text-left">{repayment.repaymentDescription}</td>
                                                                                        <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleRepaymentEditModal(repayment)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="howToApply">How to Apply</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="howToApply">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Row id="Bursary-secondRow">
                                                                    <Col md={12} className="text-center Bursary-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                            <thead id="Bursary-tableHeader">
                                                                                <tr>
                                                                                    <th>Description</th>
                                                                                    <th>Steps</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.howToApply && this.state.howToApply.map((apply) => {
                                                                                return (
                                                                                    <tbody id="Bursary-tableBody" key={apply.applyId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{apply.applyDescription}</td>
                                                                                            <td className="text-left">{apply.applySteps}</td>
                                                                                            <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleApplyEditModal(apply)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Row>
                                                                <Row id="Bursary-secondRow">
                                                                    <Col md={12} className="text-center Bursary-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                            <thead id="Bursary-tableHeader">
                                                                                <tr>
                                                                                    <th>Application Period</th>
                                                                                    <th>Closing Date</th>
                                                                                    <th>Notification Period</th>
                                                                                    <th>Processing Period</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.howToApplyContent && this.state.howToApplyContent.map((applyContent) => {
                                                                                return (
                                                                                    <tbody id="Bursary-tableBody">
                                                                                        <tr>
                                                                                            <td>{applyContent.applyApplicationPeriod}</td>
                                                                                            <td>{applyContent.applyClosingDate}</td>
                                                                                            <td>{applyContent.applyNotificationPeriod}</td>
                                                                                            <td>{applyContent.applyProcessingPeriod}</td>
                                                                                            <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="requiredSupportingDocs">Required Supporting Documents</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="requiredSupportingDocs">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Row id="Bursary-secondRow">
                                                                    <Col md={12} className="text-center Bursary-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                            <thead id="Bursary-tableHeader">
                                                                                <tr>
                                                                                    <th>SIM PDPA Policy</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.requiredSupportingDocs && this.state.requiredSupportingDocs.map((requiredDocs) => {
                                                                                return (
                                                                                    <tbody id="Bursary-tableBody" key={requiredDocs.supportDocsId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{requiredDocs.supportDocsSimPdpaPolicy}</td>
                                                                                            <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Row>
                                                                <Row id="Bursary-secondRow">
                                                                    <Col md={12} className="text-center Bursary-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                            <thead id="Bursary-tableHeader">
                                                                                <tr>
                                                                                    <th id="Bursary-titleHeading">Title</th>
                                                                                    <th>Description</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.requiredSupportingDocsContent && this.state.requiredSupportingDocsContent.map((requiredDocsContent) => {
                                                                                return (
                                                                                    <tbody id="Bursary-tableBody">
                                                                                        <tr>
                                                                                            <td><b>{requiredDocsContent.supportDocsTitle}</b></td>
                                                                                            <td className="text-left">{requiredDocsContent.supportDocsDescription}</td>
                                                                                            <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="thingsToNote">Things to Note</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="thingsToNote">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th>Content</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.thingsToNote && this.state.thingsToNote.map((note) => {
                                                                            return (
                                                                                <tbody id="Bursary-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{note.noteContent}</td>
                                                                                        <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                    <Card>
                                                        <div className="Bursary-Header">
                                                            <Accordion.Toggle as={Card.Header} eventKey="contactInfo">Contact Information</Accordion.Toggle>
                                                        </div>
                                                        <Accordion.Collapse eventKey="contactInfo">
                                                            <Card.Body className="Bursary-cardBody">
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th>Email</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.contactInformation && this.state.contactInformation.map((contactInfo) => {
                                                                            return (
                                                                                <tbody id="Bursary-tableBody" key={contactInfo.contactInfoId}>
                                                                                    <tr>
                                                                                        <td>{contactInfo.contactInfoEmail}</td>
                                                                                        <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                </Accordion>
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {/* Venue and Tenure of Bursary Edit Modal */}
                {this.state.valueTenureEditModal == true ? 
                    <Modal show={this.state.valueTenureEditModal} onHide={this.handleValueTenureEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Value and Tenure of Bursary</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="4" type="text" name="valueDescription" placeholder="Value and Tenure of Bursary's Description" required defaultValue={this.state.valueDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleValueTenureEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Eligibility Edit Modal */}
                {this.state.eligibilityEditModal == true ? 
                    <Modal show={this.state.eligibilityEditModal} onHide={this.handleEligibilityEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Eligibility</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="4" type="text" name="eligibilityContent" placeholder="Eligibility's Content" required defaultValue={this.state.eligibilityContent} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleEligibilityEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Repayment Edit Modal */}
                {this.state.repaymentEditModal == true ? 
                    <Modal show={this.state.repaymentEditModal} onHide={this.handleRepaymentEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Repayment</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="4" type="text" name="repaymentDescription" placeholder="Repayment's Description" required defaultValue={this.state.repaymentDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleRepaymentEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* How to Apply Edit Modal */}
                {this.state.howToApplyEditModal == true ? 
                    <Modal show={this.state.howToApplyEditModal} onHide={this.handleApplyEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit How to Apply</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="4" type="text" name="applyDescription" placeholder="How to Apply's Description" required defaultValue={this.state.applyDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faShoePrints}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="4" type="text" name="applySteps" placeholder="How to Apply's Steps" required defaultValue={this.state.applySteps} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleApplyEditModal}>Cancel</Button>
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
export default SIMGEBursary;