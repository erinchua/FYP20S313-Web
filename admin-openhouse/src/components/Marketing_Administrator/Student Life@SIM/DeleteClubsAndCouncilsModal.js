import { Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/StudentLife.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

class DeleteClubsAndCouncilsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handleDelete: "",
        }
    }

    deleteClubsCouncils() {

        var title = this.props.clubsAndCouncilsLogo.split(/\%2..*%2F(.*?)\?alt/)[1].split(".")[0]
        var res = this.props.clubsAndCouncilsLogo.split("?alt=")[0];
        var extension = res.substr(res.length - 4);

        if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
            var fileName = title;
            const store = storage.ref(`/ClubsAndCouncil/${this.props.categoryType}`).child(fileName);

            db.collection("ClubsAndCouncils").doc(this.props.id).delete()
            .then(() => {
                store.delete().then(() => {
                    this.props.handleDelete();
                });
            });
            
        } else {
            var fileName = title + extension;
            const store = storage.ref(`/ClubsAndCouncil/${this.props.categoryType}`).child(fileName);

            db.collection("ClubsAndCouncils").doc(this.props.id).delete()
            .then(() => {
                store.delete().then(() => {
                    this.props.handleDelete();
                });
            });
            
        }
    }

    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="StudentLife-modalTitle" className="w-100">Delete Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-center">
                        <Col md={12} className="text-center StudentLife-deleteFooterCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={12} className="text-center StudentLife-deleteFooterCol">
                            <h5 id="StudentLife-deleteText">Do you want to delete this club/council?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={6} className="text-right StudentLife-deleteFooterCol">
                            <Button id="StudentLife-deleteConfirmBtn" onClick={() => this.deleteClubsCouncils()}>Confirm</Button>
                        </Col>
                        <Col md={6} className="text-left StudentLife-deleteFooterCol">
                            <Button id="StudentLife-deleteCancelBtn" onClick={() => this.props.handleDelete()}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}
export default DeleteClubsAndCouncilsModal;