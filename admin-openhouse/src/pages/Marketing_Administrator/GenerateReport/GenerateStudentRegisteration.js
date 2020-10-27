import React, { Component, useReducer } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

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
      totalNumber: 0,
      dateRegistered: "",
      useremail:"",
    };
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();

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
          dateRegistered: doc.data().dateRegistered,
          id: doc.id,
          counter : counter,
        };
        counter++;
        users.push(data);
        console.log(data)
      });

      this.setState({ users: users });
    });
}



  generateReport = () => {
    const db = fire.firestore();
    var counter = 0;
    const total = db
      .collection("Students")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id);
          counter++;
        });
        this.setState(
            {
                totalNumber: counter
            },
            () => {
              console.log(this.state.totalNumber);
              this.generatePDF();
            }
          );
        });
      console.log(counter);

    }
generatePDF(){
    var doc = new jsPDF("landscape");
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

    var today = new Date();    
    var day = today.getDate();
    var monthIndex = today.getMonth();
    var year = today.getFullYear();
    var date = day + ' ' + monthNames[monthIndex] + ' ' + year;
    var newdat = "\nDate Requested : "+ date;
    doc.setFontSize(14);   
    doc.text(206,20,newdat);

    var user = this.state.useremail;
    var adminuser = "\nRequested by : " + user;
    doc.setFontSize(14);   
    doc.text(14,20,adminuser);

    doc.line(14, 30, 283, 30);
        

    var totalNumber = "\nTotal Number : " + this.state.totalNumber;
    doc.setFontSize(20);   
    doc.text(14,34,totalNumber);

    doc.line(14, 50, 283, 50);

    doc.setFontSize(12);
    doc.text(14,57,"List of People Registered");

    doc.autoTable({
      html: "#students",
      startY: 63,
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index === 0) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    doc.setFontSize(18); 
    doc.text("Report on Total Number of Registerations for Open House Mobile Application", 35, 15);
      
    doc.save("StudentRegisteration.pdf");
  };


  render() {
    return (
      <div className="home">
        <div>{/* Do not change the id below*/}
          <table id="students" class="table table-bordered">
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Email</th>
                <th scope="col">Date</th>
              </tr>
              {this.state.users &&
                this.state.users.map((user) => {
                  return (
                    <tr>
                      <td>{user.counter}</td>
                      <td>{user.email} </td>
                      <td>{user.dateRegistered} </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button onClick={this.generateReport}>Generate PDF</button>
      </div>
    );
  }
}
export default GenerateStudentRegisteration;
