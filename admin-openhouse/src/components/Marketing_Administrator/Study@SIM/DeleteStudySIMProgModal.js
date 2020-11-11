import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../css/Marketing_Administrator/DeleteStudySIMProgModal.css";

export default class DeleteStudySIMProgModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docid: this.props.docid,

      handleConfirmDelete: "",
      handleCancelDelete: "",
    };
  }

  deleteProgramme() {
    var title = this.props.logoUrl.split(/\%2F(.*?)\?alt/)[1].split(".")[0]
    var res = this.props.logoUrl.split("?alt=")[0];
    var extension = res.substr(res.length - 4);

    if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
      var fileName = title;
      const store = storage.ref(`/Universities/`).child(fileName);

      db.collection("ProgrammesWeb")
      .doc(this.props.docid).delete()
      .then(dataSnapshot => {
          // console.log("Deleted programme");
          store.delete().then(dataSnapshot => {
              // console.log("Deleted Image in Storage");
              this.props.handleConfirmDelete();
          });
      }); 
    } 
    else {
      var fileName = title + extension;
      const store = storage.ref(`/Universities/`).child(fileName);

      db.collection("ProgrammesWeb")
      .doc(this.props.docid).delete()
      .then(dataSnapshot => {
        // console.log("Deleted programme");
        store.delete().then(dataSnapshot => {
            // console.log("Deleted Image in Storage");
            this.props.handleConfirmDelete();
        });
      });
    }
  }

  
  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title id="deleteStudySIMProgModalTitle">
            Delete Programme
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-center">
            <Col md="12" className="text-center deleteStudySIMProgModalCol">
              <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
            </Col>
          </Row>     

          <Row className="justify-content-center">
            <Col md="12" className="text-center deleteStudySIMProgModalCol">
              <h5 id="deleteStudySIMProgModalText">Are you sure you want to remove this programme?</h5>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md="6" className="text-right deleteStudySIMProgModalCol">
              <Button id="confirmDeleteStudySIMProgModalBtn" onClick={() => {this.deleteProgramme()}}>Confirm</Button>
            </Col>

            <Col md="6" className="text-left deleteStudySIMProgModalCol">
              <Button id="cancelDeleteStudySIMProgModalBtn" onClick={this.props.handleCancelDelete}>Cancel</Button>
            </Col>
          </Row>
        </Modal.Body>
      </div>
    );
  }
}
