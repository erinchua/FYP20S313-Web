import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class Performances extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      endTime: "",
      startTime: "",
      performanceName: "",
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
      .collection("Performances").orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const performance = [];
        snapshot.forEach((doc) => {
          const data = {
            date: doc.data().date,
            endTime: doc.data().endTime,
            startTime: doc.data().startTime,
            performanceName: doc.data().performanceName,
            venue: doc.data().venue,
            id: doc.id,
            counter: counter,
          };
          counter++;
          performance.push(data);
        });

        this.setState({ performance: performance });
      });
  }

  addPerformance = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("Performances")
      .add({
      date: this.state.date,
      endTime: this.state.endTime,
      startTime: this.state.startTime,
      performanceName: this.state.performanceName,
      venue: this.state.venue,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeletePerformance(e, performanceid) {
    const db = fire.firestore();
    const userRef = db
      .collection("Performances")
      .doc(performanceid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, performanceid) {
    const performanceName = document.getElementById(performanceid + "performancename").value
    const startTime = document.getElementById(performanceid + "starttime").value
    const endTime = document.getElementById(performanceid + "endtime").value
    const venue = document.getElementById(performanceid + "venue").value

    const db = fire.firestore();
    if (performanceName != null && startTime != null && endTime != null && venue != null) {
      const userRef = db
        .collection("Performances")
        .doc(performanceid)
        .update({
            endTime: endTime,
            startTime: startTime,
            performanceName: performanceName,
            venue: venue,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editPerformance(e, performanceid) {
    document.getElementById(performanceid + "spanperformancename").removeAttribute("hidden");
    document.getElementById(performanceid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(performanceid + "spanendtime").removeAttribute("hidden");
    document.getElementById(performanceid + "spanvenue").removeAttribute("hidden");
    document.getElementById(performanceid + "editbutton").setAttribute("hidden", "");
    document.getElementById(performanceid + "updatebutton").removeAttribute("hidden");
    document.getElementById(performanceid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        performanceid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, performanceid) {
    document.getElementById(performanceid + "spanperformancename").setAttribute("hidden", "");
    document.getElementById(performanceid + "spanstarttime").setAttribute("hidden", "");
    document.getElementById(performanceid + "spanendtime").setAttribute("hidden", "");
    document.getElementById(performanceid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(performanceid + "editbutton").removeAttribute("hidden");
    document.getElementById(performanceid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(performanceid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        performanceid + "text"
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
                <th scope="col">Performance</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.performance &&
                this.state.performance.map((performance) => {
                  return (
                    <tr>
                        <td>{performance.counter}</td>
                      <td>
                      <span class={performance.id + "text"}>
                      {performance.performanceName}
                        </span>
                          
                          <span id={performance.id + "spanperformancename"} hidden>
                          <input
                            id={performance.id + "performancename"}
                            defaultValue={performance.performanceName}
                            type="text"
                            name={performance.id + "performancename"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={performance.performanceName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={performance.id + "text"}>
                      {performance.startTime}
                        </span>
                          <span id={performance.id + "spanstarttime"} hidden>
                          <input
                            id={performance.id + "starttime"}
                            defaultValue={performance.startTime}
                            type="text"
                            name={performance.id + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={performance.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={performance.id + "text"}>
                      {performance.endTime}
                        </span>
                          <span id={performance.id + "spanendtime"} hidden>
                          <input
                            id={performance.id + "endtime"}
                            defaultValue={performance.endTime}
                            type="text"
                            name={performance.id + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={performance.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={performance.id + "text"}>
                      {performance.venue}
                        </span>
                          <span id={performance.id + "spanvenue"} hidden>
                          <input
                            id={performance.id + "venue"}
                            defaultValue={performance.venue}
                            type="text"
                            name={performance.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={performance.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={performance.id + "editbutton"}
                          onClick={(e) => {
                            this.editPerformance(e, performance.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={performance.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, performance.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={performance.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, performance.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeletePerformance(e, performance.id);
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
        <form onSubmit={this.addPerformance}>
          <input
            type="text"
            name="performanceName"
            placeholder="Performance Name"
            onChange={this.updateInput}
            value={this.state.performanceName}
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
          <button type="submit">Add Performance</button>
        </form>
      </div>
    );
  }
}
export default Performances;
