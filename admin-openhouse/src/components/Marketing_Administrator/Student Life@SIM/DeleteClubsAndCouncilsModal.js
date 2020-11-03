import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/ArtsAndCulture.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

class DeleteClubsAndCouncilsModal extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.id)
        console.log(this.props.categoryType)
        console.log(this.props.clubsAndCouncilTitle)
        this.state = {
            handleDelete: "",
        }
    }

    deleteClubsCouncils() {
        const db = fire.firestore();
        const storage = fire.storage().ref(`/ClubsAndCouncil/${this.props.categoryType}`).child(this.props.clubsAndCouncilTitle);

        db.collection("ClubsAndCouncils").doc(this.props.id).delete()
        .then(dataSnapshot => {
            console.log("Deleted the Club/Council");
            storage.delete().then(dataSnapshot => {
                console.log("Deleted Image in Storage");
                this.props.handleDelete();
                window.location.reload();
            });
        });
    }

    render(){
        return(
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="ArtsCulture-modalTitle" className="w-100">Delete Club/Council</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-center">
                        <Col md={12} className="text-center ArtsCulture-deleteFooterCol">
                            <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={12} className="text-center ArtsCulture-deleteFooterCol">
                            <h5 id="ArtsCulture-deleteText">Do you want to delete this club/council?</h5>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={6} className="text-right ArtsCulture-deleteFooterCol">
                            <Button id="ArtsCulture-deleteConfirmBtn" onClick={() => this.deleteClubsCouncils()}>Confirm</Button>
                        </Col>
                        <Col md={6} className="text-left ArtsCulture-deleteFooterCol">
                            <Button id="ArtsCulture-deleteCancelBtn" onClick={() => this.props.handleDelete()}>Cancel</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        )
    }
}
export default DeleteClubsAndCouncilsModal;