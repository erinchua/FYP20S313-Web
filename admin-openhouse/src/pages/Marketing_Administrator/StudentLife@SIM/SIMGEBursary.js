import { Container, Row, Col, Table, Button, Modal, Form, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Bursary.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarAlt, faCalendarCheck, faEdit, faEnvelopeOpen, faFileAlt, faHeading, faHourglassHalf, faShoePrints, faStickyNote } from '@fortawesome/free-solid-svg-icons';

const initialStates = {
    valueDescriptionError: "",
    eligibilityContentError: "",
    repaymentDescriptionError: "",
    applyDescriptionError: "",
    applyStepsError: "",
    applyApplicationPeriodError: "",
    applyNotificationPeriodError: "",
    applyClosingDateError: "",
    applyProcessingPeriodError: "",
    supportDocsSimPdpaPolicyError: "",
    supportDescriptionError: "",
    supportTitleError: "",
    noteContentError: "",
    contactInfoEmailError: "",
}

class SIMGEBursary extends Component {

    state = initialStates;

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
            description: "",
            title: "",
            //Things to Note
            noteId: "",
            noteContent: "",
            //Contact Information
            contactInfoId: "",
            contactInfoEmail: "",
            //Others
            previousData: "",
            previousApplicationPeriod: "",
            previousClosingDate: "",
            previousNotificationPeriod: "",
            previousProcessingPeriod: "",
            previousSupportDocsTitle: "",
            previousSupportDocsDescription: "",
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
            howToApplyContentEditModal: false,
            supportingDocsEditModal: false,
            supportingDocsContentEditModal: false,
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

                    const otherData = {
                        supportDocsId: doc.id,
                        supportDocsSimPdpaPolicy: doc.data().simPdpaPolicy,
                    }
                    supportOthers.push(otherData);

