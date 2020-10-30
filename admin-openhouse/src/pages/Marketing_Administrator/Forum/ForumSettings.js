import { Container, Row, Col, Table, Form, Modal, Button } from "react-bootstrap";
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/Forum.css";
import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
  
class ForumSettings extends Component {
    constructor() {
        super();
        this.state = {
            checked: false,
            text: "Disable",
            confirmModal: false,
        };
    }

    componentDidMount() {
        this.authListener();
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

    display() {
        const db = fire.firestore();
    
        const userRe1 = db
        .collection("Openhouse")
        .doc("openhouse")
        .onSnapshot((snapshot) => {
            if (snapshot.data().disableForum === false) {
                this.setState({
                    checked: false,
                    text: "Disable",
                    confirmModal: false,
                });
            } else {
                this.setState({
                    checked: true,
                    text: "Enable",
                    confirmModal: false,
                });
            }
        });
    }
  
    //Confirm Disable Forum Modal
    handleToggle = () => {
        this.confirmModal = this.state.confirmModal;
        this.checked = this.state.checked;
    
        if (this.confirmModal == false && this.checked == false) {
            this.setState({
                confirmModal: true,
            });
        }

        if (this.confirmModal == false) {
            this.setState({
                confirmModal: true
            });
        } else {
            this.setState({
                confirmModal: false
            });
        }
    
        if (this.checked == true) {
            this.setState({
                text: "Enable",
                confirmModal: true,
            });
        }

    };
  
    //OnClick Method for Confirm Button
    onClickConfirm = () => {
      this.checked = this.state.checked;
      this.text = this.state.text;
      this.confirmModal = this.state.confirmModal;
  
        if (this.text === "Enable") {
            const db = fire.firestore();

            const userRef = db.collection("Openhouse").doc("openhouse");
    
            userRef.update({
                disableForum: false,
                checked: false
            });
        } else {
            const db = fire.firestore();
    
            const userRef = db.collection("Openhouse").doc("openhouse");
    
            userRef.update({
                disableForum: true,
                checked: true
            });
        }
    };
  
    /*/   this.setState({
        checked: true,
        text: "Enable",
        confirmModal: false,
      });
      console.log("Forum Disabled");
      const db = fire.firestore();
  
      const userRef = db.collection("Openhouse").doc("openhouse-001");
  
      userRef.update({
        disableForum: true,
      });*/
  
    //OnClick Method for Cancel Button
    onClickCancel = () => {
        this.checked = this.state.checked;
        this.text = this.state.text;
        this.confirmModal = this.state.confirmModal;
        if (this.checked === true && this.text === "Enable") {
            this.setState({
                checked: true,
                confirmModal: false,
            });
            console.log("Forum is still Disabled");
        } else {
            this.setState({
                checked: false,
                confirmModal: false,
            });
            console.log("Forum is still Enabled");
        }
    };
  
    render() {
        return (
            <div>
                <Container fluid className="Forum-container">
                    <NavBar isMA={true} />
        
                    <Container fluid className="Forum-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Row>
                            <Col md={2} style={{ paddingRight: 0 }}>
                                <SideNavBar />
                            </Col>
            
                            <Col md={10} style={{ paddingLeft: 0 }}>
                                <Container fluid id="Forum-topContentContainer">
                                    <Row id="Forum-firstRow"></Row>
                
                                    <Row id="Forum-secondRow">
                                        <Col md={12} className="text-center" id="Forum-secondRowCol">
                                            <Table responsive="sm" striped id="Forum-tableContainer">
                                            <thead id="Forum-tableHeader">
                                                <tr>
                                                    <th colSpan="2">Settings</th>
                                                </tr>
                                            </thead>
                                            <tbody id="Forum-tableBody">
                                                <tr>
                                                <td className="text-left ForumSettings-text">
                                                    Disable Forum
                                                </td>
                                                <td className="text-right">
                                                    <Form>
                                                        <Form.Check type="switch" id="ForumSettings-switch" checked={this.state.checked} onChange={this.handleToggle} label=""/>
                                                    </Form>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
        
                    <Footer />
                </Container>
        
                {this.state.confirmModal == true ? (
                    <Modal show={this.state.confirmModal} onHide={this.handleToggle} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                            <Col md={12} className="text-center ForumSettings-switchModalCol">
                                <FontAwesomeIcon size="3x" icon={faTimesCircle} />
                            </Col>
                            </Row>
            
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumSettings-switchModalCol">
                                    <h5 id="ForumSettings-switchText">
                                        Are you sure you want to {this.state.text} the forum?
                                    </h5>
                                </Col>
                                </Row>
                
                                <Row className="justify-content-center">
                                <Col md={6} className="text-right ForumSettings-switchModalCol">
                                    <Button id="ForumSettings-switchConfirmBtn" onClick={this.onClickConfirm}>
                                        Confirm
                                    </Button>
                                </Col>
                                <Col md={6} className="text-left ForumFlagged-switchModalCol">
                                    <Button id="ForumSettings-switchCancelBtn" onClick={this.onClickCancel}>
                                    Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                    ) : ( ""
                )}
            </div>
        );
    }
}
  
export default ForumSettings;