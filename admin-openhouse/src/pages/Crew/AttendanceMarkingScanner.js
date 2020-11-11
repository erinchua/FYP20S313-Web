import { Container, Row, Col, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";
import Login from "../../pages/Login";

import "../../css/Crew/AttendanceMarkingScanner.css";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SideNavBar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faQrcode } from "@fortawesome/free-solid-svg-icons";
import QrReader from "react-qr-reader";
  
class AttendanceMarkingScanner extends Component {
    constructor() {
        super();
        this.state = {
            //Attendance Details
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            date: "",
            programmeName: "",
            universityName: "",
            counter: "",
            //Programme Talks
            talkId: "",
            talkName: "",
            programmeTalkName: "",
            //Scanner
            openWebCam: false,
            user: "",
            result: "",
            //Below states are for the functions
            attendance: "",
            programmeTalks: "",
            //Below states are for the modals
            selectionModal: false,
            showAlert: false,
        };
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email)
                .onSnapshot((snapshot) => {
                    console.log(snapshot.size);
                    this.setState(
                    {
                        user: snapshot.size,
                    },
                    () => {
                        if (this.state.user > 0) {
                            this.handleSelectionModal();
                            this.display();
                        } else {
                            history.push("/Login");
                            window.location.reload();
                        }
                    }
                    );
                });
            } else {
                history.push("/Login");
                window.location.reload();
            }
        });
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            selectionModal: false,
        });
    };

    display() {
        //Retrieve Talk Name List
        db.collection("ProgrammeTalks").onSnapshot((snapshot) => {
            const programmeTalks = [];

            snapshot.forEach((doc) => {
                const data = {
                    talkId: doc.id,
                    talkName: doc.data().talkName,
                }
                programmeTalks.push(data);
            });
            this.setState({
                programmeTalks: programmeTalks,
            });
        });

        //Retrieve Attendance
        db.collection("Attendance").onSnapshot((snapshot) => {
            const attendance = [];

            snapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    email: doc.data().email,
                    date: doc.data().date,
                    talkName: doc.data().talkName,
                    universityName: doc.data().universityName,
                };
                attendance.push(data);
            });
            this.setState({ 
                attendance: attendance
            });
        });
    }

    handleScan = (data) => {
        if (data) {
            this.setState({
                result: data,
                openWebCam: false,
            });

            if (this.state.result != null) {
                var qrCodeString = this.state.result;
                var result = qrCodeString.split(",");
                var firstName = result[0];
                var lastName = result[1];
                var email = result[2];
                var talkName = result[3];
                var date = result[4];
                var universityName = result[5];


                db.collection("Attendance").orderBy("id", "desc").limit(1).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        var docid = "";
                        var res = doc.data().id.substring(11);
                        var id = parseInt(res);
                        id += 1;

                        if (id.toString().length == 1) {
                            docid = "attendance-00" + id;
                        } else if (id.toString().length == 2) {
                            docid = "attendance-0" + id;
                        } else {
                            docid = "attendance-" + id;
                        }

                        db.collection("Attendance").doc(docid)
                        .set({
                            date: date,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            talkName: talkName,
                            universityName: universityName,
                            id: docid,
                        })
                        .then(() => {
                            console.log("Added the attendance");
                            this.setState({
                                openWebCam: true,
                            });
                            this.display();
                        });
                    });
                });

                // for (var i = 0; i < this.state.attendance.length; i++) {
                //     if (this.state.attendance[i].email !== email) {
                //         db.collection("Attendance").orderBy("id", "desc").limit(1).get()
                //         .then((snapshot) => {
                //             snapshot.forEach((doc) => {
                //                 var docid = "";
                //                 var res = doc.data().id.substring(11);
                //                 var id = parseInt(res);
                //                 id += 1;
        
                //                 if (id.toString().length == 1) {
                //                     docid = "attendance-00" + id;
                //                 } else if (id.toString().length == 2) {
                //                     docid = "attendance-0" + id;
                //                 } else {
                //                     docid = "attendance-" + id;
                //                 }
        
                //                 db.collection("Attendance").doc(docid)
                //                 .set({
                //                     date: date,
                //                     email: email,
                //                     firstName: firstName,
                //                     lastName: lastName,
                //                     talkName: talkName,
                //                     universityName: universityName,
                //                     id: docid,
                //                 })
                //                 .then(() => {
                //                     console.log("Added the attendance");
                //                     this.setState({
                //                         openWebCam: true,
                //                     });
                //                     this.display();
                //                 });
                //             });
                //         });
                //     } else {
                //         this.setState({
                //             showAlert: true,
                //         });
                //     }
                // }
            }
        }
    };

    handleError = (err) => {
        console.error(err);
    };

    handleWebCam = () => {
        this.openWebCam = this.state.openWebCam;
        let webCam_status = localStorage.getItem('webCam_status');

        if (!webCam_status && this.openWebCam === false) {
            this.setState({
                openWebCam: true,
            });
            localStorage.setItem('webCam_status', 1);
        }

        if (webCam_status && this.openWebCam === true) {
            this.setState({
                openWebCam: false,
            });
            localStorage.clear();
            localStorage.setItem('selectionModal_status', 1);
        }

        if (this.state.openWebCam) {
            return null;
        }
    }

    handleSelectionModal = () => {
        this.selectionModal = this.state.selectionModal;
        let selectionModal_status = localStorage.getItem('selectionModal_status');

        if (!selectionModal_status && this.selectionModal === false) {
            this.setState({
                selectionModal: true,
            });
            localStorage.setItem('selectionModal_status', 1);
        }
        if (this.state.selectionModal) {
            return null;
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="AttendanceMarking-container">
                    <NavBar isMA={false} />

                        <Container fluid className="AttendanceMarking-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar isMarketing={false}/>
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="AttendanceMarking-topContentContainer">
                                        <Row id="AttendanceMarking-firstRow">
                                            <Col md={6} className="text-left" id="AttendanceMarking-firstRowCol">
                                                <h4 id="AttendanceMarking-title">Attendance Marking Scanner</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="AttendanceMarking-firstRowCol">
                                                <Button id="AttendanceMarking-scannerBtn" onClick={this.handleWebCam}><FontAwesomeIcon size="lg" icon={faQrcode} /><span id="AttendanceMarking-scannerBtnText">Scan</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="AttendanceMarking-secondRow">
                                            <Col md={12} className="text-center" id="AttendanceMarking-secondRowCol">
                                                {this.state.openWebCam === true ? 
                                                    <>
                                                    <Row className="AttendanceMarking-secondInnerRow">
                                                        <Col md={12} className="text-center AttendanceMarking-secondInnerCol">
                                                            <QrReader delay={2000} onError={this.handleError} onScan={this.handleScan} style={{ width: "30%", paddingTop: "3%", paddingBottom: "3%"}} />
                                                        </Col>
                                                    </Row>
                                                    </> : ''
                                                }
                                            </Col>
                                        </Row>
                                        <Row id="AttendanceMarking-secondRow">
                                            <Col md={12} className="text-center" id="AttendanceMarking-secondRowCol">
                                                <Table responsive="sm" bordered hover className="AttendanceMarking-tableCon">
                                                    <thead id="AttendanceMarking-tableHeader">
                                                        <tr>
                                                            <th id="AttendanceMarking-nameHeading">First Name</th>
                                                            <th id="AttendanceMarking-nameHeading">Last Name</th>
                                                            <th id="AttendanceMarketing-emailHeading">Email</th>
                                                            <th id="AttendanceMarketing-dateHeading">Date</th>
                                                            <th id="AttendanceMarketing-programmeHeading">University Name</th>
                                                            <th id="AttendanceMarketing-programmeHeading">Talk Name</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.attendance && this.state.attendance.map((attendance) => {
                                                        if (attendance.talkName === this.state.programmeTalkName) {
                                                            return (
                                                                <tbody id="AttendanceMarking-tableBody" key={attendance.id}>
                                                                    <tr>
                                                                        <td>{attendance.firstName}</td>
                                                                        <td>{attendance.lastName}</td>
                                                                        <td>{attendance.email}</td>
                                                                        <td>{attendance.date}</td>
                                                                        <td className="text-left">{attendance.universityName}</td>
                                                                        <td className="text-left">{attendance.talkName}</td>
                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        }
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>

                    <Footer />
                </Container>

                {/* Attendance Marking Scanner Modal - Crew */}
                {this.state.selectionModal == true ? 
                    <Modal show={this.state.selectionModal} onHide={() => this.setState({selectionModal: false})} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="AttendanceMarking-modalTitle" className="w-100">Select a Programme Talk</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="AttendanceMarking-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faMicrophone}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="AttendanceMarking-inputFields" name="programmeTalkName" as="select" required defaultValue={""} onChange={this.updateInput} noValidate>
                                                    <option value="">Select a Programme Talk</option>
                                                    {this.state.programmeTalks && this.state.programmeTalks.map((talks) => {
                                                        return(
                                                            <option value={talks.talkName}>{talks.talkName}</option>
                                                        )
                                                    })}
                                                </Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="AttendanceMarking-editFooter">
                                        <Col md={12} className="AttendanceMarking-editCol">
                                            <Button id="AttendanceMarking-cancelBtn" onClick={() => this.setState({selectionModal: false})}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {this.state.showAlert == true ?
                    <Modal show={this.state.showAlert} onHide={() => this.setState({ showAlert: false })} size="sm" centered backdrop="static" keyboard={false}>
                        <Alert show={this.state.showAlert} onClose={() => this.setState({ showAlert: false })} dismissible>
                            <Alert.Heading>Error Occurred!</Alert.Heading>
                            <p id="AttendanceMarking-alertFail-data">You have already marked your attendance!</p>
                        </Alert>
                    </Modal> : ''
                }

            </div>
        );
    }
}
export default AttendanceMarkingScanner;