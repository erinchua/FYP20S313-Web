import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class ProgrammeTalkSchedule extends Component {
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
      .collection("ProgrammeTalks").orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const progTalk = [];
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
            link: doc.data().link,
            id: doc.id,
            counter: counter,
          };
          counter++;
          progTalk.push(data);
        });

        this.setState({ progTalk: progTalk });
      });
  }

  addProgrammeTalks = (e) => {
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
      link: this.state.link,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteProgrammeTalk(e, progtalkid) {
    const db = fire.firestore();
    const userRef = db
      .collection("ProgrammeTalks")
      .doc(progtalkid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, progtalkid) {
    const talkName = document.getElementById(progtalkid + "talkname").value
    const awardingUni = document.getElementById(progtalkid + "awarduni").value
    const startTime = document.getElementById(progtalkid + "starttime").value
    const endTime = document.getElementById(progtalkid + "endtime").value
    const venue = document.getElementById(progtalkid + "venue").value

    const db = fire.firestore();
    if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null) {
      const userRef = db
        .collection("ProgrammeTalks")
        .doc(progtalkid)
        .update({
            awardingUni: awardingUni,

            endTime: endTime,
            startTime: startTime,
            talkName: talkName,
            venue: venue,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editProgTalk(e, progtalkid) {
    document.getElementById(progtalkid + "spantalkname").removeAttribute("hidden");
    document.getElementById(progtalkid + "spanawarduni").removeAttribute("hidden");
    document.getElementById(progtalkid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(progtalkid + "spanendtime").removeAttribute("hidden");
    document.getElementById(progtalkid + "spanvenue").removeAttribute("hidden");
    document.getElementById(progtalkid + "editbutton").setAttribute("hidden", "");
    document.getElementById(progtalkid + "updatebutton").removeAttribute("hidden");
    document.getElementById(progtalkid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        progtalkid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, progtalkid) {
    document.getElementById(progtalkid + "spantalkname").setAttribute("hidden", "");
    document.getElementById(progtalkid + "spanawarduni").setAttribute("hidden", "");
    document.getElementById(progtalkid + "spanstarttime").setAttribute("hidden", "");
    document.getElementById(progtalkid + "spanendtime").setAttribute("hidden", "");
    document.getElementById(progtalkid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(progtalkid + "editbutton").removeAttribute("hidden");
    document.getElementById(progtalkid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(progtalkid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        progtalkid + "text"
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
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.progTalk &&
                this.state.progTalk.map((progTalk) => {
                  return (
                    <tr>
                        <td>{progTalk.counter}</td>
                      <td>
                      <span class={progTalk.id + "text"}>
                      {progTalk.talkName}
                        </span>
                          
                          <span id={progTalk.id + "spantalkname"} hidden>
                          <input
                            id={progTalk.id + "talkname"}
                            defaultValue={progTalk.talkName}
                            type="text"
                            name={progTalk.id + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={progTalk.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={progTalk.id + "text"}>
                      {progTalk.awardingUni}
                        </span>
                          <span id={progTalk.id + "spanawarduni"} hidden>
                          <input
                            id={progTalk.id + "awarduni"}
                            defaultValue={progTalk.awardingUni}
                            type="text"
                            name={progTalk.id + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={progTalk.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={progTalk.id + "text"}>
                      {progTalk.startTime}
                        </span>
                          <span id={progTalk.id + "spanstarttime"} hidden>
                          <input
                            id={progTalk.id + "starttime"}
                            defaultValue={progTalk.startTime}
                            type="text"
                            name={progTalk.id + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={progTalk.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={progTalk.id + "text"}>
                      {progTalk.endTime}
                        </span>
                          <span id={progTalk.id + "spanendtime"} hidden>
                          <input
                            id={progTalk.id + "endtime"}
                            defaultValue={progTalk.endTime}
                            type="text"
                            name={progTalk.id + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={progTalk.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={progTalk.id + "text"}>
                      {progTalk.venue}
                        </span>
                          <span id={progTalk.id + "spanvenue"} hidden>
                          <input
                            id={progTalk.id + "venue"}
                            defaultValue={progTalk.venue}
                            type="text"
                            name={progTalk.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={progTalk.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={progTalk.id + "editbutton"}
                          onClick={(e) => {
                            this.editProgTalk(e, progTalk.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={progTalk.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, progTalk.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={progTalk.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, progTalk.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteProgrammeTalk(e, progTalk.id);
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
        <form onSubmit={this.addProgrammeTalks}>
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
            type="text"
            name="hasRecording"
            placeholder="Has Recording"
            onChange={this.updateInput}
            value={this.state.hasRecording}
            required
          />
          <input
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
            name="link"
            placeholder="Link"
            onChange={this.updateInput}
            value={this.state.link}
            required
          />
          <button type="submit">Add Programme Talk</button>
        </form>
      </div>
    );
  }
}
export default ProgrammeTalkSchedule;
