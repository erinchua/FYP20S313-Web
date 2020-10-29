import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/ProgrammeTalkSchedule.css";
import "../../../css/Marketing_Administrator/ProgTalkModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import AddProgTalkModal from "../../../components/Marketing_Administrator/OpenHouseProgrammes/AddProgTalkModal";
import EditProgTalkModal from "../../../components/Marketing_Administrator/OpenHouseProgrammes/EditProgTalkModal";
import DeleteProgTalkModal from "../../../components/Marketing_Administrator/OpenHouseProgrammes/DeleteProgTalkModal";


class ProgrammeTalkSchedule extends Component {
  constructor() {
    super();
    this.state = {
      awardingUni: "",
      capacityLimit: "",
      date: "",
      endTime: "",
      hasRecording: "",
      isLive: "",
      noRegistered: "",
      startTime: "",
      talkName: "",
      venue: "",
      link: "",
      id: "",
      progTalkDetails: "",
      discipline: [],
      day1: [],
      day2: [],
      day1Date: "",
      day2Date: "",

      // University collection
      uniId: "",
      universityName: "",
      uniList: [],

      // Discipline collection
      disciplineId: "",
      disciplineName: "",
      disciplineList: [],

      checkDiscipline: false,
      addProgTalkModal: false,
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

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  
  };

  componentDidMount() {
    this.authListener();
  }

  display= () => {
    var getYear = new Date().getFullYear();
    console.log(getYear);
    
    const db = fire.firestore();
    const progtalk = [];

    // Get All Universities
    db.collection("Universities").get()
    .then((snapshot) => {
      const uni_list = [];
      snapshot.forEach((doc) => {
        const data = {
          docid: doc.id,
          uniId: doc.data().id,
          universityName: doc.data().universityName,
        };
        uni_list.push(data);
      });
      this.setState({ uniList: uni_list });
    });

    // Get All Disciplines
    db.collection("Disciplines").get()
    .then((snapshot) => {
      const discipline_list = [];
      snapshot.forEach((doc) => {
        const data = {
          docid: doc.id,
          disciplineId: doc.data().id,
          disciplineName: doc.data().name
        };
        discipline_list.push(data);
      });
      this.setState({ disciplineList: discipline_list });
    });
    
    const userRef = db
    .collection("ProgrammeTalks")
    .where('date', '>=', "2021")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        progtalk.push(doc.data().date);
      });
      
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
    
      var unique = progtalk.filter(onlyUnique);
      console.log(unique);

      //day1
      const day1date = [];
      day1date.push(unique[0]);
      this.setState({ day1date: day1date });
      var day1_counter = 1;

      const day1  = db
      .collection("ProgrammeTalks").where("date", "==", unique[0])
      .get()
      .then((snapshot) => {
        const progtalk = [];
        snapshot.forEach((doc) => {
          const data = {
            docid: doc.id,
            id: doc.data().id,
            talkName: doc.data().talkName,
            date: doc.data().date,
            awardingUni: doc.data().awardingUni,
            startTime: doc.data().startTime,     
            endTime: doc.data().endTime,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit,
            noRegistered: doc.data().noRegistered,
            hasRecording: doc.data().hasRecording.toString(),
            link: doc.data().link,
            isLive: doc.data().isLive.toString(),
            progTalkDetails: doc.data().details,
            discipline: doc.data().discipline,
            day1_counter : day1_counter,
          };
            day1_counter++;
            progtalk.push(data);
        });
        this.setState({ day1: progtalk });
        this.setState({ day1Date: progtalk[0].date})
      });

      //day 2
      const day2date = [];
      day2date.push(unique[1]);
      this.setState({ day2: day2date });
      var day2_counter = 1

