import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class SIMGEBursary extends Component {
  constructor() {
    super();
    this.state = {
      aboutBursary: "",
      closingDate: "",
      notificationPeriod: "",
      processingPeriod: "",
      eligibility1: "",
      eligibility2: "",
      eligibility3: "",
      eligibility4: "",
      eligibility5: "",
      eligibility6: "",
      eligibility7: "",
      faqFile: "",
      howApply: "",
      id: "",
      repayment: "",

      householdDoc1: "",
      householdDoc2: "",
      householdDoc3: "",
      householdDoc4: "",
      householdDoc5: "",
      householdDoc6: "",

      NRIC: "",

      description1: "",
      description2: "",

      expensesDocument1: "",
      expensesDocument2: "",

      personalDocument1: "",
      personalDocument2: "",
      personalDocument3: "",
      personalDocument4: "",
      personalDocument5: "",
      personalDocument6: "",
      personalDocument7: "",

      resultTranscript: "",

      thingsToNote1: "",
      thingsToNote2: "",
      thingsToNote3: "",
      thingsToNote4: "",

      valueTenure: "",
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

    //SIM GE Bursary
    const simgebursary = db
      .collection("Bursary")
      .doc("simGlobalEducationBursary")
      .onSnapshot((snapshot) => {
        const bursaryarray = [];
        const gebursary = snapshot.data();
        const data = {
          aboutBursary: gebursary.aboutBursary,
          applicationPeriod1: gebursary.applicationPeriod1,
          applicationPeriod2: gebursary.applicationPeriod2,
          applicationPeriod3: gebursary.applicationPeriod3,
          applicationPeriod4: gebursary.applicationPeriod4,
          eligibility: gebursary.eligibility,
          faqFile: gebursary.faqFile,
          howApply: gebursary.howApply,
          repayment: gebursary.repayment,
          requiredDocuments: gebursary.requiredDocuments,
          thingsToNote: gebursary.thingsToNote,
          valueTenure: gebursary.valueTenure,
          id: gebursary.id,
        };
        bursaryarray.push(data);
        console.log(bursaryarray)
        this.setState({ bursaryarray: bursaryarray });
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
        const foldername = "Bursary";
        const file = this.state.files[0];
        const storageRef = storage.ref(foldername);
        const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
        fileRef.on("state_changed", function (snapshot) {
            fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log("File available at", downloadURL);

                const userRef = db.collection("Bursary").doc("simGlobalEducationBursary")
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
                <h1>SIM GE Bursary<br/></h1>
                <h5>Main Description<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">FAQ Download File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.aboutBursary}</td>
                      <td><span class={bursaryarray.id + "text"}>
                          {bursaryarray.faqFile}
                        </span>
                        <span id={bursaryarray.id + "upload"} hidden>
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
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              <p>
                <h5>Value and Tenure of Bursary<br/></h5>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.valueTenure}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
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
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>
                          <tr>{bursaryarray.eligibility.eligibility1}</tr>
                          <tr>{bursaryarray.eligibility.eligibility2}</tr>
                          <tr>{bursaryarray.eligibility.eligibility3}</tr>
                          <tr>{bursaryarray.eligibility.eligibility4}</tr>
                          <tr>{bursaryarray.eligibility.eligibility5}</tr>
                          <tr>{bursaryarray.eligibility.eligibility6}</tr>
                          <tr>{bursaryarray.eligibility.eligibility7}</tr>
                      </td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              
              <tr>
                <th scope="col">Repayment</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.repayment}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
              
              <tr>
                <th scope="col">How to Apply</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.howApply}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                
              <tr>
                <th scope="col">Application Period (Quarter 1 - Jan to Mar)</th>
                <th scope="col"> </th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Closing Date</td>
                      <td>{bursaryarray.applicationPeriod1.closingDate}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })} 
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Processing Period</td>
                      <td>{bursaryarray.applicationPeriod1.processingPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Notification Period</td>
                      <td>{bursaryarray.applicationPeriod1.notificationPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                <tr>
                <th scope="col">Application Period (Quarter 2 - Apr to Jun)</th>
                <th scope="col"> </th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Closing Date</td>
                      <td>{bursaryarray.applicationPeriod2.closingDate}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })} 
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Processing Period</td>
                      <td>{bursaryarray.applicationPeriod2.processingPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Notification Period</td>
                      <td>{bursaryarray.applicationPeriod2.notificationPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                <tr>
                <th scope="col">Application Period (Quarter 3 - Jul to Sep)</th>
                <th scope="col"> </th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Closing Date</td>
                      <td>{bursaryarray.applicationPeriod3.closingDate}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })} 
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Processing Period</td>
                      <td>{bursaryarray.applicationPeriod3.processingPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Notification Period</td>
                      <td>{bursaryarray.applicationPeriod3.notificationPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                <tr>
                <th scope="col">Application Period (Quarter 4 - Oct to Dec)</th>
                <th scope="col"> </th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Closing Date</td>
                      <td>{bursaryarray.applicationPeriod4.closingDate}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })} 
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Processing Period</td>
                      <td>{bursaryarray.applicationPeriod4.processingPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
                {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>Notification Period</td>
                      <td>{bursaryarray.applicationPeriod4.notificationPeriod}</td>
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}
               
              <tr>
                <th scope="col">Required Supporting Documents</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.requiredDocuments.description1}
                        <tr><br/><b>Household Income-related Documents:</b></tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc1}</tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc2}</tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc3}</tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc4}</tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc5}</tr>
                        <tr>{bursaryarray.requiredDocuments.HouseholdIncomeDocuments.householdDoc6}</tr>

                        <tr><br/><b>Results / Official Transcript:</b></tr>
                        <tr>{bursaryarray.requiredDocuments.resultTranscript}</tr>

                        <tr><br/><b>NRIC:</b></tr>
                        <tr>{bursaryarray.requiredDocuments.NRIC}</tr>

                        <tr><br/><b>Expenses-related Documents:</b></tr>
                        <tr>{bursaryarray.requiredDocuments.expensesDocument.expensesDocument1}</tr>
                        <tr>{bursaryarray.requiredDocuments.expensesDocument.expensesDocument2}</tr>

                        <tr><br/><b>Personal Documents (If applicable):</b></tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument1}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument2}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument3}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument4}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument5}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument6}</tr>
                        <tr>{bursaryarray.requiredDocuments.personalDocument.personalDocument7}</tr>

                        <tr><br/></tr>
                        <tr>{bursaryarray.requiredDocuments.description2}</tr>                       
                      
                      </td>
                      
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
                        >
                          Edit
                        </button>

                    </td>
                    </tr>
                  );
                })}

    
              <tr>
                <th scope="col">Things to Note</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursaryarray &&
                this.state.bursaryarray.map((bursaryarray) => {
                  return (
                    <tr>
                      <td>{bursaryarray.thingsToNote.thingsToNote1}
                      <tr>{bursaryarray.thingsToNote.thingsToNote2}</tr>
                      <tr>{bursaryarray.thingsToNote.thingsToNote3}</tr>
                      <tr>{bursaryarray.thingsToNote.thingsToNote4}</tr>
                      </td>
                      
                      <td>
                        <button
                          id={bursaryarray.id + "editbutton"}
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
export default SIMGEBursary;
