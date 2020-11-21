import { Container, Row, Col, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

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
            //Others
            isMarketing: "",
            allTalks: false,
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
                    snapshot.forEach((doc) => {
                        console.log(snapshot.size);
                        this.setState({
                            user: snapshot.size,
                        },
                        () => {
                            if (this.state.user > 0) {
                                if (doc.data().administratorType === "Marketing Administrator") {
                                    this.setState({
                                        isMarketing: true
                                    });
                                    this.handleSelectionModal();
                                    this.display();
                                }

                                if (doc.data().administratorType === "Crew") {
                                    this.setState({
                                        isMarketing: false
                                    });
                                    this.handleSelectionModal();
                                    this.display();
                                }

                            } else {
                                history.push("/Login");
                                window.location.reload();
                                localStorage.clear();
                            }
                        });
                    })
                });
            } else {
                history.push("/Login");
                window.location.reload();
                localStorage.clear();
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

    handleScan = async(data) => {
        if (data) {
            this.setState({
                result: data,
                openWebCam: false,
            });

            if (this.state.result != null) {
                var qrCodeString = this.state.result;
                var result = qrCodeString.split("~");
                var firstName = result[0];
                var lastName = result[1];
                var email = result[2];
                var talkName = result[3];
                var date = result[4];
                var universityName = result[5];

                await db.collection("Attendance").orderBy("id", "desc").limit(1).get()
                .then((snapshot) => {
                    snapshot.forEach(async (doc) => {
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

                        //Check if attendee existed in a progTalk
                        const attendee = await db.collection("Attendance").where("talkName", "==", talkName).where("email", "==", email).get()
                        if (!attendee.empty) {
                            this.setState({
                                showAlert: true,
                            });
                            return
                        } else {
                            await db.collection("Attendance").doc(docid)
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
                                this.setState({
                                    openWebCam: true,
                                });
                                this.display();
                            });
                        }
                        
                    });
                });
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
            localStorage.removeItem('webCam_status');
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
                    {this.state.isMarketing == false ?
                        <NavBar isMA={false} /> : ''
                    }

                    {this.state.isMarketing == true ? 
                        <NavBar isMA={true} /> : ''
                    }

                        <Container fluid className="AttendanceMarking-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar isMarketing={this.state.isMarketing}/>
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="AttendanceMarking-topContentContainer">
                                        <Row id="AttendanceMarking-firstRow">
                                            {this.state.isMarketing === true ? 
                                                <Col md={6} className="text-left" id="AttendanceMarking-firstRowCol">
                                                    <h4 id="AttendanceMarking-title">Programme Talk Attendance List</h4>
                                                </Col> : ''
                                            }
                                            {this.state.isMarketing === false ? 
                                                <>
                                                <Col md={6} className="text-left" id="AttendanceMarking-firstRowCol">
                                                    <h4 id="AttendanceMarking-title">Attendance Marking Scanner</h4>
                                                </Col>
                                                <Col md={6} className="text-right" id="AttendanceMarking-firstRowCol">
                                                    <Button id="AttendanceMarking-scannerBtn" onClick={this.handleWebCam}><FontAwesomeIcon size="lg" icon={faQrcode} /><span id="AttendanceMarking-scannerBtnText">Scan</span></Button>
                                                </Col>
                                                </> : ''
                                            }
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
                                                        } else if (this.state.programmeTalkName === "all") {
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
                    <Modal show={this.state.selectionModal} onHide={() => this.setState({selectionModal: false})} size="lg" centered backdrop="static" keyboard={false}>
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
                                                <Form.Control id="AttendanceMarking-inputFields" name="programmeTalkName" as="select" required onChange={this.updateInput} noValidate>
                                                    <option value="" id="AttendanceMarking-options">Select a Programme Talk</option>
                                                    <option value="all" id="AttendanceMarking-options">All</option>
                                                    {this.state.programmeTalks && this.state.programmeTalks.map((talks) => {
                                                        return(
                                                            <option value={talks.talkName} id="AttendanceMarking-options">{talks.talkName}</option>
                                                        )
                                                    })}
                                                </Form.Control>
                                                
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
                    <Modal show={this.state.showAlert} onHide={() => [this.setState({ showAlert: false }), localStorage.removeItem('webCam_status')]} size="sm" centered backdrop="static" keyboard={false}>
                        <Alert show={this.state.showAlert} onClose={() => [this.setState({ showAlert: false }), localStorage.removeItem('webCam_status')]} dismissible>
                            <Alert.Heading>Error Occurred!</Alert.Heading>
                            <p id="AttendanceMarking-alertFail-data">Student has already marked his/her attendance!</p>
                        </Alert>
                    </Modal> : ''
                }

            </div>
        );
    }
}
export default AttendanceMarkingScanner;