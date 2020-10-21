import { Container, Row, Col, Table } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';

class ForumSettings extends Component {

    render() {
        return (
            <div>
                <Container fluid className="Forum-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Forum-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row style={{ marginRight: 0 }}>
                                <Col md={2}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} id="Forum-topContentContainer">
                                    <Container fluid id="Forum-topContentContainer">
                                        <Row id="Forum-firstRow">
                                            <Col md={12} id="Forum-firstRowCol">
                                                <p id="Forum-title">Forum - Settings</p>
                                            </Col>
                                        </Row>
                                        
                                        <Row id="Forum-secondRow">
                                            <Col md={12} className="text-center" id="Forum-secondRowCol">
                                                
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>

                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>
            </div>
        )
    }

}

export default ForumSettings;