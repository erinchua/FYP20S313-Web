import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class StudentCouncil extends Component {
  constructor() {
    super();
    this.state = {
      categoryType: "",
      clubsAndCouncilDescription: "",
      clubsAndCouncilTitle: "",
      clubsAndCouncilsLogo: "",
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
    const userRef = db
      .collection("ClubsAndCouncils").where("categoryType", "==", "StudentCouncil")
      .get()
      .then((snapshot) => {
        const studentcouncil = [];
        snapshot.forEach((doc) => {
          const data = {
            categoryType: doc.data().categoryType,
            clubsAndCouncilDescription: doc.data().clubsAndCouncilDescription,
            clubsAndCouncilTitle: doc.data().clubsAndCouncilTitle,
            clubsAndCouncilsLogo: doc.data().clubsAndCouncilsLogo,
            id: doc.id,
            counter: counter,
          };
          counter++;
          studentcouncil.push(data);
        });

        this.setState({ studentcouncil: studentcouncil });
      });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  
  };
  addStudentCouncil()  {
  const db = fire.firestore();
      var lastdoc = db.collection("ClubsAndCouncils").orderBy('id','desc')
      .limit(1).get().then((snapshot) =>  {
        snapshot.forEach((doc) => {
  var docid= "";
          var res = doc.data().id.substring(5, 10);
        var id = parseInt(res)
  if(id.toString().length <= 2){
  docid= "club-0" + (id +1) 
  }else{
    docid="club-0" + (id +1) 
  }
  var categoryType= document.getElementById("categoryType").value;
  var clubsAndCouncilTitle = document.getElementById("clubsAndCouncilTitle").value;
var clubsAndCouncilDescription = document.getElementById("clubsAndCouncilDescription").value

const parentthis = this;
const foldername = "/ClubsAndCouncil/StudentCouncil";
const file = this.state.files[0];
const storageRef = fire.storage().ref(foldername);
const fileRef = storageRef.child(file.name).put(file);
fileRef.on("state_changed", function (snapshot) {
  fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  

    const userRef = db
    .collection("ClubsAndCouncils")
    .doc(docid)
    .set({
        categoryType : categoryType,
        clubsAndCouncilTitle: clubsAndCouncilTitle,
        clubsAndCouncilDescription: clubsAndCouncilDescription,
        clubsAndCouncilsLogo: downloadURL,
    })
    .then(function () {
      alert("Added");
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


      })

  });

}

  editStudentCouncil(e, studentcouncilid) {
    document.getElementById(studentcouncilid + "upload").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "spanstudcounciltitle").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "spanstudcouncildesc").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "spanstudcouncillogo").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "editbutton").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "updatebutton").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        studentcouncilid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, studentcouncilid) {
    document.getElementById(studentcouncilid + "upload").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "spanstudcounciltitle").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "spanstudcouncildesc").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "spanstudcouncillogo").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "editbutton").removeAttribute("hidden");
    document.getElementById(studentcouncilid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(studentcouncilid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        studentcouncilid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

DeleteStudentCouncil(e, studentcouncilid) {
    const db = fire.firestore();
  
    const userRef = db
      .collection("ClubsAndCouncils")
      .doc(studentcouncilid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

handleSave = (studentcouncilid) => {
  const parentthis = this;
  const db = fire.firestore();

  var clubsAndCouncilTitle = document.getElementById(studentcouncilid + "studcounciltitle").value;
var clubsAndCouncilDescription = document.getElementById(studentcouncilid + "studcouncildesc").value;
console.log(this.state.files);

if (this.state.files !== undefined) {
    const foldername = "/ClubsAndCouncil/StudentCouncil";
    const storageRef = fire.storage().ref(foldername);
    const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
    fileRef.on("state_changed", function (snapshot) {
      fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

        const userRef = db
        .collection("ClubsAndCouncils")
        .doc(studentcouncilid)
        .update({
            clubsAndCouncilTitle: clubsAndCouncilTitle,
            clubsAndCouncilDescription: clubsAndCouncilDescription,
            clubsAndCouncilsLogo: downloadURL,
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
    .collection("ClubsAndCouncils")
    .doc(studentcouncilid)
    .update({
        clubsAndCouncilTitle: clubsAndCouncilTitle,
        clubsAndCouncilDescription: clubsAndCouncilDescription,
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
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Name of Clubs/Councils</th>
                <th scope="col">Description</th>
                <th scope="col">Logo File</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.studentcouncil &&
                this.state.studentcouncil.map((studentcouncil) => {
                  return (
                    <tr>
                        <td>{studentcouncil.counter}</td>
                      <td>
                      <span class={studentcouncil.id + "text"}>
                      {studentcouncil.clubsAndCouncilTitle}
                        </span>
                          <span id={studentcouncil.id + "spanstudcounciltitle"} hidden>
                          <input
                            id={studentcouncil.id + "studcounciltitle"}
                            defaultValue={studentcouncil.clubsAndCouncilTitle}
                            type="text"
                            name={studentcouncil.id + "studcounciltitle"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={studentcouncil.clubsAndCouncilTitle}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={studentcouncil.id + "text"}>
                      {studentcouncil.clubsAndCouncilDescription}
                        </span>
                          <span id={studentcouncil.id + "spanstudcouncildesc"} hidden>
                          <input
                            id={studentcouncil.id + "studcouncildesc"}
                            defaultValue={studentcouncil.clubsAndCouncilDescription}
                            type="text"
                            name={studentcouncil.id + "studcouncildesc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={studentcouncil.clubsAndCouncilDescription}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={studentcouncil.id + "text"}>
                      {studentcouncil.clubsAndCouncilsLogo}
                        </span>
                          <span id={studentcouncil.id + "spanstudcouncillogo"} hidden>
                          <input
                            id={studentcouncil.id + "studcouncillogo"}
                            defaultValue={studentcouncil.clubsAndCouncilsLogo}
                            type="text"
                            name={studentcouncil.id + "studcouncillogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={studentcouncil.clubsAndCouncilsLogo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {studentcouncil.id+ "upload" } hidden ><input
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
                          id={studentcouncil.id + "editbutton"}
                          onClick={(e) => {
                            this.editStudentCouncil(e, studentcouncil.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={studentcouncil.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(studentcouncil.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={studentcouncil.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, studentcouncil.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteStudentCouncil(e, studentcouncil.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form onSubmit={(e) => {this.addStudentCouncil(); e.preventDefault();}}>
          <input
          id= "categoryType"
            type="text"
            name="categoryType"
            placeholder="Category Type"
            onChange={this.updateInput}
            value={this.state.categoryType}
            required
          />
          <input
            id="clubsAndCouncilTitle"
            type="text"
            name="clubsAndCouncilTitle"
            placeholder="Title"
            onChange={this.updateInput}
            value={this.state.clubsAndCouncilTitle}
            required
          />
          <input
            id="clubsAndCouncilDescription"
            type="text"
            name="clubsAndCouncilDescription"
            placeholder="Description"
            onChange={this.updateInput}
            value={this.state.clubsAndCouncilDescription}
            required
          />
          <input
            type="file"

            onChange={(e) => {
              this.handleFileUpload(e.target.files); 
            }
            
            }required></input>
          <button type="submit">Add Student Councils</button>
        </form>
      </div>
    );
  }
}
export default StudentCouncil;