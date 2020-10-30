import React from 'react';
import { Modal,Button, Col, Row } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../css/Marketing_Administrator/LiveTalkModals.css";

export default class DeleteLiveTalkModal extends React.Component {
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
                    <Modal.Title id="deleteLiveTalkModalTitle">
                        Delete Live Talk
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>                 
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteLiveTalkModalCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>    

                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteLiveTalkModalCol">
                            <h5 id="deleteLiveTalkModalText">Are you sure you want to remove this live talk?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="6" className="text-right deleteLiveTalkModalCol">
                            <Button type="submit" id="confirmDeleteLiveTalkModalBtn" onClick={this.props.handleConfirmDelete}>Confirm</Button>
                        </Col>

                        <Col md="6" className="text-left deleteLiveTalkModalCol">
                            <Button id="cancelDeleteLiveTalkModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}

