import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class ContactInformation extends Component {
  constructor() {
    super();
    this.state = {
      contactNo: "",
      contactTitle: "",
      country: "",
      email: "",
      weekEnd: "",
      weekDay: "",
      noOperation: "",
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
            weekDay: doc.data().operatingHours.weekDay,
            weekEnd: doc.data().operatingHours.weekEnd,
          };
          contact.push(data);
        });
        console.log(contact);
        this.setState({ contact: contact });
      });
  }

  update(e, contactid) {
    const contactNo = document.getElementById(contactid + "number").value
    const email = document.getElementById(contactid + "email").value
    const noOperation = document.getElementById(contactid + "nooperate").value
    const weekDay = document.getElementById(contactid + "weekday").value
    const weekEnd = document.getElementById(contactid + "weekend").value

    const db = fire.firestore();
    if (contactNo != null && email != null && noOperation != null && weekDay != null && weekEnd != null) {
      const userRef = db
        .collection("ContactInfo")
        .doc(contactid)
        .update({
            contactNo: contactNo,
            email: email,
            noOperation: noOperation,
            weekDay: weekDay,
            weekEnd: weekEnd,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editContact(e, contactid) {
    document.getElementById(contactid + "spannumber").removeAttribute("hidden");
    document.getElementById(contactid + "spanemail").removeAttribute("hidden");
    document.getElementById(contactid + "spannooperate").removeAttribute("hidden");
    document.getElementById(contactid + "spanweekday").removeAttribute("hidden");
    document.getElementById(contactid + "spanweekend").removeAttribute("hidden");
    document.getElementById(contactid + "editbutton").setAttribute("hidden", "");
    document.getElementById(contactid + "updatebutton").removeAttribute("hidden");
    document.getElementById(contactid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        contactid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, contactid) {
    document.getElementById(contactid + "spannumber").setAttribute("hidden", "");
    document.getElementById(contactid + "spanemail").setAttribute("hidden", "");
    document.getElementById(contactid + "spannooperate").setAttribute("hidden", "");
    document.getElementById(contactid + "spanweekday").setAttribute("hidden", "");
    document.getElementById(contactid + "spanweekend").setAttribute("hidden", "");
    document.getElementById(contactid + "editbutton").removeAttribute("hidden");
    document.getElementById(contactid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(contactid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        contactid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

render() {
    return (
      <div className="home">
        <div>
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
        </div>
      </div>
    );
  }
}
  
export default ContactInformation;