import { Container, Row, Col } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';

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

                                <Col md={10}>
                                    <p>Hello</p>
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