import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class Sponsors extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      description1: "",
      description2: "",
      id: "",
      period1: "",
      period2: "",

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

    //Sponsors
    const otherfinancialassistance = db
      .collection("Scholarship")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {

        if(doc.id === "sponsors"){
        const sponsorarray = [];
        const data = {
            description: doc.data().description,
            id: doc.data().id,
          };
          sponsorarray.push(data);
          this.setState({ sponsorarray: sponsorarray });
        }

        //SAFRA-SIM GE SPONSORSHIP
        if(doc.id === "safraSIMGESponsorship"){
            const safraSIMGEarray = [];
            const data = {
                description1: doc.data().description1,
                description2: doc.data().description2,
                id: doc.data().id,
                period1: doc.data().period1,
                period2: doc.data().period2,
              };
              safraSIMGEarray.push(data);
              this.setState({ safraSIMGEarray: safraSIMGEarray });
        }
        
      });

    })
}

  /*editStudentCare(e, studentcareid, type) {
    if (type === "workPlayLiveWell") {
      document
        .getElementById(studentcareid + "spanactivitiesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "studentWellnessCentre") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelllogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "counsellingService") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounseldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounsellogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simPeerSupport") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerlogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simWellnessAdvocates") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocatesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocateslogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
  }*/


  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <p>
                <h1><b>Sponsors</b><br/></h1>
                <h5>Sponsorship<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.sponsorarray &&
                this.state.sponsorarray.map((sponsorarray) => {
                  return (
                    <tr>
                      <td>{sponsorarray.description}</td>
                      
                      <td>
                        <button
                          id={sponsorarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h1><b>Our Sponsors</b><br/></h1>
                <h5>SAFRA-SIM GE SPONSORSHIP<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.safraSIMGEarray &&
                this.state.safraSIMGEarray.map((safraSIMGEarray) => {
                  return (
                    <tr>
                      <td>{safraSIMGEarray.description1}
                      <tr>{safraSIMGEarray.period1}</tr>
                      <tr>{safraSIMGEarray.period2}</tr>
                      <tr>{safraSIMGEarray.description2}</tr>
                      </td>
                      <td>
                        <button
                          id={safraSIMGEarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default Sponsors;
