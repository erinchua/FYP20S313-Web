import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/OtherFinancialAssistance.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEnvelopeOpen, faFileAlt, faLocationArrow, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons';

class OtherFinancialAssistance extends Component {
    constructor() {
        super();
        this.state = {
            //AMP Education Busary
            ampId: "",
            ampEmail: "",
            ampWebsite: "",
            ampDescription: "",
            //MTFA Bursary
            mtfaId: "",
            mtfaEmail: "",
            mtfaAddress: "",
            mtfaWebsite: "",
            mtfaDescription: "",
            //Lembaga Biasiswa Kenanga Maulud
            lembagaId: "",
            lembagaEmail: "",
            lembagaWebsite: "",
            lembagaDescription: "",
            //Sivades-HEB Education Fund
            sivadasId: "",
            sivadasEmail: "",
            sivadasWebsite: "",
            sivadasDescription: "",
            //Others
            previousContact: "",
            //Below states are for the functions
            ampEducation: "",
            ampEduContact: "",
            mtfaBursary: "",
            mtfaBursaryContact: "",
            lembaga: "",
            lembagaContact: "",
            sivadasHeb: "",
            sivadasHebContact: "",
            //Below states are for the edit modals
            ampEditModal: false,
            mtfaEditModal: false,
            lembagaEditModal: false,
            sivadasEditModal: false,
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
        console.log([e.target.name], e.target.value);
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
        db.collection("Bursary").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {

                //AMP Education Bursary
                if (doc.id === "bursary-08") {
                    const ampEducation = [];
                    const ampContact = [];

                    const data = {
                        ampId: doc.id,
                        ampEmail: doc.data().email,
                        ampWebsite: doc.data().website,
                        ampDescription: doc.data().description,
                    }
                    ampEducation.push(data);

                    for (var i = 0; i < doc.data().contact.length; i++) {
                        ampContact.push(doc.data().contact[i]);
                    }

                    this.setState({
                        ampEducation: ampEducation,
                        ampEduContact: ampContact.join(', '),
                    });
                }

                //MTFA Bursary
                if (doc.id === "bursary-09") {
                    const mtfaBursary = [];
                    const mtfaContact = [];

                    const data = {
                        mtfaId: doc.id,
                        mtfaEmail: doc.data().email,
                        mtfaWebsite: doc.data().website,
                        mtfaAddress: doc.data().address,
                        mtfaDescription: doc.data().description,
                    }
                    mtfaBursary.push(data);

                    for (var i = 0; i < doc.data().contact.length; i++) {
                        mtfaContact.push(doc.data().contact[i]);
                    }
                    
                    this.setState({
                        mtfaBursary: mtfaBursary,
                        mtfaBursaryContact: mtfaContact.join(', '),
                    });

                }

                //Lembaga Biasiswa Kenanga Maulud
                if (doc.id === "bursary-10") {
                    const lembaga = [];
                    const lembagaContact = [];

                    const data = {
                        lembagaId: doc.id,
                        lembagaEmail: doc.data().email,
                        lembagaWebsite: doc.data().website,
                        lembagaDescription: doc.data().description,
                    }
                    lembaga.push(data);

                    for (var i = 0; i < doc.data().contact.length; i++) {
                        lembagaContact.push(doc.data().contact[i]);
                    }

                    this.setState({
                        lembaga: lembaga,
                        lembagaContact: lembagaContact.join(', '),
                    });
                }

                //Sivadas-HEB Education Fund
                if (doc.id === "bursary-11") {
                    const sivadasHeb = [];
                    const sivadasContact = [];

                    const data = {
                        sivadasId: doc.id,
                        sivadasEmail: doc.data().email,
                        sivadasWebsite: doc.data().website,
                        sivadasDescription: doc.data().description,
                    }
                    sivadasHeb.push(data);

                    for (var i = 0; i < doc.data().contact.length; i++) {
                        sivadasContact.push(doc.data().contact[i]);
                    }

                    this.setState({
                        sivadasHeb: sivadasHeb,
                        sivadasHebContact: sivadasContact.join(', '),
                    });
                }

            })
        });
    }

    updateFinancialAssistance = (id) => {
        //AMP Education Bursary
        if (id === this.state.ampId) {
            if (this.state.previousContact === this.state.ampEduContact) {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.ampEmail,
                    website: this.state.ampWebsite,
                    description: this.state.ampDescription,
                })
                .then(() => {
                    console.log("Updated AMP Education Bursary!");
                    this.setState({
                        ampEditModal: false,
                    });
                    this.display();
                });
            } else {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.ampEmail,
                    website: this.state.ampWebsite,
                    description: this.state.ampDescription,
                    contact: firebase.firestore.FieldValue.arrayRemove(this.state.previousContact)
                })
                .then(() => {
                    db.collection("Bursary").doc(id)
                    .update({
                        contact: firebase.firestore.FieldValue.arrayUnion(this.state.ampEduContact)
                    }).then(() => {
                        console.log("Updated AMP Education Bursary!");
                        this.setState({
                            ampEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

        //MTFA Bursary - TBC
        if (id === this.state.mtfaId) {
            console.log("mtfa")
            var splitContact = this.state.mtfaBursaryContact.split(', ')
            console.log(splitContact);
            var splitPreviousContact = this.state.previousContact.split(', ');
            console.log(splitPreviousContact);

            for (var i = 0; i < splitPreviousContact.length; i++) {
                if (splitPreviousContact[i] !== splitContact[i]) {
                    this.setState({
                        previousContact: splitPreviousContact[i],
                        mtfaBursaryContact: splitContact[i],
                    });
                }
            }

            if (this.state.previousContact === this.state.mtfaBursaryContact) {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.mtfaEmail,
                    website: this.state.mtfaWebsite,
                    address: this.state.mtfaAddress,
                    description: this.state.mtfaDescription,
                })
                .then(() => {
                    console.log("Updated MTFA!");
                    this.setState({
                        mtfaEditModal: false,
                    });
                    this.display();
                });
            } else {
                console.log(this.state.previousContact)
                console.log(this.state.mtfaBursaryContact)
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.mtfaEmail,
                    website: this.state.mtfaWebsite,
                    address: this.state.mtfaAddress,
                    description: this.state.mtfaDescription,
                    contact: firebase.firestore.FieldValue.arrayRemove(this.state.previousContact)
                })
                .then(() => {
                    db.collection("Bursary").doc(id)
                    .update({
                        contact: firebase.firestore.FieldValue.arrayUnion(this.state.mtfaBursaryContact)
                    }).then(() => {
                        console.log("Updated MTFA!");
                        this.setState({
                            mtfaEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

        //LBKM
        if (id === this.state.lembagaId) {
            if (this.state.previousContact === this.state.lembagaContact) {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.lembagaEmail,
                    website: this.state.lembagaWebsite,
                    description: this.state.lembagaDescription,
                })
                .then(() => {
                    console.log("Updated LBKM!");
                    this.setState({
                        lembagaEditModal: false,
                    });
                    this.display();
                });
            } else {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.lembagaEmail,
                    website: this.state.lembagaWebsite,
                    description: this.state.lembagaDescription,
                    contact: firebase.firestore.FieldValue.arrayRemove(this.state.previousContact)
                })
                .then(() => {
                    db.collection("Bursary").doc(id)
                    .update({
                        contact: firebase.firestore.FieldValue.arrayUnion(this.state.lembagaContact)
                    }).then(() => {
                        console.log("Updated LBKM!");
                        this.setState({
                            lembagaEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

        //Sivades-HEB
        if (id === this.state.sivadasId) {
            if (this.state.previousContact === this.state.sivadasHebContact) {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.sivadasEmail,
                    website: this.state.sivadasWebsite,
                    description: this.state.sivadasDescription,
                })
                .then(() => {
                    console.log("Updated Sivadas!");
                    this.setState({
                        sivadasEditModal: false,
                    });
                    this.display();
                });
            } else {
                db.collection("Bursary").doc(id)
                .update({
                    email: this.state.sivadasEmail,
                    website: this.state.sivadasWebsite,
                    description: this.state.sivadasDescription,
                    contact: firebase.firestore.FieldValue.arrayRemove(this.state.previousContact)
                })
                .then(() => {
                    db.collection("Bursary").doc(id)
                    .update({
                        contact: firebase.firestore.FieldValue.arrayUnion(this.state.sivadasHebContact)
                    }).then(() => {
                        console.log("Updated Sivadas!");
                        this.setState({
                            sivadasEditModal: false,
                        });
                        this.display();
                    });
                });
            }
        }

    }

    //Edit AMP Education Bursary
    handleAmpEditModal = (amp) => {
        if (this.state.ampEditModal == false) {
            this.setState({
                ampEditModal: true,
                ampId: amp.ampId,
                ampEmail: amp.ampEmail,
                ampWebsite: amp.ampWebsite,
                ampDescription: amp.ampDescription,
                previousContact: this.state.ampEduContact,
            });
        }
        else {
            this.setState({
                ampEditModal: false
            });
        }
    }

    //Edit MTFA Bursary
    handleMtfaEditModal = (mtfa) => {
        if (this.state.mtfaEditModal == false) {
            this.setState({
                mtfaEditModal: true,
                mtfaId: mtfa.mtfaId,
                mtfaEmail: mtfa.mtfaEmail,
                mtfaWebsite: mtfa.mtfaWebsite,
                mtfaAddress: mtfa.mtfaAddress,
                mtfaDescription: mtfa.mtfaDescription,
                previousContact: this.state.mtfaBursaryContact,
            });
        }
        else {
            this.setState({
                mtfaEditModal: false
            });
        }
    }

    //Edit Lembaga Biasiswa Kenanga Maulud
    handleLembagaEditModal = (lembaga) => {
        if (this.state.lembagaEditModal == false) {
            this.setState({
                lembagaEditModal: true,
                lembagaId: lembaga.lembagaId,
                lembagaEmail: lembaga.lembagaEmail,
                lembagaWebsite: lembaga.lembagaWebsite,
                lembagaDescription: lembaga.lembagaDescription,
                previousContact: this.state.lembagaContact,
            });
        }
        else {
            this.setState({
                lembagaEditModal: false
            });
        }
    }

    //Edit Sivadas-HEB Education Fund
    handleSivadasEditModal = (sivadas) => {
        if (this.state.sivadasEditModal == false) {
            this.setState({
                sivadasEditModal: true,
                sivadasId: sivadas.sivadasId,
                sivadasEmail: sivadas.sivadasEmail,
                sivadasWebsite: sivadas.sivadasWebsite,
                sivadasDescription: sivadas.sivadasDescription,
                previousContact: this.state.sivadasHebContact,
            });
        }
        else {
            this.setState({
                sivadasEditModal: false
            });
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="OFA-container">
                    <NavBar isMA={true} />

                        <Container fluid className="OFA-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="OFA-topContentContainer">
                                        <Row id="OFA-firstRow">
                                            <Col md={12} className="text-left" id="OFA-firstRowCol">
                                                <h4 id="OFA-title">Other Financial Assistance</h4>
                                            </Col>
                                        </Row>

                                        <Row id="OFA-secondRow">
                                            <Col md={12} id="OFA-secondRowCol">
                                                <Tab.Container defaultActiveKey="ampEducationBursary">
                                                    <Row className="OFA-secondInnerRow">
                                                        <Col md={12} className="OFA-secondInnerCol">
                                                            <Nav defaultActiveKey="workPlayLive" className="OFA-nav" variant="tabs">
                                                                <Col md={3} className="text-center OFA-navItemCon">
                                                                    <Nav.Item className="OFA-navItems">
                                                                        <Nav.Link eventKey="ampEducationBursary" className="OFA-navLinks">AMP Education<br/> Bursary</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center OFA-navItemCon">
                                                                    <Nav.Item className="OFA-navItems">
                                                                        <Nav.Link eventKey="mtfaBursary" className="OFA-navLinks">MTFA<br/> Bursary</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center OFA-navItemCon">
                                                                    <Nav.Item className="OFA-navItems">
                                                                        <Nav.Link eventKey="lembaga" className="OFA-navLinks">Lembaga Biasiswa Kenanga Maulud</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center OFA-navItemCon">
                                                                    <Nav.Item className="OFA-navItems">
                                                                        <Nav.Link eventKey="sivadasHeb" className="OFA-navLinks">Sivadas-HEB<br/> Education Fund</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>
                                                    
                                                    <Row className="OFA-secondInnerRow">
                                                        <Col md={12} className="OFA-secondInnerCol">
                                                            <Tab.Content>
                                                                
                                                                {/* AMP Education Bursary */}
                                                                <Tab.Pane eventKey="ampEducationBursary">
                                                                    <Col md={12} className="text-center OFA-tableColCon">
                                                                        <Table responsive="sm" bordered className="OFA-tableCon">
                                                                            <thead id="OFA-tableHeader">
                                                                                <tr>
                                                                                    <th id="OFA-emailHeading">Email</th>
                                                                                    <th id="OFA-contactHeading">Contact</th>
                                                                                    <th>Website</th>
                                                                                    <th>Description</th>
                                                                                    <th id="OFA-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.ampEducation && this.state.ampEducation.map((amp) => {
                                                                                return (
                                                                                    <tbody id="OFA-tableBody" key={amp.ampId}>
                                                                                        <tr>
                                                                                            <td>{amp.ampEmail}</td>
                                                                                            {this.state.ampEduContact ?
                                                                                                <td key={amp.ampId}>{this.state.ampEduContact}</td>: ''
                                                                                            }
                                                                                            <td className="text-left">{amp.ampWebsite}</td>
                                                                                            <td className="text-left">{amp.ampDescription}</td>
                                                                                            <td><Button size="sm" id="OFA-editBtn" onClick={() => this.handleAmpEditModal(amp)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* MTFA Bursary */}
                                                                <Tab.Pane eventKey="mtfaBursary">
                                                                    <Col md={12} className="text-center OFA-tableColCon">
                                                                        <Table responsive="sm" bordered className="OFA-tableCon">
                                                                            <thead id="OFA-tableHeader">
                                                                                <tr>
                                                                                    <th id="OFA-emailHeading">Email</th>
                                                                                    <th id="OFA-contactHeading">Contact</th>
                                                                                    <th id="OFA-heading">Address</th>
                                                                                    <th id="OFA-heading">Website</th>
                                                                                    <th id="OFA-heading">Description</th>
                                                                                    <th id="OFA-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.mtfaBursary && this.state.mtfaBursary.map((mtfa) => {
                                                                                return (
                                                                                    <tbody id="OFA-tableBody" key={mtfa.mtfaId}>
                                                                                        <tr>
                                                                                            <td>{mtfa.mtfaEmail}</td>
                                                                                            {this.state.mtfaBursaryContact ? 
                                                                                                <td>{this.state.mtfaBursaryContact}</td>: ''
                                                                                            }
                                                                                            <td className="text-left">{mtfa.mtfaAddress}</td>
                                                                                            <td className="text-left">{mtfa.mtfaWebsite}</td>
                                                                                            <td className="text-left">{mtfa.mtfaDescription}</td>
                                                                                            <td><Button size="sm" id="OFA-editBtn" onClick={() => this.handleMtfaEditModal(mtfa)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Lembaga Biasiswa Kenanga Maulud */}
                                                                <Tab.Pane eventKey="lembaga">
                                                                    <Col md={12} className="text-center OFA-tableColCon">
                                                                        <Table responsive="sm" bordered className="OFA-tableCon">
                                                                            <thead id="OFA-tableHeader">
                                                                                <tr>
                                                                                    <th id="OFA-emailHeading">Email</th>
                                                                                    <th id="OFA-contactHeading">Contact</th>
                                                                                    <th>Website</th>
                                                                                    <th>Description</th>
                                                                                    <th id="OFA-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.lembaga && this.state.lembaga.map((lembaga) => {
                                                                                return (
                                                                                    <tbody id="OFA-tableBody" key={lembaga.lembagaId}>
                                                                                        <tr>
                                                                                            <td>{lembaga.lembagaEmail}</td>
                                                                                            {this.state.lembagaContact ?
                                                                                                <td key={lembaga.lembagaId}>{this.state.lembagaContact}</td>: ''
                                                                                            }
                                                                                            <td className="text-left">{lembaga.lembagaWebsite}</td>
                                                                                            <td className="text-left">{lembaga.lembagaDescription}</td>
                                                                                            <td><Button size="sm" id="OFA-editBtn" onClick={() => this.handleLembagaEditModal(lembaga)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                                
                                                                {/* Sivadas-HEB Education Fund */}
                                                                <Tab.Pane eventKey="sivadasHeb">
                                                                    <Col md={12} className="text-center OFA-tableColCon">
                                                                        <Table responsive="sm" bordered className="OFA-tableCon">
                                                                            <thead id="OFA-tableHeader">
                                                                                <tr>
                                                                                    <th id="OFA-emailHeading">Email</th>
                                                                                    <th id="OFA-contactHeading">Contact</th>
                                                                                    <th>Website</th>
                                                                                    <th>Description</th>
                                                                                    <th id="OFA-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.sivadasHeb && this.state.sivadasHeb.map((sivadas) => {
                                                                                return (
                                                                                    <tbody id="OFA-tableBody" key={sivadas.sivadasId}>
                                                                                        <tr>
                                                                                            <td>{sivadas.sivadasEmail}</td>
                                                                                            {this.state.sivadasHebContact ? 
                                                                                                <td key={sivadas.sivadasId}>{this.state.sivadasHebContact}</td>: ''
                                                                                            }
                                                                                            <td>{sivadas.sivadasWebsite}</td>
                                                                                            <td>{sivadas.sivadasDescription}</td>
                                                                                            <td><Button size="sm" id="OFA-editBtn" onClick={() => this.handleSivadasEditModal(sivadas)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Col>
                                                    </Row>

                                                </Tab.Container>
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {/* AMP Education Bursary Edit Modal */}
                {this.state.ampEditModal == true ? 
                    <Modal show={this.state.ampEditModal} onHide={this.handleAmpEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="OFA-modalTitle" className="w-100">Edit AMP Education Bursary Details</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="ampEmail" placeholder="AMP Education Bursary's Email" required defaultValue={this.state.ampEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faPhone}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="ampEduContact" placeholder="AMP Education Bursary's Contact Number" required defaultValue={this.state.ampEduContact} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faInternetExplorer}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="2" type="text" name="ampWebsite" placeholder="AMP Education Bursary's Website" required defaultValue={this.state.ampWebsite} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="4" type="text" name="ampDescription" placeholder="Description of AMP Education Bursary" required defaultValue={this.state.ampDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="OFA-editFooter">
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-saveBtn" type="submit" onClick={() => this.updateFinancialAssistance(this.state.ampId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-cancelBtn" onClick={this.handleAmpEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* MTFA Bursary Edit Modal */}
                {this.state.mtfaEditModal == true ? 
                    <Modal show={this.state.mtfaEditModal} onHide={this.handleMtfaEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="OFA-modalTitle" className="w-100">Edit MTFA Bursary Details</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="mtfaEmail" placeholder="MTFA Bursary's Email" required defaultValue={this.state.mtfaEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faPhone}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="mtfaBursaryContact" placeholder="MTFA Bursary's Contact Number" required defaultValue={this.state.mtfaBursaryContact} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faLocationArrow}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="2" type="text" name="mtfaAddress" placeholder="MTFA Bursary's Address" required defaultValue={this.state.mtfaAddress} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faInternetExplorer}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="2" type="text" name="mtfaWebsite" placeholder="MTFA Bursary's Website" required defaultValue={this.state.mtfaWebsite} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="4" type="text" name="mtfaDescription" placeholder="Description of MTFA Bursary" required defaultValue={this.state.mtfaDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="OFA-editFooter">
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-saveBtn" type="submit" onClick={() => this.updateFinancialAssistance(this.state.mtfaId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-cancelBtn" onClick={this.handleMtfaEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Lembaga Biasiswa Kenanga Maulud Edit Modal */}
                {this.state.lembagaEditModal == true ? 
                    <Modal show={this.state.lembagaEditModal} onHide={this.handleLembagaEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="OFA-modalTitle" className="w-100">Edit Lembaga Biasiswa Kenanga Maulud Details</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="lembagaEmail" placeholder="Lembaga Biasiswa Kenanga Maulud's Email" required defaultValue={this.state.lembagaEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faPhone}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="lembagaContact" placeholder="Lembaga Biasiswa Kenanga Maulud's Contact Number" required defaultValue={this.state.lembagaContact} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faInternetExplorer}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="2" type="text" name="lembagaWebsite" placeholder="Lembaga Biasiswa Kenanga Maulud's Website" required defaultValue={this.state.lembagaWebsite} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="4" type="text" name="lembagaDescription" placeholder="Description of Lembaga Biasiswa Kenanga Maulud" required defaultValue={this.state.lembagaDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="OFA-editFooter">
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-saveBtn" type="submit" onClick={() => this.updateFinancialAssistance(this.state.lembagaId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-cancelBtn" onClick={this.handleLembagaEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Sivadas-HEB Education Fund Edit Modal */}
                {this.state.sivadasEditModal == true ? 
                    <Modal show={this.state.sivadasEditModal} onHide={this.handleSivadasEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="OFA-modalTitle" className="w-100">Edit Sivadas-HEB Education Fund Details</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faEnvelopeOpen}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="sivadasEmail" placeholder="Sivadas-HEB Education Fund's Email" required defaultValue={this.state.sivadasEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faPhone}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-inputFields" type="text" name="sivadasHebContact" placeholder="Sivadas-HEB Education Fund's Contact Number" required defaultValue={this.state.sivadasHebContact} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faInternetExplorer}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="2" type="text" name="sivadasWebsite" placeholder="Sivadas-HEB Education Fund's Website" required defaultValue={this.state.sivadasWebsite} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="OFA-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="OFA-textAreas" as="textarea" rows="4" type="text" name="sivadasDescription" placeholder="Description of Sivadas-HEB Education Fund" required defaultValue={this.state.sivadasDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="OFA-editFooter">
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-saveBtn" type="submit" onClick={() => this.updateFinancialAssistance(this.state.sivadasId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="OFA-editCol">
                                            <Button id="OFA-cancelBtn" onClick={this.handleSivadasEditModal}>Cancel</Button>
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
export default OtherFinancialAssistance;