      const day2  = db
      .collection("ProgrammeTalks").where("date", "==", unique[1])
      .get()
      .then((snapshot) => {
          const progtalk = [];
          snapshot.forEach((doc) => {
            const data = {
              docid : doc.id,
              id: doc.data().id,
              talkName:doc.data().talkName,
              awardingUni : doc.data().awardingUni,
              startTime:  doc.data().startTime,     
              endTime: doc.data().endTime,
              date: doc.data().date,
              venue: doc.data().venue,
              capacityLimit: doc.data().capacityLimit,
              noRegistered: doc.data().noRegistered,
              hasRecording: doc.data().hasRecording.toString(),
              link : doc.data().link,
              isLive: doc.data().isLive.toString(),
              progTalkDetails: doc.data().details,
              discipline: doc.data().discipline,
              day2_counter: day2_counter,
            };
            day2_counter++;
            progtalk.push(data);
          });
          this.setState({ day2: progtalk });   
          this.setState({ day2Date: progtalk[0].date})
        });
    });  
  }

  addProgrammeTalks = (e) => { 
    e.preventDefault();
    // var recordingvalue = document.getElementById("recordingvalue");
    // var livestatus = document.getElementById("livestatus");
    // recordingvalue = recordingvalue.options[recordingvalue.selectedIndex].value;
    // livestatus = livestatus.options[livestatus.selectedIndex].value;
    // recordingvalue = (recordingvalue === "true");
    // livestatus = (livestatus === "true");

    const db = fire.firestore();
    var lastdoc = db.collection("ProgrammeTalks").orderBy('id','asc')
    .limit(1).get().then((snapshot) =>  {
      snapshot.forEach((doc) => {
      var docid= "";
      var res = doc.data().id.substring(5, 10);
      var id = parseInt(res)
      if(id.toString().length <= 1){
        docid= "talk-00" + (id +1) 
        }
        else if(id.toString().length <= 2){
          docid= "talk-0" + (id +1) 
          }
        else{
          docid="talk-0" + (id +1) 
        }
        db
        .collection("ProgrammeTalks")
        .doc(docid)
        .set({
          awardingUni: this.state.awardingUni,
          capacityLimit: this.state.capacityLimit,
          date: this.state.date,
          endTime: this.state.endTime,
          hasRecording: this.state.hasRecording,
          isLive: this.state.isLive,
          noRegistered: this.state.noRegistered,
          startTime: this.state.startTime,
          talkName: this.state.talkName,
          venue: this.state.venue,
          link: this.state.link,
          id: docid,
          progTalkDetails: this.state.details,
          discipline: this.state.discipline,

        })
        .then(function () {
          window.location.reload();
        });
      })
    })
  };

  DeleteProgrammeTalk(e, progtalkid) {
    const db = fire.firestore();
    const userRef = db
      .collection("ProgrammeTalks")
      .doc(progtalkid)
      .delete()
      .then(function () {
        // alert("Deleted");
        window.location.reload();
      });
  }

  update(e, progtalkid) {
    const talkName = document.getElementById(progtalkid + "talkname").value
    const awardingUni = document.getElementById(progtalkid + "awarduni").value
    const startTime = document.getElementById(progtalkid + "starttime").value
    const endTime = document.getElementById(progtalkid + "endtime").value
    const venue = document.getElementById(progtalkid + "venue").value

    const db = fire.firestore();
    if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null) {
      const userRef = db
        .collection("ProgrammeTalks")
        .doc(progtalkid)
        .update({
            awardingUni: awardingUni,
            endTime: endTime,
            startTime: startTime,
            talkName: talkName,
            venue: venue,
        })
        .then(function () {
          // alert("Updated");
          window.location.reload();
        });
    }
  }

  editProgTalk(e, progtalkid) {
    // document.getElementById(progtalkid + "spantalkname").removeAttribute("hidden");
    // document.getElementById(progtalkid + "spanawarduni").removeAttribute("hidden");
    // document.getElementById(progtalkid + "spanstarttime").removeAttribute("hidden");
    // document.getElementById(progtalkid + "spanendtime").removeAttribute("hidden");
    // document.getElementById(progtalkid + "spanvenue").removeAttribute("hidden");
    // document.getElementById(progtalkid + "editbutton").setAttribute("hidden", "");
    // document.getElementById(progtalkid + "updatebutton").removeAttribute("hidden");
    // document.getElementById(progtalkid + "cancelbutton").removeAttribute("hidden");
    // var texttohide = document.getElementsByClassName(
    //     progtalkid + "text"
    // );
    // for (var i = 0; i < texttohide.length; i++) {
    //   texttohide[i].setAttribute("hidden", "");
    // }  

    this.setState({
      awardingUni: this.state.awardingUni,
      capacityLimit: this.state.capacityLimit,
      date: this.state.date,
      endTime: this.state.endTime,
      hasRecording: this.state.hasRecording,
      isLive: this.state.isLive,
      noRegistered: this.state.noRegistered,
      startTime: this.state.startTime,
      talkName: this.state.talkName,
      venue: this.state.venue,
      link: this.state.link,
      progTalkDetails: this.state.details,
      discipline: this.state.discipline
    });

  }

  /* Don't need cancel function as we can just hide the modal if cancel */
  // CancelEdit(e, progtalkid) {
  //   document.getElementById(progtalkid + "spantalkname").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "spanawarduni").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "spanstarttime").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "spanendtime").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "spanvenue").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(progtalkid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(progtalkid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //       progtalkid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }

  handleSaveChanges = () => {
    console.log(this.state.venue);
    console.log(this.state.discipline);

  }

  /* Add Programme Talk Modal */
  handleAddProgTalkModal = () => {
    if (this.state.addProgTalkModal == false) {
      this.setState({
        addProgTalkModal: true,
      });
    }
    else {
      this.setState({
        addProgTalkModal: false
      });
    }
  };

  /* Edit Programme Talk Modal */
  handleEditProgTalkModal = (day) => {
    if (this.state.editProgTalkModal == false) {
      this.setState({
        editProgTalkModal: true,
        awardingUni: day.awardingUni,
        capacityLimit: day.capacityLimit,
        date: day.date,
        endTime: day.endTime,
        hasRecording: day.hasRecording,
        isLive: day.isLive,
        noRegistered: day.noRegistered,
        startTime: day.startTime,
        talkName: day.talkName,
        venue: day.venue,
        link: day.link,
        progTalkDetails: day.progTalkDetails,
        discipline: day.discipline
      })
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
        <Container fluid className="MAProgTalkScheduleCon">
          <NavBar isMA={true} />

          <Container fluid className="MAProgTalkScheduleContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAProgTalkScheduleContentCon">
                  {/* Programme Talks Schedule Page Header row */}
                  <Row id="MAProgTalkScheduleContentHeaderRow" className="justify-content-center">
                    <Col md="6" className="text-left MAProgTalkScheduleContentHeaderCol">
                      <h4 id="MAProgTalkScheduleHeaderText">Programme Talks Schedule</h4>
                    </Col>

                    <Col md="6" className="text-right MAProgTalkScheduleContentHeaderCol">
                      <Button id="addProgTalkBtn" onClick={this.handleAddProgTalkModal}>
                        <FontAwesomeIcon size="lg" id="addProgTalkBtnIcon" icon={faPlus} />
                        <span id="addProgTalkBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="MAProgTalkScheduleContentTabRow">
                    <Col md="12" className="MAProgTalkScheduleContentTabCol">

                      <Tab.Container defaultActiveKey="day1">
                        <Row className="MAProgTalkScheduleTabConRow">
                          <Col md="12" className="MAProgTalkScheduleTabConCol">
                            <Nav defaultActiveKey="day1" className="MAProgTalkScheduleTabNav" variant="tabs">
                              <Col md="6" className="MAProgTalkScheduleTabConInnerCol text-center">
                                <Nav.Item className="MAProgTalkScheduleTab_NavItem">
                                  <Nav.Link eventKey="day1" className="MAProgTalkScheduleTab_Day">{this.state.day1Date}</Nav.Link>
                                </Nav.Item>
                              </Col>  

                              <Col md="6" className="MAProgTalkScheduleTabConInnerCol text-center">
                                <Nav.Item className="MAProgTalkScheduleTab_NavItem">
                                  <Nav.Link eventKey="day2" className="MAProgTalkScheduleTab_Day">{this.state.day2Date}</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>
                          </Col>

                        </Row>

                        <Row className="MAProgTalkScheduleTabConRow justify-content-center">
                          <Col md="12" className="MAProgTalkScheduleTabConCol text-center">
                            <Tab.Content id="MAProgTalkScheduleTabPane_Day1">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="day1">
                                <Col md="12" className="MAProgTalkScheduleTabpaneCol">
                                  <Table responsive="sm" bordered id="MAProgTalkScheduleTable_Day1">
                                    <thead>
                                      <tr>
                                        <th className="progTalkScheduleHeader_SNo">S/N</th>
                                        <th className="progTalkScheduleHeader_ProgTalk">Programme Talk</th>
                                        <th className="progTalkScheduleHeader_ProgTalkDetails">Programme Talk Details</th>
                                        <th className="progTalkScheduleHeader_AwardingUni">Awarding University</th>
                                        <th className="progTalkScheduleHeader_StartTime">Start Time</th>
                                        <th className="progTalkScheduleHeader_EndTime">End Time</th>
                                        <th className="progTalkScheduleHeader_Venue">Venue</th>
                                        <th className="progTalkScheduleHeader_Capacity">Capacity Limit</th>
                                        <th className="progTalkScheduleHeader_Discipline">Discipline(s)</th>
                                        <th className="progTalkScheduleHeader_Edit">Edit</th>
                                        <th className="progTalkScheduleHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>
              
                                    <tbody>
                                      {this.state.day1 && this.state.day1.map((day1) => {
                                        return (
                                          <tr key={day1.docid}>
                                            <td className="progTalkScheduleData_SNo">{day1.day1_counter}</td>
                                            <td className="progTalkScheduleData_ProgTalk text-left">{day1.talkName}</td>
                                            <td className="progTalkScheduleData_ProgTalkDetails text-left">{day1.progTalkDetails}</td>
                                            <td className="progTalkScheduleData_AwardingUni">{day1.awardingUni}</td>
                                            <td className="progTalkScheduleData_StartTime text-left">{day1.startTime}</td>
                                            <td className="progTalkScheduleData_EndTime text-left">{day1.endTime}</td>
                                            <td className="progTalkScheduleData_Venue text-left">{day1.venue}</td>
                                            <td className="progTalkScheduleData_Capacity text-center">{day1.capacityLimit}</td>
                                            <td className="progTalkScheduleData_Discipline text-center">{day1.discipline}</td>
                                            <td className="progTalkScheduleData_Edit">
                                              <Button id="editProgTalkScheduleBtn" onClick={()=>this.handleEditProgTalkModal(day1)}>
                                                <FontAwesomeIcon size="lg" id="editProgTalkScheduleBtnIcon" icon={faEdit} />
                                              </Button>
                                            </td>
                                            <td className="progTalkScheduleData_Delete">
                                              <Button id="deleteProgTalkScheduleBtn" onClick={this.handleDeleteProgTalkModal}>
                                                <FontAwesomeIcon size="lg" id="deleteProgTalkScheduleBtnIcon" icon={faTrashAlt} />
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                    </tbody>
                                        

                                  </Table>
                                </Col>
                              </Tab.Pane>

                              {/* Tab Pane 2 */}
                              <Tab.Pane eventKey="day2">
                                <Col md="12" className="MAProgTalkScheduleTabpaneCol">
                                  <Table responsive="sm" bordered id="MAProgTalkScheduleTable_Day2">
                                    <thead>
                                      <tr>
                                        <th className="progTalkScheduleHeader_SNo">S/N</th>
                                        <th className="progTalkScheduleHeader_ProgTalk">Programme Talk</th>
                                        <th className="progTalkScheduleHeader_ProgTalkDetails">Programme Talk Details</th>
                                        <th className="progTalkScheduleHeader_AwardingUni">Awarding University</th>
                                        <th className="progTalkScheduleHeader_StartTime">Start Time</th>
                                        <th className="progTalkScheduleHeader_EndTime">End Time</th>
                                        <th className="progTalkScheduleHeader_Venue">Venue</th>
                                        <th className="progTalkScheduleHeader_Capacity">Capacity Limit</th>
                                        <th className="progTalkScheduleHeader_Discipline">Discipline(s)</th>
                                        <th className="progTalkScheduleHeader_Edit">Edit</th>
                                        <th className="progTalkScheduleHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>
                                    
                                    <tbody>
                                      {this.state.day2 && this.state.day2.map((day2) => {
                                        return (
                                          <tr key={day2.docid}>
                                            <td className="progTalkScheduleData_SNo">{day2.day2_counter}</td>
                                            <td className="progTalkScheduleData_ProgTalk text-left">{day2.talkName}</td>
                                            <td className="progTalkScheduleData_ProgTalkDetails text-left">{day2.progTalkDetails}</td>
                                            <td className="progTalkScheduleData_AwardingUni">{day2.awardingUni}</td>
                                            <td className="progTalkScheduleData_StartTime text-left">{day2.startTime}</td>
                                            <td className="progTalkScheduleData_EndTime text-left">{day2.endTime}</td>
                                            <td className="progTalkScheduleData_Venue text-left">{day2.venue}</td>
                                            <td className="progTalkScheduleData_Capacity text-center">{day2.capacityLimit}</td>
                                            <td className="progTalkScheduleData_Discipline text-center">{day2.discipline}</td>
                                            <td className="progTalkScheduleData_Edit">
                                              <Button id="editProgTalkScheduleBtn" onClick={()=>this.handleEditProgTalkModal(day2)}>
                                                <FontAwesomeIcon size="lg" id="editProgTalkScheduleBtnIcon" icon={faEdit} />
                                              </Button>
                                            </td>
                                            <td className="progTalkScheduleData_Delete">
                                              <Button id="deleteProgTalkScheduleBtn" onClick={this.handleDeleteProgTalkModal}>
                                                <FontAwesomeIcon size="lg" id="deleteProgTalkScheduleBtnIcon" icon={faTrashAlt} />
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })}
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


        {/* Add Programme Talk Modal */}
        <Modal 
          show={this.state.addProgTalkModal}
          onHide={this.handleAddProgTalkModal}
          aria-labelledby="addProgTalkModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="addProgTalkModal"
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="addProgTalkModalTitle" className="w-100">
              Add Programme Talk
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="addProgTalkModalBody">
            <Form noValidate onSubmit={this.addProgrammeTalks}>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="addProgTalkFormCol text-center">
                  {/* Programme Name */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="talkName" id="addProgTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Programme Talk Venue */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="venue" id="addProgTalkForm_Venue" placeholder="Venue*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Capacity Limit */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faChair} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="number" min="0" name="endTime" id="addProgTalkForm_Capacity" placeholder="Capacity Limit*" required />
                      </InputGroup>
                    </Col>
                  </ Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="startTime" id="addProgTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                      </InputGroup>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="endTime" id="addProgTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>
                </Col>

                {/* Right Col */}
                <Col md="6" className="addProgTalkFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <Form.Control as="select" name="date" defaultValue="chooseDate" className="addProgTalkFormSelect" required noValidate>
                          <option value="chooseDate" className="addProgTalkFormSelectOption">Choose an Openhouse Date</option>
                          
                          {/* To be retrieved from DB */}
                          <option value={this.state.day1Date} className="addProgTalkFormSelectOption">{this.state.day1Date}</option>
                          <option value={this.state.day2Date} className="addProgTalkFormSelectOption">{this.state.day2Date}</option>

                        </Form.Control>                                        
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addProgTalkFormSelect" required noValidate>
                          <option value="chooseUni" className="addProgTalkFormSelectOption">Choose a University</option>
                          
                          {/* To be retrieved from DB */}
                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                              <>
                                <option value={uni.universityName} className="addProgTalkFormSelectOption">{uni.universityName}</option>
                              </>
                            );
                          })}

                        </Form.Control>
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Discipline Name */}
                  <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                    <Col md="10" className="text-left addProgTalkForm_InnerCol">
                      <Form.Label className="addProgTalkFormLabel">Choose Discipline(s):</Form.Label>                                     
                          
                      <Container className="addProgTalkForm_DisciplineCon">
                        {/* To be retrieved from db - row is generated dynamically */}
                        {this.state.disciplineList && this.state.disciplineList.map((discipline) => {
                          return (
                            <>
                              <Row key={discipline.disciplineId}>
                                <Col>
                                  <Form.Check name="discipline" checked={this.checkDiscipline} value={discipline.disciplineName} type="checkbox" label={discipline.disciplineName} className="addProgTalkForm_CheckBox" />
                                </Col>
                              </Row>
                            </>
                          );
                        })}

                      </Container>                                        
                    </Col>
                  </Form.Row>

                </Col>
              </Form.Row>

              {/* Programme Talk Details */}
              <Form.Row className="justify-content-center addProgTalkFormRow">
                <Col md="11" className="addProgTalkFormCol">
                  <Form.Label className="addProgTalkFormLabel">Programme Talk Details</Form.Label>
                  
                  <FormControl as="textarea" rows="8" required noValidate id="addProgTalkForm_ProgTalkDetails" placeholder="Programme Talk Details" />
                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Add Programme Talk Submit Btn*/}
            <Button type="submit" id="addProgTalkFormBtn">Submit</Button>
          </Modal.Footer>
        </Modal>


        {/* Edit Programme Talk Modal */}
        <Modal 
          show={this.state.editProgTalkModal}
          onHide={this.handleEditProgTalkModal}
          aria-labelledby="editProgTalkModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="editProgTalkModal"
        >
          {/* <EditProgTalkModal handleSaveChanges={()=>{console.log("Edit Modal Saved")}} handleCancelEdit={this.handleEditProgTalkModal} /> */}
          <Modal.Header closeButton className="justify-content-center">
              <Modal.Title id="editProgTalkModalTitle" className="w-100">
                  Edit Programme Talk
              </Modal.Title>
          </Modal.Header>

          <Modal.Body id="editProgTalkModalBody">
            <Form noValidate onSubmit={()=>{this.editProgTalk(this.state.id)}}>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="editProgTalkFormCol text-center">
                  {/* Programme Name */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="talkName" defaultValue={this.state.talkName} onChange={this.updateInput} id="editProgTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Programme Talk Venue */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="venue" defaultValue={this.state.venue} onChange={this.updateInput} id="editProgTalkForm_Venue" placeholder="Venue*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Capacity Limit */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faChair} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="number" min="0" name="endTime" defaultValue={this.state.capacityLimit} onChange={this.updateInput} id="editProgTalkForm_Capacity" placeholder="Capacity Limit*" required />
                      </InputGroup>
                    </Col>
                  </ Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="startTime" defaultValue={this.state.startTime} onChange={this.updateInput} id="editProgTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                      </InputGroup>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="endTime" defaultValue={this.state.endTime} onChange={this.updateInput} id="editProgTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                      </InputGroup>
                    </Col>
                  </Form.Row>
                    
                </Col>

                {/* Right Col */}
                <Col md="6" className="editProgTalkFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <Form.Control as="select" name="date" defaultValue={this.state.date} onChange={this.updateInput} className="editProgTalkFormSelect" required noValidate>
                          <option value="chooseDate" className="editProgTalkFormSelectOption">Choose an Openhouse Date</option>
                          
                          {/* To be retrieved from DB */}
                          <option value={this.state.day1Date} className="editProgTalkFormSelectOption">{this.state.day1Date}</option>
                          <option value={this.state.day2Date} className="editProgTalkFormSelectOption">{this.state.day2Date}</option>

                        </Form.Control>                                        
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editProgTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editProgTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="uniName" defaultValue={this.state.awardingUni} onChange={this.updateInput} className="editProgTalkFormSelect" required noValidate>
                          <option value="chooseUni" className="editProgTalkFormSelectOption">Choose a University</option>
                          
                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                              <>
                                {/* To be retrieved from DB */}
                                <option value={uni.universityName} className="editProgTalkFormSelectOption">{uni.universityName}</option>
                              </>
                            );
                          })}
                        </Form.Control>
                      </InputGroup>
                    </Col>
                  </Form.Row>

                  {/* Discipline Name */}
                  <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                    <Col md="10" className="text-left editProgTalkForm_InnerCol">
                      <Form.Label className="editProgTalkFormLabel">Choose Discipline(s):</Form.Label>                                     
                          
                      <Container className="editProgTalkForm_DisciplineCon">
                        {/* To be retrieved from db - row is generated dynamically */}
                        {this.state.disciplineList && this.state.disciplineList.map((discipline) => {
                          return (
                            <>
                              <Row key={discipline.disciplineId}>
                                <Col>
                                  <Form.Check name="discipline" value={discipline.disciplineName} onChange={this.updateInput} defaultChecked={this.state.discipline.indexOf(discipline.disciplineName) > -1} type="checkbox" label={discipline.disciplineName} className="editProgTalkForm_CheckBox" />
                                </Col>
                              </Row>
                            </>
                          );
                        })}

                      </Container>                                        
                    </Col>
                  </Form.Row>

                </Col>
              </Form.Row>

              {/* Programme Talk Details */}
              <Form.Row className="justify-content-center editProgTalkFormRow">
                <Col md="11" className="editProgTalkFormCol">
                  <Form.Label className="editProgTalkFormLabel">Programme Talk Details</Form.Label>

                  <FormControl as="textarea" rows="8" defaultValue={this.state.progTalkDetails} onChange={this.updateInput} required noValidate id="editProgTalkForm_ProgTalkDetails" placeholder="Programme Talk Details" />
                </Col>
              </Form.Row>
            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Programme Talk Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesProgTalkFormBtn" onClick={this.handleSaveChanges}>Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditProgTalkFormBtn" onClick={this.handleEditProgTalkModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>


        {/* Delete Programme Talk Modal */}
        <Modal 
          show={this.state.deleteProgTalkModal}
          onHide={this.handleDeleteProgTalkModal}
          aria-labelledby="deleteProgTalkModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteProgTalkModal handleConfirmDelete={ (e) => {this.DeleteProgrammeTalk(e, this.state.id)} } handleCancelDelete={this.handleDeleteProgTalkModal} />
        </Modal>

      </div>
    );
  }
}
export default ProgrammeTalkSchedule;
