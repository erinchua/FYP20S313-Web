import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal } from 'react-bootstrap';

import "../../css/Super_Administrator/SAHome.css";
import "../../css/Super_Administrator/SAHomeModals.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faAddressCard, faEnvelope, faUserCircle  } from '@fortawesome/free-regular-svg-icons';
import DeleteAdmin from "../../img/Super_Administrator/deleteAdmin.png";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const bcrypt = require('bcryptjs')

const initialStates = {
  nameError: "",
  emailError: "",
  userTypeError: "",
}

  /* Generate Random Password */
  function randomGenPassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var specialChars = "!@#$%^&*~()?,<>./{}[]|-_`'\":;";
    var allChars = numberChars + upperChars + lowerChars + specialChars;

    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = specialChars;

    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return shuffleArray(randPasswordArray.map(function(x) { 
      return x[Math.floor(Math.random() * x.length)] 
    })).join('');
    
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }


class SAHome extends Component {
  state = initialStates;

  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      administratorType: "",
      email: "",
      fullname: "",
      password: "",
      id: "",

      filteredAdminType: [],

      addUserModal: false,
      deleteAdminModal: false,
    };
    this.resetForm = this.resetForm.bind(this);
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();
        var a  = this;
        var getrole = db
        .collection("Administrators")
        .where("email", "==", user.email);
        getrole.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().administratorType === "Super Administrator") {
              a.setState(() => ({
                Login: true, })
              )
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

  DeleteUser() {
    const db = fire.firestore();

    const userRef = db
    .collection("Administrators")
    .doc(this.state.id)
    .delete()
    .then(dataSnapshot => {
      this.display();
      this.setState({deleteAdminModal: false}); 
    });
  }
  
  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var counter = 1;
    const userRef = db
    .collection("Administrators").where("administratorType", "!=", "Super Administrator")
    .get()
    .then((snapshot) => {
      const users = [];
      const adminType = [];
      snapshot.forEach((doc) => {
        const data = {
          administratorType: doc.data().administratorType,
          name: doc.data().name,
          email: doc.data().email,
          password: doc.data.password,
          id: doc.id,
          counter : counter,
        };
        counter++;
        users.push(data);
        adminType.push(doc.data().administratorType);
      });
      this.setState({ adminType: adminType });
      var filteredAdminType = adminType.filter(onlyUnique);

      this.setState({ users: users });
      this.setState({ filteredAdminType: filteredAdminType });
    });
  }
  
  logout() {
    fire.auth().signOut();
    history.push("/Login");
  }

  addUser = (e) => {
    e.preventDefault();

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      this.state.password = randomGenPassword(10);
      console.log("Plain Pwd: " + this.state.password)

      /* Hash Password */
      const passwordHash = bcrypt.hashSync(this.state.password, 10);
  
      /* Decrypt Password Hash */
      // const decryptPassword = bcrypt.compareSync(this.state.password, passwordHash);
      // console.log("Decrypted: " + decryptPassword)
      
      firecreate
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((useraction) => {
        const db = fire.firestore();

        const userRef = db
        .collection("Administrators")
        .add({
          administratorType: this.state.administratorType,
          email: this.state.email,
          name: this.state.fullname,
          password: passwordHash,
        })
        .then(dataSnapshot => {
          this.setState({addUserModal: false}); 
          this.display();
        });
      });
    }
  };

  /* Add User Modal */
  handleAddUserModal = () => {
    if (this.state.addUserModal == false) {
      this.setState({ 
        addUserModal: true 
      });
    }
    else {
      this.setState({ 
        addUserModal: false 
      });
      this.resetForm();
    }
  };

  /* Delete Admin Modal */
  handleDeleteAdminModal = (id) => {
    if (this.state.deleteAdminModal == false) {
      this.setState({
        deleteAdminModal: true
      });
      this.state.id = id;
    }
    else {
      this.setState({
        deleteAdminModal: false
      });
    }
  };

  search = (e) => {
    var searchvalue = document.getElementById("SAHomeSearchBar").value;
    var counter = 1;

    const db = fire.firestore();

    if (searchvalue == "" || searchvalue == null) {
      
      const userRef = db
      .collection("Administrators").where("administratorType", "!=", "Super Administrator")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          const data = {
            administratorType: doc.data().administratorType,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data.password,
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
      .collection("Administrators").where("administratorType", "==", "Marketing Administrator") // Need to change to show crew also
      .orderBy("email")
      .startAt(searchvalue)
      .endAt(searchvalue + "\uf8ff")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          const data = {
            administratorType: doc.data().administratorType,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data.password,
            id: doc.id,
            counter : counter,
          };
          counter++;
          users.push(data);
        });
        this.setState({ users: users });
      });
    }
  }

  //Validations for the Forms in Modals
  validate = () => {
    let nameError = "";
    let emailError = "";
    let userTypeError = "";

    const validEmailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if ( !(this.state.fullname && this.state.fullname.length >= 4) ) {
      nameError = "Please enter a valid name!";
    } 
    
    if ( !(this.state.email && validEmailRegex.test(this.state.email)) ) {
      emailError = "Please enter a valid email!";
    }

    if (!this.state.administratorType) {
      userTypeError = "Please select a valid user type!";
    }

    if (nameError || emailError || userTypeError) {
      this.setState({
        nameError, emailError, userTypeError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      nameError: "",
      emailError: "",
      userTypeError: "",
      id: "", 
      fullname: "", 
      email: "", 
      startTime: "", 
      userType: ""
    })
  }
  

  render() {

    return (
      <div>
        <Container fluid className="SAHomeCon">
            <Navbar isMA={false} />

            <Container fluid className="SAHomeContent">
              <Row id="SAHomeSearchBarRow" className="justify-content-center">
                <Col md="3" className="SAHomeSearchBarCol text-center">
                  <Button id="addUserBtn" onClick={this.handleAddUserModal}>Add User</Button>
                </Col>
                
                <Col md="6" className="SAHomeSearchBarCol">
                  <InputGroup className="justify-content-center">
                    <Form inline className="SAHomeSearchInputForm">
                      <FormControl id="SAHomeSearchBar" type="text" placeholder="Search" onChange={this.search} />

                      <InputGroup.Prepend>
                        <Button id="SAHomeSearchBarBtn" onClick={this.search}>
                          <FontAwesomeIcon size="lg" id="searchBtnIcon" icon={faSearch} />  
                        </Button>
                      </InputGroup.Prepend>
                    </Form>

                  </InputGroup>
                </Col>

                <Col md="3"></Col>
              </Row>

              <Row id="adminTableRow" className="justify-content-center">
                <Col md="12" className="text-center">
                  <Table responsive="sm" bordered hover id="adminTable">
                    <thead>
                      <tr>
                        <th id="adminCheckboxHeader"></th>
                        <th id="serialNoHeader">S/N</th>
                        <th id="adminNameHeader">Name</th>
                        <th id="adminEmailHeader">Email</th>
                        <th id="adminUserTypeHeader">User Type</th>
                        <th id="removeAdminHeader">Remove User</th>
                      </tr>
                    </thead>

                    
                    <tbody>
                      {this.state.users && this.state.users.map((user) => {
                        return (
                          <tr key={user.id}>
                            <td id="adminCheckboxData">
                              <Form.Check type="checkbox" aria-label="admin_checkbox" id="adminCheckbox"/>
                            </td>

                            <td id="serialNoData">{user.counter}</td>
                            <td id="adminNameData">{user.name}</td>
                            <td id="adminEmailData">{user.email}</td>
                            <td id="adminUserTypeData">{user.administratorType}</td>
                            <td id="removeAdminData">                                
                              <Button id="removeAdminBtn" onClick={ (e) => {this.handleDeleteAdminModal(user.id);} }>
                                <FontAwesomeIcon size="lg" id="removeAdminBtnIcon" icon={faTrashAlt} />  
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

            <Footer />      
        </Container>


        {/* Add User Modal */}
        <Modal
          show={this.state.addUserModal}
          onHide={this.handleAddUserModal}
          aria-labelledby="addUserModalTitle"
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="addUserModalTitle" className="w-100">
              Add Staff
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="addUserModalBody">
            <Form noValidate>
              {/* Admin Name */}
              <Form.Row className="justify-content-center addAdminFormRow">
                <Col md="3"></Col>
                
                <Col md="1" className="addAdminFormCol text-right">
                  <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faAddressCard} />
                </Col>

                <Col md="5">
                  <Form.Control name="fullname" type="text" placeholder="Full Name*" className="addAdminFormText" required onChange={this.updateInput} noValidate />
                  <div className="errorMessage text-left">{this.state.nameError}</div>
                </Col>

                <Col md="3"></Col>
              </Form.Row>

              {/* Admin Email */}
              <Form.Row className="justify-content-center addAdminFormRow">
                <Col md="3"></Col>
                
                <Col md="1" className="addAdminFormCol text-right">
                  <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faEnvelope} />
                </Col>

                <Col md="5">
                  <Form.Control name="email" type="email" placeholder="Email*" className="addAdminFormText" required onChange={this.updateInput} noValidate />
                  <div className="errorMessage text-left">{this.state.emailError}</div>
                </Col>

                <Col md="3"></Col>
              </Form.Row>

              {/* Admin User Type */}
              <Form.Row className="justify-content-center addAdminFormRow">
                <Col md="3"></Col>
                
                <Col md="1" className="addAdminFormCol text-right">
                  <FontAwesomeIcon size="lg" className="addAdminFormIcon" icon={faUserCircle} />
                </Col>

                <Col md="5">
                  <Form.Control as="select" name="administratorType" defaultValue="" className="addAdminFormText" id="addAdminFormSelect" required onChange={this.updateInput} noValidate>
                    <option value="" className="addAdminFormSelectOption">Choose User Type</option>

                    {this.state.filteredAdminType && this.state.filteredAdminType.map((userType) => {
                      return (
                        <>
                          <option value={userType} className="addAdminFormSelectOption">{userType}</option>
                        </>
                      );
                    })}
                  </Form.Control>

                  <div className="errorMessage text-left">{this.state.userTypeError}</div>
                </Col>

                <Col md="3"></Col>
              </Form.Row>

              <Form.Row className="justify-content-center addAdminFormBtnRow">
                <Col className="text-center">
                  <Button type="submit" id="addAdminFormBtn" onClick={this.addUser}>Add Administrator</Button>
                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>
        </Modal>


        {/* Delete User Modal */}
        <Modal 
          show={this.state.deleteAdminModal}
          onHide={this.handleDeleteAdminModal}
          aria-labelledby="deleteAdminModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="deleteAdminModalTitle">
              Remove Administrator
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <Row className="justify-content-center">
              <Col md="12" className="text-center deleteAdminModalCol">
                <img id="deleteAdminModalIcon" src={DeleteAdmin} />
              </Col>
            </Row>
            
            <Row className="justify-content-center">
              <Col md="12" className="text-center deleteAdminModalCol">
                <h5 id="deleteAdminModalText">Are you sure you want to remove this administrator?</h5>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md="6" className="text-right deleteAdminModalCol">
                <Button id="confirmDeleteAdminModalBtn" onClick={ (e) => {this.DeleteUser(e, this.state.id)} }>Confirm</Button>
              </Col>

              <Col md="6" className="text-left deleteAdminModalCol">
                <Button id="cancelDeleteAdminModalBtn" onClick={this.handleDeleteAdminModal}>Cancel</Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default SAHome;