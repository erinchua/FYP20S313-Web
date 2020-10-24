import React from 'react';
import { Modal,Button, Col, Row } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/DeleteProgTalkModal.css";

export default class DeleteProgTalkModal extends React.Component {
    constructor() {
        super();
        this.state = {
            handleConfirmDelete: "",
            handleCancelDelete: "",
        }
    }

    render(){
        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="deleteProgTalkModalTitle">
                        Delete Programme Talk
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>                    
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteProgTalkModalCol">
                            <h5 id="deleteProgTalkModalText">Are you sure you want to remove this programme talk?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="6" className="text-right deleteProgTalkModalCol">
                            <Button type="submit" id="confirmDeleteProgTalkModalBtn" onClick={this.props.handleConfirmDelete}>Confirm</Button>
                        </Col>

                        <Col md="6" className="text-left deleteProgTalkModalCol">
                            <Button id="cancelDeleteProgTalkModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}

