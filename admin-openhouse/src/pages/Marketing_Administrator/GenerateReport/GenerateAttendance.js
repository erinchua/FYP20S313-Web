import React, { Component, useReducer } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";

import "../../../css/Marketing_Administrator/GenerateAttendance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


class GenerateAttendance extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      talkName: "",
      universityName: "",
      id: "",
      totalNumber: 0,
      date: "",
      userEmail:"",
      universityValue:"All",
      talkNameValue:"All",
      attendance: []
    };
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {

        var getrole = db
        .collection("Administrators")
        .where("email", "==", user.email);
        this.state.userEmail=user.email;

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

  componentDidMount=() =>{ 
    this.authListener()
  }

display() {
  var counter = 1;
  this.state.universityName = "All"
  this.state.talkName = "All"

  //Retrieve Attendance
  const userRef = db
  .collection("Attendance")
  .get()
  .then((snapshot) => {
    const attendance = [];
    snapshot.forEach((doc) => {
      const data = {
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        email: doc.data().email,
        date: doc.data().date,
        talkName: doc.data().talkName,
        universityName: doc.data().universityName,
        id: doc.id,
        counter : counter,
      };
      counter++;
      attendance.push(data);
    });

    this.setState({ attendance: attendance });
  });

    // Get All Universities
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    
    const university = [];
    const Universityquery = db
    .collection("Universities")
    .onSnapshot((snapshot) => {     
      snapshot.forEach((doc) => {
        university.push(doc.data().universityName);
      });
      var uniqueUniversity = university.filter(onlyUnique);
      uniqueUniversity = uniqueUniversity.filter((val) => val !== undefined);
      uniqueUniversity = uniqueUniversity.filter((val) => val !== "");
      this.setState({ university: uniqueUniversity });
    });

    // Get All Programme Name
    const talkname = [];
    const talkNamequery = db
    .collection("Attendance")
    .onSnapshot((snapshot) => {     
      snapshot.forEach((doc) => {
        talkname.push(doc.data().talkName);
      });
      var uniqueProgName = talkname.filter(onlyUnique);
      uniqueProgName = uniqueProgName.filter((val) => val !== undefined);
      uniqueProgName = uniqueProgName.filter((val) => val !== "");
      this.setState({ talkname: uniqueProgName });
    });
  }

  handleUniversityChange = (e) => {
    this.setState({
      universityValue: e.target.value,
    });
    this.setState({
      universityValue: e.target.value,
    },() => { this.universityFiltered() })
  }

  handleProgrammeChange = (e) => {
    this.setState({
      talkNameValue: e.target.value,
    });
    this.setState({
      universityValue: e.target.value,
    },() => { this.talknameFiltered() })
  }

  universityFiltered(){
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var counter = 1;
    this.state.universityName = this.state.universityValue;

    if(this.state.universityValue === "All") {
      db
      .collection("Attendance")
      .onSnapshot((snapshot) => {
        const attendance = [];
        snapshot.forEach((doc) => {
          const data = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            date: doc.data().date,
            talkName: doc.data().talkName,
            universityName: doc.data().universityName,
            id: doc.id,
            counter : counter,
          };
          counter++;
          attendance.push(data);
        });
        this.setState({ 
          attendance: attendance 
        });
      })
    } 
    else {
      db
      .collection("Attendance").where("universityName","==",this.state.universityValue)
      .onSnapshot((snapshot) => {
        const attendance = [];
        snapshot.forEach((doc) => {
          const data = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            date: doc.data().date,
            talkName: doc.data().talkName,
            universityName: doc.data().universityName,
            id: doc.id,
            counter : counter,
          };
          counter++;
          attendance.push(data);
        });
        this.setState({ 
          attendance: attendance 
        });
      })

      const talkname = [];
      const talkNamequery = db
      .collection("Attendance").where("universityName","==",this.state.universityValue)
      .onSnapshot((snapshot) => {     
        snapshot.forEach((doc) => {
          talkname.push(doc.data().talkName);
        });
        var uniqueProgName = talkname.filter(onlyUnique);
        uniqueProgName = uniqueProgName.filter((val) => val !== undefined);
        uniqueProgName = uniqueProgName.filter((val) => val !== "");
        this.setState({ talkname: uniqueProgName });
      });
    }
    
  }

  talknameFiltered(){
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var getTalkName="";
    var getUniversityName =""
    var counter = 1;
    //Retrieve Attendance

    if (this.state.talkNameValue === "All") {
      db
      .collection("Attendance")
      .onSnapshot((snapshot) => {
        const attendance = [];
        snapshot.forEach((doc) => {
          getTalkName = doc.data().talkName
          getUniversityName =doc.data().universityName

          const data = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            date: doc.data().date,
            talkName: doc.data().talkName,
            universityName: doc.data().universityName,
            id: doc.id,
            counter : counter,
          };
          counter++;
          attendance.push(data);
        });
        this.setState({ 
          attendance: attendance 
        });
      })

      db
      .collection("Attendance")
      .onSnapshot((snapshot) => {
        const attendance = [];
        snapshot.forEach((doc) => {
          getTalkName = doc.data().talkName
          getUniversityName =doc.data().universityName

          const data = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            date: doc.data().date,
            talkName: doc.data().talkName,
            universityName: doc.data().universityName,
            id: doc.id,
            counter : counter,
          };
          counter++;
          attendance.push(data);
        });
        this.setState({ 
          attendance: attendance 
        });
      })
    } 
    else {
      db
      .collection("Attendance").where("talkName","==",this.state.talkNameValue)
      .onSnapshot((snapshot) => {
        const attendance = [];
        snapshot.forEach((doc) => {
          getTalkName = doc.data().talkName
          getUniversityName =doc.data().universityName

          const data = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            date: doc.data().date,
            talkName: doc.data().talkName,
            universityName: doc.data().universityName,
            id: doc.id,
            counter : counter,
          };
          counter++;
          attendance.push(data);
        });
        this.setState({ 
          attendance: attendance 
        });
      })
    } 
  }

  generatePDF(){
    var doc = new jsPDF('p', 'mm', [297, 210]);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var adminuser = "\nRequested by: " + this.state.userEmail;
    doc.setFontSize(10);   
    doc.text(14, 25, adminuser);

    var today = new Date();    
    var day = today.getDate();
    var monthIndex = today.getMonth();
    var year = today.getFullYear();
    var date = day + ' ' + monthNames[monthIndex] + ' ' + year;
    var newdate = "\nDate Requested: "+ date; 
    doc.text(132, 25, newdate);

    // Line Separator
    doc.setLineWidth(0.8);
    doc.line(14, 35, 196, 35);

    var universityName = "\nUniversity Name: " + this.state.universityName;
    doc.setFontSize(10);
    doc.text(14, 38, universityName); 
    
    var talkName = "\nTalk Name: " + this.state.talkNameValue;
    doc.text(14, 46, talkName);

    var totalNumber = "\nTotal Number: " + this.state.attendance.length; 
    doc.text(14, 54, totalNumber);

    // Line Separator
    doc.line(14, 63, 196, 63);

    doc.setFontSize(10);
    doc.text(14, 72, "List of Registrants");

    doc.autoTable({
      html: "#attendance",
      headStyles: { 
        halign: 'center', 
        fillColor: [136, 183, 181] ,
        font: 'helvetica',
        cellPadding: {top: 2, right: 2, bottom: 2, left: 2},
      },
      columnStyles: { 
        0: { halign: 'center'},
        1: { halign: 'left'},
        2: { halign: 'left'},
        3: { halign: 'left'},
        4: { halign: 'center'},
        5: { halign: 'left'},
      },
      startY: 78,
      pageBreak: "auto"
    });

    doc.setFontSize(13); 
    doc.setFont('helvetica', 'bold');
    doc.text("Total Number of Attendees for Programme Talks Report", 48, 20);
      
    doc.save("StudentAttendance_" + date +".pdf");
  };


  render() {
    return (
      <div>
        <Container fluid className="generateAttendanceCon">
          <NavBar isMA={true} />

          <Container fluid className="generateAttendanceContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{ paddingRight: "0" }} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="generateAttendanceContentCon">
                  {/* Generate Attendance Page Header row */}
                  <Row className="justify-content-center generateAttendanceContentHeaderRow">
                    <Col md="9" className="text-left generateAttendanceContentHeaderCol">
                      <h4 className="generateAttendanceHeaderText">Report on Total Number of Attendees for Programme Talks</h4>
                    </Col>

                    <Col md="3" className="text-right generateAttendanceContentHeaderCol">
                      <Button className="generateReportBtn" onClick={() => {this.generatePDF()}}>
                        <FontAwesomeIcon size="lg" className="generateReportBtnIcon" icon={faPlus} />
                        <span className="generateReportBtnText">Generate Report</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Filter Row */}
                  <Row className="justify-content-center generateAttendanceFilterRow">
                    <Col md="6" className="generateAttendanceFilterCol">
                      <Form.Label className="generateAttendanceFormLabel text-left">Choose University:</Form.Label>                                     
                          
                      <Form.Control as="select" name="universityName" defaultValue="All" onChange={this.handleUniversityChange} className="generateAttendanceFormSelect text-center" required noValidate>
                        <option value="All" className="generateAttendanceFormSelectOption">All</option>

                        {this.state.university && this.state.university.map((uni) => {
                          return (
                            <>
                              <option value={uni} className="generateAttendanceFormSelectOption">{uni}</option>
                            </>
                          );
                        })}
                      </Form.Control>
                    </Col>
                  
                    <Col md="6" className="generateAttendanceFilterCol">
                      <Form.Label className="generateAttendanceFormLabel text-left">Choose Programme:</Form.Label>                                     
                          
                      <Form.Control as="select" name="talkName" defaultValue="All" onChange={this.handleProgrammeChange} className="generateAttendanceFormSelect text-center" required noValidate>
                        <option value="All" className="generateAttendanceFormSelectOption">All</option>

                        {this.state.talkname && this.state.talkname.map((talkName) => {
                          return (
                            <>
                              <option value={talkName} className="generateAttendanceFormSelectOption">{talkName}</option>
                            </>
                          );
                        })}
                      </Form.Control>
                    </Col>
                  </Row>

                  {/* Table Row */}
                  <Row className="justify-content-center generateAttendanceReportTableRow">
                    <Col md="12" className="text-center">
                      <Table responsive="sm" hover bordered id="attendance" className="generateAttendanceReportTable">
                        <thead>
                          <tr>
                            <th className="generateAttendanceReportHeader_SNo">S/N</th>
                            <th className="generateAttendanceReportHeader_Name">Name</th>
                            <th className="generateAttendanceReportHeader_Email">Email</th>
                            <th className="generateAttendanceReportHeader_Date">Attended Date</th>
                            <th className="generateAttendanceReportHeader_Uni">University</th>
                            <th className="generateAttendanceReportHeader_ProgName">Programme Name</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.attendance && this.state.attendance.map((attendance) => {
                            return (
                              <tr key={attendance.id}>
                                <td className="generateAttendanceReportData_SNo text-center">{attendance.counter}</td>
                                <td className="generateAttendanceReportData_Name text-center">{attendance.firstName} {attendance.lastName}</td>
                                <td className="generateAttendanceReportData_Email text-center">{attendance.email}</td>
                                <td className="generateAttendanceReportData_Date text-center">{attendance.date}</td>
                                <td className="generateAttendanceReportData_Uni text-center">{attendance.universityName}</td>
                                <td className="generateAttendanceReportData_ProgName text-left">{attendance.talkName}</td>
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

      </div>
    );
  }
}

export default GenerateAttendance;
