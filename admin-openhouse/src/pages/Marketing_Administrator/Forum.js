import { Container, Row, Col, Table, Nav } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';

class Forum extends Component {

    render() {
        return (
            <div>
                <Container fluid className="Forum-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Forum-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row style={{ marginRight: 0 }}>
                                <Col md={2}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} id="Forum-topContentContainer">
                                    <Container fluid id="Forum-topContentContainer">
                                        <Row id="Forum-firstRow">
                                            <Col md={12} id="Forum-firstRowCol">
                                                <p id="Forum-title">Forum</p>
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
                                                            <td className="Forum-question"><a href="" className="Forum-questionLink">Anyone going for the Digital Systems Security (University of Wollongong) programme talk?</a></td>
                                                            <td>Martin John</td>
                                                            <td>20th November 2020, 8.55pm</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td className="Forum-question"><a href="" className="Forum-questionLink">Where's the ATM?</a></td>
                                                            <td>John Tan</td>
                                                            <td>21st November 2020, 10.00am</td>
                                                            <td>1</td>
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
            </div>
        )
    }

}

export default Forum;