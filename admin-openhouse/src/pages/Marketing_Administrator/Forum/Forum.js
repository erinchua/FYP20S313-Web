import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

class Forum extends Component {

    constructor() {
        super();
        this.state = {
            viewQuestion: false,
        }
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

                                {this.state.viewQuestion == false ? 
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
                                                            <tr>
                                                                <td>1</td>
                                                                <td className="Forum-question" onClick={() => this.setState({viewQuestion: true})}>Anyone going for the Digital Systems Security (University of Wollongong) programme talk?</td>
                                                                <td>Martin John</td>
                                                                <td>20th November 2020, 8.55pm</td>
                                                                <td>0</td>
                                                            </tr>
                                                            <tr>
                                                                <td>2</td>
                                                                <td className="Forum-question">Where's the ATM?</td>
                                                                <td>John Tan</td>
                                                                <td>21st November 2020, 10.00am</td>
                                                                <td>1</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col> : 
                                    (
                                        <Col md={10} style={{paddingLeft: 0}}>
                                            <Container fluid id="Forum-topContentContainer">
                                                <Row id="ViewForum-firstRow">
                                                    <Col md={12}>
                                                        <Row>
                                                            <Button size="sm" id="ViewForum-backBtn" onClick={() => this.setState({viewQuestion: false})}><FontAwesomeIcon size="sm" icon={faHandPointLeft}/><span id="ViewForum-backText">Return to Forum</span></Button>
                                                        </Row>
                                                        <Row className="ViewForum-questionCon">
                                                            <h6>Anyone going for the Digital Systems Security (University of Wollongong) programme talk?</h6>
                                                        </Row>
                                                        <Row className="ViewForum-questionDetailsCon">
                                                            <Col md={6} className="text-left">
                                                                <p><b>Date/Time Posted: </b><span>20th November 2020, 8.55am</span></p>
                                                            </Col>
                                                            <Col md={6} className="text-right">
                                                                <p><b>Posted by: </b><span>Martin John</span></p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                <Row id="ViewForum-secondRow">
                                                    <p id="ViewForum-secondRowText">Comments</p>
                                                </Row>

                                                <Row id="ViewForum-thirdRow">
                                                    <Col md={12}>
                                                        <Row className="ViewForum-commentCon">
                                                            <p>[Deleted]</p>
                                                        </Row>
                                                        <Row className="ViewForum-commentDetailsCon">
                                                            <Col md={6} className="text-left">
                                                                <p><b>Date/Time Posted: </b><span>20th November 2020, 4.55pm</span></p>
                                                            </Col>
                                                            <Col md={6} className="text-right">
                                                                <p><b>Posted by: </b><span>John Tan</span></p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="ViewForum-replyRow justify-content-center">
                                                            <Col md={11} className="ViewForum-replyCol">
                                                                <Row className="ViewForum-replyInnerCon">
                                                                    <p>Me too!</p>
                                                                </Row>
                                                                <Row className="ViewForum-replyInnerDetailsCon">
                                                                    <Col md={6} className="text-left">
                                                                        <p><b>Date/Time Posted: </b><span>21st November 2020, 8.35am</span></p>
                                                                    </Col>
                                                                    <Col md={6} className="text-right">
                                                                        <p><b>Posted by: </b><span>Winston Obama</span></p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Col>
                                    )
                                }

                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>
            </div>
        )
    }

}

export default Forum;