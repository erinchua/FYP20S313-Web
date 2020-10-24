import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/Study@SIM.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import AddStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/AddStudySIMProgModal";
import EditStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/EditStudySIMProgModal";
import DeleteStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/DeleteStudySIMProgModal";


class StudySIM_Business extends Component {
  constructor() {
    super();
    this.state = {
      addStudySIMProgModal: false,
      editStudySIMProgModal: false,
      deleteStudySIMProgModal: false,
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
              //this.display();
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
  handleEditStudySIMProgModal = () => {
    if (this.state.editStudySIMProgModal == false) {
      this.setState({
        editStudySIMProgModal: true,
      });
    }
    else {
      this.setState({
        editStudySIMProgModal: false
      });
    }
  };

  /* Delete Programme Modal */
  handleDeleteStudySIMProgModal = () => {
    if (this.state.deleteStudySIMProgModal == false) {
      this.setState({
        deleteStudySIMProgModal: true,
      });
    }
    else {
      this.setState({
        deleteStudySIMProgModal: false
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
                        <h4 className="MAStudySIMHeaderText">Programmes for Business</h4>
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
                                        <td className="studySIMProgData_ProgName text-left">
                                            <a href="/studySIMProgDetail" className="studySIMProgData_ProgNameLink">
                                                Programme Name
                                            </a>
                                        </td>
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
                                            <Button className="deleteStudySIMProgBtn" onClick={this.handleDeleteStudySIMProgModal}>
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


        {/* Add Programme Modal */}
        <Modal 
          show={this.state.addStudySIMProgModal}
          onHide={this.handleAddStudySIMProgModal}
          aria-labelledby="addStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="addStudySIMProgModal"
        >
          <AddStudySIMProgModal />
        </Modal>

        {/* Edit Programme Modal */}
        <Modal 
          show={this.state.editStudySIMProgModal}
          onHide={this.handleEditStudySIMProgModal}
          aria-labelledby="editStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="editStudySIMProgModal"
        >
          <EditStudySIMProgModal handleSaveChanges={ ()=>{console.log("Edit Modal Saved")} } handleCancelEdit={this.handleEditStudySIMProgModal} />
        </Modal>

        {/* Delete Programme Talk Modal */}
        <Modal 
          show={this.state.deleteStudySIMProgModal}
          onHide={this.handleDeleteStudySIMProgModal}
          aria-labelledby="deleteStudySIMProgModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteStudySIMProgModal handleConfirmDelete={ ()=>{console.log("Deleted Programme")} } handleCancelDelete={this.handleDeleteStudySIMProgModal} />
        </Modal>


      </div>
    );
  }
}
export default StudySIM_Business;
