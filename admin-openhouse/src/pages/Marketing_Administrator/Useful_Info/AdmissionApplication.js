import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/AdmissionApplication.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';


const initialStates = {
  progTalkError: "",
  venueError: "",
  capacityLimitError: "",
  startTimeError: "",
  endTimeError: "",
  dateError: "",
  universityError: "",
  disciplineError: "",
  progTalkDetailsError: "",
}

class AdmissionApplication extends Component {

  state = initialStates;

  constructor() {
    super();
    this.state = {

      addAdmissionAppModal: false,
      editAdmissionAppModal: false,
      deleteAdmissionAppModal: false,
    };
    //this.resetForm = this.resetForm.bind(this);
  }



  /* Add Admission Application Modal */
  handleAddAdmissionAppModal = () => {
    if (this.state.addAdmissionAppModal == false) {
      this.setState({
        addAdmissionAppModal: true
      });
    }
    else {
      this.setState({
        addAdmissionAppModal: false
      });
      //this.resetForm();
    }
  };

  /* Edit Admission Application Modal */
  handleEditAdmissionAppModal = () => {
    if (this.state.editAdmissionAppModal == false) {
      this.setState({
        editAdmissionAppModal: true,
      })
    }
    else {
      this.setState({
        editAdmissionAppModal: false
      });
    }
  };

  /* Delete Admission Application Modal */
  handleDeleteAdmissionAppModal(id) {
    if (this.state.deleteAdmissionAppModal == false) {
      this.setState({
        deleteAdmissionAppModal: true,
      });
      //this.state.id = id;
    }
    else {
      this.setState({
        deleteAdmissionAppModal: false
      });
    }
  };


  //Validations for the Forms in Modals
//   validate = () => {
//     let progTalkError = "";
//     let venueError = "";
//     let capacityLimitError = "";
//     let startTimeError = "";

//     if ( !(this.state.talkName && this.state.talkName.length >= 4) ) {
//       progTalkError = "Please enter a valid programme talk name!";
//     } 

//     if (! (this.state.venue && this.state.venue.length >= 3) ) {
//       venueError = "Please enter a valid value. E.g. SIM HQ BLK A Atrium!";
//     }

//     if (! (this.state.capacityLimit && validCapacityLimit.test(this.state.capacityLimit)) ) {
//       capacityLimitError = "Please enter a valid capacity limit!";
//     }

//     if ( !(this.state.startTime.includes(':') && (this.state.startTime.includes("AM") || this.state.startTime.includes("PM"))) ) {
//       startTimeError = "Please enter a valid start time. E.g. 1:30PM";
//     }

//     if ( !(this.state.endTime.includes(':') && (this.state.endTime.includes("AM") || this.state.endTime.includes("PM"))) ) {
//         endTimeError = "Please enter a valid end time. E.g. 2:30PM";
//     }

//     if (!this.state.date) {
//       dateError = "Please select a valid date!";
//     }

//     if (!this.state.awardingUni) {
//       universityError = "Please select a valid university!";
//     }

//     // Have issue - TBC !(this.state.discipline.defaultChecked)
//     if (!(this.state.discipline)) {
//       disciplineError = "Please select at least 1 discipline!";
//     }

//     if ( !(this.state.details && this.state.details.length >= 2) ) {
//       progTalkDetailsError = "Please enter valid programme talk details!";
//     }

//     if (progTalkError || venueError || capacityLimitError || startTimeError || endTimeError || dateError 
//       || universityError || disciplineError || progTalkDetailsError) {
//         this.setState({
//           progTalkError, venueError, capacityLimitError, startTimeError, endTimeError, dateError, universityError,
//           disciplineError, progTalkDetailsError
//         });
//         return false;
//     } 

//     return true;
//   }

  //Reset Forms
//   resetForm = () => {
//     this.setState(initialStates);
//     this.setState({
//       id: '', 
//       talkName: '', 
//       venue: '', 
//       capacityLimit: '', 
//       startTime: '', 
//       endTime: '', 
//       date: '', 
//       awardingUni: '',
//       discipline: [],
//       details: ''
//     })
//   }


