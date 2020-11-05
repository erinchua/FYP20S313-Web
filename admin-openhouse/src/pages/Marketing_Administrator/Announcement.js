import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import "../../css/Marketing_Administrator/Announcement.css";
import "../../css/Marketing_Administrator/AnnouncementModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SideNavBar from "../../components/SideNavbar";
import DeleteAnnouncementModal from "../../components/Marketing_Administrator/DeleteAnnouncementModal";

class Announcement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      details: "",
      date: "",
      time: "",
      datePosted: "",
      id: "",
      minutes: "",
      hours: "",

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
      .collection("Announcements")
      .orderBy("id", "desc")
      .onSnapshot((snapshot) => {
        const announcement = [];
        snapshot.forEach((doc) => {
          const data = {
            title: doc.data().title,
            details: doc.data().details,
            date: doc.data().date,
            time: doc.data().time,
            datePosted: doc.data().datePosted,
            id: doc.id,
          };
          announcement.push(data);
        });

        this.setState({ announcement: announcement });
      });

    // Get Open House Dates
    db.collection("Openhouse")
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
    var minutes = [];
    for (var i = 0; i < 60; i++) {
      if (i.toString().length == 1) {
        minutes.push("0" + i);
      } else {
        minutes.push(i.toString());
      }
    }

    var hours = [];
    for (var i = 1; i <= 12; i++) {
      hours.push(i.toString());
    }
    this.setState({ hours: hours, minutes: minutes });
    console.log(hours);
    console.log(minutes);
  }

  addAnnouncement = () => {
    var time =
      this.state.updateHours +
      ":" +
      this.state.updateMinutes +
      this.state.updateAMPM;
    console.log(this.state.scheduleAnnouncement);
    console.log(this.state.announcementTitle);
    console.log(this.state.announcementDetails);
    console.log(this.state.updateDate);
    console.log(Date.now());

    if (this.state.scheduleAnnouncement === true) {
      const db = fire.firestore();

      const userRef = db
        .collection("Announcements")
        .doc(Date.now().toString())
        .set({
          title: this.state.announcementTitle,
          details: this.state.announcementDetails,
          datePosted: this.formatDate(new Date()),
          id: Date.now(),
          date: this.formatDate(new Date()),
          time: this.formatAMPM(new Date()),
        })
        .then((dataSnapshot) => {
          console.log("Added the announcement");
          this.setState({ addAnnouncementModal: false });
        });
    } else {
      const db = fire.firestore();

      const userRef = db
        .collection("Announcements")
        .doc(Date.now().toString())
        .set({
          title: this.state.announcementTitle,
          details: this.state.announcementDetails,
          datePosted: this.formatDate(new Date()),
          id: Date.now(),
          date: this.state.updateDate,
          time: time,
        })
        .then((dataSnapshot) => {
          console.log("Added the announcement");
          this.setState({ addAnnouncementModal: false });
        });
    }
  };

  formatDate(date) {
    var monthNames = [
      "Jan",
      "Feby",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + "-" + monthNames[monthIndex] + "-" + year;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + ampm;
    return strTime;
  }

  DeleteAnnouncement() {
    const db = fire.firestore();
    const userRef = db
      .collection("Announcements")
      .doc(this.state.id)
      .delete()
      .then((dataSnapshot) => {
        console.log("Deleted the announcement");
        this.setState({
          deleteAnnouncementModal: false,
        });
      });
  }

  update = () => {
    var time =
      this.state.timehour +
      ":" +
      this.state.timeminutes +
      this.state.timeampm;
    console.log(this.state.title);
    console.log(this.state.details);
    console.log(this.state.date);
    console.log(this.state.timehour);
    console.log(this.state.timeminutes);
    console.log(this.state.timeampm);
    console.log(this.state.scheduleAnnouncement);
    console.log(this.state.id);

    if (this.state.scheduleAnnouncement === true) {
      const db = fire.firestore();

      const userRef = db
        .collection("Announcements")
        .doc(this.state.id)
        .update({
          title: this.state.title,
          details: this.state.details,
          datePosted: this.formatDate(new Date()),
          
        })
        .then((dataSnapshot) => {
          console.log("Updated the announcement");
          this.setState({ editAnnouncementModal: false });
        });
    } else {
      const db = fire.firestore();

      const userRef = db
        .collection("Announcements")
        .doc(this.state.id)
        .update({
          title: this.state.title,
          details: this.state.details,
          datePosted: this.formatDate(new Date()),
          date: this.state.date,
          time: time,
        })
        .then((dataSnapshot) => {
          console.log("Updated the announcement");
          this.setState({ editAnnouncementModal: false });
        });
    }
  };

  handleHourChange = (e) => {
    this.setState(
      {
        updateHours: e.target.value,
      },
      () => {
        console.log(this.state.updateHours);
      }
    );
  };

  handleMinuteChange = (e) => {
    this.setState(
      {
        updateMinutes: e.target.value,
      },
      () => {
        console.log(this.state.updateMinutes);
      }
    );
  };

  handleAMPMChange = (e) => {
    this.setState(
      {
        updateAMPM: e.target.value,
      },
      () => {
        console.log(this.state.updateAMPM);
      }
    );
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    console.log(e.target.name);
    console.log(e.target.value);
  };

  handleDateChange = (e) => {
    this.setState(
      {
        updateDate: e.target.value,
      },
      () => {
        console.log(this.state.updateDate);
      }
    );
  };

  handleEditHourChange = (e) => {
    this.setState(
      {
        timehour: e.target.value,
      },
      () => {
        console.log(this.state.timehour);
      }
    );
  };

  handleEditMinuteChange = (e) => {
    this.setState(
      {
        timeminutes: e.target.value,
      },
      () => {
        console.log(this.state.timeminutes);
      }
    );
  };

  handleEditAMPMChange = (e) => {
    this.setState(
      {
        timeampm: e.target.value,
      },
      () => {
        console.log(this.state.timeampm);
      }
    );
  };

  handleEditDateChange = (e) => {
    this.setState(
      {
        date: e.target.value,
      },
      () => {
        console.log(this.state.date);
      }
    );
  };

  /* Add Announcement Modal */
  handleAddAnnouncementModal = () => {
    if (this.state.addAnnouncementModal == false) {
      this.setState({
        addAnnouncementModal: true,
        scheduleAnnouncement: true,
      });
    } else {
      this.setState({
        addAnnouncementModal: false,
      });
    }
  };

  /* Add Announcement Modal - Schedule Announcement Switch */
  handleScheduleAnnouncementSwitch = () => {
    const scheduleAnnouncement = this.state.scheduleAnnouncement;

    if (scheduleAnnouncement === true) {
      this.setState({
        scheduleAnnouncement: false,
        scheduleAnnouncementLabel: "Yes",
      });
    }
    if (scheduleAnnouncement === false) {
      this.setState({
        scheduleAnnouncement: true,
        scheduleAnnouncementLabel: "No",
      });
    }
  };

  /* Edit Announcement Modal */
  handleEditAnnouncementModal = (announcement) => {
    if (this.state.editAnnouncementModal == false) {
      var timehour = announcement.time.substring(0, 2);
      var timeminutes = announcement.time.substring(3, 5);
      var timeampm = announcement.time.substring(5, 7);

      this.setState({
        editAnnouncementModal: true,
        title: announcement.title,
        date: announcement.date,
        time: announcement.time,
        details: announcement.details,
        scheduleAnnouncement: announcement.scheduleAnnouncement,
        timehour: timehour,
        timeminutes: timeminutes,
        timeampm: timeampm,
        id: announcement.id,
      });
    } else {
      this.setState({
        editAnnouncementModal: false,
      });
    }
  };

  /* Delete Announcement Modal */
  handleDeleteAnnouncementModal = (id) => {
    this.state.id = id;
    if (this.state.deleteAnnouncementModal == false) {
      this.setState({
        deleteAnnouncementModal: true,
      });
    } else {
      this.setState({
        deleteAnnouncementModal: false,
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
              <Col
                md="2"
                style={{ paddingRight: "0" }}
                className="sideNavBarCol"
              >
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="announcementContentCon">
                  {/* Announcement Page Header row */}
                  <Row
                    id="announcementContentHeaderRow"
                    className="justify-content-center"
                  >
                    <Col
                      md="6"
                      className="text-left announcementContentHeaderCol"
                    >
                      <h4 id="announcementHeaderText">Announcements</h4>
                    </Col>

                    <Col
                      md="6"
                      className="text-right announcementContentHeaderCol"
                    >
                      <Button
                        id="addAnnouncementBtn"
                        onClick={this.handleAddAnnouncementModal}
                      >
                        <FontAwesomeIcon
                          size="lg"
                          id="addAnnouncementBtnIcon"
                          icon={faPlus}
                        />
                        <span id="addAnnouncementBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Announcement Table */}
                  <Row
                    id="announcementTableRow"
                    className="justify-content-center"
                  >
                    <Col md="12">
                      <Table responsive="sm" bordered id="announcementTable">
                        <thead>
                          <tr className="text-center">
                            <th
                              id="announcementHeader_AnnouncementTitle"
                              className="text-center"
                            >
                              Announcement Title
                            </th>
                            <th
                              id="announcementHeader_PostedDateTime"
                              className="text-center"
                            >
                              Posted Date/ Time
                            </th>
                            <th
                              id="announcementHeader_Detail"
                              className="text-center"
                            >
                              Announcement Details
                            </th>
                            <th
                              id="announcementHeader_Edit"
                              className="text-center"
                            >
                              Edit
                            </th>
                            <th
                              id="announcementHeader_Delete"
                              className="text-center"
                            >
                              Delete
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.announcement &&
                            this.state.announcement.map((announce) => {
                              return (
                                <tr key={announce.id}>
                                  <td
                                    id="announcementData_AnnouncementTitle"
                                    className="text-center"
                                  >
                                    {announce.title}
                                  </td>
                                  <td
                                    id="announcementData_PostedDateTime"
                                    className="text-center"
                                  >
                                    {announce.date}, {announce.time}
                                  </td>
                                  <td
                                    id="announcementData_Detail"
                                    className="text-left"
                                  >
                                    {announce.details}
                                  </td>
                                  <td
                                    id="announcementData_Edit"
                                    className="text-center"
                                  >
                                    <Button
                                      id="editAnnouncementBtn"
                                      onClick={() => {
                                        this.handleEditAnnouncementModal(
                                          announce
                                        );
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        id="editAnnouncementBtnIcon"
                                        icon={faEdit}
                                      />
                                    </Button>
                                  </td>
                                  <td
                                    className="announcementData_Delete"
                                    className="text-center"
                                  >
                                    <Button
                                      id="deleteAnnouncementBtn"
                                      onClick={() =>
                                        this.handleDeleteAnnouncementModal(
                                          announce.id
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        id="deleteAnnouncementBtnIcon"
                                        icon={faTrashAlt}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
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
            <Form noValidate>
              {/* Announcement Title */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="addAnnouncementFormLabel">
                    Announcement Title
                  </Form.Label>

                  <FormControl
                    as="textarea"
                    rows="4"
                    required
                    noValidate
                    className="addAnnouncementForm_Textarea"
                    placeholder="Announcement Title*"
                    name="announcementTitle"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Row>

              {/* Annnouncement Details */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="addAnnouncementFormLabel">
                    Announcement Details
                  </Form.Label>

                  <FormControl
                    as="textarea"
                    rows="4"
                    required
                    noValidate
                    className="addAnnouncementForm_Textarea"
                    placeholder="Announcement Details*"
                    name="announcementDetails"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Row>

              {/* Schedule Announcement */}
              <Form.Row className="justify-content-center addAnnouncementFormRow">
                <Col md="10">
                  <InputGroup>
                    <Form.Label className="addAnnouncementFormLabel">
                      Schedule Announcement?
                    </Form.Label>

                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      className="scheduleAnnouncementSwitch"
                      label={this.state.scheduleAnnouncementLabel}
                      onClick={this.handleScheduleAnnouncementSwitch}
                    />
                  </InputGroup>
                </Col>
              </Form.Row>

              {/* Schedule Announcement Content */}
              {this.state.scheduleAnnouncement == false && (
                <Form.Row className="justify-content-center">
                  <Col md="10">
                    <Container style={{ padding: "0" }}>
                      {/* Scheduled Date Row */}
                      <Form.Row className="justify-content-center addAnnouncementFormRow">
                        <Col md="12" style={{ padding: "0" }}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="addAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="addAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon
                                  size="lg"
                                  className="addAnnouncementFormIcon"
                                  icon={faCalendar}
                                />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col
                              style={{ width: "90%" }}
                              className="text-center"
                            >
                              <Form.Control
                                as="select"
                                name="scheduledDate"
                                defaultValue="chooseScheduledDate"
                                className="addAnnouncementFormSelect"
                                required
                                noValidate
                                onChange={this.handleDateChange}
                              >
                                <option
                                  value="chooseScheduledDate"
                                  className="addAnnouncementFormSelectOption"
                                  disabled
                                >
                                  Schedule Announcement Date
                                </option>
                                {/* To be retrieved from open house dates */}
                                {this.state.openhousedates &&
                                  this.state.openhousedates.map((date) => {
                                    return (
                                      <option
                                        value={date.date}
                                        className="addAnnouncementFormSelectOption"
                                      >
                                        {date.date}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>

                      {/* Scheduled Time Row */}
                      <Form.Row className="justify-content-center addAnnouncementFormRow">
                        <Col md="12" style={{ padding: "0" }}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="addAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="addAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon
                                  size="lg"
                                  className="addAnnouncementFormIcon"
                                  icon={faClock}
                                />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="scheduledDate"
                                defaultValue=""
                                className="addAnnouncementFormSelect"
                                required
                                noValidate
                                onChange={this.handleHourChange}
                              >
                                <option
                                  value=""
                                  className="addAnnouncementFormSelectOption"
                                  disabled
                                >
                                  Hour
                                </option>
                                {this.state.hours &&
                                  this.state.hours.map((hours) => {
                                    return (
                                      <option
                                        value={hours}
                                        className="addAnnouncementFormSelectOption"
                                      >
                                        {hours}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>

                            <Form.Text id="addAnnouncementInnerTime_Text">
                              :
                            </Form.Text>

                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="scheduledDate"
                                defaultValue="chooseScheduledDate"
                                className="addAnnouncementFormSelect"
                                required
                                noValidate
                                onChange={this.handleMinuteChange}
                              >
                                <option
                                  value="chooseScheduledDate"
                                  className="addAnnouncementFormSelectOption"
                                  disabled
                                >
                                  Minute
                                </option>
                                {this.state.minutes &&
                                  this.state.minutes.map((minutes) => {
                                    return (
                                      <option
                                        value={minutes}
                                        className="addAnnouncementFormSelectOption"
                                      >
                                        {minutes}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>

                            <Col className="addAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="scheduledDate"
                                defaultValue="chooseScheduledDate"
                                className="addAnnouncementFormSelect"
                                required
                                noValidate
                                onChange={this.handleAMPMChange}
                              >
                                <option
                                  className="addAnnouncementFormSelectOption"
                                  hidden
                                >
                                  AM/PM
                                </option>
                                <option
                                  value="AM"
                                  className="addAnnouncementFormSelectOption"
                                >
                                  AM
                                </option>
                                <option
                                  value="PM"
                                  className="addAnnouncementFormSelectOption"
                                >
                                  PM
                                </option>
                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>
                    </Container>
                  </Col>
                </Form.Row>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Add Announcement Submit Btn*/}
            <Button
              type="submit"
              id="addAnnouncementFormBtn"
              onClick={this.addAnnouncement}
            >
              Publish
            </Button>
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
            <Form noValidate>
              {" "}
              {/* onSubmit={this.edit} */}
              {/* Announcement Title */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="editAnnouncementFormLabel">
                    Announcement Title
                  </Form.Label>

                  <FormControl
                    as="textarea"
                    defaultValue={this.state.title}
                    rows="4"
                    required
                    noValidate
                    className="editAnnouncementForm_Textarea"
                    placeholder="Announcement Title*"
                    name="title"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Row>
              {/* Annnouncement Details */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <Form.Label className="editAnnouncementFormLabel">
                    Announcement Details
                  </Form.Label>

                  <FormControl
                    as="textarea"
                    defaultValue={this.state.details}
                    rows="4"
                    required
                    noValidate
                    className="editAnnouncementForm_Textarea"
                    placeholder="Announcement Details*"
                    name="details"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Row>
              {/* Schedule Announcement */}
              <Form.Row className="justify-content-center editAnnouncementFormRow">
                <Col md="10">
                  <InputGroup>
                    <Form.Label className="editAnnouncementFormLabel">
                      Schedule Announcement?
                    </Form.Label>

                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      className="scheduleAnnouncementSwitch"
                      label={this.state.scheduleAnnouncementLabel}
                      onClick={this.handleScheduleAnnouncementSwitch}
                    />
                  </InputGroup>
                </Col>
              </Form.Row>
              {/* Schedule Announcement Content */}
              {this.state.scheduleAnnouncement == false && (
                <Form.Row className="justify-content-center">
                  <Col md="10">
                    <Container style={{ padding: "0" }}>
                      {/* Scheduled Date Row */}
                      <Form.Row className="justify-content-center editAnnouncementFormRow">
                        <Col md="12" style={{ padding: "0" }}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="editAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="editAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon
                                  size="lg"
                                  className="editAnnouncementFormIcon"
                                  icon={faCalendar}
                                />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col
                              style={{ width: "90%" }}
                              className="text-center"
                            >
                              <Form.Control
                                as="select"
                                name="date"
                                defaultValue="chooseScheduledDate"
                                className="editAnnouncementFormSelect"
                                required
                                noValidate
                                value={this.state.date}
                                onChange={this.handleEditDateChange}
                              >
                                {/* To be retrieved from open house dates */}
                                {this.state.openhousedates &&
                                  this.state.openhousedates.map((date) => {
                                    return (
                                      <option
                                        value={date.date}
                                        className="editAnnouncementFormSelectOption"
                                      >
                                        {date.date}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>

                      {/* Scheduled Time Row */}
                      <Form.Row className="justify-content-center editAnnouncementFormRow">
                        <Col md="12" style={{ padding: "0" }}>
                          <Form.Row className="justify-content-center">
                            <InputGroup.Prepend className="editAnnouncementInnerDateTimeCol_Icon text-center">
                              <InputGroup.Text className="editAnnouncementFormIconInputGrp">
                                <FontAwesomeIcon
                                  size="lg"
                                  className="editAnnouncementFormIcon"
                                  icon={faClock}
                                />
                              </InputGroup.Text>
                            </InputGroup.Prepend>

                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="timehour"
                                defaultValue="chooseScheduledDate"
                                className="editAnnouncementFormSelect"
                                required
                                noValidate
                                value={this.state.timehour}
                                onChange={this.handleEditHourChange}
                              >
                                <option
                                  value="chooseScheduledDate"
                                  className="editAnnouncementFormSelectOption"
                                >
                                  Hour
                                </option>
                                {/* To be retrieved from arrays - Hr Array */}
                                {this.state.hours &&
                                  this.state.hours.map((hours) => {
                                    return (
                                      <option
                                        value={hours}
                                        className="editAnnouncementFormSelectOption"
                                      >
                                        {hours}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>

                            <Form.Text id="editAnnouncementInnerTime_Text">
                              :
                            </Form.Text>

                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="timeminutes"
                                defaultValue="chooseScheduledDate"
                                className="editAnnouncementFormSelect"
                                required
                                noValidate
                                value={this.state.timeminutes}
                                onChange={this.handleEditMinuteChange}
                              >
                                <option
                                  value="chooseScheduledDate"
                                  className="editAnnouncementFormSelectOption"
                                >
                                  Minute
                                </option>
                                {/* To be retrieved from arrays - Min Array */}
                                {this.state.minutes &&
                                  this.state.minutes.map((minutes) => {
                                    return (
                                      <option
                                        value={minutes}
                                        className="editAnnouncementFormSelectOption"
                                      >
                                        {minutes}
                                      </option>
                                    );
                                  })}
                              </Form.Control>
                            </Col>

                            <Col className="editAnnouncementInnerTimeCol_HrMin text-center">
                              <Form.Control
                                as="select"
                                name="timeampm"
                                defaultValue="chooseScheduledDate"
                                className="editAnnouncementFormSelect"
                                required
                                noValidate
                                value={this.state.timeampm}
                                onChange={this.handleEditAMPMChange}
                              >
                                <option
                                  value="chooseScheduledDate"
                                  className="editAnnouncementFormSelectOption"
                                  hidden
                                >
                                  AM/PM
                                </option>
                                <option
                                  value="AM"
                                  className="addAnnouncementFormSelectOption"
                                >
                                  AM
                                </option>
                                <option
                                  value="PM"
                                  className="addAnnouncementFormSelectOption"
                                >
                                  PM
                                </option>
                              </Form.Control>
                            </Col>
                          </Form.Row>
                        </Col>
                      </Form.Row>
                    </Container>
                  </Col>
                </Form.Row>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Announcement Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button
                    id="saveChangesAnnouncementFormBtn"
                    onClick={this.update}
                  >
                    Save Changes
                  </Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button
                    id="cancelEditAnnouncementFormBtn"
                    onClick={this.handleEditAnnouncementModal}
                  >
                    Cancel
                  </Button>
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
          <DeleteAnnouncementModal
            handleConfirmDelete={(e) => {
              this.DeleteAnnouncement();
            }}
            handleCancelDelete={this.handleDeleteAnnouncementModal}
          />
        </Modal>
      </div>
    );
  }
}
export default Announcement;