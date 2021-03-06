import React from 'react';
import { Modal,Button, Col, Row } from 'react-bootstrap';

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../css/Marketing_Administrator/PastRecModals.css";

export default class DeletePastRecModal extends React.Component {
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
                    <Modal.Title id="deletePastRecModalTitle">
                        Delete Recording
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>       
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deletePastRecModalCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>     

                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deletePastRecModalCol">
                            <h5 id="deletePastRecModalText">Are you sure you want to remove this recording?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="6" className="text-right deletePastRecModalCol">
                            <Button type="submit" id="confirmDeletePastRecModalBtn" onClick={this.props.handleConfirmDelete}>Confirm</Button>
                        </Col>

                        <Col md="6" className="text-left deletePastRecModalCol">
                            <Button id="cancelDeletePastRecModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}

