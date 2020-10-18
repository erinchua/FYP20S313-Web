import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class LiveTalk extends Component {
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
      .collection("ProgrammeTalks").where("isLive", "==", true)
      .get()
      .then((snapshot) => {
        const liveTalk = [];
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
          liveTalk.push(data);
        });

        this.setState({ liveTalk: liveTalk });
      });
  }

  addLiveTalks = (e) => {
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

  DeleteLiveTalk(e, livetalkid) {
    const db = fire.firestore();
    const userRef = db
      .collection("ProgrammeTalks")
      .doc(livetalkid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, livetalkid) {
    const talkName = document.getElementById(livetalkid + "talkname").value
    const awardingUni = document.getElementById(livetalkid + "awarduni").value
    const startTime = document.getElementById(livetalkid + "starttime").value
    const endTime = document.getElementById(livetalkid + "endtime").value
    const venue = document.getElementById(livetalkid + "venue").value
    const Link = document.getElementById(livetalkid + "link").value

    const db = fire.firestore();
    if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null && Link != null) {
      const userRef = db
        .collection("ProgrammeTalks")
        .doc(livetalkid)
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

  editLiveTalk(e, livetalkid) {
    document.getElementById(livetalkid + "spantalkname").removeAttribute("hidden");
    document.getElementById(livetalkid + "spanawarduni").removeAttribute("hidden");
    document.getElementById(livetalkid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(livetalkid + "spanendtime").removeAttribute("hidden");
    document.getElementById(livetalkid + "spanvenue").removeAttribute("hidden");
    document.getElementById(livetalkid + "spanlink").removeAttribute("hidden");
    document.getElementById(livetalkid + "editbutton").setAttribute("hidden", "");
    document.getElementById(livetalkid + "updatebutton").removeAttribute("hidden");
    document.getElementById(livetalkid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        livetalkid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, livetalkid) {
    document.getElementById(livetalkid + "spantalkname").setAttribute("hidden", "");
    document.getElementById(livetalkid + "spanawarduni").setAttribute("hidden", "");
    document.getElementById(livetalkid + "spanstarttime").setAttribute("hidden", "");
    document.getElementById(livetalkid + "spanendtime").setAttribute("hidden", "");
    document.getElementById(livetalkid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(livetalkid + "spanlink").setAttribute("hidden", "");
    document.getElementById(livetalkid + "editbutton").removeAttribute("hidden");
    document.getElementById(livetalkid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(livetalkid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        livetalkid + "text"
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
              {this.state.liveTalk &&
                this.state.liveTalk.map((liveTalk) => {
                  return (
                    <tr>
                        <td>{liveTalk.counter}</td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.talkName}
                        </span>
                          <span id={liveTalk.id + "spantalkname"} hidden>
                          <input
                            id={liveTalk.id + "talkname"}
                            defaultValue={liveTalk.talkName}
                            type="text"
                            name={liveTalk.id + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.awardingUni}
                        </span>
                          <span id={liveTalk.id + "spanawarduni"} hidden>
                          <input
                            id={liveTalk.id + "awarduni"}
                            defaultValue={liveTalk.awardingUni}
                            type="text"
                            name={liveTalk.id + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.startTime}
                        </span>
                          <span id={liveTalk.id + "spanstarttime"} hidden>
                          <input
                            id={liveTalk.id + "starttime"}
                            defaultValue={liveTalk.startTime}
                            type="text"
                            name={liveTalk.id + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.endTime}
                        </span>
                          <span id={liveTalk.id + "spanendtime"} hidden>
                          <input
                            id={liveTalk.id + "endtime"}
                            defaultValue={liveTalk.endTime}
                            type="text"
                            name={liveTalk.id + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.venue}
                        </span>
                          <span id={liveTalk.id + "spanvenue"} hidden>
                          <input
                            id={liveTalk.id + "venue"}
                            defaultValue={liveTalk.venue}
                            type="text"
                            name={liveTalk.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={liveTalk.id + "text"}>
                      {liveTalk.Link}
                        </span>
                          
                          <span id={liveTalk.id + "spanlink"} hidden>
                          <input
                            id={liveTalk.id + "link"}
                            defaultValue={liveTalk.Link}
                            type="text"
                            name={liveTalk.id + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={liveTalk.Link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button
                          id={liveTalk.id + "editbutton"}
                          onClick={(e) => {
                            this.editLiveTalk(e, liveTalk.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={liveTalk.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, liveTalk.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={liveTalk.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, liveTalk.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteLiveTalk(e, liveTalk.id);
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
        <form onSubmit={this.addLiveTalks}>
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
          <button type="submit">Add Live Talk</button>
        </form>
      </div>
    );
  }
}
export default LiveTalk;
