import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/ProgrammeTalkPastRec.css";
import "../../../css/Marketing_Administrator/PastRecModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import DeletePastRecModal from "../../../components/Marketing_Administrator/OpenHouseProgrammes/DeletePastRecModal";


const initialStates = {
  pastRecError: "",
  universityError: "",
  startTimeError: "",
  endTimeError: "",
  dateError: "",
  venueError: "",
  urlError: "", 
  disciplineError: ""
}

class PastRecording extends Component {
  state = initialStates;

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
      url: "",
      id: "",
      details: "",
      discipline: [],
      day1: [
        {
          docid : "",
          id: "",
          talkName: "",
          awardingUni : "",
          startTime:  "",     
          endTime: "",
          date: "",
          venue: "",
          capacityLimit: "",
          noRegistered: "",
          hasRecording: "",
          url : "",
          isLive: "",
          details: "",
          discipline: [],
          day1_counter: ""
        }
      ],
      day2: [
        {
          docid : "",
          id: "",
          talkName: "",
          awardingUni : "",
          startTime:  "",     
          endTime: "",
          date: "",
          venue: "",
          capacityLimit: "",
          noRegistered: "",
          hasRecording: "",
          url : "",
          isLive: "",
          details: "",
          discipline: [],
          day2_counter: ""
        }
      ],
      day1Date: "",
      day2Date: "",
      openHouseDay1: "",
      openHouseDay2: "",

      // University collection
      uniId: "",
      universityName: "",
      uniList: [],

      // Discipline collection
      disciplineId: "",
      disciplineName: "",
      disciplineList: [],

