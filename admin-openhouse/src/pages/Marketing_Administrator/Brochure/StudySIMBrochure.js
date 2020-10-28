import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class StudySIMBrochure extends Component {
  constructor() {
    super();
    this.state = {
      brochureUrl: "",
      description: "",
      imageUrl: "",
      university: "",
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
    var counter = 1;
    //Display of Prospectus Brochures
    const userRef = db
      .collection("Brochures")
      .where("id", ">=", "prospect-")
      .where("id", "<=", "prospect-" + "\uf8ff")
      .onSnapshot((snapshot) => {
        const prospectbrochures = [];
        snapshot.forEach((doc) => {
          console.log(doc.data());
          const data = {
            brochureUrl: doc.data().brochureUrl,
            description: doc.data().description,
            imageUrl: doc.data().imageUrl,
            university: doc.data().university,
            id: doc.id,
            counter: counter,
          };
          counter++;
          prospectbrochures.push(data);
        });

        this.setState({ prospectbrochures: prospectbrochures });
      });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };

  editBrochure(e, brochureid) {
    document.getElementById(brochureid + "upload").removeAttribute("hidden");
    document
      .getElementById(brochureid + "spanbrochurefile")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "spanimagefile")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "editbutton")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "updatebutton")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "cancelbutton")
      .removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(brochureid + "text");
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].setAttribute("hidden", "");
    }
  }

  CancelEdit(e, brochureid) {
    document.getElementById(brochureid + "upload").setAttribute("hidden", "");
    document
      .getElementById(brochureid + "spanbrochurefile")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "spanimagefile")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "editbutton")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "updatebutton")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "cancelbutton")
      .setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(brochureid + "text");
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].removeAttribute("hidden", "");
    }
  }

  handleSave = (brochureid) => {
    const parentthis = this;
    const db = fire.firestore();

    console.log(this.state.files);

    if (this.state.files !== undefined) {
      const foldername = "/Brochures/Prospectus";
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef
        .child(this.state.files[0].name)
        .put(this.state.files[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const userRef = db
            .collection("Brochures")
            .doc(brochureid)
            .update({
              brochureUrl: downloadURL,
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
        <h2>Study@SIM Brochures</h2>
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <h4>Prospectus</h4>
              <tr>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.prospectbrochures &&
                this.state.prospectbrochures.map((prospectbrochures) => {
                  return (
                    <tr>
                      <td>
                        <span class={prospectbrochures.id + "text"}>
                          {prospectbrochures.imageUrl}
                        </span>
                        <span
                          id={prospectbrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={prospectbrochures.id + "imagefile"}
                            defaultValue={prospectbrochures.imageUrl}
                            type="text"
                            name={prospectbrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prospectbrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={prospectbrochures.id + "upload"} hidden>
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
                        <span class={prospectbrochures.id + "text"}>
                          {prospectbrochures.brochureUrl}
                        </span>
                        <span
                          id={prospectbrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={prospectbrochures.id + "brochurefile"}
                            defaultValue={prospectbrochures.brochureUrl}
                            type="text"
                            name={prospectbrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prospectbrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={prospectbrochures.id + "upload"} hidden>
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
                          id={prospectbrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, prospectbrochures.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={prospectbrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(prospectbrochures.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={prospectbrochures.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, prospectbrochures.id);
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
export default StudySIMBrochure;