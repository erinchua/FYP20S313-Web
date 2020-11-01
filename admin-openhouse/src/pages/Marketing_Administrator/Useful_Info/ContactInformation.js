import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/ContactInformation.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';


const initialStates = {
  weekdayError: "",
  weekendError: "",
  noOperationError: "",
  contactNoError: "",
  emailError: "",
}

class ContactInformation extends Component {
  state = initialStates;

  constructor() {
    super();
    this.state = {
      contactNo: "",
      contactTitle: "",
      country: "",
      email: "",
      weekend: "",
      weekday: "",
      noOperation: "",
      id: "",

      editContactInfoModal: false,
      operatingHoursRow: false,
      contactNoRow: false,
      emailRow: false
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

  display() {
    const db = fire.firestore();
    const userRef = db
    .collection("ContactInfo")
    .where("country", "==", "local")
    .onSnapshot((snapshot) => {
      const contact = [];
      snapshot.forEach((doc) => {
        console.log(doc.data());
        const data = {
          docid: doc.id,
          contactNo: doc.data().contactNo,
          contactTitle: doc.data().contactTitle,
          country: doc.data().country,
          email: doc.data().email,
          id: doc.data().id,
          noOperation: doc.data().operatingHours.noOperation,
          weekday: doc.data().operatingHours.weekday,
          weekend: doc.data().operatingHours.weekend,
        };
        contact.push(data);
      });
      console.log(contact);
      this.setState({ contact: contact });
    });
  }

  // update(e, contactid) {
  //   const contactNo = document.getElementById(contactid + "number").value
  //   const email = document.getElementById(contactid + "email").value
  //   const noOperation = document.getElementById(contactid + "nooperate").value
  //   const weekday = document.getElementById(contactid + "weekday").value
  //   const weekend = document.getElementById(contactid + "weekend").value

  //   const db = fire.firestore();
  //   if (contactNo != null && email != null && noOperation != null && weekday != null && weekend != null) {
  //     const userRef = db
  //     .collection("ContactInfo")
  //     .doc(contactid)
  //     .update({
  //         contactNo: contactNo,
  //         email: email,
  //         noOperation: noOperation,
  //         weekday: weekday,
  //         weekend: weekend,
  //     })
  //     .then(function () {
  //       alert("Updated");
  //       window.location.reload();
  //     });
  //   }
  // }

  editContact(e, contactid) {
    // document.getElementById(contactid + "spannumber").removeAttribute("hidden");
    // document.getElementById(contactid + "spanemail").removeAttribute("hidden");
    // document.getElementById(contactid + "spannooperate").removeAttribute("hidden");
    // document.getElementById(contactid + "spanweekday").removeAttribute("hidden");
    // document.getElementById(contactid + "spanweekend").removeAttribute("hidden");
    // document.getElementById(contactid + "editbutton").setAttribute("hidden", "");
    // document.getElementById(contactid + "updatebutton").removeAttribute("hidden");
    // document.getElementById(contactid + "cancelbutton").removeAttribute("hidden");
    // var texttohide = document.getElementsByClassName(
    //   contactid + "text"
    // );
    // for (var i = 0; i < texttohide.length; i++) {
    //   texttohide[i].setAttribute("hidden", "");
    // }  

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      const db = fire.firestore();
      db
      .collection("ContactInfo")
      .doc(this.state.id)
      .update({
        contactNo: this.state.contactNo,
        email: this.state.email,
        noOperation: this.state.noOperation,
        weekday: this.state.weekday,
        weekend: this.state.weekend,
      })
      .then(dataSnapshot => {
        this.setState({
          editContactInfoModal: false
        })
        this.display()
      }); 
    }
  }

  // CancelEdit(e, contactid) {
  //   document.getElementById(contactid + "spannumber").setAttribute("hidden", "");
  //   document.getElementById(contactid + "spanemail").setAttribute("hidden", "");
  //   document.getElementById(contactid + "spannooperate").setAttribute("hidden", "");
  //   document.getElementById(contactid + "spanweekday").setAttribute("hidden", "");
  //   document.getElementById(contactid + "spanweekend").setAttribute("hidden", "");
  //   document.getElementById(contactid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(contactid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(contactid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //     contactid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }

  /* Edit Contact Information Modal */
  handleEditContactInfoModal = (contactInfo, field) => {
    if (this.state.editContactInfoModal == false) {
      if (field === "openingHours") {
        this.setState({
          operatingHoursRow: true,
          contactNoRow: false,
          emailRow: false,
          contactTitle: contactInfo.contactTitle,
          editContactInfoModal: true,
          id: contactInfo.id,
          weekday: contactInfo.weekday,
          weekend: contactInfo.weekend,
          noOperation: contactInfo.noOperation,
          contactNo: contactInfo.contactNo,
          email: contactInfo.email
        });
      }
      else if (field === "contactNo") {
        this.setState({
          operatingHoursRow: false,
          contactNoRow: true,
          emailRow: false,
          contactTitle: contactInfo.contactTitle,
          editContactInfoModal: true,
          id: contactInfo.id,
          weekday: contactInfo.weekday,
          weekend: contactInfo.weekend,
          noOperation: contactInfo.noOperation,
          contactNo: contactInfo.contactNo,
          email: contactInfo.email
        });
      }
      else if (field === "email") {
        this.setState({
          operatingHoursRow: false,
          contactNoRow: false,
          emailRow: true,
          contactTitle: contactInfo.contactTitle,
          editContactInfoModal: true,
          id: contactInfo.id,
          weekday: contactInfo.weekday,
          weekend: contactInfo.weekend,
          noOperation: contactInfo.noOperation,
          contactNo: contactInfo.contactNo,
          email: contactInfo.email
        });
      }
    }
    else {
      this.setState({
        editContactInfoModal: false
      });
      this.resetForm();
    }
  };

  //Validations for the Forms in Modals
  validate = () => {
    let weekdayError = "";
    let weekendError = "";
    let noOperationError = "";
    let contactNoError = "";
    let emailError = "";

    const validContactRegex = RegExp(/^\+[1-9]{1}[0-9]{1,14}$/);
    const validEmailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!this.state.weekday) {
      weekdayError = "Operating hour for weekday cannot be empty! Put \- or N.A. if not applicable!";
    } 
    
    if (!this.state.weekend) {
      weekendError = "Operating hour for weekend cannot be empty! Put \- or N.A. if not applicable!";
    }

    if (!this.state.noOperation) {
      noOperationError = "No operation field cannot be empty! Put \- or N.A. if not applicable!";
    }

    if (!(this.state.contactNo && validContactRegex.test(this.state.contactNo)) ) {
      contactNoError = "Please enter a valid contact no. in this format: e.g. +65-61234567!";
    }

    if (!(this.state.email && validEmailRegex.test(this.state.email)) ) {
      emailError = "Please enter a valid email!";
    }


    if (weekdayError || weekendError || noOperationError || contactNoError || emailError) {
      this.setState({
        weekdayError, weekendError, noOperationError, contactNoError, emailError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      weekdayError: "",
      weekendError: "",
      noOperationError: "",
      contactNoError: "",
      emailError: "",
      id: "", 
      weekday: "", 
      weekend: "", 
      noOperation: "", 
      contactNo: "", 
      email: ""
    })
  }


  render() {
    return (
      <div>
        <Container fluid className="contactInfoCon">
          <NavBar isMA={true} />

          <Container fluid className="contactInfoContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="contactInfoContentCon">
                  {/* Contact Information Page Header row */}
                  <Row id="contactInfoContentHeaderRow" className="justify-content-center">
                    <Col md="12" className="text-left contactInfoContentHeaderCol">
                      <h4 id="contactInfoHeaderText">Contact Information</h4>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="contactInfoContentTabRow">
                    <Col md="12" className="contactInfoContentTabCol">

                      <Tab.Container defaultActiveKey="general">
                        <Row className="contactInfoTabConRow">
                          <Col md="12" className="contactInfoTabConCol">
                            <Nav defaultActiveKey="general" className="contactInfoTabNav" variant="tabs">
                              <Col md="4" className="contactInfoTabConInnerCol text-center">
                                <Nav.Item className="contactInfoTab_NavItem">
                                  <Nav.Link eventKey="general" className="contactInfoTab_NavLink">General Enquiries</Nav.Link>
                                </Nav.Item>
                              </Col>  

                              <Col md="4" className="contactInfoTabConInnerCol text-center">
                                <Nav.Item className="contactInfoTab_NavItem">
                                  <Nav.Link eventKey="studentServices" className="contactInfoTab_NavLink">Student Services Enquiries</Nav.Link>
                                </Nav.Item>
                              </Col>

                              <Col md="4" className="contactInfoTabConInnerCol text-center">
                                <Nav.Item className="contactInfoTab_NavItem">
                                  <Nav.Link eventKey="programme" className="contactInfoTab_NavLink">Programme Enquiries</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>
                          </Col>

                        </Row>

                        <Row className="contactInfoTabConRow justify-content-center">
                          <Col md="12" className="contactInfoTabConCol text-center">
                            <Tab.Content id="contactInfoTabPane_Steps">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="general">
                                <Col md="12" className="contactInfoTabpaneCol">
                                  <Table responsive="sm" bordered id="contactInfoTable_General">
                                    <thead>
                                      <tr>
                                        <th className="contactInfoHeader_SNo">S/N</th>
                                        <th className="contactInfoHeader_Type">Type</th>
                                        <th className="contactInfoHeader_Info">Information</th>
                                        <th className="contactInfoHeader_Edit">Edit</th>
                                      </tr>
                                    </thead>
                                    
                                    <tbody>
                                      {/* Operating Hours Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "General Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">1</td>
                                              <td className="contactInfoData_Type text-center">Operating Hours:</td>
                                              <td className="contactInfoData_OperatingHrInfo text-left">
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekday:</b> {contactInfo.weekday}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekend:</b> {contactInfo.weekend}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Closed on:</b> {contactInfo.noOperation}</Col>
                                                </Row>
                                              </td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "openingHours")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                        
                                      {/* Tel No. Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "General Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">2</td>
                                              <td className="contactInfoData_Type text-center">Tel No.</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.contactNo}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "contactNo")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}

                                      {/* Email Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "General Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">3</td>
                                              <td className="contactInfoData_Type text-center">Email:</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.email}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "email")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                          
                                    </tbody>                                      
                                  </Table>
                                </Col>
                              </Tab.Pane>

                              {/* Tab Pane 2 */}
                              <Tab.Pane eventKey="studentServices">
                                <Col md="12" className="contactInfoTabpaneCol">
                                  <Table responsive="sm" bordered id="contactInfoTable_StudentServices">
                                    <thead>
                                      <tr>
                                        <th className="contactInfoHeader_SNo">S/N</th>
                                        <th className="contactInfoHeader_Type">Type</th>
                                        <th className="contactInfoHeader_Info">Information</th>
                                        <th className="contactInfoHeader_Edit">Edit</th>
                                      </tr>
                                    </thead>
              
                                    <tbody>
                                      {/* Operating Hours Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Student Services Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">1</td>
                                              <td className="contactInfoData_Type text-center">Operating Hours:</td>
                                              <td className="contactInfoData_OperatingHrInfo text-left">
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekday:</b> {contactInfo.weekday}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekend:</b> {contactInfo.weekend}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Closed on:</b> {contactInfo.noOperation}</Col>
                                                </Row>
                                              </td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "openingHours")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                        
                                      {/* Tel No. Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Student Services Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">2</td>
                                              <td className="contactInfoData_Type text-center">Tel No.</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.contactNo}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "contactNo")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}

                                      {/* Email Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Student Services Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">3</td>
                                              <td className="contactInfoData_Type text-center">Email:</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.email}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "email")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                          
                                    </tbody>

                                  </Table>
                                </Col>
                              </Tab.Pane>

                              {/* Tab Pane 3 */}
                              <Tab.Pane eventKey="programme">
                                <Col md="12" className="contactInfoTabpaneCol">
                                  <Table responsive="sm" bordered id="contactInfoTable_Programme">
                                  <thead>
                                      <tr>
                                        <th className="contactInfoHeader_SNo">S/N</th>
                                        <th className="contactInfoHeader_Type">Type</th>
                                        <th className="contactInfoHeader_Info">Information</th>
                                        <th className="contactInfoHeader_Edit">Edit</th>
                                      </tr>
                                    </thead>
              
                                    <tbody>
                                      {/* Operating Hours Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Programmes Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">1</td>
                                              <td className="contactInfoData_Type text-center">Operating Hours:</td>
                                              <td className="contactInfoData_OperatingHrInfo text-left">
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekday:</b> {contactInfo.weekday}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Weekend:</b> {contactInfo.weekend}</Col>
                                                </Row>
                                                <Row className="contactInfoDataInfo_InnerRow">
                                                  <Col className="contactInfoDataInfo_InnerCol"><b>Closed on:</b> {contactInfo.noOperation}</Col>
                                                </Row>
                                              </td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "openingHours")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}
                                        
                                      {/* Tel No. Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Programmes Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">2</td>
                                              <td className="contactInfoData_Type text-center">Tel No.</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.contactNo}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "contactNo")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      })}

                                      {/* Email Row */}
                                      {this.state.contact && this.state.contact.map((contactInfo) => {
                                        if(contactInfo.contactTitle === "Programmes Enquiries"){
                                          return (
                                            <tr key={contactInfo.id}>
                                              <td className="contactInfoData_SNo text-center">3</td>
                                              <td className="contactInfoData_Type text-center">Email:</td>
                                              <td className="contactInfoData_Info text-left">{contactInfo.email}</td>
                                              <td className="contactInfoData_Edit text-center">
                                                <Button className="editContactInfoBtn" onClick={()=>this.handleEditContactInfoModal(contactInfo, "email")}>
                                                  <FontAwesomeIcon size="lg" className="editContactInfoBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                            </tr>
                                          );
                                        }
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


        {/* Edit Contact Info Modal */}
        <Modal 
          show={this.state.editContactInfoModal}
          onHide={this.handleEditContactInfoModal}
          aria-labelledby="editContactInfoModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            {this.state.operatingHoursRow ?
              <Modal.Title id="editContactInfoModalTitle" className="w-100">Edit Operating Hours</Modal.Title>
              :""
            }

            {this.state.contactNoRow ?
              <Modal.Title id="editContactInfoModalTitle" className="w-100">Edit Contact No.</Modal.Title>
              :""
            }

            {this.state.emailRow ?
              <Modal.Title id="editContactInfoModalTitle" className="w-100">Edit Email</Modal.Title>
              :""
            }
          </Modal.Header>

          <Modal.Body id="editContactInfoModalBody">
            <Form noValidate onClick={() => {this.editContact()}}>
              {/* Operating Hours */}
              {this.state.operatingHoursRow ?
                <>
                  <Form.Row className="justify-content-center editContactInfoFormRow">
                    <Col md="10">
                      <Form.Label className="editContactInfoFormLabel">Weekday</Form.Label>
                      <FormControl defaultValue={this.state.weekday} onChange={this.updateInput} required noValidate className="editContactInfoForm_InputField" placeholder="Weekday" />
                      
                      <div className="errorMessage text-left">{this.state.weekdayError}</div>
                    </Col>
                  </Form.Row>

                  <Form.Row className="justify-content-center editContactInfoFormRow">
                    <Col md="10">
                      <Form.Label className="editContactInfoFormLabel">Weekend</Form.Label>
                      <FormControl defaultValue={this.state.weekend} onChange={this.updateInput} required noValidate className="editContactInfoForm_InputField" placeholder="Weekend" />
                    
                      <div className="errorMessage text-left">{this.state.weekendError}</div>
                    </Col>
                  </Form.Row>

                  <Form.Row className="justify-content-center editContactInfoFormRow">
                    <Col md="10">
                      <Form.Label className="editContactInfoFormLabel">Closed on</Form.Label>
                      <FormControl defaultValue={this.state.noOperation} onChange={this.updateInput} required noValidate className="editContactInfoForm_InputField" placeholder="Closed on" />
                    
                      <div className="errorMessage text-left">{this.state.noOperationError}</div>
                    </Col>
                  </Form.Row> 
                </>
                : ""
              }

              {/* Tel No. */}
              {this.state.contactNoRow ?
                <>
                  <Form.Row className="justify-content-center editContactInfoFormRow">
                    <Col md="10">
                      <Form.Label className="editContactInfoFormLabel">Tel No.</Form.Label>
                      <FormControl defaultValue={this.state.contactNo} onChange={this.updateInput} required noValidate className="editContactInfoForm_InputField" placeholder="Tel No." />
                    
                      <div className="errorMessage text-left">{this.state.contactNoError}</div>
                    </Col>
                  </Form.Row>
                </>
                : ""
              }

              {/* Email */}
              {this.state.emailRow ?
                <>
                  <Form.Row className="justify-content-center editContactInfoFormRow">
                    <Col md="10">
                      <Form.Label className="editContactInfoFormLabel">Email</Form.Label>
                      <FormControl defaultValue={this.state.email} onChange={this.updateInput} required noValidate className="editContactInfoForm_InputField" placeholder="Email" />
                    
                      <div className="errorMessage text-left">{this.state.emailError}</div>
                    </Col>
                  </Form.Row>
                </>
                : ""
              }
            
            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Contact Info Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesContactInfoFormBtn" onClick={(e) => {this.editContact()}}>Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditContactInfoFormBtn" onClick={this.handleEditContactInfoModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>

        </Modal>



        {/* <div>
          <table class="table table-bordered">
            <tbody>
                <h4>General Enquiries</h4>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Type</th>
                <th scope="col">Information</th>
                <th scope="col">Edit</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Operating Hours</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                      if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <tr>{contact.weekDay}</tr>
                        <tr>{contact.weekEnd}</tr>
                      </td>
                    );
                } })}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
              }})}
              </tr>
              <tr>
                <td>2</td>
                <td>Tel</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <tr>{contact.contactNo}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
                }})}
              </tr>
              <tr>
                <td>3</td>
                <td>Email</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <tr>{contact.email}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "General Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
              }})}
              </tr>

              <h4>Student Services Enquiries</h4>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Type</th>
                <th scope="col">Information</th>
                <th scope="col">Edit</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Operating Hours</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                      if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <tr>{contact.weekDay}</tr>
                        <tr>{contact.weekEnd}</tr>
                        <tr>{contact.noOperation}</tr>
                      </td>
                    );
                } })}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
                }})}
              </tr>
              <tr>
                <td>2</td>
                <td>Tel</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <tr>{contact.contactNo}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
                }})}
              </tr>
              <tr>
                <td>3</td>
                <td>Email</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <tr>{contact.email}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Student Services Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
              }})}
              </tr>

              <h4>Programmes Enquiries</h4>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Type</th>
                <th scope="col">Information</th>
                <th scope="col">Edit</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Operating Hours</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                      if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <tr>{contact.weekDay}</tr>
                        <tr>{contact.weekEnd}</tr>
                        <tr>{contact.noOperation}</tr>
                      </td>
                    );
                } })}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
              }})}
              </tr>
              <tr>
                <td>2</td>
                <td>Tel</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <tr>{contact.contactNo}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
              }})}
              </tr>
              <tr>
                <td>3</td>
                <td>Email</td>
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <tr>{contact.email}</tr>
                      </td>
                    );
                }})}
                {this.state.contact &&
                  this.state.contact.map((contact) => {
                    if(contact.contactTitle === "Programmes Enquiries"){
                    return (
                      <td>
                        <button> Edit </button>
                      </td>
                    );
                }})}
              </tr>
            </tbody>
          </table>
        </div> */}


      </div>
    );
  }
}
  
export default ContactInformation;