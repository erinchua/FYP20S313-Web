import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

class MAHome extends Component {

    render() {
        return (
            <div>
                <Container fluid className="MAHome-container">
                    <NavBar isMA={true} />

                    <Container fluid className="MAHome-content">

                        <Container fluid className="MAHome-content">
                            <Row>

                                <Col md={2}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} id="MAHome-topContentContainer">
                                    <Row id="MAHome-firstRow"></Row>
                                    <Row>
                                        <Col md={10} id="MAHome-secondRowCol1">
                                            <p>Real-Time Numbers</p>
                                        </Col>
                                        <Col md={2} id="MAHome-secondRowCol2">
                                            <Button size="sm" id="MAHome-refreshBtn"><FontAwesomeIcon size="lg" icon={faSyncAlt}/></Button>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Container>

                    </Container>

                    <Footer />
                </Container>
            </div>
        )
    }

}

export default MAHome;