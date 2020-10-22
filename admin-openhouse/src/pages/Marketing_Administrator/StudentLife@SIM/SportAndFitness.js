import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class SportAndFitness extends Component {
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
      .collection("ClubsAndCouncils").where("categoryType", "==", "SportsFitness")
      .get()
      .then((snapshot) => {
        const sportfitness = [];
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
          sportfitness.push(data);
        });

        this.setState({ sportfitness: sportfitness });
      });
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  
  };
  addSportFitness()  {
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
const foldername = "/ClubsAndCouncil/SportsFitness";
const file = this.state.files[0];
const storageRef = fire.storage().ref(foldername);
const fileRef = storageRef.child(file.name).put(file);
fileRef.on("state_changed", function (snapshot) {
  fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  

    const userRef = db
    .collection("ClubsAndCouncils")
    .doc(docid)
    .set({
        categoryType : "SportsFitness",
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

  editSportFitness(e, sportfitnessid) {
    document.getElementById(sportfitnessid + "upload").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "spansportfitnesstitle").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "spansportfitnessdesc").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "spansportfitnesslogo").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "editbutton").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "updatebutton").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        sportfitnessid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, sportfitnessid) {
    document.getElementById(sportfitnessid + "upload").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "spansportfitnesstitle").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "spansportfitnessdesc").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "spansportfitnesslogo").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "editbutton").removeAttribute("hidden");
    document.getElementById(sportfitnessid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(sportfitnessid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        sportfitnessid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

DeleteSportFitness(e, sportfitnessid) {
    const db = fire.firestore();
  
    const userRef = db
      .collection("ClubsAndCouncils")
      .doc(sportfitnessid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

handleSave = (sportfitnessid) => {
  const parentthis = this;
  const db = fire.firestore();

  var clubsAndCouncilTitle = document.getElementById(sportfitnessid + "sportfitnesstitle").value;
var clubsAndCouncilDescription = document.getElementById(sportfitnessid + "sportfitnessdesc").value;
console.log(this.state.files);

if (this.state.files !== undefined) {
    const foldername = "/ClubsAndCouncil/SportsFitness";
    const storageRef = fire.storage().ref(foldername);
    const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
    fileRef.on("state_changed", function (snapshot) {
      fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

        const userRef = db
        .collection("ClubsAndCouncils")
        .doc(sportfitnessid)
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
    .doc(sportfitnessid)
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
              {this.state.sportfitness &&
                this.state.sportfitness.map((sportfitness) => {
                  return (
                    <tr>
                        <td>{sportfitness.counter}</td>
                      <td>
                      <span class={sportfitness.id + "text"}>
                      {sportfitness.clubsAndCouncilTitle}
                        </span>
                          <span id={sportfitness.id + "spansportfitnesstitle"} hidden>
                          <input
                            id={sportfitness.id + "sportfitnesstitle"}
                            defaultValue={sportfitness.clubsAndCouncilTitle}
                            type="text"
                            name={sportfitness.id + "sportfitnesstitle"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={sportfitness.clubsAndCouncilTitle}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={sportfitness.id + "text"}>
                      {sportfitness.clubsAndCouncilDescription}
                        </span>
                          <span id={sportfitness.id + "spansportfitnessdesc"} hidden>
                          <input
                            id={sportfitness.id + "sportfitnessdesc"}
                            defaultValue={sportfitness.clubsAndCouncilDescription}
                            type="text"
                            name={sportfitness.id + "sportfitnessdesc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={sportfitness.clubsAndCouncilDescription}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={sportfitness.id + "text"}>
                      {sportfitness.clubsAndCouncilsLogo}
                        </span>
                          <span id={sportfitness.id + "spansportfitnesslogo"} hidden>
                          <input
                            id={sportfitness.id + "sportfitnesslogo"}
                            defaultValue={sportfitness.clubsAndCouncilsLogo}
                            type="text"
                            name={sportfitness.id + "sportfitnesslogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={sportfitness.clubsAndCouncilsLogo}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                       <span id= {sportfitness.id+ "upload" } hidden ><input
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
                          id={sportfitness.id + "editbutton"}
                          onClick={(e) => {
                            this.editSportFitness(e, sportfitness.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={sportfitness.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(sportfitness.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={sportfitness.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, sportfitness.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteSportFitness(e, sportfitness.id);
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
        <form onSubmit={(e) => {this.addSportFitness(); e.preventDefault();}}>
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
          <button type="submit">Add Sport Fitness</button>
        </form>
      </div>
    );
  }
}
export default SportAndFitness;