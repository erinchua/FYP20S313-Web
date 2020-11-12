import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, InputGroup, FormControl } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/ProgrammeTalkLiveTalk.css";
import "../../../css/Marketing_Administrator/LiveTalkModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMicrophone, faSchool, faUniversity, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import DeleteLiveTalkModal from "../../../components/Marketing_Administrator/OpenHouseProgrammes/DeleteLiveTalkModal";


const initialStates = {
  liveTalkError: "",
  universityError: "",
  startTimeError: "",
  endTimeError: "",
  dateError: "",
  venueError: "",
  urlError: ""
}

class LiveTalk extends Component {
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
      progTalkDetails: "",
      day1: [],
      day2: [],
      openHouseDay1: "",
      openHouseDay2: "",
      day1Date: "",
      day2Date: "",

      // University collection
      uniId: "",
      universityName: "",
      uniList: [],

      addLiveTalkModal: false,
      editLiveTalkModal: false,
      deleteLiveTalkModal: false,
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
    const livetalk = [];

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

      db
      .collection("ProgrammeTalks").where("date", "==", dates[0].date)
      .where("isLive", "==", true)
      .get()
      .then((snapshot) => {
        const livetalk = [];
        snapshot.forEach((doc) => {
          const data = {
            docid : doc.id,
            id: doc.data().id,
            talkName: doc.data().talkName,
            awardingUni: doc.data().awardingUni,
            startTime: doc.data().startTime,     
            endTime: doc.data().endTime,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit.toString(),
            noRegistered: doc.data().noRegistered.toString(),
            hasRecording: doc.data().hasRecording.toString(),
            url: doc.data().url,
            isLive: doc.data().isLive.toString(),
            date: doc.data().date,
            day1_counter: day1_counter
          };
          day1_counter++
          livetalk.push(data);
        });
        this.setState({ day1: livetalk });            
      });

      //day 2
      var day2_counter = 1
      