  render() {
    return (
      <div>
        <Container fluid className="admissionAppCon">
          <NavBar isMA={true} />

          <Container fluid className="admissionAppContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="admissionAppContentCon">
                  {/* Admission & Application Page Header row */}
                  <Row id="admissionAppContentHeaderRow" className="justify-content-center">
                    <Col md="12" className="text-left admissionAppContentHeaderCol">
                      <h4 id="admissionAppHeaderText">Admission & Application</h4>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="admissionAppContentTabRow">
                    <Col md="12" className="admissionAppContentTabCol">

                      <Tab.Container defaultActiveKey="steps">
                        <Row className="admissionAppTabConRow">
                          <Col md="12" className="admissionAppTabConCol">
                            <Nav defaultActiveKey="steps" className="admissionAppTabNav" variant="tabs">
                              <Col md="6" className="admissionAppTabConInnerCol text-center">
                                <Nav.Item className="admissionAppTab_NavItem">
                                  <Nav.Link eventKey="steps" className="admissionAppTab_NavLink">Steps</Nav.Link>
                                </Nav.Item>
                              </Col>  

                              <Col md="6" className="admissionAppTabConInnerCol text-center">
                                <Nav.Item className="admissionAppTab_NavItem">
                                  <Nav.Link eventKey="additionalInfo" className="admissionAppTab_NavLink">Additional Information</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>
                          </Col>

                        </Row>

                        <Row className="admissionAppTabConRow justify-content-center">
                          <Col md="12" className="admissionAppTabConCol text-center">
                            <Tab.Content id="admissionAppTabPane_Steps">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="steps">
                                <Col md="12" className="admissionAppTabpaneCol">
                                  <Table responsive="sm" bordered id="admissionAppTable_Steps">
                                    <thead>
                                      <tr>
                                        <th className="admissionAppHeader_Step">Step</th>
                                        <th className="admissionAppHeader_ProgTalk">Programme Talk</th>
                                        <th className="admissionAppHeader_ProgTalkDetails">Programme Talk Details</th>
                                        <th className="admissionAppHeader_AwardingUni">Awarding University</th>
                                        <th className="admissionAppHeader_StartTime">Start Time</th>
                                        <th className="admissionAppHeader_EndTime">End Time</th>
                                        <th className="admissionAppHeader_Venue">Venue</th>
                                        <th className="admissionAppHeader_Capacity">Capacity Limit</th>
                                        <th className="admissionAppHeader_Discipline">Discipline(s)</th>
                                        <th className="admissionAppHeader_Edit">Edit</th>
                                        <th className="admissionAppHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>
              
                                    <tbody>
                                        <tr>
                                            <td className="admissionAppData_SNo text-center"></td>
                                            <td className="admissionAppData_ProgTalk text-left"></td>
                                            <td className="admissionAppData_ProgTalkDetails text-left"></td>
                                            <td className="admissionAppData_AwardingUni text-center"></td>
                                            <td className="admissionAppData_StartTime text-left"></td>
                                            <td className="admissionAppData_EndTime text-left"></td>
                                            <td className="admissionAppData_Venue text-left"></td>
                                            <td className="admissionAppData_Capacity text-center"></td>
                                            <td className="admissionAppData_Discipline text-center"></td>
                                            <td className="admissionAppData_Edit text-center">
                                                <Button id="editAdmissionAppBtn" onClick={()=>this.handleEditAdmissionAppModal()}>
                                                    <FontAwesomeIcon size="lg" id="editAdmissionAppBtnIcon" icon={faEdit} />
                                                </Button>
                                            </td>
                                            <td className="admissionAppData_Delete text-center">
                                                <Button id="deleteAdmissionAppBtn" onClick={(e) => this.handleDeleteAdmissionAppModal()}>
                                                    <FontAwesomeIcon size="lg" id="deleteAdmissionAppBtnIcon" icon={faTrashAlt} />
                                                </Button>
                                            </td>
                                        </tr>

                                    </tbody>

                                  </Table>
                                </Col>
                              </Tab.Pane>

                              {/* Tab Pane 2 */}
                              <Tab.Pane eventKey="additionalInfo">
                                <Col md="12" className="admissionAppTabpaneCol">
                                  <Table responsive="sm" bordered id="admissionAppTable_AdditionalInfo">
                                    <thead>
                                      <tr>
                                        <th className="admissionAppHeader_SNo">S/N</th>
                                        <th className="admissionAppHeader_ProgTalk">Programme Talk</th>
                                        <th className="admissionAppHeader_ProgTalkDetails">Programme Talk Details</th>
                                        <th className="admissionAppHeader_AwardingUni">Awarding University</th>
                                        <th className="admissionAppHeader_StartTime">Start Time</th>
                                        <th className="admissionAppHeader_EndTime">End Time</th>
                                        <th className="admissionAppHeader_Venue">Venue</th>
                                        <th className="admissionAppHeader_Capacity">Capacity Limit</th>
                                        <th className="admissionAppHeader_Discipline">Discipline(s)</th>
                                        <th className="admissionAppHeader_Edit">Edit</th>
                                        <th className="admissionAppHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>
                                    
                                    <tbody>
                                        <tr>
                                            <td className="admissionAppData_SNo text-center"></td>
                                            <td className="admissionAppData_ProgTalk text-left"></td>
                                            <td className="admissionAppData_ProgTalkDetails text-left"></td>
                                            <td className="admissionAppData_AwardingUni text-center"></td>
                                            <td className="admissionAppData_StartTime text-left"></td>
                                            <td className="admissionAppData_EndTime text-left"></td>
                                            <td className="admissionAppData_Venue text-left"></td>
                                            <td className="admissionAppData_Capacity text-center"></td>
                                            <td className="admissionAppData_Discipline text-center"></td>
                                            <td className="admissionAppData_Edit text-center">
                                                <Button id="editAdmissionAppBtn" onClick={()=>this.handleEditAdmissionAppModal()}>
                                                    <FontAwesomeIcon size="lg" id="editAdmissionAppBtnIcon" icon={faEdit} />
                                                </Button>
                                            </td>
                                            <td className="admissionAppData_Delete text-center">
                                                <Button id="deleteAdmissionAppBtn" onClick={(e) => this.handleDeleteAdmissionAppModal()}>
                                                    <FontAwesomeIcon size="lg" id="deleteAdmissionAppBtnIcon" icon={faTrashAlt} />
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>

                                  </Table>
                                </Col>
                              </Tab.Pane>

                            </Tab.Content>
                            
                          </Col>
                        </Row>
                      </Tab.Container>

                    </Col>
                  </Row>

                </Container>
              </Col>

            </Row>
          </Container>

          <Footer />
        </Container>

      </div>
    );
  }
}

export default AdmissionApplication;
