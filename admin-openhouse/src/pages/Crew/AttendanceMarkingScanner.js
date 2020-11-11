import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";
import Login from "../../pages/Login";

import "../../css/Crew/AttendanceMarkingScanner.css";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SideNavBar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarDay,
  faEdit,
  faHourglassEnd,
  faHourglassStart,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import QrReader from "react-qr-reader";

class AttendanceMarkingScanner extends Component {
  constructor(props) {
    super();

    this.state = {
      openwebcam: true,
      user: "",
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        var getrole = db
          .collection("Administrators")
          .where("email", "==", user.email)
          .onSnapshot((snapshot) => {
            console.log(snapshot.size);
            this.setState(
              {
                user: snapshot.size,
              },
              () => {
                if (this.state.user > 0) {
                  this.display();
                } else {
                  history.push("/Login");
                  window.location.reload();
                }
              }
            );
          });
      } else {
        history.push("/Login");
        window.location.reload();
      }
    });
  }

  display() {
    var counter = 1;
    //Retrieve Attendance
    const userRef = db.collection("Attendance").onSnapshot((snapshot) => {
      const attendance = [];
      snapshot.forEach((doc) => {
        const data = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          date: doc.data().date,
          programmeName: doc.data().programmeName,
          universityName: doc.data().universityName,
          id: doc.id,
          counter: counter,
        };
        counter++;

        attendance.push(data);
        console.log(data);
      });

      this.setState({ attendance: attendance });
    });
  }

  handleScan = async (data) => {
    var counter = 0;
    if (data) {
      this.setState({
        result: data,
        openwebcam: false,
      });

      if (this.state.result != null) {
        var qrcodestring = this.state.result;
        var result = qrcodestring.split(",");
        var firstname = result[0];
        var lastname = result[1];
        var email = result[2];
        var progtalk = result[3];
        var progdate = result[4];
        var proguni = result[5];


        await db.collection("Attendance")
          .orderBy("id", "desc")
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              var docid = "";
              var res = doc.data().id.substring(11);
              var id = parseInt(res);
              id += 1;

              if (id.toString().length == 1) {
                docid = "attendance-00" + id;
              } else if (id.toString().length == 2) {
                docid = "attendance-0" + id;
              } else {
                docid = "attendance-" + id;
              }
              //Check if attendee existed in a progTalk
              const attendee = await db.collection("Attendance").where("talkName", "==", progTalk).where("email", "==", email).get()
              if (!attendee.empty) {
                console.log("Student existed in attendance")
                return
              }

              await db.collection("Attendance")
                .doc(docid)
                .set({
                  date: progdate,
                  email: email,
                  firstName: firstname,
                  lastName: lastname,
                  programmeName: progtalk,
                  universityName: proguni,
                  id: docid,
                })
                .then((dataSnapshot) => {
                  console.log("Added the attendance");
                  this.setState({
                    openwebcam: true,
                  });
                });
            });
          });
      }
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  render() {
    return (
      <div>
        <Container fluid className="AttendanceMarking-container">
          <NavBar isMA={false} />

          <Container
            fluid
            className="AttendanceMarking-content"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Row>
              {/* //If admin is Marketing Admin
                                  <Col md={2} style={{paddingRight: 0}}>
                                      <SideNavBar />
                                  </Col> */}

              <Col md={12}>
                <Container fluid id="AttendanceMarking-topContentContainer">
                  <Row id="AttendanceMarking-firstRow">
                    <Col
                      md={12}
                      className="text-left"
                      id="AttendanceMarking-firstRowCol"
                    >
                      <h4 id="AttendanceMarking-title">
                        Attendance Marking Scanner
                        </h4>
                    </Col>
                  </Row>

                  <Row id="AttendanceMarking-secondRow">
                    <Col
                      md={12}
                      className="text-center"
                      id="AttendanceMarking-secondRowCol"
                    >
                      {this.state.openwebcam === true && (
                        <div>
                          <QrReader
                            delay={2000}
                            onError={this.handleError}
                            onScan={this.handleScan}
                            style={{ width: "30%" }}
                          />
                        </div>
                      )}
                      {this.state.openwebcam === false && (
                        <div>
                          <h1>UPDATING DATABASE</h1>
                        </div>
                      )}
                      <div>
                        <table id="attendance" class="table table-bordered">
                          <tbody>
                            <tr>
                              <th scope="col">S/N</th>
                              <th scope="col">First Name</th>
                              <th scope="col">Last Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Date</th>
                              <th scope="col">Name of University</th>
                              <th scope="col">Programme Name</th>
                            </tr>
                            {this.state.attendance &&
                              this.state.attendance.map((attendance) => {
                                return (
                                  <tr>
                                    <td>{attendance.counter}</td>
                                    <td>{attendance.firstName} </td>
                                    <td>{attendance.lastName} </td>
                                    <td>{attendance.email} </td>
                                    <td>{attendance.date} </td>
                                    <td>{attendance.universityName} </td>
                                    <td>{attendance.programmeName} </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
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
export default AttendanceMarkingScanner;
