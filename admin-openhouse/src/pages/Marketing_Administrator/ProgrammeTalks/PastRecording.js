import { faOldRepublic } from "@fortawesome/free-brands-svg-icons";
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

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
      Link: "",
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

  display= () => {
    var getYear = new Date().getFullYear();
    console.log(getYear);
    
              const db = fire.firestore();
              const pastrecording = [];
              const userRef = db
              .collection("ProgrammeTalks")
               .get()
                .then((snapshot) => {
                  
                  snapshot.forEach((doc) => {
                    
                    pastrecording.push(doc.data().date);
                  
                  });
          
                  console.log(pastrecording);
                  
                  function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                  }
               
                 var unique = pastrecording.filter(onlyUnique);
                  console.log(unique);
               //day1
               const day1date = [];
               day1date.push(unique[0]);
               this.setState({ day1date: day1date });
                const day1  = db
                .collection("ProgrammeTalks").where("date", "==", unique[0])
                .where("hasRecording", "==", true)
                  .get()
                  .then((snapshot) => {
                    const pastrecording = [];
                    snapshot.forEach((doc) => {
                      const data = {
                        docid : doc.id,
                        id: doc.data().id,
                        talkName:doc.data().talkName,
                        awardingUni : doc.data().awardingUni,
                        startTime:  doc.data().startTime,     
                        endTime: doc.data().endTime,
                        venue: doc.data().venue,
                        capacityLimit: doc.data().capacityLimit,
                        noRegistered: doc.data().noRegistered,
                        hasRecording: doc.data().hasRecording.toString(),
                        Link : doc.data().Link,
                        isLive: doc.data().isLive.toString(),
                   };
                   pastrecording.push(data);
                   
                    
                    });
   
                 
                    
                    this.setState({ day1: pastrecording });
                                    
                  });
                  //day 2
                  const day2date = [];
                  day2date.push(unique[1]);
                  this.setState({ day2date: day2date });
                  const day2  = db
                  .collection("ProgrammeTalks").where("date", "==", unique[1])
                  .where("hasRecording", "==", true)
                    .get()
                    .then((snapshot) => {
                      const pastrecording = [];
                      snapshot.forEach((doc) => {
                        const data = {
                          docid : doc.id,
                          id: doc.data().id,
                          talkName:doc.data().talkName,
                          awardingUni : doc.data().awardingUni,
                          startTime:  doc.data().startTime,     
                          endTime: doc.data().endTime,
                          venue: doc.data().venue,
                          capacityLimit: doc.data().capacityLimit,
                          noRegistered: doc.data().noRegistered,
                          hasRecording: doc.data().hasRecording.toString(),
                          Link : doc.data().Link,
                          isLive: doc.data().isLive.toString(),
                       
                        };
                        pastrecording.push(data);
                    
                      
                      });
                      this.setState({ day2: pastrecording });
                    
                    });

                });
  
  
               
            }

  addPastRecording = (e) => {
    e.preventDefault();
    var recordingvalue = document.getElementById("recordingvalue");
    var livestatus = document.getElementById("livestatus");
     recordingvalue = recordingvalue.options[recordingvalue.selectedIndex].value;
     livestatus = livestatus.options[livestatus.selectedIndex].value;
    recordingvalue = (recordingvalue === "true");
   livestatus = (livestatus === "true");

    const db = fire.firestore();
      var lastdoc = db.collection("ProgrammeTalks").orderBy('id','desc')
      .limit(1).get().then((snapshot) =>  {
        snapshot.forEach((doc) => {
  var docid= "";
          var res = doc.data().id.substring(5, 10);
        var id = parseInt(res)
        if(id.toString().length <= 1){
          docid= "talk-00" + (id +1) 
          }
          else if(id.toString().length <= 2){
            docid= "talk-0" + (id +1) 
            }
          else{
            docid="talk-0" + (id +1) 
          }
          const userRef = db
          .collection("ProgrammeTalks")
          .doc(docid)
          .set({
          awardingUni: this.state.awardingUni,
          capacityLimit: this.state.capacityLimit,
          date: this.state.date,
          endTime: this.state.endTime,
          hasRecording: recordingvalue,
          isLive: livestatus,
          noRegistered: this.state.noRegistered,
          startTime: this.state.startTime,
          talkName: this.state.talkName,
          venue: this.state.venue,
          Link: this.state.Link,
          id: docid,
          })
          .then(function () {
            window.location.reload();
          });
        })
      })
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
        {/* day1 */}
        <div>
        {this.state.day1date &&
                this.state.day1date.map((day1) => {
                  return (
                    <p>{day1}</p>
                  )})}
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
              {this.state.day1 &&
                this.state.day1.map((day1, index) => {
                  return (
                    <tr>
                        <td>{index+1}</td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.talkName}
                        </span>
                          <span id={day1.docid + "spantalkname"} hidden>
                          <input
                            id={day1.docid + "talkname"}
                            defaultValue={day1.talkName}
                            type="text"
                            name={day1.docid + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.awardingUni}
                        </span>
                          <span id={day1.docid + "spanawarduni"} hidden>
                          <input
                            id={day1.docid + "awarduni"}
                            defaultValue={day1.awardingUni}
                            type="text"
                            name={day1.docid + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.startTime}
                        </span>
                          <span id={day1.docid + "spanstarttime"} hidden>
                          <input
                            id={day1.docid + "starttime"}
                            defaultValue={day1.startTime}
                            type="text"
                            name={day1.docid + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.endTime}
                        </span>
                          <span id={day1.docid + "spanendtime"} hidden>
                          <input
                            id={day1.docid + "endtime"}
                            defaultValue={day1.endTime}
                            type="text"
                            name={day1.docid + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.venue}
                        </span>
                          <span id={day1.docid + "spanvenue"} hidden>
                          <input
                            id={day1.docid + "venue"}
                            defaultValue={day1.venue}
                            type="text"
                            name={day1.docid + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.Link}
                        </span>
                          
                          <span id={day1.docid + "spanlink"} hidden>
                          <input
                            id={day1.docid + "link"}
                            defaultValue={day1.Link}
                            type="text"
                            name={day1.docid + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.Link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button
                          id={day1.docid + "editbutton"}
                          onClick={(e) => {
                            this.editPastRecording(e, day1.docid);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={day1.docid + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, day1.docid);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={day1.docid + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, day1.docid);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeletePastRecording(e, day1.docid);
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
        <div>
          {/* day2 */}
        {this.state.day2date &&
                this.state.day2date.map((day2) => {
                  return (
                    <p>{day2}</p>
                  )})}
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
              {this.state.day2 &&
                this.state.day2.map((day2,index) => {
                  return (
                    <tr>
                        <td>{index+1}</td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.talkName}
                        </span>
                          
                          <span id={day2.docid + "spantalkname"} hidden>
                          <input
                            id={day2.docid + "talkname"}
                            defaultValue={day2.talkName}
                            type="text"
                            name={day2.docid + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.awardingUni}
                        </span>
                          <span id={day2.docid + "spanawarduni"} hidden>
                          <input
                            id={day2.docid + "awarduni"}
                            defaultValue={day2.awardingUni}
                            type="text"
                            name={day2.docid + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.startTime}
                        </span>
                          <span id={day2.docid + "spanstarttime"} hidden>
                          <input
                            id={day2.docid + "starttime"}
                            defaultValue={day2.startTime}
                            type="text"
                            name={day2.docid + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.endTime}
                        </span>
                          <span id={day2.docid + "spanendtime"} hidden>
                          <input
                            id={day2.docid + "endtime"}
                            defaultValue={day2.endTime}
                            type="text"
                            name={day2.docid + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.venue}
                        </span>
                          <span id={day2.docid + "spanvenue"} hidden>
                          <input
                            id={day2.docid + "venue"}
                            defaultValue={day2.venue}
                            type="text"
                            name={day2.docid + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.Link}
                        </span>
                          
                          <span id={day2.docid + "spanlink"} hidden>
                          <input
                            id={day2.docid + "link"}
                            defaultValue={day2.Link}
                            type="text"
                            name={day2.docid + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.Link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button
                          id={day2.docid + "editbutton"}
                          onClick={(e) => {
                            this.editLiveTalk(e, day2.docid);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={day2.docid + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, day2.docid);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={day2.docid + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, day2.docid);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteLiveTalk(e, day2.docid);
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
          <select id = "recordingvalue" required>

<option disabled selected value></option>
<option value="true">true</option>
<option value="false">false</option>

</select>

<select id = "livestatus" required>
<option disabled selected value></option>
            <option value="true">true</option>
            <option value="false">false</option>
        
          </select>
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
