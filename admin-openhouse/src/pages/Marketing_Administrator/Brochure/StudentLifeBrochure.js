import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class StudentLifeBrochure extends Component {
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
    var counter = 1;
    //Display of Scholarship Brochures
    const userRef = db
      .collection("Brochures")
      .doc("study-001")
      .onSnapshot((snapshot) => {
        const scholarshipbrochures = [];
          const data = {
            brochureUrl: snapshot.data().brochureUrl,
            description: snapshot.data().description,
            imageUrl: snapshot.data().imageUrl,
            university: snapshot.data().university,
            id: snapshot.id,
            counter: counter,
          };
          counter++;
          scholarshipbrochures.push(data);
        

        this.setState({ scholarshipbrochures: scholarshipbrochures });
      });

      //Display of Bursary Brochures
    const userRef1 = db
    .collection("Brochures")
    .doc("study-002")
    .onSnapshot((snapshot) => {
      const bursarybrochures = [];
        const data = {
          brochureUrl: snapshot.data().brochureUrl,
          description: snapshot.data().description,
          imageUrl: snapshot.data().imageUrl,
          university: snapshot.data().university,
          id: snapshot.id,
          counter: counter,
        };
        counter++;
        bursarybrochures.push(data);
      

      this.setState({ bursarybrochures: bursarybrochures });
    });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  
  };
  

  editBrochure(e, brochureid) {
    document.getElementById(brochureid + "upload").removeAttribute("hidden");
    document.getElementById(brochureid + "spanbrochurefile").removeAttribute("hidden");
    document.getElementById(brochureid + "editbutton").setAttribute("hidden", "");
    document.getElementById(brochureid + "updatebutton").removeAttribute("hidden");
    document.getElementById(brochureid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        brochureid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, brochureid) {
    document.getElementById(brochureid + "upload").setAttribute("hidden", "");
    document.getElementById(brochureid + "spanbrochurefile").setAttribute("hidden", "");
    document.getElementById(brochureid + "editbutton").removeAttribute("hidden");
    document.getElementById(brochureid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(brochureid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        brochureid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}


handleSave = (brochureid) => {
  const parentthis = this;

console.log(this.state.files);

if (this.state.files !== undefined) {
    const foldername = "/Brochures/StudentLife";
    const storageRef = storage.ref(foldername);
    const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
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
          <h2>Student Life@SIM Brochures</h2>
        <div>
          <table id="users" class="table table-bordered"> 
            <tbody>
                <h4>SIM GE Scholarship</h4>
              <tr>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.scholarshipbrochures &&
                this.state.scholarshipbrochures.map((scholarshipbrochures) => {
                  return (
                    <tr>
                      <td>
                      <span class={scholarshipbrochures.id + "text"}>
                      {scholarshipbrochures.brochureUrl}
                        </span>
                          <span id={scholarshipbrochures.id + "spanbrochurefile"} hidden>
                          <input
                            id={scholarshipbrochures.id + "brochurefile"}
                            defaultValue={scholarshipbrochures.brochureUrl}
                            type="text"
                            name={scholarshipbrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={scholarshipbrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {scholarshipbrochures.id+ "upload" } hidden ><input
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
                          id={scholarshipbrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, scholarshipbrochures.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={scholarshipbrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(scholarshipbrochures.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={scholarshipbrochures.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, scholarshipbrochures.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
            })}

                <h4>SIM GE Bursary</h4>
              <tr>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.bursarybrochures &&
                this.state.bursarybrochures.map((bursarybrochures) => {
                  return (
                    <tr>
                      <td>
                      <span class={bursarybrochures.id + "text"}>
                      {bursarybrochures.brochureUrl}
                        </span>
                          <span id={bursarybrochures.id + "spanbrochurefile"} hidden>
                          <input
                            id={bursarybrochures.id + "brochurefile"}
                            defaultValue={bursarybrochures.brochureUrl}
                            type="text"
                            name={bursarybrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={bursarybrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {bursarybrochures.id+ "upload" } hidden ><input
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
                          id={bursarybrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, bursarybrochures.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={bursarybrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(bursarybrochures.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={bursarybrochures.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, bursarybrochures.id);
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
export default StudentLifeBrochure;