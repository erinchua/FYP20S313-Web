import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal, Tabs, Tab, Nav, NavItem } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/Study@SIM.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import AddProgTalkModal from "../../../components/Marketing_Administrator/AddProgTalkModal";
import EditProgTalkModal from "../../../components/Marketing_Administrator/EditProgTalkModal";
import DeleteProgTalkModal from "../../../components/Marketing_Administrator/DeleteProgTalkModal";


class StudySIM_ArtsSocialSciences extends Component {
  constructor() {
    super();
    this.state = {
      addStudySIMProgModal: false,
      editProgTalkModal: false,
      deleteProgTalkModal: false,
    };
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();
        var getrole = db
          .collection("Administrators")
          .where("email", "==", user.email);
        getrole.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().administratorType === "Marketing Administrator") {
              this.display();
            } else {
              history.push("/Login");
            }
          });
        });
      } else {
        history.push("/Login");
      }
    });
  }

  componentDidMount() {
    this.authListener();
  }

  /* Add Programme Talk Modal */
  handleAddStudySIMProgModal = () => {
    if (this.state.addStudySIMProgModal == false) {
      this.setState({
        addStudySIMProgModal: true,
      });
    }
    else {
      this.setState({
        addStudySIMProgModal: false
      });
    }
  };

  /* Edit Programme Talk Modal */
  handleEditProgTalkModal = () => {
    if (this.state.editProgTalkModal == false) {
      this.setState({
        editProgTalkModal: true,
      });
    }
    else {
      this.setState({
        editProgTalkModal: false
      });
    }
  };

  /* Delete Programme Talk Modal */
  handleDeleteProgTalkModal = () => {
    if (this.state.deleteProgTalkModal == false) {
      this.setState({
        deleteProgTalkModal: true,
      });
    }
    else {
      this.setState({
        deleteProgTalkModal: false
      });
    }
  };


  render() {
    return (
      <div>
        <Container fluid className="MAStudySIMCon">
          <NavBar isMA={true} />

          <Container fluid className="MAStudySIMContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAStudySIMContentCon">
                    {/* Study@SIM Page Header row */}
                    <Row className="justify-content-center MAStudySIMContentHeaderRow">
                        <Col md="6" className="text-left MAStudySIMContentHeaderCol">
                        <h4 className="MAStudySIMHeaderText">Programmes for Arts & Social Sciences</h4>
                        </Col>

                        <Col md="6" className="text-right MAStudySIMContentHeaderCol">
                        <Button className="addStudySIMProgBtn" onClick={this.handleAddStudySIMProgModal}>
                            <FontAwesomeIcon size="lg" className="addStudySIMProgBtnIcon" icon={faPlus} />
                            <span className="addStudySIMProgBtnText">Add</span>
                        </Button>
                        </Col>
                    </Row>

                    {/* Table Row */}
                    <Row className="justify-content-center MAStudySIMTableRow">
                        <Col md="12" className="text-center">
                            <Table responsive="sm" hover bordered className="MAStudySIMTable">
                                <thead>
                                    <tr>
                                        <th className="studySIMProgHeader_SNo">S/N</th>
                                        <th className="studySIMProgHeader_ProgName">Programme Name</th>
                                        <th className="studySIMProgHeader_AwardedBy">Awarded By</th>
                                        <th className="studySIMProgHeader_LogoFile">Logo File</th>
                                        <th className="studySIMProgHeader_Category">Category</th>
                                        <th className="studySIMProgHeader_MoS">Mode of Study</th>
                                        <th className="studySIMProgHeader_Discipline">Disciplines</th>
                                        <th className="studySIMProgHeader_AcademicLvl">Academic Level</th>
                                        <th className="studySIMProgHeader_EntryQual">Entry Qualifications</th>
                                        <th className="studySIMProgHeader_SubDiscipline">Sub-Disciplines</th>
                                        <th className="studySIMProgHeader_Edit">Edit</th>
                                        <th className="studySIMProgHeader_Delete">Delete</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="studySIMProgData_SNo text-center">S/N</td>
                                        <td className="studySIMProgData_ProgName text-left">Programme Name</td>
                                        <td className="studySIMProgData_AwardedBy text-left">Awarded By</td>
                                        <td className="studySIMProgData_LogoFile text-left">Logo File</td>
                                        <td className="studySIMProgData_Category text-left">Category</td>
                                        <td className="studySIMProgData_MoS text-left">Mode of Study</td>
                                        <td className="studySIMProgData_Discipline text-left">Disciplines</td>
                                        <td className="studySIMProgData_AcademicLvl text-left">Academic Level</td>
                                        <td className="studySIMProgData_EntryQual text-left">Entry Qualifications</td>
                                        <td className="studySIMProgData_SubDiscipline text-left">Sub-Disciplines</td>
                                        <td className="studySIMProgData_Edit text-center">
                                            <Button className="editStudySIMProgBtn" onClick={this.handleEditStudySIMProgModal}>
                                                <FontAwesomeIcon size="lg" className="editStudySIMProgBtnIcon" icon={faEdit} />
                                            </Button>
                                        </td>
                                        <td className="studySIMProgData_Delete text-center">
                                            <Button className="deleteStudySIMProgBtn" onClick={this.handleDeleteStudySimProgModal}>
                                                <FontAwesomeIcon size="lg" className="deleteStudySIMProgBtnIcon" icon={faTrashAlt} />
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>

                            </Table>
                        </Col>
                    </Row>

                </Container>
              </Col>

            </Row>
          </Container>

          <Footer />
        </Container>


        {/* Add Programme Talk Modal */}
        <Modal 
          show={this.state.addStudySIMProgModal}
          onHide={this.handleAddStudySIMProgModal}
          aria-labelledby="addProgTalkModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
        >
          <AddProgTalkModal />
        </Modal>

        {/* Edit Programme Talk Modal */}
        {/* <Modal 
          show={this.state.editProgTalkModal}
          onHide={this.handleEditProgTalkModal}
          aria-labelledby="editProgTalkModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
        >
          <EditProgTalkModal />
        </Modal> */}

        {/* Delete Programme Talk Modal */}
        {/* <Modal 
          show={this.state.deleteProgTalkModal}
          onHide={this.handleDeleteProgTalkModal}
          aria-labelledby="deleteProgTalkModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteProgTalkModal handleConfirmDelete={ (e) => {this.DeleteProgrammeTalk(e, this.state.id)} } handleCancelDelete={this.handleDeleteProgTalkModal} />
        </Modal> */}


      </div>
    );
  }
}
export default StudySIM_ArtsSocialSciences;