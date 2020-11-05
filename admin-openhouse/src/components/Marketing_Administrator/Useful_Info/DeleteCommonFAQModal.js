import React from 'react';
import { Modal,Button, Col, Row } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../css/Marketing_Administrator/CommonFAQsModal.css";

export default class DeleteCommonFAQModal extends React.Component {
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
                    <Modal.Title id="deleteCommonFAQModalTitle">
                        Delete FAQ
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>                 
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteCommonFAQModalCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>    

                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteCommonFAQModalCol">
                            <h5 id="deleteCommonFAQModalText">Are you sure you want to remove this FAQ?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="6" className="text-right deleteCommonFAQModalCol">
                            <Button type="submit" id="confirmDeleteCommonFAQModalBtn" onClick={this.props.handleConfirmDelete}>Confirm</Button>
                        </Col>

                        <Col md="6" className="text-left deleteCommonFAQModalCol">
                            <Button id="cancelDeleteCommonFAQModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}

