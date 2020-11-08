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
import { faEdit, faEnvelopeOpen, faFileAlt, faLocationArrow, faPhone } from '@fortawesome/free-solid-svg-icons';
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
            requiredSupportingDocs: "",
            thingsToNote: "",
            contactInformation: "",
            //Below states are for the modals
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

                    
                }

            });
        });
    }

  /*editStudentCare(e, studentcareid, type) {
    if (type === "workPlayLiveWell") {
      document
        .getElementById(studentcareid + "spanactivitiesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "studentWellnessCentre") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelllogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "counsellingService") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounseldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounsellogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simPeerSupport") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerlogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simWellnessAdvocates") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocatesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocateslogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
  }*/

    handleFileUpload = (files) => {
        this.setState({
            files: files,
        });
    };

    handleSave = (mapImage) => {
        const parentthis = this;

        if (this.state.files !== undefined) {
            const foldername = "Bursary";
            const file = this.state.files[0];
            const storageRef = storage.ref(foldername);
            const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log("File available at", downloadURL);

                    const userRef = db.collection("Bursary").doc("simGlobalEducationBursary")
                    .update({
                        faqFile: downloadURL,
                    })
                    .then(function () {
                        alert("Updated");
                        window.location.reload();
                    });
                });
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                if (progress != "100") {
                    parentthis.setState({ progress: progress });
                } else {
                    parentthis.setState({ progress: "Uploaded!" });
                }
            });
            console.log();
        } else {
            alert("No Files Selected");
        }
    };

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
                                                                                <th id="Bursary-titleHeading">Title</th>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="Bursary-tableBody">
                                                                            <tr>
                                                                                <td></td>
                                                                                <td className="text-left"></td>
                                                                                <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        </tbody>
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
                                                                                <th id="Bursary-titleHeading">Title</th>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="Bursary-tableBody">
                                                                            <tr>
                                                                                <td></td>
                                                                                <td className="text-left"></td>
                                                                                <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        </tbody>
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
                                                                                <th id="Bursary-titleHeading">Title</th>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="Bursary-tableBody">
                                                                            <tr>
                                                                                <td></td>
                                                                                <td className="text-left"></td>
                                                                                <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        </tbody>
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
                                                                <Col md={12} className="text-center Bursary-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Bursary-tableCon">
                                                                        <thead id="Bursary-tableHeader">
                                                                            <tr>
                                                                                <th id="Bursary-titleHeading">Title</th>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="Bursary-tableBody">
                                                                            <tr>
                                                                                <td></td>
                                                                                <td className="text-left"></td>
                                                                                <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </Table>
                                                                </Col>
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
                                                                                    <th id="Bursary-titleHeading">Title</th>
                                                                                    <th>Description</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody id="Bursary-tableBody">
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td className="text-left"></td>
                                                                                    <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
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
                                                                                    <th id="Bursary-titleHeading">Title</th>
                                                                                    <th>Description</th>
                                                                                    <th id="Bursary-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody id="Bursary-tableBody">
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td className="text-left"></td>
                                                                                    <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
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
                                                                                <th id="Bursary-titleHeading">Title</th>
                                                                                <th>Description</th>
                                                                                <th id="Bursary-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="Bursary-tableBody">
                                                                            <tr>
                                                                                <td></td>
                                                                                <td className="text-left"></td>
                                                                                <td><Button size="sm" id="Bursary-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        </tbody>
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

            </div>
        );
    }
}
export default SIMGEBursary;