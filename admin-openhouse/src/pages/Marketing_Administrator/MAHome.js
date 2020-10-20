import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import Chart from 'react-google-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faMobileAlt, faSchool, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const data = [
    ["Label", "Total Number of Participants", { role: "style" }],
    ["Total number of registered prospective students for the open house mobile application", 400, "color: #deecfc"],
    ["Total number of prospective student actual turn-ups for open house programme talks", 350, "color: #b9ceeb"],
    ["Total number of registrations for open house programme talks (through mobile application)", 380, "color: #87a8d0"],
];

class MAHome extends Component {

    render() {
        return (
            <div>
                <Container fluid className="MAHome-container">
                    <NavBar isMA={true} />

                        <Container fluid className="MAHome-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row style={{ marginRight: 0 }}>
                                <Col md={2}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} id="MAHome-topContentContainer">
                                    <Container fluid  id="MAHome-topContentContainer">
                                        <Row id="MAHome-firstRow"></Row>
                                        <Row id="MAHome-secondRow">
                                            <Col md={10} id="MAHome-secondRowCol1">
                                                <p>Real-Time Numbers</p>
                                            </Col>
                                            <Col md={2} id="MAHome-secondRowCol2">
                                                <Button size="sm" id="MAHome-refreshBtn"><FontAwesomeIcon size="lg" icon={faSyncAlt}/></Button>
                                            </Col>
                                        </Row>

                                        <Row id="MAHome-thirdRow">
                                            <Col md={3} style={{backgroundColor: '#deecfc'}}>
                                                <Row className="MAHome-thirdInnerRow">
                                                    <Col md={6} className="MAHome-thirdInnerCol1">
                                                        <FontAwesomeIcon size="3x" icon={faMobileAlt}/>
                                                    </Col>
                                                    <Col md={6} className="MAHome-thirdInnerCol2">
                                                        <h3>400</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={3} style={{backgroundColor: '#b9ceeb'}}>
                                                <Row className="MAHome-thirdInnerRow">
                                                    <Col md={6} className="MAHome-thirdInnerCol1">
                                                        <FontAwesomeIcon size="3x" icon={faSchool}/>
                                                    </Col>
                                                    <Col md={6} className="MAHome-thirdInnerCol2">
                                                        <h3>350</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={3} style={{backgroundColor: '#87a8d0'}}>
                                                <Row className="MAHome-thirdInnerRow">
                                                    <Col md={6} className="MAHome-thirdInnerCol1">
                                                        <FontAwesomeIcon size="3x" icon={faChalkboardTeacher}/>
                                                    </Col>
                                                    <Col md={6} className="MAHome-thirdInnerCol2">
                                                        <h3>380</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row id="MAHome-fourthRow">
                                            <Col md={12}>
                                                <Chart id="MAHome-fourthChart" height="100%" chartType="BarChart" data={data} options={{legend: "none", vAxis: {textStyle: {fontSize: 9}}}}/>
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

export default MAHome;