      addPastRecModal: false,
      editPastRecModal: false,
      deletePastRecModal: false
    };
    this.resetForm = this.resetForm.bind(this);
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {
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
    
    const pastrecording = [];

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

    // Retrieve Open House Dates from Openhouse Collection
    const dates = [];
    db.collection("Openhouse").get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.get('day');
        for (var i = 0; i < Object.keys(data).length; i++) {
          const retrieved = {
              date: data[Object.keys(data)[i]].date
          };
          dates.push(retrieved)
        }
      });
      this.setState({openHouseDates: dates})
      this.setState({openHouseDay1: dates[0].date}) // Use date from OpenHouse  
      this.setState({openHouseDay2: dates[1].date}) // Use date from OpenHouse       
      var day1_counter = 1;

      const day1  = db
      .collection("ProgrammeTalks").where("date", "==", dates[0].date)
      .where("hasRecording", "==", true)
      .get()
      .then((snapshot) => {
        const pastRecording = [];
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
            capacityLimit: doc.data().capacityLimit.toString(),
            noRegistered: doc.data().noRegistered.toString(),
            hasRecording: doc.data().hasRecording.toString(),
            url: doc.data().url,
            isLive: doc.data().isLive.toString(),
            details: doc.data().details,
            discipline: doc.data().discipline,
            day1_counter: day1_counter,
          };
          day1_counter++
          pastRecording.push(data);
        });
        this.setState({ day1: pastRecording });
      })

      //day 2
      var day2_counter = 1

      const day2  = db
      .collection("ProgrammeTalks").where("date", "==", dates[1].date)
      .where("hasRecording", "==", true)
      .get()
      .then((snapshot) => {
        const pastRecording = [];
        snapshot.forEach((doc) => {
          const data = {
            docid: doc.id,
            id: doc.data().id,
            talkName:doc.data().talkName,
            awardingUni: doc.data().awardingUni,
            startTime:  doc.data().startTime,     
            endTime: doc.data().endTime,
            date: doc.data().date,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit.toString(),
            noRegistered: doc.data().noRegistered.toString(),
            hasRecording: doc.data().hasRecording.toString(),
            url: doc.data().url,
            isLive: doc.data().isLive.toString(),
            details: doc.data().details,
            discipline: doc.data().discipline,
            day2_counter: day2_counter,
          };
          day2_counter++
          pastRecording.push(data);
        });
        this.setState({ day2: pastRecording });   
      })
    })
  }

  addPastRecording = (e) => {
    e.preventDefault();

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      var lastdoc = db.collection("ProgrammeTalks").orderBy('id','desc')
      .limit(1).get().then((snapshot) =>  {
        snapshot.forEach((doc) => {
          var docid= "";
          var res = doc.data().id.substring(8, 5);
          var id = parseInt(res);
          id += 1

          if(id.toString().length == 1){
            docid= "talk-00" + (id) 
          }
          else if(id.toString().length == 2){
            docid= "talk-0" + (id) 
            }
          else{
            docid="talk-" + (id) 
          }

          db
          .collection("ProgrammeTalks")
          .doc(docid)
          .set({
            awardingUni: this.state.awardingUni,
            capacityLimit: +this.state.capacityLimit,
            date: this.state.date,
            endTime: this.state.endTime,
            hasRecording: true,
            isLive: false,
            noRegistered: +this.state.noRegistered,
            startTime: this.state.startTime,
            talkName: this.state.talkName,
            venue: this.state.venue,
            url: this.state.url,
            id: docid,
            details: this.state.details,
            discipline: this.state.discipline,
          })
          .then(dataSnapshot => {
            this.display();
            this.setState({addPastRecModal: false}); 
          });
        })
      })
    }
  };

  DeletePastRecording(e, pastrecordingid) {
    const userRef = db
    .collection("ProgrammeTalks")
    .doc(pastrecordingid)
    .delete()
    .then(dataSnapshot => {
      this.display();
      this.setState({deletePastRecModal: false}); 
    });
  }

  editPastRecording(e, pastrecordingid) {
    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      db
      .collection("ProgrammeTalks")
      .doc(this.state.id)
      .update({
          awardingUni: this.state.awardingUni,
          endTime: this.state.endTime,
          startTime: this.state.startTime,
          talkName: this.state.talkName,
          venue: this.state.venue,
          date: this.state.date,
          discipline: this.state.discipline,
          url: this.state.url
      })
      .then(dataSnapshot => {
        this.setState({
          editPastRecModal: false
        })
        this.display()
      }); 
    }
  }

  /* Checkbox - Discipline */
  handleCheckbox = (event) => {
    let disciplineArray = this.state.discipline
    if (disciplineArray.includes(event.target.value)) {
      disciplineArray = disciplineArray.filter(discipline => discipline !== event.target.value)
    } else {
      disciplineArray.push(event.target.value);
    }
    this.setState({discipline: disciplineArray});
  }

  /* Add Past Rec Modal */
  handleAddPastRecModal = () => {
    if (this.state.addPastRecModal == false) {
      this.setState({
        addPastRecModal: true,
        discipline: []
      });
    }
    else {
      this.setState({
        addPastRecModal: false
      });
      this.resetForm();
    }
  };

  /* Edit Past Rec Modal */
  handleEditPastRecModal = (day) => {
    if (this.state.editPastRecModal == false) {
      this.setState({
        id: day.id,
        editPastRecModal: true,
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
        url: day.url,
        details: day.details,
        discipline: day.discipline
      })
    }
    else {
      this.setState({
        editPastRecModal: false
      });
      this.resetForm();
    }
  };

  /* Delete Past Rec Modal */
  handleDeletePastRecModal = (id) => {
    if (this.state.deletePastRecModal == false) {
      this.setState({
        deletePastRecModal: true,
      });
      this.state.id = id;
    }
    else {
      this.setState({
        deletePastRecModal: false
      });
    }
  };

  //Validations for the Forms in Modals
  validate = () => {
    let pastRecError = "";
    let venueError = "";
    let startTimeError = "";
    let endTimeError = "";
    let dateError = "";
    let universityError = "";
    let disciplineError = ""
    let urlError = "";

    if ( !(this.state.talkName && this.state.talkName.length >= 4) ) {
      pastRecError = "Please enter a valid recording name!";
    } 
    
    if (!this.state.awardingUni) {
      universityError = "Please select a valid university!";
    }

    if (! (this.state.venue && this.state.venue.length >= 3) ) {
      venueError = "Please enter a valid venue. E.g. SIM HQ BLK A Atrium!";
    }

    if ( !(this.state.startTime.includes(":") && (this.state.startTime.includes("AM") || this.state.startTime.includes("PM"))) ) {
      startTimeError = "Please enter a valid start time. E.g. 1:30PM";
    }

    if ( !(this.state.endTime.includes(":") && (this.state.endTime.includes("AM") || this.state.endTime.includes("PM"))) ) {
      endTimeError = "Please enter a valid end time. E.g. 2:30PM";
    }

    if (!this.state.date) {
      dateError = "Please select a valid date!";
    }

    if (this.state.discipline.length == 0) {
      disciplineError = "Please select at least 1 discipline!";
    }

    if ( !(this.state.url.includes(":") && this.state.url.includes("/")) ) {  
      urlError = "Please enter a valid url!";
    }

    if (pastRecError || universityError || venueError || startTimeError || endTimeError || dateError || disciplineError || urlError ) {
      this.setState({
        pastRecError, universityError, venueError, startTimeError, endTimeError, dateError, disciplineError,
        urlError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      pastRecError: "",
      venueError: "",
      startTimeError: "",
      endTimeError: "",
      dateError: "",
      universityError: "",
      disciplineError: "",
      urlError: "",
      id: "", 
      talkName: "", 
      venue: "", 
      startTime: "", 
      endTime: "", 
      date: "", 
      awardingUni: "",
      discipline: [],
      url: ""
    })
  }


  render() {
    return (
      <div>
        <Container fluid className="MAPastRecCon">
          <NavBar isMA={true} />

          <Container fluid className="MAPastRecContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAPastRecContentCon">
                  {/* Past Recordings Page Header row */}
                  <Row id="MAPastRecContentHeaderRow" className="justify-content-center">
                    <Col md="6" className="text-left MAPastRecContentHeaderCol">
                      <h4 id="MAPastRecHeaderText">Past Recordings</h4>
                    </Col>

                    <Col md="6" className="text-right MAPastRecContentHeaderCol">
                      <Button id="addPastRecBtn" onClick={this.handleAddPastRecModal}>
                        <FontAwesomeIcon size="lg" id="addPastRecBtnIcon" icon={faPlus} />
                        <span id="addPastRecBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="MAPastRecContentTabRow">
                    <Col md="12" className="MAPastRecContentTabCol">

                      <Tab.Container defaultActiveKey="day1">
                        <Row className="MAPastRecTabConRow">
                          <Col md="12" className="MAPastRecTabConCol">
                            <Nav defaultActiveKey="day1" className="MAPastRecTabNav" variant="tabs">
                              <Col md="6" className="MAPastRecTabConInnerCol text-center">
                                <Nav.Item className="MAPastRecTab_NavItem">
                                  <Nav.Link eventKey="day1" className="MAPastRecTab_Day">{this.state.openHouseDay1}</Nav.Link>
                                </Nav.Item>
                              </Col>  

                              <Col md="6" className="MAPastRecTabConInnerCol text-center">
                                <Nav.Item className="MAPastRecTab_NavItem">
                                  <Nav.Link eventKey="day2" className="MAPastRecTab_Day">{this.state.openHouseDay2}</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>
                          </Col>

                        </Row>

                        <Row className="MAPastRecTabConRow justify-content-center">
                          <Col md="12" className="MAPastRecTabConCol text-center">
                            <Tab.Content id="MAPastRecTabPane_Day1">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="day1">
                                <Col md="12" className="MAPastRecTabpaneCol">
                                  <Table responsive="sm" bordered id="MAPastRecTable_Day1">
                                    <thead>
                                      <tr>
                                        <th className="pastRecHeader_SNo">S/N</th>
                                        <th className="pastRecHeader_ProgTalk">Programme Talk</th>
                                        <th className="pastRecHeader_AwardingUni">Awarding University</th>
                                        <th className="pastRecHeader_StartTime">Start Time</th>
                                        <th className="pastRecHeader_EndTime">End Time</th>
                                        <th className="pastRecHeader_Venue">Venue</th>
                                        <th className="pastRecHeader_File">File</th>
                                        <th className="pastRecHeader_Discipline">Discipline(s)</th>
                                        <th className="pastRecHeader_Edit">Edit</th>
                                        <th className="pastRecHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {this.state.day1 && this.state.day1.map((day1) => {
                                        return (
                                          <tr key={day1.docid}>
                                            <td className="pastRecData_SNo text-center">{day1.day1_counter}</td>
                                            <td className="pastRecData_ProgTalk text-left">{day1.talkName}</td>
                                            <td className="pastRecData_AwardingUni text-center">{day1.awardingUni}</td>
                                            <td className="pastRecData_StartTime text-left">{day1.startTime}</td>
                                            <td className="pastRecData_EndTime text-left">{day1.endTime}</td>
                                            <td className="pastRecData_Venue text-left">{day1.venue}</td>
                                            <td className="pastRecData_File text-left">
                                              <a href={day1.url} className="pastRecData_FileUrl">{day1.url}</a>
                                            </td>
                                            <td className="pastRecData_Discipline text-center">
                                              {day1.discipline && day1.discipline.map((discipline) => {
                                                return(
                                                  <Row className="justify-content-center">
                                                    <Col className="text-left">- {discipline}</Col>
                                                  </Row>
                                                );
                                              })}
                                            </td>
                                            <td className="pastRecData_Edit text-center">
                                              <Button id="editPastRecBtn" onClick={()=>this.handleEditPastRecModal(day1)}>
                                                <FontAwesomeIcon size="lg" id="editPastRecBtnIcon" icon={faEdit} />
                                              </Button>
                                            </td>
                                            <td className="pastRecData_Delete text-center">
                                              <Button id="deletePastRecBtn" onClick={(e) => this.handleDeletePastRecModal(day1.id)}>
                                                <FontAwesomeIcon size="lg" id="deletePastRecBtnIcon" icon={faTrashAlt} />
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
                                <Col md="12" className="MAPastRecTabpaneCol">
                                  <Table responsive="sm" bordered id="MAPastRecTable_Day2">
                                    <thead>
                                      <tr>
                                        <th className="pastRecHeader_SNo">S/N</th>
                                        <th className="pastRecHeader_ProgTalk">Programme Talk</th>
                                        <th className="pastRecHeader_AwardingUni">Awarding University</th>
                                        <th className="pastRecHeader_StartTime">Start Time</th>
                                        <th className="pastRecHeader_EndTime">End Time</th>
                                        <th className="pastRecHeader_Venue">Venue</th>
                                        <th className="pastRecHeader_File">File</th>
                                        <th className="pastRecData_Discipline">Discipline(s)</th>
                                        <th className="pastRecData_Edit">Edit</th>
                                        <th className="pastRecData_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {this.state.day2 && this.state.day2.map((day2) => {
                                        return (
                                          <tr key={day2.docid}>
                                            <td className="pastRecData_SNo text-center">{day2.day2_counter}</td>
                                            <td className="pastRecData_ProgTalk text-left">{day2.talkName}</td>
                                            <td className="pastRecData_AwardingUni text-center">{day2.awardingUni}</td>
                                            <td className="pastRecData_StartTime text-left">{day2.startTime}</td>
                                            <td className="pastRecData_EndTime text-left">{day2.endTime}</td>
                                            <td className="pastRecData_Venue text-left">{day2.venue}</td>
                                            <td className="pastRecData_File text-left">
                                              <a href={day2.url} className="pastRecData_FileUrl">{day2.url}</a>
                                            </td>
                                            <td className="pastRecData_Discipline text-center">
                                              {day2.discipline && day2.discipline.map((discipline) => {
                                                return(
                                                  <Row className="justify-content-center">
                                                    <Col className="text-left">- {discipline}</Col>
                                                  </Row>
                                                );
                                              })}
                                            </td>
                                            <td className="pastRecData_Edit text-center">
                                              <Button id="editPastRecBtn" onClick={()=>this.handleEditPastRecModal(day2)}>
                                                <FontAwesomeIcon size="lg" id="editPastRecBtnIcon" icon={faEdit} />
                                              </Button>
                                            </td>
                                            <td className="pastRecData_Delete text-center">
                                              <Button id="deletePastRecBtn" onClick={(e) => this.handleDeletePastRecModal(day2.id)}>
                                                <FontAwesomeIcon size="lg" id="deletePastRecBtnIcon" icon={faTrashAlt} />
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

        
        {/* Add Past Rec Modal */}
        <Modal 
          show={this.state.addPastRecModal}
          onHide={this.handleAddPastRecModal}
          aria-labelledby="addPastRecModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
          className="addPastRecModal"
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="addPastRecModalTitle" className="w-100">
              Add Recording
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="addPastRecModalBody">
            <Form noValidate>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="addPastRecCol text-center">
                  {/* Programme Name */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="talkName" onChange={this.updateInput} id="addPastRecForm_ProgTalkName" placeholder="Name of Recording*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.pastRecError}</div>
                    </Col>
                  </Form.Row>

                  {/* Programme Talk Venue */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="venue" onChange={this.updateInput} id="addPastRecForm_Venue" placeholder="Venue*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.venueError}</div>
                    </Col>
                  </Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="startTime" onChange={this.updateInput} id="addPastRecForm_ProgTalkStartTime" placeholder="Start Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.startTimeError}</div>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="endTime" onChange={this.updateInput} id="addPastRecForm_ProgTalkEndTime" placeholder="End Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.endTimeError}</div>
                    </Col>
                  </Form.Row>
                  
                  {/* URL */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-left">
                      <Form.Label className="addPastRecFormLabel">Recording URL</Form.Label>                                     
                      <FormControl as="textarea" name="url" rows="4" onChange={this.updateInput} required noValidate id="addPastRecForm_PastRecURL" placeholder="Past Recording URL*" />                                       
                      
                      <div className="errorMessage text-left">{this.state.urlError}</div>
                    </Col>
                  </Form.Row>
                </Col>

                {/* Right Col */}
                <Col md="6" className="addPastRecFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                              <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <Form.Control as="select" name="date" defaultValue="" onChange={this.updateInput} className="addPastRecFormSelect" required noValidate>
                            <option value="" className="addPastRecFormSelectOption">Choose an Openhouse Date</option>
                            <option value={this.state.openHouseDay1} className="addPastRecFormSelectOption">{this.state.openHouseDay1}</option>
                            <option value={this.state.openHouseDay2} className="addPastRecFormSelectOption">{this.state.openHouseDay2}</option>
                        </Form.Control>                                        
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.dateError}</div>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="awardingUni" defaultValue="" onChange={this.updateInput} className="addPastRecFormSelect" required noValidate>
                          <option value="" className="addPastRecFormSelectOption">Choose a University</option>

                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                              <>
                                <option value={uni.universityName} className="addPastRecFormSelectOption">{uni.universityName}</option>
                              </>
                            );
                          })}
                        </Form.Control>
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.universityError}</div>
                    </Col>
                  </Form.Row>

                  {/* Discipline Name */}
                  <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                    <Col md="10" className="text-left addPastRecForm_InnerCol">
                      <Form.Label className="addPastRecFormLabel">Choose Discipline(s):</Form.Label>                                     
                          
                      <Container className="addPastRecForm_DisciplineCon">
                        {this.state.disciplineList && this.state.disciplineList.map((discipline) => {
                          return (
                            <>
                              <Row key={discipline.disciplineId}>
                                <Col>
                                  <Form.Check name="discipline" value={discipline.disciplineName} onChange={this.handleCheckbox} type="checkbox" label={discipline.disciplineName} className="addPastRecForm_CheckBox" />
                                </Col>
                              </Row>
                            </>
                          );
                        })}

                      </Container>         

                      <div className="errorMessage text-left">{this.state.disciplineError}</div>                               
                    </Col>
                  </Form.Row>

                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Add Past Rec Submit Btn*/}
            <Button type="submit" id="addPastRecFormBtn" onClick={this.addPastRecording}>Submit</Button>
          </Modal.Footer>        
        </Modal>


        {/* Edit Past Rec Modal */}
        <Modal 
          show={this.state.editPastRecModal}
          onHide={this.handleEditPastRecModal}
          aria-labelledby="editPastRecModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
          className="editPastRecModal"
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="editPastRecModalTitle" className="w-100">
              Edit Recording
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="editPastRecModalBody">
            <Form noValidate onSubmit={()=>{this.editPastRecording()}}>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="editPastRecCol text-center">
                  {/* Programme Name */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="talkName" defaultValue={this.state.talkName} onChange={this.updateInput} id="editPastRecForm_ProgTalkName" placeholder="Name of Recording*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.pastRecError}</div>
                    </Col>
                  </Form.Row>

                  {/* Programme Talk Venue */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="venue" defaultValue={this.state.venue} onChange={this.updateInput} id="editPastRecForm_Venue" placeholder="Venue*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.venueError}</div>
                    </Col>
                  </Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="startTime" defaultValue={this.state.startTime} onChange={this.updateInput} id="editPastRecForm_ProgTalkStartTime" placeholder="Start Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.startTimeError}</div>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="endTime" defaultValue={this.state.endTime} onChange={this.updateInput} id="editPastRecForm_ProgTalkEndTime" placeholder="End Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.endTimeError}</div>
                    </Col>
                  </Form.Row>

                  {/* URL */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-left">
                      <Form.Label className="editPastRecFormLabel">Recording URL</Form.Label>                                     
                      <FormControl as="textarea" name="url" rows="4" defaultValue={this.state.url} onChange={this.updateInput} required noValidate id="editPastRecForm_PastRecURL" placeholder="Past Recording URL*" />                                       
                      
                      <div className="errorMessage text-left">{this.state.urlError}</div>
                    </Col>
                  </Form.Row>
                </Col>

                {/* Right Col */}
                <Col md="6" className="editPastRecFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <Form.Control as="select" name="date" defaultValue={this.state.date} onChange={this.updateInput} className="editPastRecFormSelect" required noValidate>
                          <option value="" className="editPastRecFormSelectOption">Choose an Openhouse Date</option>

                          <option value={this.state.openHouseDay1} className="editPastRecFormSelectOption">{this.state.openHouseDay1}</option>
                          <option value={this.state.openHouseDay2} className="editPastRecFormSelectOption">{this.state.openHouseDay2}</option>
                        </Form.Control>                                        
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.dateError}</div>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editPastRecFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editPastRecFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="awardingUni" defaultValue={this.state.awardingUni} onChange={this.updateInput} className="editPastRecFormSelect" required noValidate>
                          <option value="" className="editPastRecFormSelectOption">Choose a University</option>

                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                              <>
                                <option value={uni.universityName} className="editPastRecFormSelectOption">{uni.universityName}</option>
                              </>
                            );
                          })}
                        </Form.Control>
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.universityError}</div>
                    </Col>
                  </Form.Row>

                  {/* Discipline Name */}
                  <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                    <Col md="10" className="text-left editPastRecForm_InnerCol">
                      <Form.Label className="editPastRecFormLabel">Choose Discipline(s):</Form.Label>                                     
                          
                      <Container className="editPastRecForm_DisciplineCon">
                        {this.state.disciplineList && this.state.disciplineList.map((discipline) => {
                          return (
                            <>
                              <Row key={discipline.disciplineId}>
                                <Col>
                                  <Form.Check name="discipline" value={discipline.disciplineName} onChange={this.handleCheckbox} defaultChecked={this.state.discipline.indexOf(discipline.disciplineName) > -1} type="checkbox" label={discipline.disciplineName} className="editPastRecForm_CheckBox" />
                                </Col>
                              </Row>
                            </>
                          );
                        })}

                      </Container>     

                      <div className="errorMessage text-left">{this.state.disciplineError}</div>                                   
                    </Col>
                  </Form.Row>

                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Past Rec Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesPastRecFormBtn" onClick={(e) => {this.editPastRecording()}}>Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditPastRecFormBtn" onClick={this.handleEditPastRecModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>


        {/* Delete Past Rec Modal */}
        <Modal 
          show={this.state.deletePastRecModal}
          onHide={this.handleDeletePastRecModal}
          aria-labelledby="deletePastRecModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeletePastRecModal handleConfirmDelete={ (e) => {this.DeletePastRecording(e, this.state.id)} } handleCancelDelete={this.handleDeletePastRecModal} />
        </Modal>

      </div>
    );
  }
}

export default PastRecording;
