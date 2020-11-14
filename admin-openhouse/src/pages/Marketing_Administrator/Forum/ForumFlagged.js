import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/Forum.css";
import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

class ForumFlagged extends Component {
    constructor() {
        super();
        this.state = {
            //Questions states
            questionId: "",
            entry: "", 
            isDeleted: "",
            postedBy: "",
            dateTime: "",
            noOfComments: "",
            posterId: "",
            posterName: "",
            reported: "",
            questions: "",
            //Reports states
            dateTime: "",
            entry: "",
            reportId: "",
            offender: "",
            offenderId: "",
            postContent: "",
            postId: "",
            postType: "",
            reporter: "",
            reporterId: "",
            reports: "",
            //Comments states
            commentId: "",
            dateTime: "",
            isDeleted: "",
            entry: "",
            noOfReplies: "",
            posterId: "",
            posterName: "",
            commentQnsId: "",
            reported: "", 
            comments: "",
            //Below states are for the modals
            removeModal: false,
            keepModal: false,
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

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
        db.collectionGroup("Reports").onSnapshot((snapshot) => {
            const reportsCollection = [];

            snapshot.forEach((doc) => {
                const data = {
                    dateTime: doc.data().dateTime,
                    entry: doc.data().entry,
                    reportId: doc.id,
                    offender: doc.data().offender,
                    offenderId: doc.data().offenderId,
                    postContent: doc.data().postContent,
                    postId: doc.data().postId,
                    postType: doc.data().postType,
                    reporter: doc.data().reporter,
                    reporterId: doc.data().reporterId,
                };
                reportsCollection.push(data);
                this.setState({ 
                    reports: reportsCollection,
                });
            });
        });

        db.collectionGroup("Questions").onSnapshot((snapshot) => {
            const questionsCollection = [];

            snapshot.forEach((doc) => {
                const data = {
                    questionId: doc.id,
                    entry: doc.data().entry,
                    isDeleted: doc.data().deleted,
                    postedBy: doc.data().posterName,
                    dateTime: doc.data().dateTime,
                    noOfComments: doc.data().noOfComments,
                    posterId: doc.data().posterId,
                    posterName: doc.data().posterName,
                    reported: doc.data().reported,
                }
                questionsCollection.push(data);
                this.setState({
                    questions: questionsCollection,
                });
            });
        });

        db.collectionGroup("Comments").onSnapshot((snapshot) => {
            const commentsCollection = [];

            snapshot.forEach((doc) => {
                const data = {
                    commentId: doc.id,
                    dateTime: doc.data().dateTime,
                    isDeleted: doc.data().deleted,
                    entry: doc.data().entry,
                    noOfReplies: doc.data().noOfReplies,
                    posterId: doc.data().posterId,
                    posterName: doc.data().posterName,
                    commentQnsId: doc.data().questionId,
                    reported: doc.data().reported, 
                }
                commentsCollection.push(data);
                this.setState({
                    comments: commentsCollection,
                });
            });
        })

    }

    //Remove Post Modal
    handleRemoveModal = (type, parameter) => {
        this.removeModal = this.state.removeModal;
        if (this.removeModal == false) {
            this.setState({
                removeModal: true,
                postType: type,
            });

            if (type === "Question") {
                this.setState({
                    questionId: parameter.questionId
                });
            } else {
                this.setState({
                    commentId: parameter.commentId
                });
            }

        } else {
            this.setState({
                removeModal: false,
            });
        }
    };

    //Keep Post Modal
    handleKeepModal = (type, parameter) => {
        this.keepModal = this.state.keepModal;
        if (this.keepModal == false) {
            this.setState({
                keepModal: true,
                postType: type,
            });

            if (type === "Question") {
                this.setState({
                    questionId: parameter.questionId
                });
            } else {
                this.setState({
                    commentId: parameter.commentId
                });
            }

        } else {
            this.setState({
                keepModal: false,
            });
        }
    };

    removePost = (id) => {
        if (id === this.state.questionId) {
            db.collectionGroup("Questions").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id === id) {
                        doc.ref
                        .update({
                            deleted: true,
                        })
                        .then(() => {
                            this.display();
                            this.setState({
                                removeModal: false,
                            });
                        });
                    }
                });
            });
        }

        if (id === this.state.commentId) {
            db.collectionGroup("Comments").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id === id) {
                        doc.ref
                        .update({
                            deleted: true,
                        })
                        .then(() => {
                            this.display();
                            this.setState({
                                removeModal: false,
                            });
                        });
                    }
                });
            });
        }
    }

    keepPost = (id) => {
        if (id === this.state.questionId) {
            db.collectionGroup("Questions").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id === id) {
                        doc.ref
                        .update({
                            deleted: false,
                            reported: false,
                        })
                        .then(() => {
                            this.display();
                            this.setState({
                                keepModal: false,
                            });
                        });
                    }
                });
            });
        }

        if (id === this.state.commentId) {
            db.collectionGroup("Comments").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id === id) {
                        doc.ref
                        .update({
                            deleted: false,
                            reported: false,
                        })
                        .then(() => {
                            this.display();
                            this.setState({
                                keepModal: false,
                            });
                        });
                    }
                });
            });
        }
    }

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
                                                            <th id="ForumFlagged-questionsComments">Question/Comment</th>
                                                            <th id="ForumFlagged-reasons">Reason</th>
                                                            <th id="ForumFlagged-type">Type</th>
                                                            <th id="ForumFlagged-postedBy">Posted By</th>
                                                            <th id="ForumFlagged-dateTime">Date/Time</th>
                                                            <th id="ForumFlagged-comments">No. of Comments/Replies</th>
                                                            <th id="ForumFlagged-icons">Remove Post</th>
                                                            <th id="ForumFlagged-icons">Keep Post</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="Forum-tableBody">
                                                        {this.state.reports && this.state.reports.map((rep) => {
                                                            if (rep.postType === "Question") {
                                                                return (
                                                                    <tr>
                                                                        {this.state.questions && this.state.questions.map((qns) => {
                                                                            if (rep.postId == qns.questionId && qns.reported == true && qns.isDeleted != true) {
                                                                                return (
                                                                                    <>
                                                                                        <td>{rep.postContent}</td>
                                                                                        <td>{rep.entry}</td>
                                                                                        <td>{rep.postType}</td>
                                                                                        <td>{rep.offender}</td>
                                                                                        <td>{qns.dateTime}</td>
                                                                                        <td>{qns.noOfComments}</td>
                                                                                        <td>
                                                                                            <Button size="lg" id="ForumFlagged-removeBtn" onClick={() => this.handleRemoveModal(rep.postType, qns)}><FontAwesomeIcon size="lg" icon={faTimesCircle}/></Button>
                                                                                        </td>
                                                                                        <td>
                                                                                            <Button size="lg" id="ForumFlagged-keepBtn" onClick={() => this.handleKeepModal(rep.postType, qns)}><FontAwesomeIcon size="lg" icon={faCheckCircle} /></Button>
                                                                                        </td>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </tr>
                                                                )
                                                            } else {
                                                                return (
                                                                    <tr>
                                                                        {this.state.comments && this.state.comments.map((comments) => {
                                                                            if (rep.postId == comments.commentId && comments.reported == true && comments.isDeleted != true) {
                                                                                return (
                                                                                    <>
                                                                                        <td>{rep.postContent}</td>
                                                                                        <td>{rep.entry}</td>
                                                                                        <td>{rep.postType}</td>
                                                                                        <td>{rep.offender}</td>
                                                                                        <td>{comments.dateTime}</td>
                                                                                        <td>{comments.noOfReplies}</td>
                                                                                        <td>
                                                                                            <Button size="lg" id="ForumFlagged-removeBtn" onClick={() => this.handleRemoveModal(rep.postType, comments)}><FontAwesomeIcon size="lg" icon={faTimesCircle}/></Button>
                                                                                        </td>
                                                                                        <td>
                                                                                            <Button size="lg" id="ForumFlagged-keepBtn" onClick={() => this.handleKeepModal(rep.postType, comments)}><FontAwesomeIcon size="lg" icon={faCheckCircle} /></Button>
                                                                                        </td>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </tr>
                                                                )
                                                            }
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

                {this.state.removeModal == true ? (
                    <Modal show={this.state.removeModal} onHide={this.handleRemoveModal} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-removeModalCol" >
                                    <FontAwesomeIcon size="3x" icon={faTimesCircle} />
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-removeModalCol" >
                                    <h5 id="ForumFlagged-removeText">Do you want to delete this post?</h5>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                {this.state.postType === "Question" ?
                                    <Col md={6} className="text-right ForumFlagged-removeModalCol">
                                        <Button id="ForumFlagged-removeConfirmBtn" onClick={() => this.removePost(this.state.questionId)}>Confirm</Button>
                                    </Col> 
                                    : 
                                    <Col md={6} className="text-right ForumFlagged-removeModalCol">
                                        <Button id="ForumFlagged-removeConfirmBtn" onClick={() => this.removePost(this.state.commentId)}>Confirm</Button>
                                    </Col>
                                }
                                <Col md={6} className="text-left ForumFlagged-removeModalCol">
                                    <Button id="ForumFlagged-removeCancelBtn" onClick={this.handleRemoveModal}>Cancel</Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                ) : ("")}

                {this.state.keepModal == true ? (
                    <Modal show={this.state.keepModal} onHide={this.handleKeepModal} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-keepModalCol">
                                    <FontAwesomeIcon size="3x" icon={faCheckCircle} />
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumFlagged-keepModalCol">
                                    <h5 id="ForumFlagged-keepText">Do you want to keep this post?</h5>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                {this.state.postType === "Question" ?
                                    <Col md={6} className="text-right ForumFlagged-removeModalCol">
                                        <Button id="ForumFlagged-removeConfirmBtn" onClick={() => this.keepPost(this.state.questionId)}>Confirm</Button>
                                    </Col> 
                                    : 
                                    <Col md={6} className="text-right ForumFlagged-removeModalCol">
                                        <Button id="ForumFlagged-removeConfirmBtn" onClick={() => this.keepPost(this.state.commentId)}>Confirm</Button>
                                    </Col>
                                }
                                <Col md={6} className="text-left ForumFlagged-keepModalCol">
                                    <Button id="ForumFlagged-keepCancelBtn" onClick={this.handleKeepModal}>Cancel</Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                ) : ("")}
            </div>
        );
    }
}

export default ForumFlagged;