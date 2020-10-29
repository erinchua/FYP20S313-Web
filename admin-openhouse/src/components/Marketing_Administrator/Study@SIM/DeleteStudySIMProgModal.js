import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/DeleteStudySIMProgModal.css";

export default class DeleteStudySIMProgModal extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.docid);
    this.state = {
      handleConfirmDelete: "",
      handleCancelDelete: "",
    };
  }
  delete() {
    var a = this;
    const db = fire.firestore();

    const userRef = db
      .collection("Programmes")
      .doc(this.props.docid)
      .delete()
      .then(function () {
        // a.props.handleConfirmDelete();
        alert("Deleted");
      });
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
              <h5 id="deleteStudySIMProgModalText">
                Are you sure you want to remove this programme?
              </h5>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md="6" className="text-right deleteStudySIMProgModalCol">
              <Button
                id="confirmDeleteStudySIMProgModalBtn"
                onClick={() => {
                  this.delete();
                  this.props.handleConfirmDelete();
                }}
              >
                Confirm
              </Button>
            </Col>

            <Col md="6" className="text-left deleteStudySIMProgModalCol">
              <Button
                id="cancelDeleteStudySIMProgModalBtn"
                onClick={this.props.handleCancelDelete}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </div>
    );
  }
}
