import { Container, Row, Col, Table } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';

class Forum extends Component {
    constructor() {
        super();
        this.state = {
            questionId: "",
            entry: "",
            posterName: "",
            dateTime: "",
            noOfComments: "",
            deleted: "",
            posterId: "",
            reported: "",
            questions: "",
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
        const userRef = db.collection("Forum");
        const question = [];

        userRef.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                userRef.doc(doc.id).collection("Questions").get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        const data = {
                            questionId: doc.id,
                            entry: doc.data().entry,
                            posterName: doc.data().posterName,
                            dateTime: doc.data().dateTime,
                            noOfComments: doc.data().noOfComments,
                            deleted: doc.data().deleted,
                            posterId: doc.data().posterId,
                            reported: doc.data().reported,
                        };
                        question.push(data);
                    });
                    this.setState({ questions: question });
                });
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
                                                <h4 id="Forum-title">Forum</h4>
                                            </Col>
                                        </Row>
                                        
                                        <Row id="Forum-secondRow">
                                            <Col md={12} className="text-center" id="Forum-secondRowCol">
                                                <Table responsive="sm" bordered id="Forum-tableContainer">
                                                    <thead id="Forum-tableHeader">
                                                        <tr>
                                                            <th>S/N</th>
                                                            <th>Question</th>
                                                            <th>Posted By</th>
                                                            <th>Date/Time</th>
                                                            <th>No. of Comments</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="Forum-tableBody">
                                                    {this.state.questions &&
                                                    this.state.questions.map((questions, index) => {
                                                        if (questions.deleted === false) {
                                                            return (
                                                                <tr>
                                                                <td>{index + 1}</td>
                                                                <td className="text-left">
                                                                    <a className="Forum-question" href={"/ViewForumQuestion?id=" + questions.questionId}>
                                                                    {questions.entry}
                                                                    </a>
                                                                </td>
                                                                <td>{questions.posterName}</td>
                                                                <td>{questions.dateTime}</td>
                                                                <td>{questions.noOfComments}</td>
                                                                </tr>
                                                            );
                                                        } else {
                                                            return (
                                                                <tr>
                                                                <td>{index + 1}</td>
                                                                <td className="text-left">
                                                                    <a className="Forum-question" href={"/ViewForumQuestion?id=" + questions.questionId}>
                                                                    [Deleted]
                                                                    </a>
                                                                </td>
                                                                <td>{questions.posterName}</td>
                                                                <td>{questions.dateTime}</td>
                                                                <td>{questions.noOfComments}</td>
                                                                </tr>
                                                            );
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
            </div>
        )
    }

}

export default Forum;