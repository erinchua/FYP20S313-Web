import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Table } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/OpenHouseFeedback.css";

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';


class OpenHouseFeedback extends Component {
    constructor() {
        super();
        this.state = {
            attendedDate: "",
            natureOfFeedback: "",
            feedbackDescription: "",
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
        var counter = 1;
        db
        .collection("Feedback")
        .get()
        .then((snapshot) => {
            const feedback = [];
            snapshot.forEach((doc) => {
                const data = {
                    attendedDate: doc.data().attendedDate,
                    natureOfFeedback: doc.data().natureOfFeedback,
                    feedbackDescription: doc.data().feedbackDescription,
                    id: doc.id,
                    counter: counter,
                };
                counter++;
                feedback.push(data);
            });
            this.setState({ feedback: feedback });
        });
    }


    render() {
        return (
            <div>
                <Container fluid className="openhouseFeedbackCon">
                    <NavBar isMA={true} />

                        <Container fluid className="openhouseFeedbackContent">
                            <Row>
                                {/* SideNavBar Col */}
                                <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                                    <SideNavBar />
                                </Col>

                                {/* Contents Col */}
                                <Col md="10" style={{paddingLeft:"0"}}>
                                    <Container fluid className="openhouseFeedbackContentCon">
                                        {/* Openhouse Feedback Page Header row */}
                                        <Row id="openhouseFeedbackContentHeaderRow" className="justify-content-center">
                                            <Col md="12" className="text-left openhouseFeedbackContentHeaderCol">
                                                <h4 id="openhouseFeedbackHeaderText">Open House Feedbacks</h4>
                                            </Col>
                                        </Row>

                                        {/* Openhouse Feedback Table */}
                                        <Row id="openhouseFeedbackTableRow" className="justify-content-center">
                                            <Col md="12">
                                                <Table responsive="sm" bordered id="openhouseFeedbackTable">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th id="openhouseFeedbackHeader_SNo" className="text-center">S/N</th>
                                                            <th id="openhouseFeedbackHeader_AttendedDate" className="text-center">Attended Open House Date</th>
                                                            <th id="openhouseFeedbackHeader_Nature" className="text-center">Nature of Feedback</th>
                                                            <th id="openhouseFeedbackHeader_Feedback" className="text-center">Feedback/Comments</th>
                                                        </tr>
                                                    </thead>
                                                    
                                                    <tbody>
                                                        {this.state.feedback && this.state.feedback.map((feedback) => {
                                                            return (
                                                            <tr key={feedback.id}>
                                                                <td id="openhouseFeedbackData_SNo" className="text-center">{feedback.counter}</td>
                                                                <td id="openhouseFeedbackData_AttendedDate" className="text-center">{feedback.attendedDate}</td>
                                                                <td id="openhouseFeedbackData_Nature" className="text-center">{feedback.natureOfFeedback}</td>
                                                                <td id="openhouseFeedbackData_Feedback" className="text-left">{feedback.feedbackDescription}</td>
                                                            </tr>
                                                            );
                                                        })}
                                                    </tbody>

                                                </Table>
                                            </ Col>
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

export default OpenHouseFeedback;
