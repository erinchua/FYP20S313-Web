import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class CampusFacilitiesMap extends Component {
  constructor() {
    super();
    this.state = {
      blockName: "",
      facilityName: "",
      location: "",
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

    const userRef = db
      .collection("CampusFacilities")
      .get()
      .then((snapshot) => {
        const facilities = [];
        snapshot.forEach((doc) => {
          const data = {
            blockName: doc.data().blockName,
            facilityName: doc.data().facilityName,
            location: doc.data().location,
            id: doc.id,
          };
          facilities.push(data);
        });

        this.setState({ facilities: facilities });
      });
  }

  update(e, facilitiesid) {
    const blockName = document.getElementById(facilitiesid + "block").value
    const facilityName = document.getElementById(facilitiesid + "name").value
    const location = document.getElementById(facilitiesid + "location").value

    const db = fire.firestore();
    if (blockName != null && facilityName != null && location != null) {
      const userRef = db
        .collection("CampusFacilities")
        .doc(facilitiesid)
        .update({
            blockName: blockName,
          facilityName: facilityName,
          location: location,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editFacilities(e, facilitiesid) {
    document.getElementById(facilitiesid + "spanblock").removeAttribute("hidden");
    document.getElementById(facilitiesid + "spanname").removeAttribute("hidden");
    document.getElementById(facilitiesid + "spanlocation").removeAttribute("hidden");
    document.getElementById(facilitiesid + "editbutton").setAttribute("hidden", "");
    document.getElementById(facilitiesid + "updatebutton").removeAttribute("hidden");
    document.getElementById(facilitiesid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        facilitiesid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, facilitiesid) {
    document.getElementById(facilitiesid + "spanblock").setAttribute("hidden", "");
    document.getElementById(facilitiesid + "spanname").setAttribute("hidden", "");
    document.getElementById(facilitiesid + "spanlocation").setAttribute("hidden", "");
    document.getElementById(facilitiesid + "editbutton").removeAttribute("hidden");
    document.getElementById(facilitiesid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(facilitiesid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        facilitiesid + "text"
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
                <th scope="col">Block</th>
                <th scope="col">Name of Place</th>
                <th scope="col">Location</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.facilities &&
                this.state.facilities.map((facilities) => {
                  return (
                    <tr>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.blockName}
                        </span>
                          
                          <span id={facilities.id + "spanblock"} hidden>
                          <input
                            id={facilities.id + "block"}
                            defaultValue={facilities.blockName}
                            type="text"
                            name={facilities.id + "block"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.blockName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.facilityName}
                        </span>    
                          <span id={facilities.id + "spanname"} hidden>
                          <input
                            id={facilities.id + "name"}
                            defaultValue={facilities.facilityName}                    
                            type="text"
                            name={facilities.id + "name"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.facilityName}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.location} 
                        </span>  
                          <span id={facilities.id + "spanlocation"} hidden>
                          <input
                            id={facilities.id + "location"}
                            defaultValue={facilities.location}
                            type="text"
                            name={facilities.id + "location"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.location}
                            required
                          />
                        </span> 
                      </td>
                      <td>
                        <button
                          id={facilities.id + "editbutton"}
                          onClick={(e) => {
                            this.editFacilities(e, facilities.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={facilities.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, facilities.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={facilities.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, facilities.id);
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
export default CampusFacilitiesMap;
