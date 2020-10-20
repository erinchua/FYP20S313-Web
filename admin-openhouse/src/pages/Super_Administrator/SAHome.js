import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal, Alert } from 'react-bootstrap';

import "../../css/Super_Administrator/SAHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import DeleteAdmin from "../../img/Super_Administrator/deleteAdmin.png";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddUserModal from "../../components/Super_Administrator/AddUserModal";

class SAHome extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      administratorType: "",
      email: "",
      fullname: "",
      password: "",
      addUserModal: false,
      deleteAdminModal: false,
    };
    this.handleAddUserModal = this.handleAddUserModal.bind(this);
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
              window.location.reload();
            }
          });
        });
      } else {
        history.push("/Login");
        window.location.reload();
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
      .doc(this.state.userid)
      .delete()
      .then(function () {
        // alert("Deleted");
        window.location.reload();
      });
  }
  
  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();
    var counter = 1;
    const userRef = db
      .collection("Administrators").where("administratorType", "==", "Marketing Administrator")
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
  
  logout() {
    fire.auth().signOut();
    history.push("/Login");
  }


  /* Add User Modal */
  handleAddUserModal = () => {
    this.addUserModal = this.state.addUserModal;
    if (this.addUserModal == false) {
      this.setState({ 
        addUserModal: true 
      });
    }
    else {
      this.setState({ 
        addUserModal: false 
      });
    }
  };

  /* Delete Admin Modal */
  handleDeleteAdminModal = () => {
    this.deleteAdminModal = this.state.deleteAdminModal;
    if (this.deleteAdminModal == false) {
      this.setState({
        deleteAdminModal: true
      });
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
      .collection("Administrators").where("administratorType", "==", "Marketing Administrator")
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
        .collection("Administrators").where("administratorType", "==", "Marketing Administrator") 
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

  retrieveuserdata(id){
    this.setState({ userid: id }, () => {
      this.handleDeleteAdminModal();
    }); 
  }
  

  render() {
    if(this.state.Login)

    return (
      <div>
        <Container fluid className="SAHomeCon">
            <Navbar isMA={false} />

            <Container fluid className="SAHomeContent">
              <Row id="SAHomeSearchBarRow" className="justify-content-center">
                <Col md="3" className="SAHomeSearchBarCol text-center">
                  <Button id="addUserBtn" onClick={this.handleAddUserModal.bind(this)}>Add User</Button>
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

                    {this.state.users && this.state.users.map((user) => {
                      return (
                        <>
                          <tbody>
                            <tr>
                              <td id="adminCheckboxData">
                                <Form.Check type="checkbox" aria-label="admin_checkbox" id="adminCheckbox"/>
                              </td>

                              <td id="serialNoData">{user.counter}</td>
                              <td id="adminNameData">{user.name}</td>
                              <td id="adminEmailData">{user.email}</td>
                              <td id="adminUserTypeData">{user.administratorType}</td>
                              <td id="removeAdminData">                                
                                <Button id="removeAdminBtn" onClick={(e) => {
                                  this.retrieveuserdata(user.id);
                                }}>
                                  <FontAwesomeIcon size="lg" id="removeAdminBtnIcon" icon={faTrashAlt} />  
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                          
                          {this.state.deleteAdminModal == true && 
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
                                  <Col size="12" className="text-center deleteAdminModalCol">
                                    <img id="deleteAdminModalIcon" src={DeleteAdmin} />
                                  </Col>
                                </Row>
                                
                                <Row className="justify-content-center">
                                  <Col size="12" className="text-center deleteAdminModalCol">
                                    <h5 id="deleteAdminModalText">Are you sure you want to remove this administrator?</h5>
                                  </Col>
                                </Row>

                                <Row className="justify-content-center">
                                  <Col size="6" className="text-right deleteAdminModalCol">
                                    <Button id="confirmDeleteAdminModalBtn" onClick={ (e) => {this.DeleteUser()} }>
                                      Confirm
                                    </Button>
                                  </Col>

                                  <Col size="6" className="text-left deleteAdminModalCol">
                                    <Button id="cancelDeleteAdminModalBtn" onClick={this.handleDeleteAdminModal}>Cancel</Button>
                                  </Col>
                                </Row>
                              </Modal.Body>
                            </Modal>
                          }

                        </>
                        
                      );
                    })}

                  </Table>

                </Col>
              </Row>

            </Container>

            <Footer />
            
        </Container>

        {this.state.addUserModal == true ?
          <Modal
           show={this.state.addUserModal}
           onHide={this.handleAddUserModal}
           aria-labelledby="addUserModalTitle"
           size="lg"
           centered
           backdrop="static"
           keyboard={false}
          >
            <AddUserModal />
          </Modal>
          :''
        }

      </div>
    );
    else {

      return(<div></div>)
      }
  }
}
export default SAHome;