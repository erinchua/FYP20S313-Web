import { Container, Row, Col, Table, Form, Modal, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class ForumSettings extends Component {

    constructor() {
        super();
        this.state = {
            checked: false,
            text: "Disable",
            confirmModal: false,
        };
    }

    //Confirm Disable Forum Modal
    handleToggle = () => {
        this.confirmModal = this.state.confirmModal;
        this.checked = this.state.checked;

        if (this.confirmModal == false && this.checked == false) {
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
                checked: false,
                text: "Disable",
                confirmModal: false,
            });
        }
    }

    //OnClick Method for Confirm Button
    onClickConfirm = () => {
        this.checked = this.state.checked;
        this.text = this.state.text;
        this.confirmModal = this.state.confirmModal;

        this.setState({
            checked: true,
            text: "Enable",
            confirmModal: false,
        });
        console.log("Forum Disabled")
    }

    //OnClick Method for Cancel Button
    onClickCancel = () => {
        this.checked = this.state.checked;
        this.text = this.state.text;
        this.confirmModal = this.state.confirmModal;
        this.setState({
            checked: false,
            text: "Disable",
            confirmModal: false,
        });
        console.log("Forum Enabled")
    }

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
                                                            <td className="text-left ForumSettings-text">{this.state.text} Forum</td>
                                                            <td className="text-right"><Form><Form.Check type="switch" id="ForumSettings-switch" checked={this.state.checked} onChange={this.handleToggle} label="" /></Form></td>
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

                {this.state.confirmModal == true ? 
                    <Modal show={this.state.confirmModal} onHide={this.handleToggle} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumSettings-switchModalCol">
                                    <FontAwesomeIcon size="3x" icon={faTimesCircle}/>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={12} className="text-center ForumSettings-switchModalCol">
                                    <h5 id="ForumSettings-switchText">Are you sure you want to {this.state.text} the forum?</h5>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={6} className="text-right ForumSettings-switchModalCol">
                                    <Button id="ForumSettings-switchConfirmBtn" onClick={this.onClickConfirm}>Confirm</Button>
                                </Col>
                                <Col md={6} className="text-left ForumFlagged-switchModalCol">
                                    <Button id="ForumSettings-switchCancelBtn" onClick={this.onClickCancel}>Cancel</Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>: ''
                }

            </div>
        )
    }

}

export default ForumSettings;