import React from 'react';
import { Modal,Button, Col, Row } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../css/Marketing_Administrator/ProgTalkModals.css";

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
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>      

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

