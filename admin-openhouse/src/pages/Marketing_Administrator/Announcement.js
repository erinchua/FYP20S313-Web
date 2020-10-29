import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import { Container, Row, Col, Button, Table, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

import "../../css/Marketing_Administrator/Announcement.css";
import "../../css/Marketing_Administrator/AnnouncementModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import DeleteAnnouncementModal from '../../components/Marketing_Administrator/DeleteAnnouncementModal';


class Announcement extends Component {
  constructor() {
    super();
    this.state = {
      announcementTitle: "",
      Description: "",
      Date: "",
      Time: "",

      openhousedates: [],
      scheduleAnnouncementLabel: "No",
      toggleScheduleAnnouncement: false,

      addAnnouncementModal: false,
      editAnnouncementModal: false,
      deleteAnnouncementModal: false,
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

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();
    const userRef = db
    .collection("Announcements").orderBy("Date", "desc")
    .get()
    .then((snapshot) => {
      const announcement = [];
      snapshot.forEach((doc) => {
        const data = {
          announcementTitle: doc.data().announcementTitle,
          Description: doc.data().Description,
          Date: doc.data().Date,
          Time: doc.data().Time,
          id: doc.id,
        };
        announcement.push(data);
      });

      this.setState({ announcement: announcement });
    });

    // Get Open House Dates
    db
    .collection("Openhouse")
    .get()
    .then((snapshot) => {
      const openhousedates = [];

      snapshot.forEach((doc) => {
      const daydata = doc.get("day");
      if (Array.isArray(daydata)) {
        for (var i = 0; i < Object.keys(daydata).length; i++) {
          console.log(daydata[i].date);
          console.log(daydata[i].startTime);
          console.log(daydata[i].endTime);
        }
      }
      for (var i = 0; i < Object.keys(daydata).length; i++) {
          const data = {
              day: Object.keys(doc.data().day)[i],
              date: daydata[Object.keys(daydata)[i]].date,
              startTime: daydata[Object.keys(daydata)[i]].startTime,
              endTime: daydata[Object.keys(daydata)[i]].endTime,
              description: daydata[Object.keys(daydata)[i]].description,
              docid: doc.id,
          };
          openhousedates.push(data);
        }
      });

      this.setState({ openhousedates: openhousedates });
    });
  }
  
  addAnnouncement = (e) => {
    e.preventDefault();
    const db = fire.firestore();

    const userRef = db
    .collection("Announcements")
    .add({
      announcementTitle: this.state.announcementTitle,
      Date: this.state.Date,
      Time: this.state.Time,
      Description: this.state.Description,
    })
    .then(function () {
      window.location.reload();
    });
  };

  DeleteAnnouncement(e, announcementid) {
    const db = fire.firestore();
    const userRef = db
    .collection("Announcements")
    .doc(announcementid)
    .delete()
    .then(function () {
      alert("Deleted");
      window.location.reload();
    });
  }

  update(e, announcementid) {
    const announcementTitle = document.getElementById(announcementid + "title").value
    const Date = document.getElementById(announcementid + "date").value
    const Time = document.getElementById(announcementid + "time").value
    const Description = document.getElementById(announcementid + "description").value

    const db = fire.firestore();
    if (announcementTitle != null && Date != null && Time != null && Description != null) {
      const userRef = db
      .collection("Announcements")
      .doc(announcementid)
      .update({
        announcementTitle: announcementTitle,
        Date: Date,
        Time: Time,
        Description: Description,
      })
      .then(function () {
        alert("Updated");
        window.location.reload();
      });
    }
  }

  editAnnouncement(e, announcementid) {
    document.getElementById(announcementid + "spantitle").removeAttribute("hidden");
    document.getElementById(announcementid + "spandate").removeAttribute("hidden");
    document.getElementById(announcementid + "spantime").removeAttribute("hidden");
    document.getElementById(announcementid + "spandescription").removeAttribute("hidden");
    document.getElementById(announcementid + "editbutton").setAttribute("hidden", "");
    document.getElementById(announcementid + "updatebutton").removeAttribute("hidden");
    document.getElementById(announcementid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
      announcementid + "text"
    );
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].setAttribute("hidden", "");
    }  
  }

  CancelEdit(e, announcementid) {
    document.getElementById(announcementid + "spantitle").setAttribute("hidden", "");
    document.getElementById(announcementid + "spandate").setAttribute("hidden", "");
    document.getElementById(announcementid + "spantime").setAttribute("hidden", "");
    document.getElementById(announcementid + "spandescription").setAttribute("hidden", "");
    document.getElementById(announcementid + "editbutton").removeAttribute("hidden");
    document.getElementById(announcementid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(announcementid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
      announcementid + "text"
    );
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].removeAttribute("hidden", "");
    }
  }


  /* Add Announcement Modal */
  handleAddAnnouncementModal = () => {
    if (this.state.addAnnouncementModal == false) {
      this.setState({
        addAnnouncementModal: true,
        scheduleAnnouncement: true,
      });
    }
    else {
      this.setState({
        addAnnouncementModal: false
      });
    }
  };

  /* Add Announcement Modal - Schedule Announcement Switch */
  handleScheduleAnnouncementSwitch = () => {
    const scheduleAnnouncement = this.state.scheduleAnnouncement;

    if (scheduleAnnouncement == true) {
      this.setState({
        scheduleAnnouncement: false,
        scheduleAnnouncementLabel: "Yes"
      })
    }
    if (scheduleAnnouncement == false) {
      this.setState({
        scheduleAnnouncement: true,
        scheduleAnnouncementLabel: "No"
      })
    }
  }

  /* Edit Announcement Modal */
  handleEditAnnouncementModal = (announcement) => {
    if (this.state.editAnnouncementModal == false) {
      this.setState({
        editAnnouncementModal: true,
        announcementTitle: announcement.announcementTitle,
        Date: announcement.Date,
        Time: announcement.Time,
        Description: announcement.Description,
        scheduleAnnouncement: announcement.scheduleAnnouncement
      });
    }
    else {
      this.setState({
        editAnnouncementModal: false
      });
    }
  };

  /* Delete Announcement Modal */
  handleDeleteAnnouncementModal = () => {
    if (this.state.deleteAnnouncementModal == false) {
      this.setState({
        deleteAnnouncementModal: true,
      });
    }
    else {
      this.setState({
        deleteAnnouncementModal: false
      });
    }
  };




  render() {
    return (
      <div>
        <Container fluid className="announcementCon">
          <NavBar isMA={true} />

          <Container fluid className="announcementContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="announcementContentCon">
                  {/* Announcement Page Header row */}
                  <Row id="announcementContentHeaderRow" className="justify-content-center">
                    <Col md="6" className="text-left announcementContentHeaderCol">
                      <h4 id="announcementHeaderText">Announcements</h4>
                    </Col>

                    <Col md="6" className="text-right announcementContentHeaderCol">
                      <Button id="addAnnouncementBtn" onClick={this.handleAddAnnouncementModal}>
                        <FontAwesomeIcon size="lg" id="addAnnouncementBtnIcon" icon={faPlus} />
                        <span id="addAnnouncementBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Announcement Table */}
                  <Row id="announcementTableRow" className="justify-content-center">
                    <Col md="12">
                      <Table responsive="sm" bordered id="announcementTable">
                        <thead>
                          <tr className="text-center">
                            <th id="announcementHeader_AnnouncementTitle" className="text-center">Announcement Title</th>
                            <th id="announcementHeader_PostedDateTime" className="text-center">Posted Date/ Time</th>
                            <th id="announcementHeader_Detail" className="text-center">Announcement Details</th>
                            <th id="announcementHeader_Edit" className="text-center">Edit</th>
                            <th id="announcementHeader_Delete" className="text-center">Delete</th>
                          </tr>
                        </thead>
                          
                        <tbody>
                          {this.state.announcement && this.state.announcement.map((announce) => {
                            return (
                              <tr key={announce.id}>
                                <td id="announcementData_AnnouncementTitle" className="text-center">{announce.announcementTitle}</td>
                                <td id="announcementData_PostedDateTime" className="text-center">{announce.Date}, {announce.Time}</td>
                                <td id="announcementData_Detail" className="text-left">{announce.Description}</td>
                                <td id="announcementData_Edit" className="text-center">
                                  <Button id="editAnnouncementBtn" onClick={() => {this.handleEditAnnouncementModal(announce)}}>
                                    <FontAwesomeIcon size="lg" id="editAnnouncementBtnIcon" icon={faEdit} />
                                  </Button>
                                </td>
                                <td className="announcementData_Delete" className="text-center">
                                  <Button id="deleteAnnouncementBtn" onClick={this.handleDeleteAnnouncementModal}>
                                    <FontAwesomeIcon size="lg" id="deleteAnnouncementBtnIcon" icon={faTrashAlt} />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}

                        </tbody>

                      </Table>
                    </ Col>
                  </Row>

                </Container>
              </Col>
            </Row>

          </Container>

          <Footer />
        </Container>


        {/* Add Announcement Modal */}
        <Modal 
          show={this.state.addAnnouncementModal}
          onHide={this.handleAddAnnouncementModal}
          aria-labelledby="addAnnouncementModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="addAnnouncementModalTitle" className="w-100">
              Add Announcement
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="addAnnouncementModalBody">
            <Form noValidate> {/* onSubmit={this.add} */}
              {/* Announcement Title */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="addAnnouncementFormLabel">Announcement Title</Form.Label>

                  <FormControl as="textarea" rows="4" required noValidate className="addAnnouncementForm_Textarea" placeholder="Announcement Title*" />                                       
                </Col>
              </Form.Row>

              {/* Annnouncement Details */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="addAnnouncementFormLabel">Announcement Details</Form.Label>

                  <FormControl as="textarea" rows="4" required noValidate className="addAnnouncementForm_Textarea" placeholder="Announcement Details*" />                                       
                </Col>
              </Form.Row>

              {/* Schedule Announcement */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <InputGroup>
                    <Form.Label className="addAnnouncementFormLabel">Schedule Announcement?</Form.Label>

                    <Form.Check type="switch" id="custom-switch" className="scheduleAnnouncementSwitch" label={this.state.scheduleAnnouncementLabel} onClick={this.handleScheduleAnnouncementSwitch} />
                  </InputGroup>
                </Col>
              </Form.Row>
              
              {/* Schedule Announcement Content */}
              {this.state.scheduleAnnouncement == false &&
                <Form.Row className="justify-content-center">
                  <Col md="10">
                    <Container style={{padding: "0"}}>
                      {/* Scheduled Date Row */}
                      <Form.Row className="justify-content-center addAnnouncementFormRow">
                        <Col md="12" style={{padding: "0"}}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="addAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="addAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon size="lg" className="addAnnouncementFormIcon" icon={faCalendar} />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col style={{width: "90%"}} className="text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="addAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="addAnnouncementFormSelectOption">Schedule Announcement Date</option>
                                {/* To be retrieved from open house dates */}
                                {this.state.openhousedates && this.state.openhousedates.map((date) => {
                                  return(
                                    <option value={date.date} className="addAnnouncementFormSelectOption">{date.date}</option>
                                  );
                                })}

                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>

                      {/* Scheduled Time Row */}
                      <Form.Row className="justify-content-center addAnnouncementFormRow">
                        <Col md="12" style={{padding: "0"}}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="addAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="addAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon size="lg" className="addAnnouncementFormIcon" icon={faClock} />
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            
                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="addAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="addAnnouncementFormSelectOption">Hour</option>
                                {/* To be retrieved from arrays - Hr Array */}
                                <option value="1" className="addAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                            <Form.Text id="addAnnouncementInnerTime_Text">:</Form.Text>

                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="addAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="addAnnouncementFormSelectOption">Minute</option>
                                {/* To be retrieved from arrays - Min Array */}
                                <option value="1" className="addAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="addAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="addAnnouncementFormSelectOption">Minute</option>
                                {/* To be retrieved from arrays - Min Array */}
                                <option value="1" className="addAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                          </Form.Row>
                        </Col>
                      </Form.Row>

                    </Container>
                  </Col>
                </Form.Row>
              }

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Add Announcement Submit Btn*/}
            <Button type="submit" id="addAnnouncementFormBtn">Publish</Button>
          </Modal.Footer>

        </Modal>

        
        {/* Edit Announcement Modal */}
        <Modal 
          show={this.state.editAnnouncementModal}
          onHide={this.handleEditAnnouncementModal}
          aria-labelledby="editAnnouncementModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="editAnnouncementModalTitle" className="w-100">
              Edit Announcement
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="editAnnouncementModalBody">
            <Form noValidate> {/* onSubmit={this.edit} */}
              {/* Announcement Title */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="editAnnouncementFormLabel">Announcement Title</Form.Label>

                  <FormControl as="textarea" defaultValue={this.state.announcementTitle} rows="4" required noValidate className="editAnnouncementForm_Textarea" placeholder="Announcement Title*" />                                       
                </Col>
              </Form.Row>

              {/* Annnouncement Details */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="editAnnouncementFormLabel">Announcement Details</Form.Label>

                  <FormControl as="textarea" defaultValue={this.state.Description} rows="4" required noValidate className="editAnnouncementForm_Textarea" placeholder="Announcement Details*" />                                       
                </Col>
              </Form.Row>

              {/* Schedule Announcement */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <InputGroup>
                    <Form.Label className="editAnnouncementFormLabel">Schedule Announcement?</Form.Label>

                    <Form.Check type="switch" id="custom-switch" className="scheduleAnnouncementSwitch" label={this.state.scheduleAnnouncementLabel} onClick={this.handleScheduleAnnouncementSwitch} />
                  </InputGroup>
                </Col>
              </Form.Row>
              
              {/* Schedule Announcement Content */}
              {this.state.scheduleAnnouncement == false &&
                <Form.Row className="justify-content-center">
                  <Col md="10">
                    <Container style={{padding: "0"}}>
                      {/* Scheduled Date Row */}
                      <Form.Row className="justify-content-center editAnnouncementFormRow">
                        <Col md="12" style={{padding: "0"}}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="editAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="editAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon size="lg" className="editAnnouncementFormIcon" icon={faCalendar} />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col style={{width: "90%"}} className="text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="editAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="editAnnouncementFormSelectOption">Schedule Announcement Date</option>
                                {/* To be retrieved from open house dates */}
                                {this.state.openhousedates && this.state.openhousedates.map((date) => {
                                  return(
                                    <option value={date.date} className="editAnnouncementFormSelectOption">{date.date}</option>
                                  );
                                })}
                                
                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>

                      {/* Scheduled Time Row */}
                      <Form.Row className="justify-content-center editAnnouncementFormRow">
                        <Col md="12" style={{padding: "0"}}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="editAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="editAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon size="lg" className="editAnnouncementFormIcon" icon={faClock} />
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            
                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="editAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="editAnnouncementFormSelectOption">Hour</option>
                                {/* To be retrieved from arrays - Hr Array */}
                                <option value="1" className="editAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                            <Form.Text id="editAnnouncementInnerTime_Text">:</Form.Text>

                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="editAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="editAnnouncementFormSelectOption">Minute</option>
                                {/* To be retrieved from arrays - Min Array */}
                                <option value="1" className="editAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control as="select" name="scheduledDate" defaultValue="chooseScheduledDate" className="editAnnouncementFormSelect" required noValidate>
                                <option value="chooseScheduledDate" className="editAnnouncementFormSelectOption">Minute</option>
                                {/* To be retrieved from arrays - Min Array */}
                                <option value="1" className="editAnnouncementFormSelectOption">1</option>
                              </Form.Control>
                            </Col>

                          </Form.Row>
                        </Col>
                      </Form.Row>

                    </Container>
                  </Col>
                </Form.Row>
              }

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Announcement Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesAnnouncementFormBtn">Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditAnnouncementFormBtn" onClick={this.handleEditAnnouncementModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>

        </Modal>


        {/* Delete Announcement Modal */}
        <Modal 
          show={this.state.deleteAnnouncementModal}
          onHide={this.handleDeleteAnnouncementModal}
          aria-labelledby="deleteAnnouncementModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteAnnouncementModal handleConfirmDelete={ (e) => {this.DeleteAnnouncement(e, this.state.id)} } handleCancelDelete={this.handleDeleteAnnouncementModal} />
        </Modal>



        {/* <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <tr>
              <th scope="col">Announcement Title</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.announcement &&
                this.state.announcement.map((announcement) => {
                  return (
                    <tr>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.announcementTitle} 
                        </span>  
                          <span id={announcement.id + "spantitle"} hidden>
                          <input
                            id={announcement.id + "title"}
                            defaultValue={announcement.announcementTitle}
                            type="text"
                            name={announcement.id + "title"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.announcementTitle}
                            required
                          />
                        </span>
                        </td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Date} 
                        </span>  
                          <span id={announcement.id + "spandate"} hidden>
                          <input
                            id={announcement.id + "date"}
                            defaultValue={announcement.Date}
                            type="date"
                            name={announcement.id + "date"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Date}
                            required
                          />
                        </span>
                        </td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Time}
                        </span>  
                          <span id={announcement.id + "spantime"} hidden>
                          <input
                            id={announcement.id + "time"}
                            defaultValue={announcement.Time}
                            type="time"
                            name={announcement.id + "time"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Time}
                            required
                          />
                        </span></td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Description}
                        </span>  
                          <span id={announcement.id + "spandescription"} hidden>
                          <input
                            id={announcement.id + "description"}
                            defaultValue={announcement.Description}
                            type="text"
                            name={announcement.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Description}
                            required
                          />
                        </span>
                        </td>
                      <td>
                        <button
                          id={announcement.id + "editbutton"}
                          onClick={(e) => {
                            this.editAnnouncement(e, announcement.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={announcement.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, announcement.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={announcement.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, announcement.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteAnnouncement(e, announcement.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form onSubmit={this.addAnnouncement}>
          <input
            type="text"
            name="announcementTitle"
            placeholder="Announcement Title"
            onChange={this.updateInput}
            value={this.state.announcementTitle}
            required
          />
          <input
            type="date"
            name="Date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.Date}
            required
          />
          <input
            type="time"
            name="Time"
            placeholder="Time"
            onChange={this.updateInput}
            value={this.state.Time}
            required
          />
          <input
            type="text"
            name="Description"
            placeholder="Description"
            onChange={this.updateInput}
            value={this.state.Description}
            required
          />
          <button type="submit">Add Announcement</button>
        </form> */}
      </div>
    );
  }
}
export default Announcement;