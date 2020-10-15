import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal } from 'react-bootstrap';

import "../../css/Super_Administrator/SAHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

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
    };
    this.handleAddUserModal = this.handleAddUserModal.bind(this);
    // this.handleAddUserModalSubmit = this.handleAddUserModalSubmit.bind(this);
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

  DeleteUser(e, administratorid) {
    const db = fire.firestore();

    const userRef = db
      .collection("Administrators")
      .doc(administratorid)
      .delete()
      .then(function () {
        alert("Deleted");
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
      .collection("Administrators")
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
  search = (e) => {
var searchvalue = document.getElementById("SAHomeSearchBar").value;
var counter = 1;

const db = fire.firestore();

var searchvalue = document.getElementById("SAHomeSearchBar").value;
if (searchvalue == "" || searchvalue == null) {
  
  const userRef = db
   .collection("Administrators")
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
    .collection("Administrators")
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


  search = (e) => {
    var searchvalue = document.getElementById("SAHomeSearchBar").value;
    var counter = 1;

    const db = fire.firestore();

    var searchvalue = document.getElementById("SAHomeSearchBar").value;
    if (searchvalue == "" || searchvalue == null) {
      
      const userRef = db
      .collection("Administrators")
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
        .collection("Administrators")
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
  
  
  render() {
    if(this.state.Login)

    return (
      <div>
        <Container fluid className="SAHomeCon">
            <Navbar />

            <Container fluid className="SAHomeContent">
              <Row id="SAHomeSearchBarRow" className="justify-content-center">
                <Col md="3" className="SAHomeSearchBarCol text-center">
                  <Button id="addUserBtn" onClick={this.handleAddUserModal.bind(this)}>Add User</Button>
                </Col>
                
                <Col md="6" className="SAHomeSearchBarCol">
                  <InputGroup className="justify-content-center">
                    <Form inline className="SAHomeSearchInputForm">
                      <FormControl id="SAHomeSearchBar" type="text" placeholder="Search" />

                      <InputGroup.Prepend>
                        <Button id="SAHomeSearchBarBtn">
                          <FontAwesomeIcon size="lg" id="searchBtnIcon" onClick={this.search} icon={faSearch} />  
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
                        <tbody>
                          <tr>
                            <td id="adminCheckboxData">
                              <Form.Check type="checkbox" aria-label="admin checkbox" id="adminCheckbox"/>
                            </td>

                            {/* Serial No. to be generated dynamically, 1, 2, 3 and so on */}
                            <td id="serialNoData">{user.counter}</td>
                            <td id="adminNameData">{user.name}</td>
                            <td id="adminEmailData">{user.email}</td>
                            <td id="adminUserTypeData">{user.administratorType}</td>
                            <td id="removeAdminData">
                              <Button id="removeAdminBtn" onClick={(e) => {
                                this.DeleteUser(e, user.id);
                              }}>
                                <FontAwesomeIcon size="lg" id="removeAdminBtnIcon" icon={faTrashAlt} />  
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}

                  </Table>

                </Col>
              </Row>

            </Container>

            <Footer />

            {/* <div className="SAHomeContent">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Type of User</th>
                  </tr>
                  
                  {this.state.users &&
                    this.state.users.map((user) => {
                      return (
                        <tr>
                          <td>{user.id} </td>

                          <td>{user.name} </td>
                          <td>{user.email} </td>
                          <td>{user.administratorType} </td>
                          <td>
                            <button
                              onClick={(e) => {
                                this.DeleteUser(e, user.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <form onSubmit={this.addUser}>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  onChange={this.updateInput}
                  value={this.state.fullname}
                  required
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={this.updateInput}
                  value={this.state.email}
                  required
                />
                <input
                  type="text"
                  name="administratorType"
                  placeholder="Type of User"
                  onChange={this.updateInput}
                  value={this.state.administratorType}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.updateInput}
                  value={this.state.password}
                  required
                />
                <button type="submit">Add User</button>
              </form>
              <button onClick={this.changepasswordpage}>Change Password</button>
              <button onClick={this.logout}>Logout</button>

            </div> */}
            
            
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
