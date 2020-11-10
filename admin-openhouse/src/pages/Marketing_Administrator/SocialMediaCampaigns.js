import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Marketing_Administrator/SocialMediaCampaigns.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';

class SocialMediaCampaigns extends Component {

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

    render() {
        return (
            <div>
                <Container fluid className="SocialMedia-container">
                    <NavBar isMA={true} />

                    <Container fluid className="SocialMedia-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Row>
                            <Col md={2} style={{ paddingRight: 0 }}>
                                <SideNavBar />
                            </Col>

                            <Col md={10} style={{ paddingLeft: 0 }}>
                                <Container fluid id="SocialMedia-topContentContainer">
                                    <Row id="SocialMedia-firstRow">
                                        <Col md={12} className="text-left" id="SocialMedia-firstRowCol">
                                            <h4 id="SocialMedia-title">Social Media Campaigns</h4>
                                        </Col>
                                    </Row>

                                    <Row id="SocialMedia-secondRow">
                                        <Col md={12} id="SocialMedia-secondTextRowCol">
                                            <h6>Click on the button below to be connected to Facebook for posting SIM's campaigns to the students!</h6>
                                        </Col>
                                    </Row>

                                    <Row id="SocialMedia-secondRow">
                                        <Col md={12} id="SocialMedia-secondRowCol">
                                            <Button className="SocialMedia-fbBtn" href="https://www.facebook.com/FYP20S313-University-of-Wollongong-109981057544096/" target="_blank">Connect to Facebook</Button>
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
export default SocialMediaCampaigns;