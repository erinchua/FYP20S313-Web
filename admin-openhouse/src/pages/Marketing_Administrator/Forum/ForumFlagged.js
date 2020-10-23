import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class ForumFlagged extends Component {

    constructor() {
        super();
        this.state = {
            removeModal: false,
            keepModal: false,
        };
        this.handleRemoveModal = this.handleRemoveModal.bind(this);
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
        //this.authListener();
        this.display();
      }
    
      display() {
        const db = fire.firestore();
        var a = this;
        var counter = 1;
    
        const questions = db
          .collectionGroup("Reports")
          .get()
          .then((snapshot) => {
            const flagged = [];
            snapshot.forEach((doc) => {
              const data = {
                questionscomment: doc.data().postContent,
                reason: doc.data().entry,
                type: doc.data().postType,
                postedby: doc.data().offender,
                datetime: doc.data().dateTime,
                reportedby: doc.data().reporter,
                postid: doc.data().postId,
              };
              flagged.push(data);
    
              this.setState({ flagged: flagged });
            });
          });
      }

    //Remove Post Modal
    handleRemoveModal = () => {
        this.removeModal = this.state.removeModal;
        if (this.removeModal == false) {
            this.setState({
                removeModal: true
            });
        } else {
            this.setState({
                removeModal: false
            });
        }
    }

    //Keep Post Modal
    handleKeepModal = () => {
        this.keepModal = this.state.keepModal;
        if (this.keepModal == false) {
            this.setState({
                keepModal: true
            });
        } else {
            this.setState({
                keepModal: false
            });
        }
    }

    //Remove Post Modal - Cancel Button
    handleRemoveCancel = () => {
        this.removeModal = this.state.removeModal;
        if (this.removeModal == true) {
            this.setState({
                removeModal: false
            });
        } else {
            this.setState({
                removeModal: true
            });
        }
    }

    //Keep Post Modal - Cancel Button
    handleKeepCancel = () => {
        this.keepModal = this.state.keepModal;
        if (this.keepModal == true) {
            this.setState({
                keepModal: false
            });
        } else {
            this.setState({
                keepModal: true
            });
        }
    }

    //Remove Post Modal - Confirm Button
    handleRemoveConfirm = () => {
        console.log("Confirm remove post")
        this.removeModal = this.state.removeModal;
        if (this.removeModal == true) {
            this.setState({
                removeModal: false
            });
        } else {
            this.setState({
                removeModal: true
            });
        }
    }

    //Keep Post Modal - Cancel Button
    handleKeepConfirm = () => {
        console.log("Confirm keep post")
        this.keepModal = this.state.keepModal;
        if (this.keepModal == true) {
            this.setState({
                keepModal: false
            });
        } else {
            this.setState({
                keepModal: true
            });
        }
    }

    retrievepostdetails(postid, type) {
        this.setState({
          id: postid,
          type: type,
        });
    
        //this.handleRemoveModal.bind(this);
      }
    
      removepost(postid, type) {
        var reporttype = type;
        if (reporttype == "Question") {
          reporttype = "Questions";
        } else {
          reporttype = "Comments";
        }
    
        const db = fire.firestore();
        const userRef = db
          .collectionGroup(reporttype.toString())
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.data().id === postid.toString()) {
                doc.ref
                  .update({
                    deleted: true,
                  })
                  .then(function () {
                    alert("Updated");
                  });
              }
            });
          });
    
        //  userRef.update({ deleted: false });
      }
    
      keeppost(postid, type) {
        var reporttype = type;
        if (reporttype == "Question") reporttype = "Questions";
        else {
          reporttype = "Comments";
        }
        const db = fire.firestore();
        const userRef = db
          .collectionGroup(reporttype.toString())
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.data().id === postid.toString()) {
                doc.ref
                  .update({
                    deleted: false,
                  })
                  .then(function () {
                    alert("Updated");
                  });
              }
            });
          });
      }

    render() {
        return (
            <div>
                <Container fluid className="Forum-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Forum-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Forum-topContentContainer">
                                        <Row id="Forum-firstRow">
                                            <Col md={12} id="Forum-firstRowCol">
                                                <h4 id="Forum-title">Forum - Flagged Posts</h4>
                                            </Col>
                                        </Row>
                                        
                                        <Row id="Forum-secondRow">
                                            <Col md={12} className="text-center" id="Forum-secondRowCol">
                                                <Table responsive="sm" bordered id="Forum-tableContainer">
                                                    <thead id="Forum-tableHeader">
                                                        <tr>
                                                            <th id="ForumFlagged-SNo">S/N</th>
                                                            <th id="ForumFlagged-questionsComments">Question/Comment</th>
                                                            <th id="ForumFlagged-reasons">Reason</th>
                                                            <th>Type</th>
                                                            <th>Posted By</th>
                                                            <th>Date/Time</th>
                                                            <th id="ForumFlagged-comments">No. of Comments</th>
                                                            <th id="ForumFlagged-icons">Remove Post</th>
                                                            <th id="ForumFlagged-icons">Keep Post</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="Forum-tableBody">
                                                    {this.state.flagged &&
                            this.state.flagged.map((flagged, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{flagged.questionscomment}</td>
                                  <td>{flagged.reason}</td>
                                  <td>{flagged.type}</td>
                                  <td>{flagged.postedby}</td>
                                  <td>{flagged.datetime}</td>
                                  <td>{flagged.reportedby}</td>
                                                            <td><Button size="lg" id="ForumFlagged-removeBtn" onClick={this.handleRemoveModal.bind(this)}><FontAwesomeIcon size="lg" icon={faTimesCircle}/></Button></td>
                                                            <td><Button size="lg" id="ForumFlagged-keepBtn" onClick={this.handleKeepModal.bind(this)}><FontAwesomeIcon size="lg" icon={faCheckCircle}/></Button></td>
                                                        </tr>
                                                        );
                                                    })}
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

                {this.state.removeModal == true ? 
                    <Modal show={this.state.removeModal} onHide={this.handleRemoveModal} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-removeModalCol">
                                    <FontAwesomeIcon size="3x" icon={faTimesCircle}/>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-removeModalCol">
                                    <h5 id="ForumFlagged-removeText">Do you want to delete this post?</h5>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={6} className="text-right ForumFlagged-removeModalCol">
                                    <Button id="ForumFlagged-removeConfirmBtn" onClick={this.handleRemoveConfirm}>Confirm</Button>
                                </Col>
                                <Col md={6} className="text-left ForumFlagged-removeModalCol">
                                    <Button id="ForumFlagged-removeCancelBtn" onClick={this.handleRemoveCancel}>Cancel</Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>: ''
                }

                {this.state.keepModal == true ? 
                    <Modal show={this.state.keepModal} onHide={this.handleKeepModal} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-keepModalCol">
                                    <FontAwesomeIcon size="3x" icon={faCheckCircle}/>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-keepModalCol">
                                    <h5 id="ForumFlagged-keepText">Do you want to keep this post?</h5>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={6} className="text-right ForumFlagged-keepModalCol">
                                    <Button id="ForumFlagged-keepConfirmBtn" onClick={this.handleKeepConfirm}>Confirm</Button>
                                </Col>
                                <Col md={6} className="text-left ForumFlagged-keepModalCol">
                                    <Button id="ForumFlagged-keepCancelBtn" onClick={this.handleKeepCancel}>Cancel</Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>: ''
                }
                
            </div>
        )
    }

}

export default ForumFlagged;