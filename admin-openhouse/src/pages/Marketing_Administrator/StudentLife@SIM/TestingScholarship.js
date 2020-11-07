import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Scholarship.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faCalendarAlt, faEdit, faFileAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

class Scholarship extends Component {

    constructor() {
        super();
        this.state = {
            //Scholarship01
            scholarshipOneId: "",
            scholarshipOneTitle: "",
            scholarshipOneDescription: "",
            //Scholarship02
            scholarshipTwoId: "",
            scholarshipTwoContent: "",
            //Scholarship03
            scholarshipThreeId: "",
            scholarshipThreeCovers: "",
            //Scholarship04
            scholarshipFourId: "",
            scholarshipFourApplicationPeriods: "",
            //Scholarship05
            scholarshipFiveId: "",
            scholarshipFiveContent: "",
            scholarshipFiveExamples: "",
            scholarshipFiveEmail: "",
            scholarshipFiveEmailFormat: "",
            scholarshipFiveSimPdpaPolicy: "",
            //Scholarship06
            scholarshipSixId: "",
            scholarshipSixDescription: "",
            //Scholarship07
            scholarshipSevenId: "",
            scholarshipSevenDescription: "",
            scholarshipSevenPeriod: "",
            scholarshipSevenProgrammes: "",
            //Scholarship08
            scholarshipEightId: "",
            scholarshipEightContent: "",
            //Below states are for the functions
            scholarshipOne: "",
            scholarshipTwo: "",
            scholarshipThree: "",
            scholarshipFour: "",
            scholarshipFiveOthers: "",
            scholarshipFiveContentArray: "",
            scholarshipFiveExamplesArray: "",
            scholarshipSix: "",
            scholarshipSeven: "",
            scholarshipEight: "",
            //Below states are for previous states
            previousData: "",
            previousContent: "",
            previousDescription: "",
            previousPeriod: "",
            previousProgrammes: "",
            previousTitle: "",
            previousExamples: "",
            //Below states are for the modals
            editOneModal: false,
            editTwoModal: false,
            editThreeModal: false,
            editFourModal: false,
            editFiveModal: false,
            editSixModal: false,
            editSevenModal: false,
            editEightModal: false,
        }
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
        db.collection("Scholarship").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                
                //Get Scholarship-01
                if (doc.id === "scholarship-01") {
                    const scholarshipOne = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            scholarshipOneId: doc.id,
                            scholarshipOneTitle: doc.data().content[i].title,
                            scholarshipOneDescription: doc.data().content[i].description,
                        }
                        scholarshipOne.push(data);

                    }
                    this.setState({scholarshipOne: scholarshipOne});
                }

                //Get Scholarship-02
                if (doc.id === "scholarship-02") {
                    const scholarshipTwo = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            scholarshipTwoId: doc.id,
                            scholarshipTwoContent: doc.data().content[i],
                        }
                        scholarshipTwo.push(data);
                    }
                    this.setState({scholarshipTwo: scholarshipTwo});
                }

                //Get Scholarship-03
                if (doc.id === "scholarship-03") {
                    const scholarshipThree = [];

                    for (var i = 0; i < doc.data().covers.length; i++) {
                        const data = {
                            scholarshipThreeId: doc.id,
                            scholarshipThreeCovers: doc.data().covers[i],
                        }
                        scholarshipThree.push(data);
                    }
                    this.setState({scholarshipThree: scholarshipThree});
                }

                //Get Scholarship-04
                if (doc.id === "scholarship-04") {
                    const scholarshipFour = [];

                    for (var i = 0; i < doc.data().applicationPeriods.length; i++) {
                        const data = {
                            scholarshipFourId: doc.id,
                            scholarshipFourApplicationPeriods: doc.data().applicationPeriods[i],
                        }
                        scholarshipFour.push(data);
                    }
                    this.setState({scholarshipFour: scholarshipFour});
                }

                //Get Scholarship-05
                if (doc.id === "scholarship-05") {
                    const content = [];
                    const examples = [];
                    const others = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            scholarshipFiveId: doc.id,
                            scholarshipFiveContent: doc.data().content[i],
                        }
                        content.push(data);
                    }

                    for (var i = 0; i < doc.data().examples.length; i++) {
                        const data = {
                            scholarshipFiveId: doc.id,
                            scholarshipFiveExamples: doc.data().examples[i],
                        }
                        examples.push(data);
                    }

                    const otherData = {
                        scholarshipFiveId: doc.id,
                        scholarshipFiveEmail: doc.data().email,
                        scholarshipFiveEmailFormat: doc.data().emailFormat,
                        scholarshipFiveSimPdpaPolicy: doc.data().simPdpaPolicy,
                    }
                    others.push(otherData)

                    this.setState({
                        scholarshipFiveOthers: others,
                        scholarshipFiveContentArray: content,
                        scholarshipFiveExamplesArray: examples,
                    });
                }

                //Get Scholarship-06
                if (doc.id === "scholarship-06") {
                    const scholarshipSix = [];

                    const data = {
                        scholarshipSixId: doc.id,
                        scholarshipSixDescription: doc.data().description,
                    }
                    scholarshipSix.push(data);
                    this.setState({scholarshipSix: scholarshipSix});
                }

                //Get Scholarship-07
                if (doc.id === "scholarship-07"){
                    const scholarshipSeven = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        for (var j = 0; j < doc.data().content[i].applicationPeriod.length; j++) {
                            const data = {
                                scholarshipSevenId: doc.id,
                                scholarshipSevenDescription: doc.data().content[i].applicationPeriod[j].description,
                                scholarshipSevenPeriod: doc.data().content[i].applicationPeriod[j].period,
                                scholarshipSevenProgrammes: doc.data().content[i].programmes,
                            }
                            scholarshipSeven.push(data);
                        }
                    }
                    this.setState({scholarshipSeven: scholarshipSeven});
                }

                //Get Scholarship-08
                if (doc.id === "scholarship-08") {
                    const scholarshipEight = [];

                    for (var i = 0; i < doc.data().content.length; i++) {
                        const data = {
                            scholarshipEightId: doc.id,
                            scholarshipEightContent: doc.data().content[i],
                        }
                        scholarshipEight.push(data);
                    }
                    this.setState({scholarshipEight: scholarshipEight});
                }
            });
        });
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log([e.target.name], e.target.value)
    };

    updateScholarships = (id) => {
        if (id == this.state.scholarshipOneId) {
            db.collection("Scholarship").doc(id)
            .update({
                content: firebase.firestore.FieldValue.arrayRemove({
                    title: this.state.previousTitle,
                    description: this.state.previousData
                })
            })
            .then(() => {
                console.log("Removed Scholarship-01");
                db.collection("Scholarship").doc(id)
                .update({
                    content: firebase.firestore.FieldValue.arrayUnion({
                        title: this.state.scholarshipOneTitle,
                        description: this.state.scholarshipOneDescription
                    })
                }).then(() => {
                    console.log("Updated Scholarship-01")
                    this.setState({
                        editOneModal: false,
                    });
                    this.display();
                });
                
            });
        }

        if (id == this.state.scholarshipTwoId) {
            db.collection("Scholarship").doc(id)
            .update({
                content: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
            })
            .then(() => {
                console.log("Removed Scholarship-02");
                db.collection("Scholarship").doc(id)
                .update({
                    content: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipTwoContent)
                }).then(() => {
                    console.log("Updated Scholarship-02")
                    this.setState({
                        editTwoModal: false,
                    });
                    this.display();
                });
                
            });
        }

        if (id == this.state.scholarshipThreeId) {
            db.collection("Scholarship").doc(id)
            .update({
                covers: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
            })
            .then(() => {
                console.log("Removed Scholarship-03");
                db.collection("Scholarship").doc(id)
                .update({
                    covers: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipThreeCovers)
                }).then(() => {
                    console.log("Updated Scholarship-03")
                    this.setState({
                        editThreeModal: false,
                    });
                    this.display();
                });
                
            });
        }

        if (id == this.state.scholarshipFourId) {
            db.collection("Scholarship").doc(id)
            .update({
                applicationPeriods: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
            })
            .then(() => {
                console.log("Removed Scholarship-04");
                db.collection("Scholarship").doc(id)
                .update({
                    applicationPeriods: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipFourApplicationPeriods)
                }).then(() => {
                    console.log("Updated Scholarship-04")
                    this.setState({
                        editFourModal: false,
                    });
                    this.display();
                });
                
            });
        }

        // if (id == this.state.scholarshipFiveId) {
        //     console.log(typeof this.state.scholarshipFiveId)
        //     db.collection("Scholarship").doc(this.state.scholarshipFiveId)
        //     .update({
        //         content: firebase.firestore.FieldValue.arrayRemove(this.state.previousContent),
        //         examples: firebase.firestore.FieldValue.arrayRemove(this.state.previousExamples),
        //         email: this.state.scholarshipFiveEmail,
        //         emailFormat: this.state.scholarshipFiveEmailFormat,
        //         simPdpaPolicy: this.state.scholarshipFiveSimPdpaPolicy,
        //     })
        //     .then(() => {
        //         console.log("Removed Scholarship-05");
        //         db.collection("Scholarship").doc(id)
        //         .update({
        //             content: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipFiveContent),
        //             examples: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipFiveExamples),
        //         }).then(() => {
        //             console.log("Updated Scholarship-05")
        //             this.setState({
        //                 editFiveModal: false,
        //             });
        //             this.display();
        //         });
                
        //     });
        // }

        if (id == this.state.scholarshipSixId) {
            db.collection("Scholarship").doc(id)
            .update({
                description: this.state.scholarshipSixDescription, 
            })
            .then(() => {
                console.log("Updated Scholarship-06")
                this.setState({
                    editSixModal: false,
                });
                this.display();
            });
        }

        if (id == this.state.scholarshipSevenId) {
            db.collection("Scholarship").doc(id)
            .update({
                // content: firebase.firestore.FieldValue.arrayRemove({
                //     applicationPeriod: [{
                //         description: this.state.previousDescription,
                //         period: this.state.previousPeriod,
                //     }],
                //     programmes: this.state.previousProgrammes,
                // })
                content: firebase.firestore.FieldValue.arrayUnion({
                    applicationPeriod: [{
                        description: this.state.scholarshipSevenDescription,
                        period: this.state.scholarshipSevenPeriod,
                    }],
                    programmes: this.state.scholarshipSevenProgrammes,
                })
            })
            .then(() => {
                console.log("Removed Scholarship-07");
                this.setState({
                    editSevenModal: false,
                });
                this.display();

                // db.collection("Scholarship").doc(id)
                // .update({
                //     content: firebase.firestore.FieldValue.arrayUnion({
                //         applicationPeriod: [{
                //             description: this.state.scholarshipSevenDescription,
                //             period: this.state.scholarshipSevenPeriod,
                //         }],
                //         programmes: this.state.scholarshipSevenProgrammes,
                //     })
                // }).then(() => {
                //     console.log("Updated Scholarship-07")
                //     this.setState({
                //         editSevenModal: false,
                //     });
                //     this.display();
                // });
                
            });
        }

        if (id == this.state.scholarshipEightId) {
            db.collection("Scholarship").doc(id)
            .update({
                content: firebase.firestore.FieldValue.arrayRemove(this.state.previousData)
            })
            .then(() => {
                console.log("Removed Scholarship-08");
                db.collection("Scholarship").doc(id)
                .update({
                    content: firebase.firestore.FieldValue.arrayUnion(this.state.scholarshipEightContent)
                }).then(() => {
                    console.log("Updated Scholarship-08")
                    this.setState({
                        editEightModal: false,
                    });
                    this.display();
                });
                
            });
        }
    }

    handleEditOne = (scholarshipOne) => {
        if (this.state.editOneModal == false) {
            this.setState({
                editOneModal: true,
                scholarshipOneId: scholarshipOne.scholarshipOneId,
                scholarshipOneTitle: scholarshipOne.scholarshipOneTitle,
                scholarshipOneDescription: scholarshipOne.scholarshipOneDescription,
                previousTitle: scholarshipOne.scholarshipOneTitle,
                previousData: scholarshipOne.scholarshipOneDescription,
            });
        }
        else {
            this.setState({
                editOneModal: false
            });
        }
    }

    handleEditTwo = (scholarshipTwo) => {
        if (this.state.editTwoModal == false) {
            this.setState({
                editTwoModal: true,
                scholarshipTwoId: scholarshipTwo.scholarshipTwoId,
                scholarshipTwoContent: scholarshipTwo.scholarshipTwoContent,
                previousData: scholarshipTwo.scholarshipTwoContent,
            });
        }
        else {
            this.setState({
                editTwoModal: false
            });
        }
    }

    handleEditThree = (scholarshipThree) => {
        if (this.state.editThreeModal == false) {
            this.setState({
                editThreeModal: true,
                scholarshipThreeId: scholarshipThree.scholarshipThreeId,
                scholarshipThreeCovers: scholarshipThree.scholarshipThreeCovers,
                previousData: scholarshipThree.scholarshipThreeCovers,
            });
        }
        else {
            this.setState({
                editThreeModal: false
            });
        }
    }

    handleEditFour = (scholarshipFour) => {
        console.log(scholarshipFour)
        if (this.state.editFourModal == false) {
            this.setState({
                editFourModal: true,
                scholarshipFourId: scholarshipFour.scholarshipFourId,
                scholarshipFourApplicationPeriods: scholarshipFour.scholarshipFourApplicationPeriods,
                previousData: scholarshipFour.scholarshipFourApplicationPeriods,
            });
        }
        else {
            this.setState({
                editFourModal: false
            });
        }
    }

    handleEditFive = (scholarshipFive) => {
        if (this.state.editFiveModal == false) {
            this.setState({
                editFiveModal: true,
                scholarshipFiveContent: scholarshipFive.scholarshipFiveContent,
                scholarshipFiveExamples: scholarshipFive.scholarshipFiveExamples,
                scholarshipFiveEmail: scholarshipFive.scholarshipFiveExamples,
                scholarshipFiveEmailFormat: scholarshipFive,
                scholarshipFiveSimPdpaPolicy: scholarshipFive,
                scholarshipFiveId: scholarshipFive,
                previousContent: scholarshipFive.scholarshipFiveContent,
                previousExamples: scholarshipFive.scholarshipFiveExamples,
            });
        }
        else {
            this.setState({
                editFiveModal: false
            });
        }
    }

    handleEditSix = (scholarshipSix) => {
        if (this.state.editSixModal == false) {
            this.setState({
                editSixModal: true,
                scholarshipSixId: scholarshipSix.scholarshipSixId,
                scholarshipSixDescription:scholarshipSix.scholarshipSixDescription,
            });
        }
        else {
            this.setState({
                editSixModal: false
            });
        }
    }

    handleEditSeven = (scholarshipSeven) => {
        if (this.state.editSevenModal == false) {
            this.setState({
                editSevenModal: true,
                scholarshipSevenId: scholarshipSeven.scholarshipSevenId,
                scholarshipSevenPeriod: scholarshipSeven.scholarshipSevenPeriod,
                scholarshipSevenDescription: scholarshipSeven.scholarshipSevenDescription,
                scholarshipSevenProgrammes: scholarshipSeven.scholarshipSevenProgrammes,
                previousPeriod: scholarshipSeven.scholarshipSevenPeriod,
                previousDescription: scholarshipSeven.scholarshipSevenDescription,
                previousProgrammes: scholarshipSeven.scholarshipSevenProgrammes,
            });
        }
        else {
            this.setState({
                editSevenModal: false
            });
        }
    }

    handleEditEight = (scholarshipEight) => {
        if (this.state.editEightModal == false) {
            this.setState({
                editEightModal: true,
                scholarshipEightId: scholarshipEight.scholarshipEightId,
                scholarshipEightContent: scholarshipEight.scholarshipEightContent,
                previousData: scholarshipEight.scholarshipEightContent,
            });
        }
        else {
            this.setState({
                editEightModal: false
            });
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td>{one.scholarshipOneTitle}</td>
                                                                                    <td className="text-left">{one.scholarshipOneDescription}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditOne(one)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td className="text-left">{two.scholarshipTwoContent}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditTwo(two)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td className="text-left">{three.scholarshipThreeCovers}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditThree(three)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td className="text-left">{four.scholarshipFourApplicationPeriods}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFour(four)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                        {this.state.scholarshipFiveContentArray && this.state.scholarshipFiveContentArray.map((fiveContent) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{fiveContent.scholarshipFiveContent}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFive(fiveContent)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
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
                                                                        {this.state.scholarshipFiveExamplesArray && this.state.scholarshipFiveExamplesArray.map((fiveExamples) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody">
                                                                                    <tr>
                                                                                        <td className="text-left">{fiveExamples.scholarshipFiveExamples}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFive(fiveExamples)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            )
                                                                        })}
                                                                    </Table>
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
                                                                        {this.state.scholarshipFiveOthers && this.state.scholarshipFiveOthers.map((fiveOthers) => {
                                                                            return (
                                                                                <tbody id="Scholarship-tableBody">
                                                                                    <tr>
                                                                                        <td id="Scholarship-titleHeading"><b>Email</b></td>
                                                                                        <td className="text-left">{fiveOthers.scholarshipFiveEmail}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFive(fiveOthers.scholarshipFiveEmail)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td id="Scholarship-titleHeading"><b>Email Format</b></td>
                                                                                        <td className="text-left">{fiveOthers.scholarshipFiveEmailFormat}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFive(fiveOthers.scholarshipFiveEmailFormat)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td id="Scholarship-titleHeading"><b>SIM PDPA Policy</b></td>
                                                                                        <td className="text-left">{fiveOthers.scholarshipFiveSimPdpaPolicy}</td>
                                                                                        <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditFive(fiveOthers.scholarshipFiveSimPdpaPolicy)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td className="text-left">{six.scholarshipSixDescription}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditSix(six)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td><b>{seven.scholarshipSevenPeriod}</b></td>
                                                                                    <td className="text-left">{seven.scholarshipSevenDescription}</td>
                                                                                    <td className="text-left">{seven.scholarshipSevenProgrammes}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditSeven(seven)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                            <tbody id="Scholarship-tableBody">
                                                                                <tr>
                                                                                    <td className="text-left">{eight.scholarshipEightContent}</td>
                                                                                    <td><Button size="sm" id="Scholarship-editBtn" onClick={() => this.handleEditEight(eight)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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

                {/* Scholarship 1 Edit Modal */}
                {this.state.editOneModal == true ? 
                    <Modal show={this.state.editOneModal} onHide={this.handleEditOne} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Categories of Scholarships</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faGraduationCap}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-inputFields" type="text" name="scholarshipOneTitle" placeholder="Title for Categories of Scholarships" required value={this.state.scholarshipOneTitle} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipOneDescription" placeholder="Description for Categories of Scholarships" required defaultValue={this.state.scholarshipOneDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipOneId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditOne}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 2 Edit Modal */}
                {this.state.editTwoModal == true ? 
                    <Modal show={this.state.editTwoModal} onHide={this.handleEditTwo} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Eligibility</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipTwoContent" placeholder="Content for Eligibility's Description" required defaultValue={this.state.scholarshipTwoContent} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipTwoId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditTwo}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 3 Edit Modal */}
                {this.state.editThreeModal == true ? 
                    <Modal show={this.state.editThreeModal} onHide={this.handleEditThree} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Value of Scholarship</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipThreeCovers" placeholder="Value of Scholarship's Covers" required defaultValue={this.state.scholarshipThreeCovers} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipThreeId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditThree}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 4 Edit Modal */}
                {this.state.editFourModal == true ? 
                    <Modal show={this.state.editFourModal} onHide={this.handleEditFour} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Value of Scholarship</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-inputFields" name="scholarshipFourApplicationPeriods" as="select" required defaultValue={this.state.scholarshipFourApplicationPeriods} onChange={this.updateInput} noValidate>
                                                    <option value="">Select a Period</option>
                                                    <option value="January">January</option>
                                                    <option value="February">February</option>
                                                    <option value="March">March</option>
                                                    <option value="April">April</option>
                                                    <option value="May">May</option>
                                                    <option value="June">June</option>
                                                    <option value="July">July</option>
                                                    <option value="August">August</option>
                                                    <option value="September">September</option>
                                                    <option value="October">October</option>
                                                    <option value="November">November</option>
                                                    <option value="December">December</option>
                                                </Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipFourId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditFour}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 5 Edit Modal */}
                {this.state.editFiveModal == true ? 
                    <Modal show={this.state.editFiveModal} onHide={this.handleEditFive} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Application Documents & Procedures</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    {this.state.scholarshipFiveContent ? 
                                        <Form.Group>
                                            <Form.Group as={Row} className="Scholarship-formGroup">
                                                <Form.Group as={Col} md="1">
                                                    <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                                </Form.Group> 
                                                <Form.Group as={Col} md="7">
                                                    <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipFiveContent" placeholder="Application Documents & Procedures's Content" required defaultValue={this.state.scholarshipFiveContent} onChange={this.updateInput} noValidate></Form.Control>
                                                    <div className="errorMessage"></div>
                                                </Form.Group>
                                            </Form.Group>
                                        </Form.Group> : ''
                                    }
                                    {this.state.scholarshipFiveExamples ? 
                                        <Form.Group>
                                            <Form.Group as={Row} className="Scholarship-formGroup">
                                                <Form.Group as={Col} md="1">
                                                    <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                                </Form.Group> 
                                                <Form.Group as={Col} md="7">
                                                    <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipFiveExamples" placeholder="Application Documents & Procedures's Examples" required defaultValue={this.state.scholarshipFiveExamples} onChange={this.updateInput} noValidate></Form.Control>
                                                    <div className="errorMessage"></div>
                                                </Form.Group>
                                            </Form.Group>
                                        </Form.Group> : ''
                                    }
                                    {this.state.scholarshipFiveOthers && this.state.scholarshipFiveOthers.map((five) => {
                                        if (this.state.scholarshipFiveEmail == five.scholarshipFiveEmail){
                                            return (
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Scholarship-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipFiveEmail" placeholder="Application Documents & Procedures's Email" required defaultValue={this.state.scholarshipFiveEmail} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Form.Group>
                                            )
                                        } else if (this.state.scholarshipFiveEmailFormat == five.scholarshipFiveEmailFormat) {
                                            return (
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Scholarship-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipFiveEmailFormat" placeholder="Application Documents & Procedures's Email Format" required defaultValue={this.state.scholarshipFiveEmailFormat} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Form.Group>
                                            )
                                        } else if (this.state.scholarshipFiveSimPdpaPolicy == five.scholarshipFiveSimPdpaPolicy) {
                                            return (
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Scholarship-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipFiveSimPdpaPolicy" placeholder="Application Documents & Procedures's SIM PDPA Policy" required defaultValue={this.state.scholarshipFiveSimPdpaPolicy} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Form.Group>
                                            )
                                        } else {
                                            return ('')
                                        }
                                    })}
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipFiveId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditFive}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 6 Edit Modal */}
                {this.state.editSixModal == true ? 
                    <Modal show={this.state.editSixModal} onHide={this.handleEditSix} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Selection Process</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipSixDescription" placeholder="Selection Process's Description" required defaultValue={this.state.scholarshipSixDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipSixId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditSix}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 7 Edit Modal */}
                {this.state.editSevenModal == true ? 
                    <Modal show={this.state.editSevenModal} onHide={this.handleEditSeven} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Tenure of Scholarship</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-inputFields" name="scholarshipSevenPeriod" as="select" required defaultValue={this.state.scholarshipSevenPeriod} onChange={this.updateInput} noValidate>
                                                    <option value="">Select a Period</option>
                                                    <option value="January">January</option>
                                                    <option value="February">February</option>
                                                    <option value="March">March</option>
                                                    <option value="April">April</option>
                                                    <option value="May">May</option>
                                                    <option value="June">June</option>
                                                    <option value="July">July</option>
                                                    <option value="August">August</option>
                                                    <option value="September">September</option>
                                                    <option value="October">October</option>
                                                    <option value="November">November</option>
                                                    <option value="December">December</option>
                                                </Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipSevenDescription" placeholder="Tenure of Scholarship's Description" required defaultValue={this.state.scholarshipSevenDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faBookReader}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="2" type="text" name="scholarshipSevenProgrammes" placeholder="Tenure of Scholarship's Programmes" required defaultValue={this.state.scholarshipSevenProgrammes} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipSevenId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditSeven}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Scholarship 8 Edit Modal */}
                {this.state.editEightModal == true ? 
                    <Modal show={this.state.editEightModal} onHide={this.handleEditEight} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Scholarship-modalTitle" className="w-100">Edit Terms and Conditions</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="Scholarship-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileAlt}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="Scholarship-textAreas" as="textarea" rows="4" type="text" name="scholarshipEightContent" placeholder="Terms and Conditions's Description" required defaultValue={this.state.scholarshipEightContent} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="Scholarship-editFooter">
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-saveBtn" type="submit" onClick={() => this.updateScholarships(this.state.scholarshipEightId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="Scholarship-editCol">
                                            <Button id="Scholarship-cancelBtn" onClick={this.handleEditEight}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

            </div>

        );
    }
}

export default Scholarship;