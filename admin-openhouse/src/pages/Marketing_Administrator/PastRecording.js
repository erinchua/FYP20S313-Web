import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class PastRecording extends Component {
  constructor() {
    super();
    this.state = {
      awardingUni: "",
      capacityLimit: "",
      date: "",
      endTime: "",
      hasRecording: "",
      isLive: "",
      noRegistered: "",
      startTime: "",
      talkName: "",
      venue: "",
      link: "",
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
      .collection("ProgrammeTalks").where("hasRecording", "==", true)
      .get()
      .then((snapshot) => {
        const pastrecording = [];
        snapshot.forEach((doc) => {
          const data = {
            awardingUni: doc.data().awardingUni,
            capacityLimit: doc.data().capacityLimit,
            date: doc.data().date,
            endTime: doc.data().endTime,
            hasRecording: doc.data().hasRecording,
            isLive: doc.data().isLive,
            noRegistered: doc.data().noRegistered,
            startTime: doc.data().startTime,
            talkName: doc.data().talkName,
            venue: doc.data().venue,
            Link: doc.data().Link,
            id: doc.id,
            counter: counter,
          };
          counter++;
          pastrecording.push(data);
        });

        this.setState({ pastrecording: pastrecording });
      });
  }

  addPastRecording = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("ProgrammeTalks")
      .add({
      awardingUni: this.state.awardingUni,
      capacityLimit: this.state.capacityLimit,
      date: this.state.date,
      endTime: this.state.endTime,
      hasRecording: this.state.hasRecording,
      isLive: this.state.isLive,
      noRegistered: this.state.noRegistered,
      startTime: this.state.startTime,
      talkName: this.state.talkName,
      venue: this.state.venue,
      Link: this.state.Link,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeletePastRecording(e, pastrecordingid) {
    const db = fire.firestore();
    const userRef = db
      .collection("ProgrammeTalks")
      .doc(pastrecordingid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, pastrecordingid) {
    const talkName = document.getElementById(pastrecordingid + "talkname").value
    const awardingUni = document.getElementById(pastrecordingid + "awarduni").value
    const startTime = document.getElementById(pastrecordingid + "starttime").value
    const endTime = document.getElementById(pastrecordingid + "endtime").value
    const venue = document.getElementById(pastrecordingid + "venue").value
    const Link = document.getElementById(pastrecordingid + "link").value

    const db = fire.firestore();
    if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null && Link != null) {
      const userRef = db
        .collection("ProgrammeTalks")
        .doc(pastrecordingid)
        .update({
            awardingUni: awardingUni,
            endTime: endTime,
            startTime: startTime,
            talkName: talkName,
            venue: venue,
            Link: Link,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editPastRecording(e, pastrecordingid) {
    document.getElementById(pastrecordingid + "spantalkname").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanawarduni").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanendtime").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanvenue").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanlink").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "editbutton").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "updatebutton").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        pastrecordingid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, pastrecordingid) {
    document.getElementById(pastrecordingid + "spantalkname").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "spanawarduni").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "spanstarttime").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "spanendtime").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "spanlink").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "editbutton").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        pastrecordingid + "text"
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
                <th scope="col">Programme Talk</th>
                <th scope="col">Awarding University</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Link</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.pastrecording &&
                this.state.pastrecording.map((pastrecording) => {
                  return (
                    <tr>
                        <td>{pastrecording.counter}</td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.talkName}
                        </span>
                          <span id={pastrecording.id + "spantalkname"} hidden>
                          <input
                            id={pastrecording.id + "talkname"}
                            defaultValue={pastrecording.talkName}
                            type="text"
                            name={pastrecording.id + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.awardingUni}
                        </span>
                          <span id={pastrecording.id + "spanawarduni"} hidden>
                          <input
                            id={pastrecording.id + "awarduni"}
                            defaultValue={pastrecording.awardingUni}
                            type="text"
                            name={pastrecording.id + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.startTime}
                        </span>
                          <span id={pastrecording.id + "spanstarttime"} hidden>
                          <input
                            id={pastrecording.id + "starttime"}
                            defaultValue={pastrecording.startTime}
                            type="text"
                            name={pastrecording.id + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.endTime}
                        </span>
                          <span id={pastrecording.id + "spanendtime"} hidden>
                          <input
                            id={pastrecording.id + "endtime"}
                            defaultValue={pastrecording.endTime}
                            type="text"
                            name={pastrecording.id + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.venue}
                        </span>
                          <span id={pastrecording.id + "spanvenue"} hidden>
                          <input
                            id={pastrecording.id + "venue"}
                            defaultValue={pastrecording.venue}
                            type="text"
                            name={pastrecording.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={pastrecording.id + "text"}>
                      {pastrecording.Link}
                        </span>
                          
                          <span id={pastrecording.id + "spanlink"} hidden>
                          <input
                            id={pastrecording.id + "link"}
                            defaultValue={pastrecording.Link}
                            type="text"
                            name={pastrecording.id + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={pastrecording.Link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button
                          id={pastrecording.id + "editbutton"}
                          onClick={(e) => {
                            this.editPastRecording(e, pastrecording.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={pastrecording.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, pastrecording.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={pastrecording.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, pastrecording.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeletePastRecording(e, pastrecording.id);
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
        <form onSubmit={this.addPastRecording}>
          <input
            type="text"
            name="talkName"
            placeholder="Programme Talk"
            onChange={this.updateInput}
            value={this.state.talkName}
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
            name="awardingUni"
            placeholder="Awarding University"
            onChange={this.updateInput}
            value={this.state.awardingUni}
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
          <input
            type="text"
            name="capacityLimit"
            placeholder="Capacity Limit"
            onChange={this.updateInput}
            value={this.state.capacityLimit}
            required
          />
          <input
          //type should be boolean
            type="text"
            name="hasRecording"
            placeholder="Has Recording"
            onChange={this.updateInput}
            value={this.state.hasRecording}
            required
          />
          <input
          //type should be boolean
            type="text"
            name="isLive"
            placeholder="Is Live"
            onChange={this.updateInput}
            value={this.state.isLive}
            required
          />
          <input
            type="text"
            name="noRegistered"
            placeholder="No of Student Registered"
            onChange={this.updateInput}
            value={this.state.noRegistered}
            required
          />
          <input
            type="text"
            name="Link"
            placeholder="Link"
            onChange={this.updateInput}
            value={this.state.Link}
            required
          />
          <button type="submit">Add Past Recording</button>
        </form>
      </div>
    );
  }
}
export default PastRecording;
