import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class SpecialInterestClub extends Component {
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
      .collection("ClubsAndCouncils").where("categoryType", "==", "SpecialInterest")
      .get()
      .then((snapshot) => {
        const specialinterest = [];
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
          specialinterest.push(data);
        });

        this.setState({ specialinterest: specialinterest });
      });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  
  };
  addSpecialInterest()  {
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
  var clubsAndCouncilTitle = document.getElementById("clubsAndCouncilTitle").value;
var clubsAndCouncilDescription = document.getElementById("clubsAndCouncilDescription").value

const parentthis = this;
const foldername = "/ClubsAndCouncil/SpecialInterest";
const file = this.state.files[0];
const storageRef = fire.storage().ref(foldername);
const fileRef = storageRef.child(file.name).put(file);
fileRef.on("state_changed", function (snapshot) {
  fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  

    const userRef = db
    .collection("ClubsAndCouncils")
    .doc(docid)
    .set({
        categoryType : "SpecialInterest",
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

  editSpecialInterest(e, specialinterestid) {
    document.getElementById(specialinterestid + "upload").removeAttribute("hidden");
    document.getElementById(specialinterestid + "spanspecialinteresttitle").removeAttribute("hidden");
    document.getElementById(specialinterestid + "spanspecialinterestdesc").removeAttribute("hidden");
    document.getElementById(specialinterestid + "spanspecialinterestlogo").removeAttribute("hidden");
    document.getElementById(specialinterestid + "editbutton").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "updatebutton").removeAttribute("hidden");
    document.getElementById(specialinterestid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        specialinterestid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, specialinterestid) {
    document.getElementById(specialinterestid + "upload").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "spanspecialinteresttitle").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "spanspecialinterestdesc").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "spanspecialinterestlogo").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "editbutton").removeAttribute("hidden");
    document.getElementById(specialinterestid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(specialinterestid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        specialinterestid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

DeleteSpecialInterest(e, specialinterestid) {
    const db = fire.firestore();
  
    const userRef = db
      .collection("ClubsAndCouncils")
      .doc(specialinterestid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

handleSave = (specialinterestid) => {
  const parentthis = this;
  const db = fire.firestore();

  var clubsAndCouncilTitle = document.getElementById(specialinterestid + "specialinteresttitle").value;
var clubsAndCouncilDescription = document.getElementById(specialinterestid + "specialinterestdesc").value;
console.log(this.state.files);

if (this.state.files !== undefined) {
    const foldername = "/ClubsAndCouncil/SpecialInterest";
    const storageRef = fire.storage().ref(foldername);
    const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
    fileRef.on("state_changed", function (snapshot) {
      fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

        const userRef = db
        .collection("ClubsAndCouncils")
        .doc(specialinterestid)
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
    .doc(specialinterestid)
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
              {this.state.specialinterest &&
                this.state.specialinterest.map((specialinterest) => {
                  return (
                    <tr>
                        <td>{specialinterest.counter}</td>
                      <td>
                      <span class={specialinterest.id + "text"}>
                      {specialinterest.clubsAndCouncilTitle}
                        </span>
                          <span id={specialinterest.id + "spanspecialinteresttitle"} hidden>
                          <input
                            id={specialinterest.id + "specialinteresttitle"}
                            defaultValue={specialinterest.clubsAndCouncilTitle}
                            type="text"
                            name={specialinterest.id + "specialinteresttitle"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={specialinterest.clubsAndCouncilTitle}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={specialinterest.id + "text"}>
                      {specialinterest.clubsAndCouncilDescription}
                        </span>
                          <span id={specialinterest.id + "spanspecialinterestdesc"} hidden>
                          <input
                            id={specialinterest.id + "specialinterestdesc"}
                            defaultValue={specialinterest.clubsAndCouncilDescription}
                            type="text"
                            name={specialinterest.id + "specialinterestdesc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={specialinterest.clubsAndCouncilDescription}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={specialinterest.id + "text"}>
                      {specialinterest.clubsAndCouncilsLogo}
                        </span>
                          <span id={specialinterest.id + "spanspecialinterestlogo"} hidden>
                          <input
                            id={specialinterest.id + "specialinterestlogo"}
                            defaultValue={specialinterest.clubsAndCouncilsLogo}
                            type="text"
                            name={specialinterest.id + "specialinterestlogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={specialinterest.clubsAndCouncilsLogo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {specialinterest.id+ "upload" } hidden ><input
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
                          id={specialinterest.id + "editbutton"}
                          onClick={(e) => {
                            this.editSpecialInterest(e, specialinterest.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={specialinterest.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(specialinterest.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={specialinterest.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, specialinterest.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteSpecialInterest(e, specialinterest.id);
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
        <form onSubmit={(e) => {this.addSpecialInterest(); e.preventDefault();}}>
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
          <button type="submit">Add Special Interest Club</button>
        </form>
      </div>
    );
  }
}
export default SpecialInterestClub;