      db
      .collection("ProgrammeTalks").where("date", "==", dates[1].date)
      .where("isLive", "==", true)
      .get()
      .then((snapshot) => {
        const livetalk = [];
        snapshot.forEach((doc) => {
          const data = {
            docid : doc.id,
            id: doc.data().id,
            talkName:doc.data().talkName,
            awardingUni : doc.data().awardingUni,
            startTime:  doc.data().startTime,     
            endTime: doc.data().endTime,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit.toString(),
            noRegistered: doc.data().noRegistered.toString(),
            hasRecording: doc.data().hasRecording.toString(),
            url : doc.data().url,
            isLive: doc.data().isLive.toString(),
            date: doc.data().date,
            day2_counter: day2_counter
          };
          day2_counter++
          livetalk.push(data);
        });
        this.setState({ day2: livetalk });   
      });
    })
  }

  addLiveTalks = (e) => {
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

          const userRef = db
          .collection("ProgrammeTalks")
          .doc(docid)
          .set({
            awardingUni: this.state.awardingUni,
            capacityLimit: +this.state.capacityLimit,
            date: this.state.date,
            endTime: this.state.endTime,
            hasRecording: false,
            isLive: true,
            noRegistered: +this.state.noRegistered,
            startTime: this.state.startTime,
            talkName: this.state.talkName,
            venue: this.state.venue,
            url: this.state.url,
            id: docid
          })
          .then(dataSnapshot => {
            this.display();
            this.setState({addLiveTalkModal: false}); 
          });
        })
      })
    }
  };

  DeleteLiveTalk(e, livetalkid) {
    const userRef = db
    .collection("ProgrammeTalks")
    .doc(livetalkid)
    .delete()
    .then(dataSnapshot => {
      this.display();
      this.setState({deleteLiveTalkModal: false}); 
    });
  }

  editLiveTalk(e, livetalkid) {
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
          url: this.state.url
      })
      .then(dataSnapshot => {
        this.setState({
          editLiveTalkModal: false
        })
        this.display()
      }); 
    }
  }

  /* Add Live Talk Modal */
  handleAddLiveTalkModal = () => {
    if (this.state.addLiveTalkModal == false) {
      this.setState({
        addLiveTalkModal: true,
      });
    }
    else {
      this.setState({
        addLiveTalkModal: false
      });
      this.resetForm();
    }
  };

  /* Edit Live Talk Modal */
  handleEditLiveTalkModal = (day) => {
    if (this.state.editLiveTalkModal == false) {
      this.setState({
        id: day.id,
        editLiveTalkModal: true,
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
      });
    }
    else {
      this.setState({
        editLiveTalkModal: false
      });
      this.resetForm();
    }
  };

  /* Delete Live Talk Modal */
  handleDeleteLiveTalkModal = (id) => {
    if (this.state.deleteLiveTalkModal == false) {
      this.setState({
        deleteLiveTalkModal: true,
      });
      this.state.id = id;
    }
    else {
      this.setState({
        deleteLiveTalkModal: false
      });
    }
  };
  
  //Validations for the Forms in Modals
  validate = () => {
    let liveTalkError = "";
    let universityError = "";
    let startTimeError = "";
    let endTimeError = "";
    let dateError = "";
    let venueError = "";
    let urlError = "";

    if ( !(this.state.talkName && this.state.talkName.length >= 4) ) {
      liveTalkError = "Please enter a valid live talk name!";
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

    if ( !(this.state.url.includes(":") && this.state.url.includes("/")) ) {
      urlError = "Please enter a valid url!";
    }

    if (liveTalkError || universityError || venueError || startTimeError || endTimeError || dateError || urlError) {
      this.setState({
        liveTalkError, universityError, venueError, startTimeError, endTimeError, dateError, urlError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      liveTalkError: "",
      universityError: "",
      startTimeError: "",
      endTimeError: "",
      dateError: "",
      venueError: "",
      urlError: "",
      id: "", 
      talkName: "", 
      venue: "", 
      startTime: "", 
      endTime: "", 
      date: "", 
      awardingUni: "",
      url: ""
    })
  }


  render() {
    return (
      <div>
        <Container fluid className="MAProgLiveTalkCon">
          <NavBar isMA={true} />

          <Container fluid className="MAProgLiveTalkContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAProgLiveTalkContentCon">
                  {/* Live Stream Page Header row */}
                  <Row id="MAProgLiveTalkContentHeaderRow" className="justify-content-center">
                    <Col md="6" className="text-left MAProgLiveTalkContentHeaderCol">
                      <h4 id="MAProgLiveTalkHeaderText">Live Talks</h4>
                    </Col>

                    <Col md="6" className="text-right MAProgLiveTalkContentHeaderCol">
                      <Button id="addProgLiveTalkBtn" onClick={this.handleAddLiveTalkModal}>
                        <FontAwesomeIcon size="lg" id="addProgLiveTalkBtnIcon" icon={faPlus} />
                        <span id="addProgLiveTalkBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="MAProgLiveTalkContentTabRow">
                    <Col md="12" className="MAProgLiveTalkContentTabCol">

                      <Tab.Container defaultActiveKey="day1">
                        <Row className="MAProgLiveTalkTabConRow">
                          <Col md="12" className="MAProgLiveTalkTabConCol">
                            <Nav defaultActiveKey="day1" className="MAProgLiveTalkTabNav" variant="tabs">
                              <Col md="6" className="MAProgLiveTalkTabConInnerCol text-center">
                                <Nav.Item className="MAProgLiveTalkTab_NavItem">
                                  <Nav.Link eventKey="day1" className="MAProgLiveTalkTab_Day">{this.state.openHouseDay1}</Nav.Link>
                                </Nav.Item>
                              </Col>

                              <Col md="6" className="MAProgLiveTalkTabConInnerCol text-center">
                                <Nav.Item className="MAProgLiveTalkTab_NavItem">
                                  <Nav.Link eventKey="day2" className="MAProgLiveTalkTab_Day">{this.state.openHouseDay2}</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>

                          </Col>
                        </Row>

                        <Row className="MAProgLiveTalkTabConRow justify-content-center">
                          <Col md="12" className="MAProgLiveTalkTabConCol text-center">
                            <Tab.Content id="MAProgLiveTalkTabPane_Day1">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="day1">
                                <Col md="12" className="MAProgLiveTalkTabpaneCol">
                                  <Table responsive="sm" bordered id="MAProgLiveTalkTable_Day1">
                                    <thead>
                                      <tr>
                                        <th className="progLiveTalkHeader_SNo">S/N</th>
                                        <th className="progLiveTalkHeader_ProgTalk">Programme Talk</th>
                                        <th className="progLiveTalkHeader_AwardingUni">Awarding University</th>
                                        <th className="progLiveTalkHeader_StartTime">Start Time</th>
                                        <th className="progLiveTalkHeader_EndTime">End Time</th>
                                        <th className="progLiveTalkHeader_Venue">Venue</th>
                                        <th className="progLiveTalkHeader_Url">Live Stream URL</th>
                                        <th className="progLiveTalkHeader_Edit">Edit</th>
                                        <th className="progLiveTalkHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {this.state.day1 && this.state.day1.map((day1) => {
                                        return (
                                          <tr key={day1.id}>
                                            <td className="progLiveTalkData_SNo text-center">{day1.day1_counter}</td>
                                            <td className="progLiveTalkData_ProgTalk text-left">{day1.talkName}</td>
                                            <td className="progLiveTalkData_AwardingUni text-center">{day1.awardingUni}</td>
                                            <td className="progLiveTalkData_StartTime text-left">{day1.startTime}</td>
                                            <td className="progLiveTalkData_EndTime text-left">{day1.endTime}</td>
                                            <td className="progLiveTalkData_Venue text-left">{day1.venue}</td>
                                            <td className="progLiveTalkData_Url text-left">
                                              <a href={day1.url} className="progLiveTalkData_UrlHref">{day1.url}</a>
                                            </td>
                                            <td className="progLiveTalkData_Edit text-center">
                                              <Button id="editProgLiveTalkBtn" onClick={()=>this.handleEditLiveTalkModal(day1)}>
                                                <FontAwesomeIcon size="lg" id="editProgLiveTalkBtnIcon" icon={faEdit} />
                                              </Button>
                                            </td>
                                            <td className="progLiveTalkData_Delete text-center">
                                              <Button id="deleteProgLiveTalkBtn" onClick={(e) => this.handleDeleteLiveTalkModal(day1.id)}>
                                                <FontAwesomeIcon size="lg" id="deleteProgLiveTalkBtnIcon" icon={faTrashAlt} />
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
                                <Col md="12" className="MAProgLiveTalkTabpaneCol">
                                  <Table responsive="sm" bordered id="MAProgLiveTalkTable_Day2">
                                    <thead>
                                      <tr>
                                        <th className="progLiveTalkHeader_SNo">S/N</th>
                                        <th className="progLiveTalkHeader_ProgTalk">Programme Talk</th>
                                        <th className="progLiveTalkHeader_AwardingUni">Awarding University</th>
                                        <th className="progLiveTalkHeader_StartTime">Start Time</th>
                                        <th className="progLiveTalkHeader_EndTime">End Time</th>
                                        <th className="progLiveTalkHeader_Venue">Venue</th>
                                        <th className="progLiveTalkHeader_Url">Live Stream Url</th>
                                        <th className="progLiveTalkHeader_Edit">Edit</th>
                                        <th className="progLiveTalkHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    {this.state.day2 && this.state.day2.map((day2) => {
                                      return (
                                        <>
                                          <tbody>
                                            <tr key={day2.id}>
                                              <td className="progLiveTalkData_SNo text-center">{day2.day2_counter}</td>
                                              <td className="progLiveTalkData_ProgTalk text-left">{day2.talkName}</td>
                                              <td className="progLiveTalkData_AwardingUni text-center">{day2.awardingUni}</td>
                                              <td className="progLiveTalkData_StartTime text-left">{day2.startTime}</td>
                                              <td className="progLiveTalkData_EndTime text-left">{day2.endTime}</td>
                                              <td className="progLiveTalkData_Venue text-left">{day2.venue}</td>
                                              <td className="progLiveTalkData_Url text-left">
                                                <a href={day2.url} className="progLiveTalkData_UrlHref">{day2.url}</a>
                                              </td>
                                              <td className="progLiveTalkData_Edit text-center">
                                                <Button id="editProgLiveTalkBtn" onClick={()=>this.handleEditLiveTalkModal(day2)}>
                                                  <FontAwesomeIcon size="lg" id="editProgLiveTalkBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                              <td className="progLiveTalkData_Delete text-center">
                                                <Button id="deleteProgLiveTalkBtn" onClick={(e) => this.handleDeleteLiveTalkModal(day2.id)}>
                                                  <FontAwesomeIcon size="lg" id="deleteProgLiveTalkBtnIcon" icon={faTrashAlt} />
                                                </Button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </>
                                      );
                                    })}

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


        {/* Add Live Talk Modal */}
        <Modal 
          show={this.state.addLiveTalkModal}
          onHide={this.handleAddLiveTalkModal}
          aria-labelledby="addLiveTalkModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="addLiveTalkModalTitle" className="w-100">
              Add Live Talk
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="addLiveTalkModalBody">
            <Form noValidate>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="addLiveTalkFormCol text-center">
                  {/* Live Talk Name */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="talkName" id="addLiveTalkForm_ProgTalkName" onChange={this.updateInput} placeholder="Name of Live Talk*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.liveTalkError}</div>
                    </Col>
                  </Form.Row>

                  {/* Live Talk Venue */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" name="venue" id="addLiveTalkForm_Venue" onChange={this.updateInput} placeholder="Venue*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.venueError}</div>
                    </Col>
                  </Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="startTime" id="addLiveTalkForm_ProgTalkStartTime" onChange={this.updateInput} placeholder="Start Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.startTimeError}</div>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <FormControl type="text" name="endTime" id="addLiveTalkForm_ProgTalkEndTime" onChange={this.updateInput} placeholder="End Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.endTimeError}</div>
                    </Col>
                  </Form.Row>
                </Col>

                {/* Right Col */}
                <Col md="6" className="addLiveTalkFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        
                        <Form.Control as="select" name="date" onChange={this.updateInput} defaultValue="" className="addLiveTalkFormSelect" required noValidate>
                          <option value="" className="addLiveTalkFormSelectOption">Choose an Openhouse Date</option>
                          <option value={this.state.openHouseDay1} className="addLiveTalkFormSelectOption">{this.state.openHouseDay1}</option>
                          <option value={this.state.openHouseDay2} className="addLiveTalkFormSelectOption">{this.state.openHouseDay2}</option>
                        </Form.Control>                                        
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.dateError}</div>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="addLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="awardingUni" onChange={this.updateInput} defaultValue="" className="addLiveTalkFormSelect" required noValidate>
                          <option value="" className="addLiveTalkFormSelectOption">Choose a University</option>

                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                              <>
                                <option value={uni.universityName} className="addLiveTalkFormSelectOption">{uni.universityName}</option>
                              </>
                            );
                          })}

                        </Form.Control>
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.universityError}</div>
                    </Col>
                  </Form.Row>

                  {/* URL */}
                  <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                    <Col md="10" className="text-left addLiveTalkForm_InnerCol">
                      <Form.Label className="addLiveTalkFormLabel">Live Talk URL</Form.Label>                                     
                      <FormControl as="textarea" rows="4" name="url" onChange={this.updateInput} required noValidate id="addLiveTalkForm_LiveTalkURL" placeholder="Live Talk URL*" />                                       
                      
                      <div className="errorMessage text-left">{this.state.urlError}</div>
                    </Col>
                  </Form.Row>

                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Add Live Talk Submit Btn*/}
            <Button type="submit" id="addLiveTalkFormBtn" onClick={this.addLiveTalks}>Submit</Button>
          </Modal.Footer>
        </Modal>


        {/* Edit Live Talk Modal */}
        <Modal 
          show={this.state.editLiveTalkModal}
          onHide={this.handleEditLiveTalkModal}
          aria-labelledby="editLiveTalkModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="editLiveTalkModalTitle" className="w-100">
              Edit Live Talk
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="editLiveTalkModalBody">
            <Form noValidate onSubmit={()=>{this.editLiveTalk()}}>
              {/* Main Row */}
              <Form.Row className="justify-content-center">
                {/* Left Col */}
                <Col md="6" className="editLiveTalkFormCol text-center">
                  {/* Live Talk Name */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faMicrophone} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" defaultValue={this.state.talkName} name="talkName" onChange={this.updateInput} id="editLiveTalkForm_ProgTalkName" placeholder="Name of Live Talk*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.liveTalkError}</div>
                    </Col>
                  </Form.Row>

                  {/* Live Talk Venue */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faSchool} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl type="text" defaultValue={this.state.venue} name="venue" onChange={this.updateInput} id="editLiveTalkForm_Venue" placeholder="Venue*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.venueError}</div>
                    </Col>
                  </Form.Row>

                  {/* Start/End Time */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    {/* Start Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faHourglassStart} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                    
                        <FormControl type="text" defaultValue={this.state.startTime} name="startTime" onChange={this.updateInput} id="editLiveTalkForm_ProgTalkStartTime" placeholder="Start Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.startTimeError}</div>
                    </Col>

                    {/* End Time */}
                    <Col md="5" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faHourglassEnd} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                          
                        <FormControl type="text" defaultValue={this.state.endTime} name="endTime" onChange={this.updateInput} id="editLiveTalkForm_ProgTalkEndTime" placeholder="End Time*" required noValidate />
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.endTimeError}</div>
                    </Col>
                  </Form.Row>
                </Col>

                {/* Right Col */}
                <Col md="6" className="editLiveTalkFormCol text-center">
                  {/* Date */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faCalendarAlt} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                    
                        <Form.Control as="select" name="date" defaultValue={this.state.date} onChange={this.updateInput} className="editLiveTalkFormSelect" required noValidate>
                          <option value="" className="editLiveTalkFormSelectOption">Choose an Openhouse Date</option>

                          <option value={this.state.openHouseDay1} className="editLiveTalkFormSelectOption">{this.state.openHouseDay1}</option>
                          <option value={this.state.openHouseDay2} className="editLiveTalkFormSelectOption">{this.state.openHouseDay2}</option>
                        </Form.Control>                                        
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.dateError}</div>
                    </Col>
                  </Form.Row>

                  {/* University */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    <Col md="10" className="text-center">
                      <InputGroup className="editLiveTalkFormColInputGrp">
                        <InputGroup.Prepend>
                          <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faUniversity} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control as="select" name="awardingUni" defaultValue={this.state.awardingUni} onChange={this.updateInput} className="editLiveTalkFormSelect" required noValidate>
                          <option value="" className="editLiveTalkFormSelectOption">Choose a University</option>
                          
                          {this.state.uniList && this.state.uniList.map((uni) => {
                            return (
                            <>
                              <option value={uni.universityName} className="editLiveTalkFormSelectOption">{uni.universityName}</option>
                            </>
                            );
                          })}

                        </Form.Control>
                      </InputGroup>

                      <div className="errorMessage text-left">{this.state.universityError}</div>
                    </Col>
                  </Form.Row>

                  {/* URL */}
                  <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                    <Col md="10" className="text-left editLiveTalkForm_InnerCol">
                      <Form.Label className="editLiveTalkFormLabel">Live Talk URL</Form.Label>                                     
                      <FormControl as="textarea" name="url" rows="4" defaultValue={this.state.url} onChange={this.updateInput} required noValidate id="editLiveTalkForm_LiveTalkURL" placeholder="Live Talk URL*" />                                       
                    </Col>
                  </Form.Row>

                  <div className="errorMessage text-left">{this.state.urlError}</div>
                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Live Talk Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesLiveTalkFormBtn" onClick={(e) => {this.editLiveTalk()}}>Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditLiveTalkFormBtn" onClick={this.handleEditLiveTalkModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>

        {/* Delete Live Talk Modal */}
        <Modal 
          show={this.state.deleteLiveTalkModal}
          onHide={this.handleDeleteLiveTalkModal}
          aria-labelledby="deleteLiveTalkModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteLiveTalkModal handleConfirmDelete={ (e) => {this.DeleteLiveTalk(e, this.state.id)} } handleCancelDelete={this.handleDeleteLiveTalkModal} />
        </Modal>

      </div>
    );
  }
}

export default LiveTalk;
