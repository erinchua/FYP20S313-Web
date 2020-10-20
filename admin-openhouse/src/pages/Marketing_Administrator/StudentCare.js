import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class StudentCare extends Component {
  constructor() {
    super();
    this.state = {
      desc: "",
      logo: "",
      activitiesLogo: "",
      activitiesName: "",
      progress: "",
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

    //Work, Play and Live Well
    const workplay = db
      .collection("StudentCare")
      .doc("workPlayLiveWell")
      .get()
      .then((snapshot) => {
        const activitiesarray = [];
        const actvititiesdata = snapshot.data().activities;
        for (var i = 0; i < Object.keys(actvititiesdata).length; i++) {
          const data = {
            activitiesDesc: snapshot.data().desc,
            activitiesLogo: [Object.values(actvititiesdata)[i].activitiesLogo],
            activitiesName: [Object.values(actvititiesdata)[i].activitiesName],
          };
          activitiesarray.push(data);
        }
        this.setState({ activitiesarray: activitiesarray });
      });

    const workplaydesc = db
      .collection("StudentCare")
      .doc("workPlayLiveWell")
      .get()
      .then((snapshot) => {
        const activitiesDesc = [];

        const data = {
          activitiesDesc: snapshot.data().desc,
          id: snapshot.data().id
        };
        activitiesDesc.push(data);

        this.setState({ activitiesDesc: activitiesDesc });
      });

    //Student Wellness Centre
    const studentwellness = db
      .collection("StudentCare")
      .doc("studentWellnessCentre")
      .get()
      .then((snapshot) => {
        const wellnesscentre = [];
        const wellness = snapshot.data();
        const data = {
          desc: wellness.desc,
          logo: wellness.logo,
          id: wellness.id,
        };
        wellnesscentre.push(data);
        this.setState({ wellnesscentre: wellnesscentre });
      });

    //Counselling Service
    const counsellingservice = db
      .collection("StudentCare")
      .doc("counsellingService")
      .get()
      .then((snapshot) => {
        const counselling = [];
        const counsel = snapshot.data();
        const data = {
          desc: counsel.desc,
          logo: counsel.logo,
          id: counsel.id,
        };
        counselling.push(data);
        this.setState({ counselling: counselling });
      });

    //SIM Peer Support
    const simpeersupport = db
      .collection("StudentCare")
      .doc("simPeerSupport")
      .get()
      .then((snapshot) => {
        const peersupport = [];
        const simpeer = snapshot.data();
        const data = {
          desc: simpeer.desc,
          logo: simpeer.logo,
          id: simpeer.id,
        };
        peersupport.push(data);
        this.setState({ peersupport: peersupport });
      });

    //Student Wellness Advocates
    const studentwellnessadvocates = db
      .collection("StudentCare")
      .doc("simWellnessAdvocates")
      .get()
      .then((snapshot) => {
        const wellnessadvocates = [];
        const advocates = snapshot.data();
        const data = {
          desc: advocates.desc,
          logo: advocates.logo,
          id: advocates.id,
        };
        wellnessadvocates.push(data);
        this.setState({ wellnessadvocates: wellnessadvocates });
      });
  }

  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };

  editStudentCare(e, studentcareid, type) {
    if (type === "workPlayLiveWell") {
      document
        .getElementById(studentcareid + "spanactivitiesdes")
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
  }

  CancelEdit(e, studentcareid, type) {
    if (type === "workPlayLiveWell") {
      document
        .getElementById(studentcareid + "spanactivitiesdes")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }

    if (type === "studentWellnessCentre") {
      document
        .getElementById(studentcareid + "upload")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanwelldes")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanwelllogo")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }

    if (type === "counsellingService") {
      document
        .getElementById(studentcareid + "upload")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spancounseldes")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spancounsellogo")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if (type === "simPeerSupport") {
      document
        .getElementById(studentcareid + "upload")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanpeerdes")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanpeerlogo")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }

    if (type === "simWellnessAdvocates") {
      document
        .getElementById(studentcareid + "upload")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanadvocatesdes")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "spanadvocateslogo")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    
  }

  handleSave = (studentcareid) => {
    const parentthis = this;
    const db = fire.firestore();

    var desc = document.getElementById(studentcareid + "desc").value;
    console.log(this.state.files);

    if (this.state.files !== undefined) {
      const foldername = "StudentCare";
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef
        .child(this.state.files[0].name)
        .put(this.state.files[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const userRef = db
            .collection("StudentCare")
            .doc(studentcareid)
            .update({
              desc: desc,
              logo: downloadURL,
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
      const userRef = db
        .collection("StudentCare")
        .doc(studentcareid)
        .update({
          desc: desc,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  };

  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <p>
                <h1>WORK, PLAY AND LIVE WELL</h1>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.activitiesDesc &&
                this.state.activitiesDesc.map((activitiesDesc) => {
                  return (
                    <tr>
                      <td>
                      <span class={activitiesDesc.id + "text"}>
                      {activitiesDesc.activitiesDesc}
                        </span>
                        <span id={activitiesDesc.id + "spanactivitiesdes"} hidden>
                          <input
                            id={activitiesDesc.id + "desc"}
                            defaultValue={activitiesDesc.activitiesDesc}
                            type="text"
                            name={activitiesDesc.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={activitiesDesc.activitiesDesc}
                            required
                          />
                        </span>
                        </td>
                      <td><button
                          id={activitiesDesc.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCare(
                              e,
                              activitiesDesc.id,
                              "workPlayLiveWell"
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={activitiesDesc.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(activitiesDesc.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={activitiesDesc.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(
                              e,
                              activitiesDesc.id,
                              "workPlayLiveWell"
                            );
                          }}
                        >
                          Cancel
                        </button></td>
                    </tr>
                  );
                })}
              <p>
                <h4>WORK, PLAY AND LIVE WELL(Activities)</h4>
              </p>
              <tr>
                <th scope="col">Activity Name</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.activitiesarray &&
                this.state.activitiesarray.map((activitiesarray) => {
                  return (
                    <tr>
                      <td>
                      <span class={activitiesarray.id + "text"}>
                      {activitiesarray.activitiesName}
                        </span>
                        <span id={activitiesarray.id + "spanactivitiesname"} hidden>
                          <input
                            id={activitiesarray.id + "desc"}
                            defaultValue={activitiesarray.activitiesName}
                            type="text"
                            name={activitiesarray.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={activitiesarray.activitiesName}
                            required
                          />
                        </span>
                      </td>
                      <td>{activitiesarray.activitiesLogo}</td>
                      <td>{/*----------------------*/}</td>
                    </tr>
                  );
                })}
              <p>
                <h1>STUDENT WELLNESS CENTRE</h1>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.wellnesscentre &&
                this.state.wellnesscentre.map((wellnesscentre) => {
                  return (
                    <tr>
                      <td>
                        <span class={wellnesscentre.id + "text"}>
                          {wellnesscentre.desc}
                        </span>
                        <span id={wellnesscentre.id + "spanwelldes"} hidden>
                          <input
                            id={wellnesscentre.id + "desc"}
                            defaultValue={wellnesscentre.desc}
                            type="text"
                            name={wellnesscentre.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={wellnesscentre.desc}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={wellnesscentre.id + "text"}>
                          {wellnesscentre.logo}
                        </span>
                        <span id={wellnesscentre.id + "spanwelllogo"} hidden>
                          <input
                            id={wellnesscentre.id + "welllogo"}
                            defaultValue={wellnesscentre.logo}
                            type="text"
                            name={wellnesscentre.id + "welllogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={wellnesscentre.logo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={wellnesscentre.id + "upload"} hidden>
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
                          id={wellnesscentre.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCare(
                              e,
                              wellnesscentre.id,
                              "studentWellnessCentre"
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={wellnesscentre.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(wellnesscentre.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={wellnesscentre.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(
                              e,
                              wellnesscentre.id,
                              "studentWellnessCentre"
                            );
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <p>
                <h1>COUNSELLING SERVICE</h1>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.counselling &&
                this.state.counselling.map((counselling) => {
                  return (
                    <tr>
                      <td>
                        <span class={counselling.id + "text"}>
                          {counselling.desc}
                        </span>
                        <span id={counselling.id + "spancounseldes"} hidden>
                          <input
                            id={counselling.id + "desc"}
                            defaultValue={counselling.desc}
                            type="text"
                            name={counselling.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={counselling.desc}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={counselling.id + "text"}>
                          {counselling.logo}
                        </span>
                        <span id={counselling.id + "spancounsellogo"} hidden>
                          <input
                            id={counselling.id + "counsellogo"}
                            defaultValue={counselling.logo}
                            type="text"
                            name={counselling.id + "counsellogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={counselling.logo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={counselling.id + "upload"} hidden>
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
                          id={counselling.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCare(
                              e,
                              counselling.id,
                              "counsellingService"
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={counselling.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(counselling.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={counselling.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(
                              e,
                              counselling.id,
                              "counsellingService"
                            );
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <p>
                <h1>SIM PEER SUPPORT</h1>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.peersupport &&
                this.state.peersupport.map((peersupport) => {
                  return (
                    <tr>
                      <td>
                        <span class={peersupport.id + "text"}>
                          {peersupport.desc}
                        </span>
                        <span id={peersupport.id + "spanpeerdes"} hidden>
                          <input
                            id={peersupport.id + "desc"}
                            defaultValue={peersupport.desc}
                            type="text"
                            name={peersupport.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={peersupport.desc}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={peersupport.id + "text"}>
                          {peersupport.logo}
                        </span>
                        <span id={peersupport.id + "spanpeerlogo"} hidden>
                          <input
                            id={peersupport.id + "peerlogo"}
                            defaultValue={peersupport.logo}
                            type="text"
                            name={peersupport.id + "peerlogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={peersupport.logo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={peersupport.id + "upload"} hidden>
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
                          id={peersupport.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCare(
                              e,
                              peersupport.id,
                              "simPeerSupport"
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={peersupport.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(peersupport.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={peersupport.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(
                              e,
                              peersupport.id,
                              "simPeerSupport"
                            );
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <p>
                <h1>SIM WELLNESS ADVOCATES</h1>
              </p>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.wellnessadvocates &&
                this.state.wellnessadvocates.map((wellnessadvocates) => {
                  return (
                    <tr>
                      <td>
                        <span class={wellnessadvocates.id + "text"}>
                          {wellnessadvocates.desc}
                        </span>
                        <span
                          id={wellnessadvocates.id + "spanadvocatesdes"}
                          hidden
                        >
                          <input
                            id={wellnessadvocates.id + "desc"}
                            defaultValue={wellnessadvocates.desc}
                            type="text"
                            name={wellnessadvocates.id + "desc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={wellnessadvocates.desc}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={wellnessadvocates.id + "text"}>
                          {wellnessadvocates.logo}
                        </span>
                        <span
                          id={wellnessadvocates.id + "spanadvocateslogo"}
                          hidden
                        >
                          <input
                            id={wellnessadvocates.id + "advocateslogo"}
                            defaultValue={wellnessadvocates.logo}
                            type="text"
                            name={wellnessadvocates.id + "advocateslogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={wellnessadvocates.logo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={wellnessadvocates.id + "upload"} hidden>
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
                          id={wellnessadvocates.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCare(
                              e,
                              wellnessadvocates.id,
                              "simWellnessAdvocates"
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={wellnessadvocates.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(wellnessadvocates.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={wellnessadvocates.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(
                              e,
                              wellnessadvocates.id,
                              "simWellnessAdvocates"
                            );
                          }}
                        >
                          Cancel
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
export default StudentCare;