                    this.setState({
                        requiredSupportingDocs: supportOthers,
                        requiredSupportingDocsContent: doc.data().content,
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

    updateBursary = (parameter) => {
        const isValueValid = this.validateValue();
        const isEligibilityValid = this.validateEligibility();
        const isRepaymentValid = this.validateRepayment();
        const isApplyValid = this.validateApply();
        const isApplyContentValid = this.validateApplyContent();
        const isSupportValid = this.validateSupport();
        const isSupportContentValid = this.validateSupportContent();
        const isNoteValid = this.validateNote();
        const isContactInfoValid = this.validateContactInfo();

        //Value and Tenure of Bursary
        if (parameter === this.state.valueId) {
            if (isValueValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    description: this.state.valueDescription
                })
                .then(() => {
                    console.log("Updated Description for Value and Tenure of Bursary!");
                    this.setState({
                        valueTenureEditModal: false
                    });
                    this.display();
                });
            }
        }

        //Eligibility
        if (parameter === this.state.eligibilityId) {          
            if (isEligibilityValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    content: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
                })
                .then(() => {
                    db.collection("Bursary").doc(parameter)
                    .update({
                        content: firebase.firestore.FieldValue.arrayUnion(this.state.eligibilityContent)
                    }).then(() => {
                        console.log("Updated Eligibility Content!");
                        this.setState({
                            eligibilityEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

        //Repayment
        if (parameter === this.state.repaymentId) {
            if (isRepaymentValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    description: this.state.repaymentDescription
                })
                .then(() => {
                    console.log("Updated Description for Repayment!");
                    this.setState({
                        repaymentEditModal: false
                    });
                    this.display();
                });
            }
        }

        //How to Apply
        if (parameter === this.state.applyId) {
            if (isApplyValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    description: this.state.applyDescription,
                    steps: this.state.applySteps
                })
                .then(() => {
                    console.log("Updated How to Apply!");
                    this.setState({
                        howToApplyEditModal: false
                    });
                    this.display();
                });
            }
        }

        if (parameter === "howToApplyContent") {
            if (isApplyContentValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc("bursary-04")
                .update({
                    content: firebase.firestore.FieldValue.arrayRemove({
                        applicationPeriod: this.state.previousApplicationPeriod,
                        closingDate: this.state.previousClosingDate,
                        notificationPeriod: this.state.previousNotificationPeriod,
                        processingPeriod: this.state.previousProcessingPeriod
                    })
                })
                .then(() => {
                    db.collection("Bursary").doc("bursary-04")
                    .update({
                        content: firebase.firestore.FieldValue.arrayUnion({
                            applicationPeriod: this.state.applyApplicationPeriod,
                            closingDate: this.state.applyClosingDate,
                            notificationPeriod: this.state.applyNotificationPeriod,
                            processingPeriod: this.state.applyProcessingPeriod
                        })
                    })
                    .then(() => {
                        console.log("Updated How to Apply's Content!");
                        this.setState({
                            howToApplyContentEditModal: false
                        });
                        this.display();
                    });
                });
            }
        }

        //Required Supporting Documents
        if (parameter === this.state.supportDocsId) {
            if (isSupportValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(this.state.supportDocsId)
                .update({
                    simPdpaPolicy: this.state.supportDocsSimPdpaPolicy
                })
                .then(() => {
                    console.log("Updated Required Supporting Documents' SIM PDPA Policy!");
                    this.setState({
                        supportingDocsEditModal: false
                    });
                    this.display();
                });
            }
        }

        if (parameter === "requiredSupportingDocuments") {
            if (isSupportContentValid) {
                this.setState(initialStates);

                var splitDescription = this.state.description.split('\n- ');
                var splitPreviousDescription = this.state.previousSupportDocsDescription.split('\n- ');
                
                var previous = {
                    title: this.state.previousSupportDocsTitle,
                    description: splitPreviousDescription,
                }

                var current = {
                    title: this.state.title,
                    description: splitDescription,
                }

                db.collection("Bursary").doc("bursary-05")
                .update({
                    content: firebase.firestore.FieldValue.arrayRemove(previous)
                })
                .then(() => {
                    db.collection("Bursary").doc("bursary-05")
                    .update({
                        content: firebase.firestore.FieldValue.arrayUnion(current)
                    }).then(() => {
                        console.log("Updated Required Supporting Documents!");
                        this.setState({
                            supportingDocsContentEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

        //Things to Note
        if (parameter === this.state.noteId) {
            if (isNoteValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    content: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
                })
                .then(() => {
                    db.collection("Bursary").doc(parameter)
                    .update({
                        content: firebase.firestore.FieldValue.arrayUnion(this.state.noteContent)
                    })
                    .then(() => {
                        console.log("Updated Thing to Note's Content!");
                        this.setState({
                            thingsToNoteEditModal: false
                        });
                        this.display();
                    });
                });
            }
        }

        //Contact Information
        if (parameter === this.state.contactInfoId) {
            if (isContactInfoValid) {
                this.setState(initialStates);

                db.collection("Bursary").doc(parameter)
                .update({
                    email: this.state.contactInfoEmail
                })
                .then(() => {
                    console.log("Updated Contact Information's Email!");
                    this.setState({
                        contactInfoEditModal: false
                    });
                    this.display();
                });
            }
        }

    }

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
            this.setState(initialStates);
        }
    }

    //Edit Eligibility
    handleEligibilityEditModal = (eligibility) => {
        if (this.state.eligibilityEditModal == false) {
            this.setState({
                eligibilityEditModal: true,
                eligibilityId: eligibility.eligibilityId,
                eligibilityContent: eligibility.eligibilityContent,
                previousData: eligibility.eligibilityContent,
            });
        }
        else {
            this.setState({
                eligibilityEditModal: false
            });
            this.setState(initialStates);
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
            this.setState(initialStates);
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
            this.setState(initialStates);
        }
    }

    //Edit How to Apply Content
    handleApplyContentEditModal = (applyContent) => {
        if (this.state.howToApplyContentEditModal == false) {
            this.setState({
                howToApplyContentEditModal: true,
                applyApplicationPeriod: applyContent.applyApplicationPeriod,
                applyNotificationPeriod: applyContent.applyNotificationPeriod,
                applyClosingDate: applyContent.applyClosingDate,
                applyProcessingPeriod: applyContent.applyProcessingPeriod,
                previousApplicationPeriod: applyContent.applyApplicationPeriod,
                previousNotificationPeriod: applyContent.applyNotificationPeriod,
                previousClosingDate: applyContent.applyClosingDate,
                previousProcessingPeriod: applyContent.applyProcessingPeriod,
            });
        }
        else {
            this.setState({
                howToApplyContentEditModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Required Supporting Documents
    handleSupportingDocsEditModal = (supportDocs) => {
        if (this.state.supportingDocsEditModal == false) {
            this.setState({
                supportingDocsEditModal: true,
                supportDocsId: supportDocs.supportDocsId,
                supportDocsSimPdpaPolicy: supportDocs.supportDocsSimPdpaPolicy,
            });
        }
        else {
            this.setState({
                supportingDocsEditModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Required Supporting Documents Content
    handleSupportingDocsContentEditModal = (supportContent) => {
        if (this.state.supportingDocsContentEditModal == false) {
            this.setState({
                supportingDocsContentEditModal: true,
                title: supportContent.title,
                description: supportContent.description.join('\n- '),
                previousSupportDocsTitle: supportContent.title,
                previousSupportDocsDescription: supportContent.description.join('\n- '),
            });
        }
        else {
            this.setState({
                supportingDocsContentEditModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Things to Note
    handleThingsToNoteEditModal = (note) => {
        if (this.state.thingsToNoteEditModal == false) {
            this.setState({
                thingsToNoteEditModal: true,
                noteId: note.noteId,
                noteContent: note.noteContent,
                previousData: note.noteContent,
            });
        }
        else {
            this.setState({
                thingsToNoteEditModal: false
            });
            this.setState(initialStates);
        }
    }

    //Edit Contact Information
    handleContactInfoEditModal = (contactInfo) => {
        if (this.state.contactInfoEditModal == false) {
            this.setState({
                contactInfoEditModal: true,
                contactInfoId: contactInfo.contactInfoId,
                contactInfoEmail: contactInfo.contactInfoEmail,
            });
        }
        else {
            this.setState({
                contactInfoEditModal: false
            });
            this.setState(initialStates);
        }
    }

    //Validate Value and Tenure of Bursary
    validateValue = () => {
        let valueDescriptionError = "";

        if (!this.state.valueDescription) {
            valueDescriptionError = "Please enter a valid description.";
        }

        if (valueDescriptionError) {
            this.setState({valueDescriptionError});
            return false;
        }

        return true;
    }

    //Validate Eligibility
    validateEligibility = () => {
        let eligibilityContentError = "";

        if (!this.state.eligibilityContent) {
            eligibilityContentError = "Please enter a valid description.";
        }

        if (eligibilityContentError) {
            this.setState({eligibilityContentError});
            return false;
        }

        return true;
    }

    //Validate Repayment
    validateRepayment = () => {
        let repaymentDescriptionError = "";

        if (!this.state.repaymentDescription) {
            repaymentDescriptionError = "Please enter a valid description.";
        }

        if (repaymentDescriptionError) {
            this.setState({repaymentDescriptionError});
            return false;
        }

        return true;
    }

    //Validate How to Apply
    validateApply = () => {
        let applyDescriptionError = "";
        let applyStepsError = "";

        if (!this.state.applyDescription) {
            applyDescriptionError = "Please enter a valid description.";
        }

        if (!this.state.applySteps) {
            applyStepsError = "Please enter the valid steps.";
        }

        if (applyDescriptionError || applyStepsError) {
            this.setState({applyDescriptionError, applyStepsError});
            return false;
        }

        return true;
    }

    //Validate How to Apply
    validateApplyContent = () => {
        let applyApplicationPeriodError = "";
        let applyClosingDateError = "";
        let applyNotificationPeriodError = "";
        let applyProcessingPeriodError = "";

        if (!this.state.applyApplicationPeriod) {
            applyApplicationPeriodError = "Please enter a valid application period. E.g. Quarter 1 - Jan to Mar";
        }

        if (!this.state.applyClosingDate) {
            applyClosingDateError = "Please enter the valid closing date. E.g. 31 March";
        }

        if (!this.state.applyNotificationPeriod) {
            applyNotificationPeriodError = "Please select a valid notification period.";
        }

        if (!this.state.applyProcessingPeriod) {
            applyProcessingPeriodError = "Please enter a valid process period.";
        }

        if (applyApplicationPeriodError || applyClosingDateError || applyNotificationPeriodError || applyProcessingPeriodError) {
            this.setState({applyApplicationPeriodError, applyClosingDateError, applyNotificationPeriodError, applyProcessingPeriodError});
            return false;
        }

        return true;
    }

    //Validate Required Supporting Documents
    validateSupport = () => {
        let supportDocsSimPdpaPolicyError = "";

        if (!this.state.supportDocsSimPdpaPolicy) {
            supportDocsSimPdpaPolicyError = "Please enter a valid link.";
        }

        if (supportDocsSimPdpaPolicyError) {
            this.setState({supportDocsSimPdpaPolicyError});
            return false;
        }

        return true;
    }

    //Validate Required Supporting Documents
    validateSupportContent = () => {
        let supportDescriptionError = "";
        let supportTitleError = "";

        if (!this.state.description) {
            supportDescriptionError = "Please enter a valid description. Do enter a line break for next link and include '- ' at the start of the sentence.";
        }

        if (!this.state.title) {
            supportTitleError = "Please select a valid title.";
        }

        if (supportDescriptionError || supportTitleError) {
            this.setState({supportDescriptionError, supportTitleError});
            return false;
        }

        return true;
    }

    //Validate Things to Note
    validateNote = () => {
        let noteContentError = "";

        if (!this.state.noteContent) {
            noteContentError = "Please enter a valid description.";
        }

        if (noteContentError) {
            this.setState({noteContentError});
            return false;
        }

        return true;
    }

    //Validate Contact Information
    validateContactInfo = () => {
        let contactInfoEmailError = "";

        if (!this.state.contactInfoEmail.includes('@')) {
            contactInfoEmailError = "Please enter a valid email.";
        }

        if (contactInfoEmailError) {
            this.setState({contactInfoEmailError});
            return false;
        }

        return true;
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
                                                                                            <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleApplyContentEditModal(applyContent)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                            <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleSupportingDocsEditModal(requiredDocs)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            {this.state.requiredSupportingDocsContent && this.state.requiredSupportingDocsContent.map((content) => {
                                                                                return (
                                                                                    <tbody id="Bursary-tableBody">
                                                                                        <tr>
                                                                                            <td><b>{content.title}</b></td>
                                                                                            <td>
                                                                                                <ul>
                                                                                                    {content.description.map((desc) => {
                                                                                                        return(
                                                                                                            <li className="text-left">{desc}</li>
                                                                                                        )
                                                                                                    })}
                                                                                                </ul>
                                                                                            </td>
                                                                                            <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleSupportingDocsContentEditModal(content)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                        <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleThingsToNoteEditModal(note)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                        <td><Button size="sm" id="Bursary-editBtn" onClick={() => this.handleContactInfoEditModal(contactInfo)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                <div className="errorMessage">{this.state.valueDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.valueId)}>Save Changes</Button>
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
                                                <div className="errorMessage">{this.state.eligibilityContentError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.eligibilityId)}>Save Changes</Button>
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
                                                <div className="errorMessage">{this.state.repaymentDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.repaymentId)}>Save Changes</Button>
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
                                                <div className="errorMessage">{this.state.applyDescriptionError}</div>
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
                                                <div className="errorMessage">{this.state.applyStepsError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.applyId)}>Save Changes</Button>
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

                {/* How to Apply Content Edit Modal */}
                {this.state.howToApplyContentEditModal == true ? 
                    <Modal show={this.state.howToApplyContentEditModal} onHide={this.handleApplyContentEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit How to Apply</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="2" type="text" name="applyApplicationPeriod" placeholder="How to Apply's Application Period" required defaultValue={this.state.applyApplicationPeriod} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.applyApplicationPeriodError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faCalendarCheck}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="2" type="text" name="applyClosingDate" placeholder="How to Apply's Closing Date" required defaultValue={this.state.applyClosingDate} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.applyClosingDateError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faBell}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-inputFields" as="select" name="applyNotificationPeriod" required defaultValue={this.state.applyNotificationPeriod} onChange={this.updateInput} noValidate>
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
                                                <div className="errorMessage">{this.state.applyNotificationPeriodError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faHourglassHalf}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="2" type="text" name="applyProcessingPeriod" placeholder="How to Apply's Processing Period" required defaultValue={this.state.applyProcessingPeriod} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.applyProcessingPeriodError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary("howToApplyContent")}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleApplyContentEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Required Supporting Documents Edit Modal */}
                {this.state.supportingDocsEditModal == true ? 
                    <Modal show={this.state.supportingDocsEditModal} onHide={this.handleSupportingDocsEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Required Supporting Documents</Modal.Title>
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
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="2" type="text" name="supportDocsSimPdpaPolicy" placeholder="Required Supporting Documents' SIM PDPA Policy" required defaultValue={this.state.supportDocsSimPdpaPolicy} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.supportDocsSimPdpaPolicyError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.supportDocsId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleSupportingDocsEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Required Supporting Documents Content Edit Modal */}
                {this.state.supportingDocsContentEditModal == true ? 
                    <Modal show={this.state.supportingDocsContentEditModal} onHide={this.handleSupportingDocsContentEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Required Supporting Documents</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faHeading}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-inputFields" as="select" name="title" placeholder="Required Supporting Documents' Title" required defaultValue={this.state.title} onChange={this.updateInput} noValidate>
                                                    <option value="">Select a Title</option>
                                                    <option value="Household Income-related Documents">Household Income-related Documents</option>
                                                    <option value="Results / Official Transcript">Results / Official Transcript</option>
                                                    <option value="NRIC">NRIC</option>
                                                    <option value="Expenses-related Documents">Expenses-related Documents</option>
                                                    <option value="Personal-related Documents (If applicable)">Personal-related Documents (If applicable)</option>
                                                </Form.Control>
                                                <div className="errorMessage">{this.state.supportTitleError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="6" type="text" name="description" placeholder="Required Supporting Documents' Description" required defaultValue={this.state.description} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.supportDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary("requiredSupportingDocuments")}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleSupportingDocsContentEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Things to Note Edit Modal */}
                {this.state.thingsToNoteEditModal == true ? 
                    <Modal show={this.state.thingsToNoteEditModal} onHide={this.handleThingsToNoteEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Things to Note</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faStickyNote}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="3" type="text" name="noteContent" placeholder="Things to Note's Content" required defaultValue={this.state.noteContent} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.noteContentError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.noteId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleThingsToNoteEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Contact Information Edit Modal */}
                {this.state.contactInfoEditModal == true ? 
                    <Modal show={this.state.contactInfoEditModal} onHide={this.handleContactInfoEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Bursary-modalTitle" className="w-100">Edit Contact Information</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Bursary-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Bursary-textAreas" as="textarea" rows="2" type="text" name="contactInfoEmail" placeholder="Contact Information's Email" required defaultValue={this.state.contactInfoEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.contactInfoEmailError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Bursary-editFooter">
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-saveBtn" type="submit" onClick={() => this.updateBursary(this.state.contactInfoId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Bursary-editCol">
                                            <Button id="Bursary-cancelBtn" onClick={this.handleContactInfoEditModal}>Cancel</Button>
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