import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import Chart from 'react-google-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faMobileAlt, faSchool, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

class MAHome extends Component {
    constructor() {
        super();
        // this.logout = this.logout.bind(this);
        this.state = {
            numbers: 223,
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
        db.collection("Students")
        .onSnapshot((snapshot) => {
            this.setState({ registeredstudents: snapshot.size });
        });

        db.collection("Attendance")
        .onSnapshot((snapshot) => {
            this.setState({ attendanceregistered: snapshot.size });
        });

        db.collection("ProgrammeTalks")
        .onSnapshot((snapshot) => {
            var counter = 0;
            snapshot.forEach((doc) => {
                counter = counter + doc.data().noRegistered;
            });
            this.setState({ programtalkregisterd: counter });
        });
    }

    render() {
        return (
            <div>
                <Container fluid className="MAHome-container">
                    <NavBar isMA={true} />

                        <Container fluid className="MAHome-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="MAHome-topContentContainer">
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
                                                        <h3>{this.state.registeredstudents}</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={3} style={{backgroundColor: '#b9ceeb'}}>
                                                <Row className="MAHome-thirdInnerRow">
                                                    <Col md={6} className="MAHome-thirdInnerCol1">
                                                        <FontAwesomeIcon size="3x" icon={faSchool}/>
                                                    </Col>
                                                    <Col md={6} className="MAHome-thirdInnerCol2">
                                                        <h3>{this.state.attendanceregistered}</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={3} style={{backgroundColor: '#87a8d0'}}>
                                                <Row className="MAHome-thirdInnerRow">
                                                    <Col md={6} className="MAHome-thirdInnerCol1">
                                                        <FontAwesomeIcon size="3x" icon={faChalkboardTeacher}/>
                                                    </Col>
                                                    <Col md={6} className="MAHome-thirdInnerCol2">
                                                        <h3>{this.state.programtalkregisterd}</h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row id="MAHome-fourthRow">
                                            <Col md={12}>
                                                <Chart id="MAHome-fourthChart" height="45vh" chartType="BarChart" data={[
                                                        ["Label", "Total Number of Participants", { role: "style" }],
                                                        ["Total number of registered prospective students for the open house mobile application", +this.state.registeredstudents, "color: #deecfc"],
                                                        ["Total number of prospective student actual turn-ups for open house programme talks", +this.state.attendanceregistered, "color: #b9ceeb"],
                                                        ["Total number of registrations for open house programme talks (through mobile application)", +this.state.programtalkregisterd, "color: #87a8d0"],
                                                    ]} options={{legend: "none", vAxis: {textStyle: {fontSize: 8.5}}}}
                                                />
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