import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class SIMGEScholarship extends Component {
  constructor() {
    super();
    this.state = {
      academicExcellence: "",
      appDescription1: "",
      appDescription2: "",
      application1: "",
      application2: "",
      applicationDocuments1: "",
      applicationDocuments2: "",
      applicationDocuments3: "",
      applicationDocuments4: "",
      applicationDocuments5: "",
      applicationDocuments6: "",
      example1: "",
      example2: "",
      example3: "",
      example4: "",
      proceduresDescription1: "",
      proceduresDescription2: "",
      proceduresDescription3: "",
      description: "",
      id: "",
      eligibility1: "",
      eligibility2: "",
      eligibility3: "",
      selectionProcess: "",
      sportsArtistic: "",
      termsConditions1: "",
      termsConditions2: "",
      termsConditions3: "",
      termsConditions4: "",
      termsConditions5: "",
      termsConditions6: "",
      termsConditions7: "",
      termsConditions8: "",
      valueScholarship1: "",
      valueScholarship2: "",
      valueScholarship3: "",
      valueScholarship4: "",
      valueScholarshipDescription1: "",
      valueScholarshipDescription2: "",
      faqFile: "",

      description: "",
      period1: "",
      period1Description: "",
      period2: "",
      period2Description: "",
      progress: "",



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

    //SIM GE Scholarship
    const simgescholarship = db
      .collection("Scholarship")
      .doc("SIMGEScholarship")
      .onSnapshot((snapshot) => {
        const scholarshiparray = [];
        const gescholarship = snapshot.data();
        const data = {
            academicExcellence: gescholarship.academicExcellence,
          application: gescholarship.application,
          applicationProcedures: gescholarship.applicationProcedures,
          description: gescholarship.description,
          eligibility: gescholarship.eligibility,
          faqFile: gescholarship.faqFile,
          selectionProcess: gescholarship.selectionProcess,
          sportsArtistic: gescholarship.sportsArtistic,
          termsConditions: gescholarship.termsConditions,
          valueScholarship: gescholarship.valueScholarship,
          id: gescholarship.id,
        };
        scholarshiparray.push(data);
        console.log(scholarshiparray)
        this.setState({ scholarshiparray: scholarshiparray });
      });

      //Tenure Scholarship
      const tenurescholarship = db
      .collection("Scholarship")
      .doc("tenureScholarship")
      .onSnapshot((snapshot) => {
        const tenurescholarshiparray = [];
        const tenurescholarship = snapshot.data();
        const data = {
          description: tenurescholarship.description,
          programmes1: tenurescholarship.programmes1,
          programmes2: tenurescholarship.programmes2,
          programmes3: tenurescholarship.programmes3,
          id: tenurescholarship.id,
        };
        tenurescholarshiparray.push(data);
        console.log(tenurescholarshiparray)
        this.setState({ tenurescholarshiparray: tenurescholarshiparray });
      });

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

  handleFileUpload = (files) => {
    this.setState({
        files: files,
    });
};

handleSave = (mapImage) => {
    const parentthis = this;

    if (this.state.files !== undefined) {
        const foldername = "Scholarship";
        const file = this.state.files[0];
        const storageRef = storage.ref(foldername);
        const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
        fileRef.on("state_changed", function (snapshot) {
            fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log("File available at", downloadURL);

                const userRef = db.collection("Scholarship").doc("SIMGEScholarship")
                .update({
                    faqFile: downloadURL,
                })
                .then(function () {
                    alert("Updated");
                    window.location.reload();
                });
            });
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (progress != "100") {
                parentthis.setState({ progress: progress });
            } else {
                parentthis.setState({ progress: "Uploaded!" });
            }
        });
        console.log();
    } else {
        alert("No Files Selected");
    }
};


  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <p>
                <h1><b>SIM GE Scholarship</b><br/></h1>
                <h5>Main Description<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">FAQ Download File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>{scholarshiparray.description}</td>
                      <td><span class={scholarshiparray.id + "text"}>
                          {scholarshiparray.faqFile}
                        </span>
                        <span id={scholarshiparray.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleFileUpload(e.target.files);
                            }}
                          />
                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                        </td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}

                <p>
                <h5>Categories of Scholarships<br/></h5>
              </p>
              <tr>
                <th scope="col">Title of Category</th>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>Academic Excellence and Leadership</td>
                      <td>{scholarshiparray.academicExcellence}</td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>Sports and Artistic Talent</td>
                      <td>{scholarshiparray.sportsArtistic}</td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <tr>
                <th scope="col">Eligibility</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>
                          <tr>{scholarshiparray.eligibility.eligibility1}</tr>
                          <tr>{scholarshiparray.eligibility.eligibility2}</tr>
                          <tr>{scholarshiparray.eligibility.eligibility3}</tr>
                      </td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              
              <tr>
                <th scope="col">Value of Scholarship</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>
                        <tr>{scholarshiparray.valueScholarship.valueScholarshipDescription1}</tr>
                        <tr>{scholarshiparray.valueScholarship.valueScholarship1}</tr>
                        <tr>{scholarshiparray.valueScholarship.valueScholarship2}</tr>
                        <tr>{scholarshiparray.valueScholarship.valueScholarship3}</tr>
                        <tr>{scholarshiparray.valueScholarship.valueScholarship4}</tr>
                        <tr>{scholarshiparray.valueScholarship.valueScholarshipDescription2}</tr>
                      </td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              
              <tr>
                <th scope="col">Application</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>
                        <tr>{scholarshiparray.application.appDescription1}</tr>
                        <tr>{scholarshiparray.application.application1}</tr>
                        <tr>{scholarshiparray.application.application2}</tr>
                        <tr>{scholarshiparray.application.appDescription2}</tr>
                      </td>
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}

              <tr>
                <th scope="col">Application Documents & Procedures</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>{scholarshiparray.applicationProcedures.proceduresDescription1}
                        <tr><br/></tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments1}</tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments2}</tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments3}</tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments4}</tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments5}</tr>
                        <tr>{scholarshiparray.applicationProcedures.applicationDocuments.applicationDocuments6}</tr>
                        <tr><br/></tr>
                        <tr>{scholarshiparray.applicationProcedures.proceduresDescription2}</tr>
                        <tr><br/><b>Examples</b></tr>
                        <tr>{scholarshiparray.applicationProcedures.examples.examples1}</tr>
                        <tr>{scholarshiparray.applicationProcedures.examples.examples2}</tr>
                        <tr>{scholarshiparray.applicationProcedures.examples.examples3}</tr>
                        <tr>{scholarshiparray.applicationProcedures.examples.examples4}</tr>
                        <tr><br/></tr>
                        <tr>{scholarshiparray.applicationProcedures.proceduresDescriptions3}</tr>                      
                      
                      </td>
                      
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}

    
              <tr>
                <th scope="col">Selection Process</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>{scholarshiparray.selectionProcess}</td>
                      
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <tr>
                <th scope="col">Tenure of Scholarship</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.tenurescholarshiparray &&
                this.state.tenurescholarshiparray.map((tenurescholarshiparray) => {
                  return (
                    <tr>
                      <td>{tenurescholarshiparray.description}</td>
                      
                      <td>
                        <button
                          id={tenurescholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <tr>
                <th scope="col">Programmes</th>
                <th scope="col">March</th>
                <th scope="col">September</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.tenurescholarshiparray &&
                this.state.tenurescholarshiparray.map((tenurescholarshiparray) => {
                  return (
                    <tr>
                      <td>{tenurescholarshiparray.programmes1.description}</td>
                      <td>{tenurescholarshiparray.programmes1.period1Description}</td>
                      <td>{tenurescholarshiparray.programmes1.period2Description}</td>
                      <td>
                        <button
                          id={tenurescholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.tenurescholarshiparray &&
                this.state.tenurescholarshiparray.map((tenurescholarshiparray) => {
                  return (
                    <tr>
                      <td>{tenurescholarshiparray.programmes2.description}</td>
                      <td>{tenurescholarshiparray.programmes2.period1Description}</td>
                      <td>{tenurescholarshiparray.programmes2.period2Description}</td>
                      
                      <td>
                        <button
                          id={tenurescholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.tenurescholarshiparray &&
                this.state.tenurescholarshiparray.map((tenurescholarshiparray) => {
                  return (
                    <tr>
                      <td>{tenurescholarshiparray.programmes3.description}</td>
                      <td>{tenurescholarshiparray.programmes3.period1Description}</td>
                      <td>{tenurescholarshiparray.programmes3.period2Description}</td>
                      
                      <td>
                        <button
                          id={tenurescholarshiparray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}

              <tr>
                <th scope="col">Terms and Conditions</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshiparray &&
                this.state.scholarshiparray.map((scholarshiparray) => {
                  return (
                    <tr>
                      <td>
                      <tr>{scholarshiparray.termsConditions.termsConditions1}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions2}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions3}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions4}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions5}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions6}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions7}</tr>
                      <tr>{scholarshiparray.termsConditions.termsConditions8}</tr>   
                        </td>
                      
                      <td>
                        <button
                          id={scholarshiparray.id + "editbutton"}
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
export default SIMGEScholarship;
