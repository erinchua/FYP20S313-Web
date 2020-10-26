import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Table, Modal } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/StudentAccounts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBan, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import SuspendStud from '../../../img/Marketing_Administrator/ban-solid.svg';
import UnsuspendStud from '../../../img/Marketing_Administrator/user-check-solid.svg';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


class GenerateStudentRegisteration extends Component {
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

  generatePDF = () => {
    var doc = new jsPDF("landscape");
    var today = new Date();
    var newdat = "Date Printed : "+ today;
    doc.text(30,30,newdat);

    doc.autoTable({
      html: "#students",
      startY: 20,
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index === 0) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
    doc.text("Report on Total Number of Registerations for Open House Mobile Application", 14, 15);

    doc.save("table.pdf");
  };


  render() {
    return (
      <div className="home">
        <div>
          <table id="students" class="table table-bordered">
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
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button onClick={this.generatePDF}>Generate PDF</button>
      </div>
    );
  }
}
export default GenerateStudentRegisteration;
