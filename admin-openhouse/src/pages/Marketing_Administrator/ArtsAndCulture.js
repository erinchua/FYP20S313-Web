import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class ArtsAndCulture extends Component {
  constructor() {
    super();
    this.state = {
      categoryType: "",
      clubsAndCouncilDescription: "",
      clubsAndCouncilTitle: "",
      clubsAndCouncilsLogo: "",
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
      .collection("ClubsAndCouncils").where("categoryType", "==", "Arts & Culture")
      .get()
      .then((snapshot) => {
        const artsculture = [];
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
          artsculture.push(data);
        });

        this.setState({ artsculture: artsculture });
      });
  }

  addArtsCulture = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("ClubsAndCouncils")
      .add({
        categoryType: this.state.categoryType,
        clubsAndCouncilDescription: this.state.clubsAndCouncilDescription,
        clubsAndCouncilTitle: this.state.clubsAndCouncilTitle,
        clubsAndCouncilsLogo: this.state.clubsAndCouncilsLogo,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteArtsCulture(e, artscultureid) {
    const db = fire.firestore();
    const userRef = db
      .collection("ClubsAndCouncils")
      .doc(artscultureid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, artscultureid) {
    const clubsAndCouncilTitle = document.getElementById(artscultureid + "artstitle").value
    const clubsAndCouncilDescription = document.getElementById(artscultureid + "artsdesc").value
    const clubsAndCouncilsLogo = document.getElementById(artscultureid + "artslogo").value


    const db = fire.firestore();
    if (clubsAndCouncilTitle != null && clubsAndCouncilDescription != null && clubsAndCouncilsLogo != null) {
      const userRef = db
        .collection("ClubsAndCouncils")
        .doc(artscultureid)
        .update({
            clubsAndCouncilTitle: clubsAndCouncilTitle,
            clubsAndCouncilDescription: clubsAndCouncilDescription,
            clubsAndCouncilsLogo: clubsAndCouncilsLogo,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editArtsCulture(e, artscultureid) {
    document.getElementById(artscultureid + "spanartstitle").removeAttribute("hidden");
    document.getElementById(artscultureid + "spanartsdesc").removeAttribute("hidden");
    document.getElementById(artscultureid + "spanartslogo").removeAttribute("hidden");
    document.getElementById(artscultureid + "editbutton").setAttribute("hidden", "");
    document.getElementById(artscultureid + "updatebutton").removeAttribute("hidden");
    document.getElementById(artscultureid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        artscultureid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, artscultureid) {
    document.getElementById(artscultureid + "spanartstitle").setAttribute("hidden", "");
    document.getElementById(artscultureid + "spanartsdesc").setAttribute("hidden", "");
    document.getElementById(artscultureid + "spanartslogo").setAttribute("hidden", "");
    document.getElementById(artscultureid + "editbutton").removeAttribute("hidden");
    document.getElementById(artscultureid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(artscultureid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        artscultureid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

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
              {this.state.artsculture &&
                this.state.artsculture.map((artsculture) => {
                  return (
                    <tr>
                        <td>{artsculture.counter}</td>
                      <td>
                      <span class={artsculture.id + "text"}>
                      {artsculture.clubsAndCouncilTitle}
                        </span>
                          <span id={artsculture.id + "spanartstitle"} hidden>
                          <input
                            id={artsculture.id + "artstitle"}
                            defaultValue={artsculture.clubsAndCouncilTitle}
                            type="text"
                            name={artsculture.id + "artstitle"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={artsculture.clubsAndCouncilTitle}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={artsculture.id + "text"}>
                      {artsculture.clubsAndCouncilDescription}
                        </span>
                          <span id={artsculture.id + "spanartsdesc"} hidden>
                          <input
                            id={artsculture.id + "artsdesc"}
                            defaultValue={artsculture.clubsAndCouncilDescription}
                            type="text"
                            name={artsculture.id + "artsdesc"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={artsculture.clubsAndCouncilDescription}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={artsculture.id + "text"}>
                      {artsculture.clubsAndCouncilsLogo}
                        </span>
                          <span id={artsculture.id + "spanartslogo"} hidden>
                          <input
                            id={artsculture.id + "artslogo"}
                            defaultValue={artsculture.clubsAndCouncilsLogo}
                            type="text"
                            name={artsculture.id + "artslogo"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={artsculture.clubsAndCouncilsLogo}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={artsculture.id + "editbutton"}
                          onClick={(e) => {
                            this.editArtsCulture(e, artsculture.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={artsculture.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, artsculture.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={artsculture.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, artsculture.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteArtsCulture(e, artsculture.id);
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
        <form onSubmit={this.addArtsCulture}>
          <input
            type="text"
            name="categoryType"
            placeholder="Category Type"
            onChange={this.updateInput}
            value={this.state.categoryType}
            required
          />
          <input
            type="text"
            name="clubsAndCouncilTitle"
            placeholder="Title"
            onChange={this.updateInput}
            value={this.state.clubsAndCouncilTitle}
            required
          />
          <input
            type="text"
            name="clubsAndCouncilDescription"
            placeholder="Description"
            onChange={this.updateInput}
            value={this.state.clubsAndCouncilDescription}
            required
          />
          <input
            type="text"
            name="clubsAndCouncilsLogo"
            placeholder="Logo"
            onChange={this.updateInput}
            value={this.state.clubsAndCouncilsLogo}
            required
          />
          <button type="submit">Add Arts and Culture</button>
        </form>
      </div>
    );
  }
}
export default ArtsAndCulture;
