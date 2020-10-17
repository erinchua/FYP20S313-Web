import React, { Component } from "react";
import fire from "../../config/firebase";
//import "../node_modules/bootstrap/dist/css/bootstrap.css";
import history from "../../config/history";
import firebase from "firebase/app";

class Openhouse extends Component {
  constructor() {
    super();
    this.state = {
      day: "",
      date: "",
      startdate: "",
      enddate: "",
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

  componentDidMount() {
    this.authListener();
    /* const db = fire.firestore();

    const userRef = db.collection("Openhouse").doc("openhouse-003");

    userRef.set({
      id: "openhouse-001",
      day: {
        1: {
          date: "23-Nov-2020",
          startTime: "9:00AM",
          endTime: "6:30PM",
        },
        2: {
          endTime: "7:00PM",
          startTime: "9:00AM",
          date: "24-Nov-2020",
        },
      },
      openhouseTitle: "SIM Openhouse 2020",
    });*/
  }

  display() {
    const db = fire.firestore();

    const userRef = db
      .collection("Openhouse")
      .get()
      .then((snapshot) => {
        const users = [];

        snapshot.forEach((doc) => {
          const daydata = doc.get("day");
          if (Array.isArray(daydata)) {
            for (var i = 0; i < Object.keys(daydata).length; i++) {
              console.log(daydata[i].date);
              console.log(daydata[i].startTime);
              console.log(daydata[i].endTime);
            }
          }
          for (var i = 0; i < Object.keys(daydata).length; i++) {
            const data = {
              day: Object.keys(doc.data().day)[i],
              date: daydata[Object.keys(daydata)[i]].date,
              starttime: daydata[Object.keys(daydata)[i]].startTime,
              endtime: daydata[Object.keys(daydata)[i]].endTime,
              docid: doc.id,
            };
            users.push(data);
            const date = daydata[Object.keys(daydata)[i]].date;
            //   console.log(date);
          }

          /**  for (var i = 0; i < Object.keys(doc.data().day).length; i++) {
            const data = {
              day: Object.keys(doc.data().day)[i],
              date: doc.data().day[i + 1].date,
              starttime: doc.data().day[i + 1].startTime,
              endtime: doc.data().day[i + 1].endTime,
              docid: doc.id,
            };
            users.push(data);
          }*/
        });

        this.setState({ users: users });
      });
  }

  update(e, openhouseid, day) {
    var dateinput = document.getElementById(day + "date").value;
    var starttimeinput = document.getElementById(day + "starttime").value;
    var endttimeinput = document.getElementById(day + "endtime").value;

    const updatedate = "day." + day + ".date";
    const updatestarttime = "day." + day + ".startTime";
    const updateendtime = "day." + day + ".endTime";

    console.log(updatedate);
    const db = fire.firestore();

    const userRef = db
      .collection("Openhouse")
      .doc(openhouseid)
      .update({
        [updatedate]: dateinput,
        [updatestarttime]: starttimeinput,
        [updateendtime]:endttimeinput,
      })
      .then(() => this.onAuthSuccess(e, openhouseid, day));
  }
  onAuthSuccess = (e, openhouseid, day) => {
    alert("Updated");
    window.location.reload();
    this.cancel(e, openhouseid, day);
  };

  edit(e, openhouseid, day) {
    document.getElementById(day + "editbutton").setAttribute("hidden", "");
    document.getElementById(day + "updatebutton").removeAttribute("hidden");
    document.getElementById(day + "cancelbutton").removeAttribute("hidden");

    var inputtoshow = document.getElementsByClassName(
      openhouseid + day + "input"
    );
    var texttohide = document.getElementsByClassName(
      openhouseid + day + "text"
    );
    for (var i = 0; i < inputtoshow.length; i++) {
      inputtoshow[i].removeAttribute("hidden");
      texttohide[i].setAttribute("hidden", "");
    }
  }

  cancel = (e, openhouseid, day) => {
    document.getElementById(day + "editbutton").removeAttribute("hidden");
    document.getElementById(day + "updatebutton").setAttribute("hidden", "");
    document.getElementById(day + "cancelbutton").setAttribute("hidden", "");
    var inputtoshow = document.getElementsByClassName(
      openhouseid + day + "input"
    );
    var texttohide = document.getElementsByClassName(
      openhouseid + day + "text"
    );
    for (var i = 0; i < inputtoshow.length; i++) {
      inputtoshow[i].setAttribute("hidden", "");

      texttohide[i].removeAttribute("hidden");
    }
  };

  render() {
    return (
      <div className="home">
        <div>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th scope="col">Open House </th>
                <th scope="col">Day</th>
                <th scope="col">Date</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
              </tr>
              {this.state.users &&
                this.state.users.map((user) => {
                  return (
                    <tr>
                      <td>{user.docid}</td>
                      <td>{user.day}</td>
                      <td>
                        <span class={user.docid + user.day + "text"}>
                          {user.date}
                        </span>
                        <span class={user.docid + user.day + "input"} hidden>
                          <input
                            defaultValue={user.date}
                            id={user.day + "date"}
                            type="text"
                            class="form-control"
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={user.docid + user.day + "text"}>
                          {user.starttime}
                        </span>
                        <span class={user.docid + user.day + "input"} hidden>
                          <input
                            defaultValue={user.starttime}
                            id={user.day + "starttime"}
                            type="text"
                            class="form-control"
                            required
                          />
                        </span>
                      </td>
                      <td>
                        {" "}
                        <span class={user.docid + user.day + "text"}>
                          {user.endtime}
                        </span>
                        <span class={user.docid + user.day + "input"} hidden>
                          <input
                            defaultValue={user.endtime}
                            id={user.day + "endtime"}
                            type="text"
                            class="form-control"
                            required
                          />
                        </span>{" "}
                      </td>

                      <td>
                        <button
                          id={user.day + "editbutton"}
                          onClick={(e) => {
                            this.edit(e, user.docid, user.day);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={user.day + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, user.docid, user.day);
                          }}
                        >
                          Update
                        </button>
                        <button
                          id={user.day + "cancelbutton"}
                          hidden
                          onClick={(e) => {
                            this.cancel(e, user.docid, user.day);
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
export default Openhouse;