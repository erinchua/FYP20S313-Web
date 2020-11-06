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
            //Scholarship01
            id: "",
            title: "",
            description: "",
            //Scholarship02
            content: "",
            //Scholarship03
            covers: "",
            //Scholarship04
            applicationPeriods: "",
            //Scholarship05
            email: "",
            emailFormat: "",
            simPdpaPolicy: "",
            examples: "",
            //Scholarship06
            //Scholarship07
            programmes: "",
            period: "",
            sevenApplicationPeriod: "",
            //Scholarship08
            //Below states are for the functions
            scholarshipOne: "",
            scholarshipTwo: "",
            scholarshipThree: "",
            scholarshipFour: "",
            scholarshipFive: "",
            scholarshipFiveContent: "",
            scholarshipFiveExamples: "",
            scholarshipSix: "",
            scholarshipSeven: "",
            scholarshipEight: "",
        }
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();
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

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    
    componentDidMount() {
        this.authListener();
    }

    display() {
        const db = fire.firestore();

        db.collection("Scholarship").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                
                if (doc.id === "scholarship-01") {
                    const scholarshipOne = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            id: doc.id,
                            title: doc.data().content[i].title,
                            description: doc.data().content[i].description,
                        }
                        scholarshipOne.push(data);

                    }
                    this.setState({scholarshipOne: scholarshipOne});
                }

                if (doc.id === "scholarship-02") {
                    const scholarshipTwo = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            id: doc.id,
                            content: doc.data().content[i],
                        }
                        scholarshipTwo.push(data);
                    }
                    this.setState({scholarshipTwo: scholarshipTwo});
                }

                if (doc.id === "scholarship-03") {
                    const scholarshipThree = [];

                    for (var i = 0; i < doc.data().covers.length; i++) {
                        const data = {
                            id: doc.id,
                            covers: doc.data().covers[i],
                        }
                        scholarshipThree.push(data);
                    }
                    this.setState({scholarshipThree: scholarshipThree});
                }

                if (doc.id === "scholarship-04") {
                    const scholarshipFour = [];

                    for (var i = 0; i < doc.data().applicationPeriods.length; i++) {
                        const data = {
                            id: doc.id,
                            applicationPeriods: doc.data().applicationPeriods[i],
                        }
                        scholarshipFour.push(data);
                    }
                    this.setState({scholarshipFour: scholarshipFour});
                }

                if (doc.id === "scholarship-05") {
                    const content = [];
                    const examples = [];
                    const others = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            content: doc.data().content[i],
                        }
                        content.push(data);
                    }

                    for (var i = 0; i < doc.data().examples.length; i++) {
                        const data = {
                            examples: doc.data().examples[i],
                        }
                        examples.push(data);
                    }

                    const otherData = {
                        id: doc.id,
                        email: doc.data().email,
                        emailFormat: doc.data().emailFormat,
                        simPdpaPolicy: doc.data().simPdpaPolicy,
                    }
                    others.push(otherData)

                    this.setState({
                        scholarshipFive: others,
                        scholarshipFiveContent: content,
                        scholarshipFiveExamples: examples,
                    });
                }

                if (doc.id === "scholarship-06") {
                    const scholarshipSix = [];

                    const data = {
                        id: doc.id,
                        description: doc.data().description,
                    }
                    scholarshipSix.push(data);
                    this.setState({scholarshipSix: scholarshipSix});
                }

                if (doc.id === "scholarship-07"){
                    const scholarshipSeven = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        for (var j = 0; j < doc.data().content[i].applicationPeriod.length; j++) {
                            const data = {
                                id: doc.id,
                                description: doc.data().content[i].applicationPeriod[j].description,
                                period: doc.data().content[i].applicationPeriod[j].period,
                                programmes: doc.data().content[i].programmes,
                            }
                            scholarshipSeven.push(data);
                        }
                    }
                    this.setState({scholarshipSeven: scholarshipSeven});
                }

                if (doc.id === "scholarship-08") {
                    const scholarshipEight = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            id: doc.id,
                            content: doc.data().content[i],
                        }
                        scholarshipEight.push(data);
                    }
                    this.setState({scholarshipEight: scholarshipEight});
                }
                

            });
        });
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th id="Scholarship-titleHeading">Title</th>
                                                                            <th>Description</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipOne && this.state.scholarshipOne.map((one) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={one.id}>
                                                                                <tr>
                                                                                    <td>{one.title}</td>
                                                                                    <td className="text-left">{one.description}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th>Description</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipTwo && this.state.scholarshipTwo.map((two) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={two.id}>
                                                                                <tr>
                                                                                    <td className="text-left">{two.content}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th>Covers</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipThree && this.state.scholarshipThree.map((three) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={three.id}>
                                                                                <tr>
                                                                                    <td className="text-left">{three.covers}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th>Application Periods</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipFour && this.state.scholarshipFour.map((four) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={four.id}>
                                                                                <tr>
                                                                                    <td className="text-left">{four.applicationPeriods}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                            <Row id="Scholarship-secondRow">
                                                                <Col md={12} className="text-center Scholarship-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                        <thead id="Scholarship-tableHeader">
                                                                            <tr>
                                                                                <th>Content</th>
                                                                                <th id="Scholarship-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.scholarshipFiveContent && this.state.scholarshipFiveContent.map((fiveContent) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{fiveContent.content}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Row>

                                                            <div id="border"></div>
                                                            <Row id="Scholarship-titleRow">
                                                                <Col md={12} className="text-left" id="Scholarship-titleRowCol">
                                                                    <h6 id="Scholarship-title">Examples</h6>
                                                                </Col>
                                                            </Row>

                                                            <Row id="Scholarship-secondRow">
                                                                <Col md={12} className="text-center Scholarship-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                        <thead id="Scholarship-tableHeader">
                                                                            <tr>
                                                                                <th>Examples</th>
                                                                                <th id="Scholarship-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.scholarshipFiveExamples && this.state.scholarshipFiveExamples.map((fiveExamples) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{fiveExamples.examples}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Row>

                                                            <div id="border"></div>
                                                            <Row id="Scholarship-titleRow">
                                                                <Col md={12} className="text-left" id="Scholarship-titleRowCol">
                                                                    <h6 id="Scholarship-title">Others</h6>
                                                                </Col>
                                                            </Row>

                                                            <Row id="Scholarship-secondRow">
                                                                <Col md={12} className="text-center Scholarship-tableColCon">
                                                                    <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                        <thead id="Scholarship-tableHeader">
                                                                            <tr>
                                                                                <th colSpan="2">Email/ PDPA Policy</th>
                                                                                <th id="Scholarship-editHeading">Edit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.state.scholarshipFive && this.state.scholarshipFive.map((fiveOthers) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody" key={fiveOthers.id}>
                                                                                    <tr>
                                                                                        <td id="Scholarship-titleHeading">Email</td>
                                                                                        <td className="text-left">{fiveOthers.email}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Email Format</td>
                                                                                        <td className="text-left">{fiveOthers.emailFormat}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td id="Scholarship-titleHeading">SIM PDPA Policy</td>
                                                                                        <td className="text-left">{fiveOthers.simPdpaPolicy}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
                                                                </Col>
                                                            </Row>
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th>Description</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipSix && this.state.scholarshipSix.map((six) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={six.id}>
                                                                                <tr>
                                                                                    <td className="text-left">{six.description}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th id="Scholarship-titleHeading">Period</th>
                                                                            <th>Description</th>
                                                                            <th id="Scholarship-titleHeading">Programmes</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipSeven && this.state.scholarshipSeven.map((seven) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={seven.id}>
                                                                                <tr>
                                                                                    <td><b>{seven.period}</b></td>
                                                                                    <td className="text-left">{seven.description}</td>
                                                                                    <td className="text-left">{seven.programmes}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
                                                                <Table responsive="sm" bordered hover className="Scholarship-tableCon">
                                                                    <thead id="Scholarship-tableHeader">
                                                                        <tr>
                                                                            <th>Content</th>
                                                                            <th id="Scholarship-editHeading">Edit</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.state.scholarshipEight && this.state.scholarshipEight.map((eight) => {
                                                                        return (
                                                                            <tbody id="Scholarship-tableBody" key={eight.id}>
                                                                                <tr>
                                                                                    <td className="text-left">{eight.content}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" ><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })}
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
 