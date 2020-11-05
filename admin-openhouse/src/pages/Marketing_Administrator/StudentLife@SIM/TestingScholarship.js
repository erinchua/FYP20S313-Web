import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Scholarship.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileImage, faFutbol, faBiking, faSpa, faUsers, faComments } from '@fortawesome/free-solid-svg-icons';

class Scholarship extends Component {

    constructor() {
        super();
        this.state = {
            
        }
    }

    render() {
        return (

            <div>
                <Container fluid className="Scholarship-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Scholarship-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Scholarship-topContentContainer">
                                        <Row id="Scholarship-firstRow">
                                            <Col md={12} className="text-left" id="Scholarship-firstRowCol">
                                                <h4 id="Scholarship-title">SIMGE Scholarship</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Scholarship-secondRow">
                                            <Col md={12} id="Scholarship-secondRowCol">
                                            <Accordion defaultActiveKey="categoriesOfScholarships">
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="categoriesOfScholarships">Categories of Scholarships</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="categoriesOfScholarships">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="eligibility">Eligibility</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="eligibility">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="valueOfScholarship">Value of Scholarship</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="valueOfScholarship">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="application">Application</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="application">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="applicationDocumentsProcedures">Application Documents & Procedures</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="applicationDocumentsProcedures">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="selectionProcess">Selection Process</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="selectionProcess">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="tenureOfScholarship">Tenure of Scholarship</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="tenureOfScholarship">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <div className="Scholarship-Header">
                                                        <Accordion.Toggle as={Card.Header} eventKey="termsAndConditions">Terms and Conditions</Accordion.Toggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey="termsAndConditions">
                                                        <Card.Body className="Scholarship-cardBody">
                                                            <Col md={12} className="text-center Scholarship-tableColCon">
                                                                <Table responsive="sm" bordered className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="Scholarship-tableBody">
                                                                        <tr>
                                                                            <td className="text-left"></td>
                                                                            <td></td>
                                                                            <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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

export default Scholarship;
 