import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class GuidedTour extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      endTime: "",
      startTime: "",
      tourName: "",
      venue: "",
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
      .collection("GuidedTours").orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const guidedTour = [];
        snapshot.forEach((doc) => {
          const data = {
            date: doc.data().date,
            endTime: doc.data().endTime,
            startTime: doc.data().startTime,
            tourName: doc.data().tourName,
            venue: doc.data().venue,
            id: doc.id,
            counter: counter,
          };
          counter++;
          guidedTour.push(data);
        });

        this.setState({ guidedTour: guidedTour });
      });
  }

  addGuidedTour = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("GuidedTours")
      .add({
      date: this.state.date,
      endTime: this.state.endTime,
      startTime: this.state.startTime,
      tourName: this.state.tourName,
      venue: this.state.venue,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteGuidedTour(e, guidedtourid) {
    const db = fire.firestore();
    const userRef = db
      .collection("GuidedTours")
      .doc(guidedtourid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, guidedtourid) {
    const tourName = document.getElementById(guidedtourid + "tourname").value
    const startTime = document.getElementById(guidedtourid + "starttime").value
    const endTime = document.getElementById(guidedtourid + "endtime").value
    const venue = document.getElementById(guidedtourid + "venue").value

    const db = fire.firestore();
    if (tourName != null && startTime != null && endTime != null && venue != null) {
      const userRef = db
        .collection("GuidedTours")
        .doc(guidedtourid)
        .update({
            endTime: endTime,
            startTime: startTime,
            tourName: tourName,
            venue: venue,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editGuidedTour(e, guidedtourid) {
    document.getElementById(guidedtourid + "spantourname").removeAttribute("hidden");
    document.getElementById(guidedtourid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(guidedtourid + "spanendtime").removeAttribute("hidden");
    document.getElementById(guidedtourid + "spanvenue").removeAttribute("hidden");
    document.getElementById(guidedtourid + "editbutton").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "updatebutton").removeAttribute("hidden");
    document.getElementById(guidedtourid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        guidedtourid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, guidedtourid) {
    document.getElementById(guidedtourid + "spantourname").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "spanstarttime").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "spanendtime").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "editbutton").removeAttribute("hidden");
    document.getElementById(guidedtourid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(guidedtourid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        guidedtourid + "text"
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
                <th scope="col">Tour No.</th>
                <th scope="col">Tour</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.guidedTour &&
                this.state.guidedTour.map((guidedTour) => {
                  return (
                    <tr>
                        <td>{guidedTour.counter}</td>
                      <td>
                      <span class={guidedTour.id + "text"}>
                      {guidedTour.tourName}
                        </span>
                          
                          <span id={guidedTour.id + "spantourname"} hidden>
                          <input
                            id={guidedTour.id + "tourname"}
                            defaultValue={guidedTour.tourName}
                            type="text"
                            name={guidedTour.id + "tourname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={guidedTour.tourName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={guidedTour.id + "text"}>
                      {guidedTour.startTime}
                        </span>
                          <span id={guidedTour.id + "spanstarttime"} hidden>
                          <input
                            id={guidedTour.id + "starttime"}
                            defaultValue={guidedTour.startTime}
                            type="text"
                            name={guidedTour.id + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={guidedTour.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={guidedTour.id + "text"}>
                      {guidedTour.endTime}
                        </span>
                          <span id={guidedTour.id + "spanendtime"} hidden>
                          <input
                            id={guidedTour.id + "endtime"}
                            defaultValue={guidedTour.endTime}
                            type="text"
                            name={guidedTour.id + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={guidedTour.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={guidedTour.id + "text"}>
                      {guidedTour.venue}
                        </span>
                          <span id={guidedTour.id + "spanvenue"} hidden>
                          <input
                            id={guidedTour.id + "venue"}
                            defaultValue={guidedTour.venue}
                            type="text"
                            name={guidedTour.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={guidedTour.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={guidedTour.id + "editbutton"}
                          onClick={(e) => {
                            this.editGuidedTour(e, guidedTour.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={guidedTour.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, guidedTour.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={guidedTour.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, guidedTour.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteGuidedTour(e, guidedTour.id);
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
        <form onSubmit={this.addGuidedTour}>
          <input
            type="text"
            name="tourName"
            placeholder="Tour"
            onChange={this.updateInput}
            value={this.state.tourName}
            required
          />
          <input
            type="text"
            name="date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.date}
            required
          />
          <input
            type="text"
            name="startTime"
            placeholder="Start Time"
            onChange={this.updateInput}
            value={this.state.startTime}
            required
          />
          <input
            type="text"
            name="endTime"
            placeholder="End Time"
            onChange={this.updateInput}
            value={this.state.endTime}
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            onChange={this.updateInput}
            value={this.state.venue}
            required
          />
          <button type="submit">Add Guided Tour</button>
        </form>
      </div>
    );
  }
}
export default GuidedTour;
