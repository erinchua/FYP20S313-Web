import { Container, Row, Col, Table, Button, Modal, Accordion, Card, Nav, Tab } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Brochures.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import EditBrochuresModal from '../../../components/Marketing_Administrator/Brochures/EditBrochuresModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class StudySIMBrochure extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            brochureUrl: "",
            description: "",
            imageUrl: "",
            university: "",
            progress: "",
            //Below states are for the functions
            prospectusBrochures: "",
            programmeBrochures: "",
            //Below states are for the modals
            editModal: false,
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

    componentDidMount() {
        this.authListener();
    }

    display() {
        //Display Prospectus Brochures
        db.collection("Brochures").where("id", ">=", "prospect-").where("id", "<=", "prospect-" + "\uf8ff")
        .onSnapshot((snapshot) => {
            const prospectusBrochures = [];

            snapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    brochureUrl: doc.data().brochureUrl,
                    description: doc.data().description,
                    imageUrl: doc.data().imageUrl,
                    university: "",
                };
                prospectusBrochures.push(data);
            });
            this.setState({
                prospectusBrochures: prospectusBrochures,
            });
        });

        //Display University Brochures
        db.collection("Brochures").where("university", "!=", "")
        .onSnapshot((snapshot) => {
            const programmeBrochures = [];

            snapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    brochureUrl: doc.data().brochureUrl,
                    description: doc.data().description,
                    imageUrl: doc.data().imageUrl,
                    university: doc.data().university,
                };
                programmeBrochures.push(data);
            });
            this.setState({ 
                programmeBrochures: programmeBrochures,
            });
        });
    }

    handleEdit = (parameter) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                id: parameter.id,
                description: parameter.description,
                brochureUrl: parameter.brochureUrl,
                imageUrl: parameter.imageUrl,
                university: parameter.university,
            });
        } else {
            this.setState({
                editModal: false
            });
            this.display();
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="Brochures-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Brochures-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Brochures-topContentContainer">
                                        <Row id="Brochures-firstRow">
                                            <Col md={12} className="text-left" id="Brochures-firstRowCol">
                                                <h4 id="Brochures-title">Study@SIM Brochures</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Brochures-secondRow">
                                            <Col md={12} id="Brochures-secondRowCol">
                                                <Tab.Container defaultActiveKey="prospectus">
                                                    <Row className="Brochures-secondInnerRow">
                                                        <Col md={12} className="Brochures-secondInnerCol">
                                                            <Nav defaultActiveKey="prospectus" className="Brochures-nav" variant="tabs">
                                                                <Col md={6} className="text-center Brochures-navItemCon">
                                                                    <Nav.Item className="Brochures-navItems">
                                                                        <Nav.Link eventKey="prospectus" className="Brochures-navLinks">Prospectus</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={6} className="text-center Brochures-navItemCon">
                                                                    <Nav.Item className="Brochures-navItems">
                                                                        <Nav.Link eventKey="programmes" className="Brochures-navLinks">Programmes</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>
                                                    
                                                    <Row className="Brochures-secondInnerRow">
                                                        <Col md={12} className="Brochures-secondInnerCol">
                                                            <Tab.Content>
                                                                
                                                                {/* Prospectus */}
                                                                <Tab.Pane eventKey="prospectus">
                                                                    <Col md={12} className="text-center Brochures-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                            <thead id="Brochures-tableHeader">
                                                                                <tr>
                                                                                    <th id="Brochures-descHeading">Description</th>
                                                                                    <th id="Brochures-imageHeading">Image</th>
                                                                                    <th>Brochure</th>
                                                                                    <th id="Brochures-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.prospectusBrochures && this.state.prospectusBrochures.map((prospectus) => {
                                                                                return (
                                                                                    <tbody id="Brochures-tableBody" key={prospectus.id}>
                                                                                        <tr>
                                                                                            <td>{prospectus.description}</td>
                                                                                            <td>
                                                                                                <img src={prospectus.imageUrl} height="120px" width="90px"/>
                                                                                            </td>
                                                                                            <td className="text-left">{prospectus.brochureUrl}</td>
                                                                                            <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(prospectus)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Programmes */}
                                                                <Tab.Pane eventKey="programmes">
                                                                    <Col md={12} className="Brochures-tableColCon">
                                                                        <Accordion defaultActiveKey="birmingham">
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="birmingham">University of Birmingham</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="birmingham">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Birmingham") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="buffalo">University of Buffalo</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="buffalo">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Buffalo") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="laTrobe">La Trobe University</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="laTrobe">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "La Trobe University") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="rmit">RMIT University</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="rmit">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "RMIT University") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="sim">Singapore Institute of Management</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="sim">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Row id="Brochures-secondRow">
                                                                                            <Col md={12} className="text-center Brochures-tableColCon">
                                                                                                <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                    <thead id="Brochures-tableHeader">
                                                                                                        <tr>
                                                                                                            <th id="Brochures-descHeading">Description</th>
                                                                                                            <th id="Brochures-imageHeading">Image</th>
                                                                                                            <th>Brochure</th>
                                                                                                            <th id="Brochures-editHeading">Edit</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                    {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                        if (programme.university === "Singapore Institute of Management") {
                                                                                                            return (
                                                                                                                <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                    <tr>
                                                                                                                        <td>{programme.description}</td>
                                                                                                                        <td>
                                                                                                                            <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                        </td>
                                                                                                                        <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                        <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            )
                                                                                                        }
                                                                                                    })}
                                                                                                </Table>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="stirling">University of Stirling</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="stirling">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Stirling") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="sydney">University of Sydney</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="sydney">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Sydney") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="london">University of London</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="london">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of London") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="warwick">University of Warwick</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="warwick">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Warwick") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="wollongong">University of Wollongong</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="wollongong">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Wollongong") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="120px" width="90px"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(programme)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                        </Accordion>
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

                {/* Edit Modal */}
                <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                    <EditBrochuresModal handleEdit={this.handleEdit} id={this.state.id} description={this.state.description} imageUrl={this.state.imageUrl} brochureUrl={this.state.brochureUrl} university={this.state.university} />
                </Modal>

            </div>
        );
    }
}
export default StudySIMBrochure;