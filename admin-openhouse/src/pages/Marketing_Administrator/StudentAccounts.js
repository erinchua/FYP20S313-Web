import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal } from 'react-bootstrap';

import "../../css/Marketing_Administrator/StudentAccounts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBan, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import SuspendStud from '../../img/Marketing_Administrator/ban-solid.svg';
import UnsuspendStud from '../../img/Marketing_Administrator/user-check-solid.svg';

import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';


class StudentAccounts extends Component {
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
    };
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

  display() {
    var counter = 1;
    db
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
          id: doc.id,
          counter : counter,
        };
        counter++;
        users.push(data);
      });

      this.setState({ users: users });
    });
  }

  Unsuspend(e, studentdocid) {
    db
    .collection("Students")
    .doc(studentdocid)
    .update({
      isSuspendedFromForum: false,
    })
    .then(dataSnapshot => {
      this.setState({
        suspendStudAcctModal: false
      })
      this.display()
    }); 

    db
    .collection("Forum")
    .doc(studentdocid)
    .update({
      suspended: false,
    })
    .then(dataSnapshot => {
      this.setState({
        suspendStudAcctModal: false
      })
      this.display()
    }); 
  }

  Suspend(e, studentdocid) {
    db
    .collection("Students")
    .doc(studentdocid)
    .update({
      isSuspendedFromForum: true,
    })
    .then(dataSnapshot => {
      this.setState({
        suspendStudAcctModal: false
      })
      this.display()
    }); 

    db
    .collection("Forum")
    .doc(studentdocid)
    .update({
      suspended: true,
    })
    .then(dataSnapshot => {
      this.setState({
        suspendStudAcctModal: false,
      })
      this.display()
    }); 
  }

  Search = (e) => {
    var counter = 1;
    var searchvalue = document.getElementById("MAStudentAcctSearchBar").value;

    if (searchvalue == "" || searchvalue == null) {
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
            id: doc.id,
            counter : counter,
          };
          users.push(data);
          counter ++;
        });
        this.setState({ users: users });
      });
    } else {
      const userRef = db
      .collection("Students")
      .orderBy("email")
      .startAt(searchvalue)
      .endAt(searchvalue + "\uf8ff")
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
            id: doc.id,
            counter : counter,
          };
          counter++;
          users.push(data);
        });

        this.setState({ users: users });
      });
    }
  };

  /* Suspend Student Account Modal */
  handleSuspendStudAcctModal = () => {
    if (this.state.suspendStudAcctModal == false) {
      this.setState({
        suspendStudAcctModal: true,
      });
    }
    else {
      this.setState({
        suspendStudAcctModal: false
      });
    }
  };

  /* Handle Suspend Modals */
  retrieveuserdata_suspend(id, isSuspendedFromForum){
    this.state.id = id
    this.state.isSuspendedFromForum = isSuspendedFromForum
    this.handleSuspendStudAcctModal();
  }


  render() {
    return (
      <div>
        <Container fluid className="MAStudentAcctCon">
          <NavBar isMA={true} />

          <Container fluid className="MAStudentAcctContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAStudentAcctContentCon">
                  {/* Search row */}
                  <Row id="MAStudentAcctContentSearchRow">
                    <Col md="12" id="MAStudentAcctContentSearchCol">
                      <InputGroup className="justify-content-center">
                        <Form inline className="MAStudentAcctSearchInputForm justify-content-center">
                          <FormControl id="MAStudentAcctSearchBar" type="text" placeholder="Search" onChange={this.Search} />

                          <InputGroup.Prepend>
                            <Button id="MAStudentAcctSearchBarBtn" onClick={this.Search}>
                              <FontAwesomeIcon size="lg" id="searchBtnIcon" icon={faSearch}/>  
                            </Button>
                          </InputGroup.Prepend>
                        </Form>
                      </InputGroup>

                    </Col>
                  </Row>

                  {/* Student Accounts Table */}
                  <Row id="MAStudentAcctTableRow" className="justify-content-center">
                    <Col md="12" className="text-center">
                      <Table responsive="sm" bordered id="MAStudentAcctTable">
                        <thead>
                          <tr>
                            <th id="studAcctHeader_Checkbox"></th>
                            <th id="studAcctHeader_SNo">S/N</th>
                            <th id="studAcctHeader_FirstName">First Name</th>
                            <th id="studAcctHeader_LastName">Last Name</th>
                            <th id="studAcctHeader_Email">Email</th>
                            <th id="studAcctHeader_ContactNo">Contact No.</th>
                            <th id="studAcctHeader_DOB">D.O.B</th>
                            <th id="studAcctHeader_HighestQual">Highest Qualification</th>
                            <th id="studAcctHeader_Nationality">Nationality</th>
                            <th id="studAcctHeader_SuspendStud">Suspend From Forum</th>
                          </tr>
                        </thead>
                          
                        <tbody>
                          {this.state.users && this.state.users.map((user) => {
                            return (
                              <tr key={user.id}>
                                <td id="studAcctData_Checkbox">
                                  <Form.Check type="checkbox" aria-label="studAcctCheckbox" id="studAcctCheckbox"/>
                                </td>
                                <td id="studAcctData_SNo">{user.counter}</td>
                                <td id="studAcctData_FirstName">{user.firstName}</td>
                                <td id="studAcctData_LastName">{user.lastName}</td>
                                <td id="studAcctData_Email">{user.email}</td>
                                <td id="studAcctData_ContactNo">{user.contactNo}</td>
                                <td id="studAcctData_DOB">{user.dob}</td>
                                <td id="studAcctData_HighestQual">{user.highestQualification}</td>
                                <td id="studAcctData_Nationality">{user.nationality}</td>
                                <td id="studAcctData_SuspendStud">
                                  <Button id="unsuspendStudBtn" onClick={(e) => {this.retrieveuserdata_suspend(user.id, user.isSuspendedFromForum);} } >
                                    {user.isSuspendedFromForum ?
                                      <FontAwesomeIcon size="lg" id="suspendStudBtnIcon" icon={faUserCheck} />
                                      :
                                      <FontAwesomeIcon size="lg" id="unsuspendStudBtnIcon" icon={faBan} /> 
                                    }
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

         {/* Suspend Student Modal */}
         {this.state.suspendStudAcctModal == true && 
          <Modal 
            show={this.state.suspendStudAcctModal}
            onHide={this.handleSuspendStudAcctModal}
            aria-labelledby="suspendStudAcctModalTitle"
            size="md"
            centered
            backdrop="static"
            keyboard={false}
          >
          { this.state.isSuspendedFromForum == false ?
            <>
              <Modal.Header closeButton className="justify-content-center">
                <Modal.Title id="suspendStudAcctModalTitle">
                  Suspend Student
                </Modal.Title>
              </Modal.Header>
              
              <Modal.Body>
                <Row className="justify-content-center">
                  <Col size="12" className="text-center suspendStudAcctModalCol">
                    <img src={SuspendStud} id="suspendStudAcctModalIcon" />
                  </Col>
                </Row>
                
                <Row className="justify-content-center">
                  <Col size="12" className="text-center suspendStudAcctModalCol">
                    <h5 id="suspendStudAcctModalText">Are you sure you want to suspend this student from the forum?</h5>
                  </Col>
                </Row>

                <Row className="justify-content-center">
                  <Col size="6" className="text-right suspendStudAcctModalCol">
                    <Button id="confirmSuspendStudAcctModalBtn" onClick={ (e) => {this.Suspend(e, this.state.id)} }>Confirm</Button>
                  </Col>

                  <Col size="6" className="text-left suspendStudAcctModalCol">
                    <Button id="cancelSuspendStudAcctModalBtn" onClick={this.handleSuspendStudAcctModal}>Cancel</Button>
                  </Col>
                </Row>
              </Modal.Body> 
            </>
            : 
            <>
              <Modal.Header closeButton className="justify-content-center">
                <Modal.Title id="unsuspendStudAcctModalTitle">
                  Unsuspend Student
                </Modal.Title>
              </Modal.Header>
            
              <Modal.Body>
                <Row className="justify-content-center">
                  <Col size="12" className="text-center unsuspendStudAcctModalCol">
                    <img src={UnsuspendStud} id="unsuspendStudAcctModalIcon" />
                  </Col>
                </Row>
                
                <Row className="justify-content-center">
                  <Col size="12" className="text-center unsuspendStudAcctModalCol">
                    <h5 id="unsuspendStudAcctModalText">Are you sure you want to unsuspend this student from the forum?</h5>
                  </Col>
                </Row>

                <Row className="justify-content-center">
                  <Col size="6" className="text-right unsuspendStudAcctModalCol">
                    <Button id="confirmUnsuspendStudAcctModalBtn" onClick={ (e) => {this.Unsuspend(e, this.state.id)} }>Confirm</Button>
                  </Col>

                  <Col size="6" className="text-left unsuspendStudAcctModalCol">
                    <Button id="cancelUnsuspendStudAcctModalBtn" onClick={this.handleSuspendStudAcctModal}>Cancel</Button>
                  </Col>
                </Row>
              </Modal.Body>
            </>
          }
          </Modal>
        }
        
      </div>
    );
  }
}

export default StudentAccounts;
