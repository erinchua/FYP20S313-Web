import React from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';

import { auth, db } from "../../config/firebase";
import history from "../../config/history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../css/Marketing_Administrator/AnnouncementModals.css";

export default class DeleteAnnouncementModal extends React.Component {
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
                    <Modal.Title id="deleteAnnouncementModalTitle">
                        Delete Announcement
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>      
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteAnnouncementModalCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>      

                    <Row className="justify-content-center">
                        <Col md="12" className="text-center deleteAnnouncementModalCol">
                            <h5 id="deleteAnnouncementModalText">Are you sure you want to remove this announcement?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="6" className="text-right deleteAnnouncementModalCol">
                            <Button type="submit" id="confirmDeleteAnnouncementModalBtn" onClick={this.props.handleConfirmDelete}>Confirm</Button>
                        </Col>

                        <Col md="6" className="text-left deleteAnnouncementModalCol">
                            <Button id="cancelDeleteAnnouncementModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}