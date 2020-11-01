import React, { Component } from "react";
import fire from "../../../config/firebase";
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

    // const userRef = db
    // .collection("ProgrammeTalks")
    // .get()
    // .then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     livetalk.push(doc.data().date);
    //   });
        
      // function onlyUnique(value, index, self) {
      //   return self.indexOf(value) === index;
      // }
      
      // var unique = livetalk.filter(onlyUnique);
      // console.log(unique);
      //day1
    
    // });
  }

  addLiveTalks = (e) => {
    e.preventDefault();
    // var recordingvalue = document.getElementById("recordingvalue");
    // var livestatus = document.getElementById("livestatus");
    // recordingvalue = recordingvalue.options[recordingvalue.selectedIndex].value;
    // livestatus = livestatus.options[livestatus.selectedIndex].value;
    // recordingvalue = (recordingvalue === "true");
    // livestatus = (livestatus === "true");
    
    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      const db = fire.firestore();
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
    const db = fire.firestore();
    const userRef = db
    .collection("ProgrammeTalks")
    .doc(livetalkid)
    .delete()
    .then(dataSnapshot => {
      this.display();
      this.setState({deleteLiveTalkModal: false}); 
    });
  }

  // **No need the following function. Using editLiveTalk() instead.
  // update(e, livetalkid) {
    // const talkName = document.getElementById(livetalkid + "talkname").value
    // const awardingUni = document.getElementById(livetalkid + "awarduni").value
    // const startTime = document.getElementById(livetalkid + "starttime").value
    // const endTime = document.getElementById(livetalkid + "endtime").value
    // const venue = document.getElementById(livetalkid + "venue").value
    // const link = document.getElementById(livetalkid + "link").value

    // const db = fire.firestore();
    // if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null && url != null) {
    // const userRef = db
    // .collection("ProgrammeTalks")
    // .doc(livetalkid)
    // .update({
    //   awardingUni: awardingUni,
    //   endTime: endTime,
    //   startTime: startTime,
    //   talkName: talkName,
    //   venue: venue,
    //   url: url,
    // })
    // .then(function () {
    //   // alert("Updated");
    //   window.location.reload();
    // });
    // }
  // }

  editLiveTalk(e, livetalkid) {
    // document.getElementById(livetalkid + "spantalkname").removeAttribute("hidden");
    // document.getElementById(livetalkid + "spanawarduni").removeAttribute("hidden");
    // document.getElementById(livetalkid + "spanstarttime").removeAttribute("hidden");
    // document.getElementById(livetalkid + "spanendtime").removeAttribute("hidden");
    // document.getElementById(livetalkid + "spanvenue").removeAttribute("hidden");
    // document.getElementById(livetalkid + "spanlink").removeAttribute("hidden");
    // document.getElementById(livetalkid + "editbutton").setAttribute("hidden", "");
    // document.getElementById(livetalkid + "updatebutton").removeAttribute("hidden");
    // document.getElementById(livetalkid + "cancelbutton").removeAttribute("hidden");
    // var texttohide = document.getElementsByClassName(
    //   livetalkid + "text"
    // );
    // for (var i = 0; i < texttohide.length; i++) {
    //   texttohide[i].setAttribute("hidden", "");
    // }  

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      console.log(this.state.id)
      const db = fire.firestore();
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

  /* Don't need cancel function as we can just hide the modal if cancel */
  // CancelEdit(e, livetalkid) {
  //   document.getElementById(livetalkid + "spantalkname").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "spanawarduni").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "spanstarttime").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "spanendtime").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "spanvenue").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "spanlink").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(livetalkid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(livetalkid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //     livetalkid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }

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


        {/* day1 */}
        {/* <div>
        {this.state.day1date &&
                this.state.day1date.map((day1) => {
                  return (
                    <p>{day1}</p>
                  )})}
          <table id="users" class="table table-bordered"> 
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Programme Talk</th>
                <th scope="col">Awarding University</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Link</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.day1 &&
                this.state.day1.map((day1,index) => {
                  return (
                    <tr>
                        <td>{index+1}</td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.talkName}
                        </span>
                          <span id={day1.docid + "spantalkname"} hidden>
                          <input
                            id={day1.docid + "talkname"}
                            defaultValue={day1.talkName}
                            type="text"
                            name={day1.docid + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.awardingUni}
                        </span>
                          <span id={day1.docid + "spanawarduni"} hidden>
                          <input
                            id={day1.docid + "awarduni"}
                            defaultValue={day1.awardingUni}
                            type="text"
                            name={day1.docid + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.startTime}
                        </span>
                          <span id={day1.docid + "spanstarttime"} hidden>
                          <input
                            id={day1.docid + "starttime"}
                            defaultValue={day1.startTime}
                            type="text"
                            name={day1.docid + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.endTime}
                        </span>
                          <span id={day1.docid + "spanendtime"} hidden>
                          <input
                            id={day1.docid + "endtime"}
                            defaultValue={day1.endTime}
                            type="text"
                            name={day1.docid + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.venue}
                        </span>
                          <span id={day1.docid + "spanvenue"} hidden>
                          <input
                            id={day1.docid + "venue"}
                            defaultValue={day1.venue}
                            type="text"
                            name={day1.docid + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <span class={day1.docid + "text"}>
                          {day1.link}
                        </span>
                        <span id={day1.docid + "spanlink"} hidden>
                          <input
                            id={day1.docid + "link"}
                            defaultValue={day1.link}
                            type="text"
                            name={day1.docid + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button id={day1.docid + "editbutton"} onClick={ (e) => {this.editLiveTalk(e, day1.docid);} }>
                          Edit
                        </button>

                        <button id={day1.docid + "updatebutton"} hidden onClick={(e) => {this.update(e, day1.docid);} }>
                          Update
                        </button>
                        <button hidden id={day1.docid + "cancelbutton"} onClick={ (e) => { this.CancelEdit(e, day1.docid);} }>
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button onClick={(e) => {this.DeleteLiveTalk(e, day1.docid);} }>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div> */}
        
        {/* day2 */}
        {/* {this.state.day2date && this.state.day2date.map((day2) => {
          return (
            <p>{day2}</p>
          )})}
          <table id="users" class="table table-bordered"> 
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Programme Talk</th>
                <th scope="col">Awarding University</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Link</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.day2 && this.state.day2.map((day2,index) => {
                return (
                  <tr>
                      <td>{index+1}</td>
                    <td>
                    <span class={day2.docid + "text"}>
                    {day2.talkName}
                      </span>
                        
                        <span id={day2.docid + "spantalkname"} hidden>
                        <input
                          id={day2.docid + "talkname"}
                          defaultValue={day2.talkName}
                          type="text"
                          name={day2.docid + "talkname"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.talkName}
                          required
                        />
                      </span>            
                    </td>
                    <td>
                    <span class={day2.docid + "text"}>
                    {day2.awardingUni}
                      </span>
                        <span id={day2.docid + "spanawarduni"} hidden>
                        <input
                          id={day2.docid + "awarduni"}
                          defaultValue={day2.awardingUni}
                          type="text"
                          name={day2.docid + "awarduni"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.awardingUni}
                          required
                        />
                      </span>  
                    </td>
                    <td>
                    <span class={day2.docid + "text"}>
                    {day2.startTime}
                      </span>
                        <span id={day2.docid + "spanstarttime"} hidden>
                        <input
                          id={day2.docid + "starttime"}
                          defaultValue={day2.startTime}
                          type="text"
                          name={day2.docid + "starttime"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.startTime}
                          required
                        />
                      </span>  
                    </td>
                    <td>
                    <span class={day2.docid + "text"}>
                    {day2.endTime}
                      </span>
                        <span id={day2.docid + "spanendtime"} hidden>
                        <input
                          id={day2.docid + "endtime"}
                          defaultValue={day2.endTime}
                          type="text"
                          name={day2.docid + "endtime"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.endTime}
                          required
                        />
                      </span>  
                    </td>
                    <td>
                    <span class={day2.docid + "text"}>
                    {day2.venue}
                      </span>
                        <span id={day2.docid + "spanvenue"} hidden>
                        <input
                          id={day2.docid + "venue"}
                          defaultValue={day2.venue}
                          type="text"
                          name={day2.docid + "venue"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.venue}
                          required
                        />
                      </span>  
                    </td>
                    <td>
                    <span class={day2.docid + "text"}>
                      {day2.Link}
                      </span>
                        
                        <span id={day2.docid + "spanlink"} hidden>
                        <input
                          id={day2.docid + "link"}
                          defaultValue={day2.Link}
                          type="text"
                          name={day2.docid + "link"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day2.Link}
                          required
                        />
                      </span>            
                    </td>
                    <td>
                      <button id={day2.docid + "editbutton"} onClick={(e) => {this.editLiveTalk(e, day2.docid);} }>
                        Edit
                      </button>

                      <button id={day2.docid + "updatebutton"} hidden onClick={(e) => {this.update(e, day2.docid);} }>
                        Update
                      </button>
                      <button hidden id={day2.docid + "cancelbutton"} onClick={(e) => {this.CancelEdit(e, day2.docid);} }>
                        Cancel
                      </button>
                    </td>
                    <td>
                      <button onClick={(e) => {this.DeleteLiveTalk(e, day2.docid);} }>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <form onSubmit={this.addLiveTalks}>
          <input
            type="text"
            name="talkName"
            placeholder="Programme Talk"
            onChange={this.updateInput}
            value={this.state.talkName}
            required
          />
          <input
            type="text"
            name="date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.date}
            required
          />
          <input
            type="text"
            name="startTime"
            placeholder="Start Time"
            onChange={this.updateInput}
            value={this.state.startTime}
            required
          />
          <input
            type="text"
            name="endTime"
            placeholder="End Time"
            onChange={this.updateInput}
            value={this.state.endTime}
            required
          />
          <input
            type="text"
            name="awardingUni"
            placeholder="Awarding University"
            onChange={this.updateInput}
            value={this.state.awardingUni}
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            onChange={this.updateInput}
            value={this.state.venue}
            required
          />
          <input
            type="text"
            name="capacityLimit"
            placeholder="Capacity Limit"
            onChange={this.updateInput}
            value={this.state.capacityLimit}
            required
          />
          <select id = "recordingvalue" required>
            <option disabled selected value></option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>

          <select id = "livestatus" required>
            <option disabled selected value></option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>

          <input
            type="text"
            name="noRegistered"
            placeholder="No of Student Registered"
            onChange={this.updateInput}
            value={this.state.noRegistered}
            required
          />
          <input
            type="text"
            name="Link"
            placeholder="Link"
            onChange={this.updateInput}
            value={this.state.Link}
            required
          />
          <button type="submit">Add Live Talk</button>
        </form> */}
      </div>
    );
  }
}
export default LiveTalk;
