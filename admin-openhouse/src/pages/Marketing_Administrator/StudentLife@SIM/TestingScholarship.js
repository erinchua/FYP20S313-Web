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
                                            <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Accordion.Toggle as={Card.Header} eventKey="0">Click me!</Accordion.Toggle>
                                                    <Accordion.Collapse eventKey="0">
                                                        <Card.Body>Hello! I'm the body</Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card>
                                                    <Accordion.Toggle as={Card.Header} eventKey="1">Click me!</Accordion.Toggle>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body>Hello! I'm another body</Card.Body>
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
 