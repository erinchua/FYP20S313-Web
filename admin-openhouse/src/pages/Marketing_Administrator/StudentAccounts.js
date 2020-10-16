import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal, Alert } from 'react-bootstrap';

import "../../css/Marketing_Administrator/StudentAccounts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';


class StudentAccounts extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      dob: "",
      highestQualification: "",
      nationality: "",
      isSuspendedFromForum: "",
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
            id: doc.id,
            counter : counter,
          };
          counter++;
          users.push(data);
        });

        this.setState({ users: users });
      });
  }

  changepasswordpage = () => {
    history.push("/ChangePassword");
  };

  logout() {
    fire.auth().signOut();
    history.push("/Login");
    window.location.reload();
  }

  Unsuspend(e, studentdocid) {
    const db = fire.firestore();

    const userRef = db
      .collection("Students")
      .doc(studentdocid)
      .update({
        isSuspendedFromForum: false,
      })
      .then(function () {
     
        window.location.reload();
      });
      const userRef2 = db
      .collection("Forum")
      .doc(studentdocid)
      .update({
        suspended: false,
      })
      .then(function () {
        alert("Updated");
        window.location.reload();
      });

  }

  Suspend(e, studentdocid) {
    const db = fire.firestore();

    const userRef = db
      .collection("Students")
      .doc(studentdocid)
      .update({
        isSuspendedFromForum: true,
      })
      .then(function () {
       
        window.location.reload();
      });
      const userRef2 = db
      .collection("Forum")
      .doc(studentdocid)
      .update({
        suspended: true,
      })
      .then(function () {
        alert("Updated");
        window.location.reload();
      });
  }

  Search = (e) => {
    console.log(e.target.value);
    const db = fire.firestore();
    const searchvalue = e.target.value;
    var counter = 1;
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


  render() {
    return (
      <div>
        <Container fluid className="MAStudentAcctCon">
          <NavBar isMA={true} />

          <Container fluid className="MAStudentAcctContent">
            {/* <Row>
              <Col md="2" style={{paddingRight:"0"}}>
                <SideNavBar />
              </Col>

              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAStudentAcctContentCon">


                </Container>
              </Col>
            </Row> */}
            
            

          </Container>

          <Footer />
        </Container>



        {/* <div>
          <table id="users" class="table table-bordered">
            Search: <input type="text" onChange={this.Search} />
            <tbody>
              <tr>
              <th scope="col">S/N</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Contact Number</th>
                <th scope="col">D.O.B</th>
                <th scope="col">Highest Qualification</th>
                <th scope="col">Nationality</th>
                <th scope="col">Suspend from Forum</th>
              </tr>
              {this.state.users &&
                this.state.users.map((user) => {
                  return (
                    <tr>
                      <td>{user.counter}</td>
                      <td>{user.firstName} </td>
                      <td>{user.lastName} </td>
                      <td>{user.email} </td>
                      <td>{user.contactNo} </td>
                      <td>{user.dob} </td>
                      <td>{user.highestQualification} </td>
                      <td>{user.nationality} </td>
                      <td>
                        {user.isSuspendedFromForum ? (
                          <button
                            onClick={(e) => {
                              this.Unsuspend(e, user.id);
                            }}
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              this.Suspend(e, user.id);
                            }}
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button onClick={this.changepasswordpage}>Change Password</button>
        <button onClick={this.logout}>Logout</button> */}
      </div>
    );
  }
}
export default StudentAccounts;
