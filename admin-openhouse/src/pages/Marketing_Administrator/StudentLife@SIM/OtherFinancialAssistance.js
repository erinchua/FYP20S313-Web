import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class OtherFinancialAssistance extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      id: "",
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

    //Other Financial Assistance
    const otherfinancialassistance = db
      .collection("Bursary")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            
        if(doc.id === "otherFinancialAssistance"){
        const financialarray = [];
        const data = {
            description: doc.data().description,
            id: doc.data().id,
          };
          financialarray.push(data);
          this.setState({ financialarray: financialarray });
        }

        //AMP Bursary
        if(doc.id === "AMPBursary"){
            const amparray = [];
            const data = {
                description: doc.data().description,
                id: doc.data().id,
              };
              amparray.push(data);
              this.setState({ amparray: amparray });
        }

        //MTFA Bursary
        if(doc.id === "MTFABursary"){
            const mtfaarray = [];
            const data = {
                description: doc.data().description,
                id: doc.data().id,
              };
              mtfaarray.push(data);
              this.setState({ mtfaarray: mtfaarray });
        }

        //LBKM Bursary
        if(doc.id === "LBKMBursary"){
            const lbkmarray = [];
            const data = {
                description: doc.data().description,
                id: doc.data().id,
              };
              lbkmarray.push(data);
              this.setState({ lbkmarray: lbkmarray });
        }

        //sivadasHEBFund Bursary
        if(doc.id === "sivadasHEBFund"){
            const hebarray = [];
            const data = {
                description: doc.data().description,
                id: doc.data().id,
              };
              hebarray.push(data);
              this.setState({ hebarray: hebarray });
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
                <h1>Other Financial Assistance<br/></h1>
                <h5>Main Description<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.financialarray &&
                this.state.financialarray.map((financialarray) => {
                  return (
                    <tr>
                      <td>{financialarray.description}</td>
                      <td>
                        <button
                          id={financialarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h5>AMP Bursary<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.amparray &&
                this.state.amparray.map((amparray) => {
                  return (
                    <tr>
                      <td>{amparray.description}</td>
                      <td>
                        <button
                          id={amparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h5>MTFA Bursary<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.mtfaarray &&
                this.state.mtfaarray.map((mtfaarray) => {
                  return (
                    <tr>
                      <td>{mtfaarray.description}</td>
                      <td>
                        <button
                          id={mtfaarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h5>Lembaga Biasiswa Kenanga Maulud (LBKM)<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.lbkmarray &&
                this.state.lbkmarray.map((lbkmarray) => {
                  return (
                    <tr>
                      <td>{lbkmarray.description}</td>
                      <td>
                        <button
                          id={lbkmarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h5>Sivadas-HEB Education Fund<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.hebarray &&
                this.state.hebarray.map((hebarray) => {
                  return (
                    <tr>
                      <td>{hebarray.description}</td>
                      <td>
                        <button
                          id={hebarray.id + "editbutton"}
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
export default OtherFinancialAssistance;
