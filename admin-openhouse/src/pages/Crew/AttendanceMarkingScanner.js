import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Crew/AttendanceMarkingScanner.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCalendarDay, faEdit, faHourglassEnd, faHourglassStart, faKeyboard } from '@fortawesome/free-solid-svg-icons';

class AttendanceMarkingScanner extends Component {

    render() {
        return (
            <div>
                <Container fluid className="AttendanceMarking-container">
                    <NavBar isMA={false} />

                        <Container fluid className="AttendanceMarking-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                {/* //If admin is Marketing Admin
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col> */}

                                <Col md={12}>
                                    <Container fluid id="AttendanceMarking-topContentContainer">
                                        <Row id="AttendanceMarking-firstRow">
                                            <Col md={12} className="text-left" id="AttendanceMarking-firstRowCol">
                                                <h4 id="AttendanceMarking-title">Attendance Marking Scanner</h4>
                                            </Col>
                                        </Row>

                                        <Row id="AttendanceMarking-secondRow">
                                            <Col md={12} className="text-center" id="AttendanceMarking-secondRowCol">
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
export default AttendanceMarkingScanner;