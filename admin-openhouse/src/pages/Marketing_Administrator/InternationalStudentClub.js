import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class InternationalStudentClub extends Component {
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
      .collection("ClubsAndCouncils").where("categoryType", "==", "InternationalStudent")
      .get()
      .then((snapshot) => {
        const internationalstudent = [];
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
          internationalstudent.push(data);
        });

        this.setState({ internationalstudent: internationalstudent });
      });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  
  };
  addInternationalStudent()  {
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
const foldername = "/ClubsAndCouncil/InternationalStudent";
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

  editInternationalStudent(e, internationalstudentid) {
    document.getElementById(internationalstudentid + "upload").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "spanintstudtitle").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "spanintstuddesc").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "spanintstudlogo").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "editbutton").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "updatebutton").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        internationalstudentid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, internationalstudentid) {
    document.getElementById(internationalstudentid + "upload").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "spanintstudtitle").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "spanintstuddesc").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "spanintstudlogo").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "editbutton").removeAttribute("hidden");
    document.getElementById(internationalstudentid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(internationalstudentid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        internationalstudentid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

DeleteInternationalStudent(e, internationalstudentid) {
    const db = fire.firestore();
  
    const userRef = db
      .collection("ClubsAndCouncils")
      .doc(internationalstudentid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

handleSave = (internationalstudentid) => {
  const parentthis = this;
  const db = fire.firestore();

  var clubsAndCouncilTitle = document.getElementById(internationalstudentid + "intstudtitle").value;
var clubsAndCouncilDescription = document.getElementById(internationalstudentid + "intstuddesc").value;
console.log(this.state.files);

if (this.state.files !== undefined) {
    const foldername = "/ClubsAndCouncil/InternationalStudent";
    const storageRef = fire.storage().ref(foldername);
    const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
    fileRef.on("state_changed", function (snapshot) {
      fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

        const userRef = db
        .collection("ClubsAndCouncils")
        .doc(internationalstudentid)
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
    .doc(internationalstudentid)
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
              {this.state.internationalstudent &&
                this.state.internationalstudent.map((internationalstudent) => {
                  return (
                    <tr>
                        <td>{internationalstudent.counter}</td>
                      <td>
                      <span class={internationalstudent.id + "text"}>
                      {internationalstudent.clubsAndCouncilTitle}
                        </span>
                          <span id={internationalstudent.id + "spanintstudtitle"} hidden>
                          <input
                            id={internationalstudent.id + "intstudtitle"}
                            defaultValue={internationalstudent.clubsAndCouncilTitle}
                            type="text"
                            name={internationalstudent.id + "intstudtitle"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={internationalstudent.clubsAndCouncilTitle}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={internationalstudent.id + "text"}>
                      {internationalstudent.clubsAndCouncilDescription}
                        </span>
                          <span id={internationalstudent.id + "spanintstuddesc"} hidden>
                          <input
                            id={internationalstudent.id + "intstuddesc"}
                            defaultValue={internationalstudent.clubsAndCouncilDescription}
                            type="text"
                            name={internationalstudent.id + "intstuddesc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={internationalstudent.clubsAndCouncilDescription}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={internationalstudent.id + "text"}>
                      {internationalstudent.clubsAndCouncilsLogo}
                        </span>
                          <span id={internationalstudent.id + "spanintstudlogo"} hidden>
                          <input
                            id={internationalstudent.id + "intstudlogo"}
                            defaultValue={internationalstudent.clubsAndCouncilsLogo}
                            type="text"
                            name={internationalstudent.id + "intstudlogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={internationalstudent.clubsAndCouncilsLogo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {internationalstudent.id+ "upload" } hidden ><input
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
                          id={internationalstudent.id + "editbutton"}
                          onClick={(e) => {
                            this.editInternationalStudent(e, internationalstudent.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={internationalstudent.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(internationalstudent.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={internationalstudent.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, internationalstudent.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteInternationalStudent(e, internationalstudent.id);
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
        <form onSubmit={(e) => {this.addInternationalStudent(); e.preventDefault();}}>
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
          <button type="submit">Add International Student Club</button>
        </form>
      </div>
    );
  }
}
export default InternationalStudentClub;