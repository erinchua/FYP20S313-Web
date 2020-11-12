import React, { Component, useReducer } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

import "../../../css/Marketing_Administrator/GenerateStudentRegistration.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


class GenerateStudentRegistration extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      dob: "",
      highestQualification: "",
      nationality: "",
      isSuspendedFromForum: "",
      id: "",
      suspendStudAcctModal: false,
      unsuspendStudAcctModal: false,
      totalNumber: 0,
      dateRegistered: "",
      useremail:"",
    };
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {

        var getrole = db
        .collection("Administrators")
        .where("email", "==", user.email);
        this.state.useremail=user.email;
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
    const userRef = db
    .collection("Students")
    .get()
    .then((snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const data = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          contactNo: doc.data().contactNo,
          dob: doc.data().dob,
          highestQualification: doc.data().highestQualification,
          nationality: doc.data().nationality,
          isSuspendedFromForum: doc.data().isSuspendedFromForum,
          dateRegistered: doc.data().dateRegistered,
          id: doc.id,
          counter : counter,
        };
        counter++;
        users.push(data);
      });

      this.setState({ users: users });
    });
  }

  generateReport = () => {
    var counter = 0;
    const total = db
    .collection("Students")
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        counter++;
      });

      this.setState(
        {
            totalNumber: counter
        },
        () => {
          this.generatePDF();
        }
      );
    });
  }

  generatePDF(){
    var doc = new jsPDF('p', 'mm', [297, 210]);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var user = this.state.useremail;
    var adminuser = "\nRequested by: " + user;
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

    var totalNumber = "\nTotal Number of Registrations: " + this.state.totalNumber;
    doc.setFontSize(11);   
    doc.text(14, 39, totalNumber);

    // Line Separator
    doc.line(14, 50, 196, 50);

    doc.setFontSize(10);
    doc.text(14, 59, "List of Registrants");

    doc.autoTable({
      html: "#students",
      headStyles: { 
        halign: 'center', 
        fillColor: [136, 183, 181],
        font: 'helvetica',
        cellPadding: {top: 2, right: 2, bottom: 2, left: 2}
      },
      columnStyles: { 
        0: { halign: 'center'},
        1: { halign: 'left'},
        2: { halign: 'left'},
        3: { halign: 'center'},
        4: { halign: 'center'},
        5: { halign: 'center'},
      },
      startY: 65,
      pageBreak: "auto"
    });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("Total Number of Registrations for Open House Mobile Application Report", 20, 20);

    doc.save("StudentRegistration_" + date + ".pdf");
  };


  render() {
    return (
      <div>
        <Container fluid className="generateMobileRegCon">
          <NavBar isMA={true} />

          <Container fluid className="generateMobileRegContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{ paddingRight: "0" }} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="generateMobileRegContentCon">
                  {/* Generate Mobile Registration Page Header row */}
                  <Row className="justify-content-center generateMobileRegContentHeaderRow">
                    <Col md="9" className="text-left generateMobileRegContentHeaderCol">
                      <h4 className="generateMobileRegHeaderText">Report on Total Number of Registrations for Open House Mobile Application</h4>
                    </Col>

                    <Col md="3" className="text-right generateMobileRegContentHeaderCol">
                      <Button className="generateReportBtn" onClick={this.generateReport}>
                        <FontAwesomeIcon size="lg" className="generateReportBtnIcon" icon={faPlus} />
                        <span className="generateReportBtnText">Generate Report</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Table Row */}
                  <Row className="justify-content-center generateMobileRegReportTableRow">
                    <Col md="12" className="text-center">
                      <Table responsive="sm" hover bordered id="students" className="generateMobileRegReportTable">
                        <thead>
                          <tr>
                            <th className="generateMobileRegReportHeader_SNo">S/N</th>
                            <th className="generateMobileRegReportHeader_RegEmail">Registered Email</th>
                            <th className="generateMobileRegReportHeader_Name">Name</th>
                            <th className="generateMobileRegReportHeader_HighestQual">Highest Qualification</th>
                            <th className="generateMobileRegReportHeader_ContactNo">Contact No.</th>
                            <th className="generateMobileRegReportHeader_RegDate">Date of Registration</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.users && this.state.users.map((user) => {
                            return (
                              <tr key={user.id}>
                                <td className="generateMobileRegReportData_SNo">{user.counter}</td>
                                <td className="generateMobileRegReportData_RegEmail">{user.email}</td>
                                <td className="generateMobileRegReportData_Name">{user.firstName} {user.lastName}</td>
                                <td className="generateMobileRegReportData_HighestQual">{user.highestQualification}</td>
                                <td className="generateMobileRegReportData_ContactNo">{user.contactNo}</td>
                                <td className="generateMobileRegReportData_RegDate">{user.dateRegistered}</td>
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

export default GenerateStudentRegistration;
