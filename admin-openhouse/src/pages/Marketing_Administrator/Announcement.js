import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class Announcement extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      announcementTitle: "",
      Description: "",
      Date: "",
      Time: "",
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
      .collection("Announcements")
      .get()
      .then((snapshot) => {
        const announcement = [];
        snapshot.forEach((doc) => {
          const data = {
            announcementTitle: doc.data().announcementTitle,
            Description: doc.data().Description,
            Date: doc.data().Date,
            Time: doc.data().Time,
            id: doc.id,
          };
          announcement.push(data);
        });

        this.setState({ announcement: announcement });
      });
  }
  
  addAnnouncement = (e) => {
    e.preventDefault();
    const db = fire.firestore();

    const userRef = db
      .collection("Announcements")
      .add({
        announcementTitle: this.state.announcementTitle,
        Date: this.state.Date,
        Time: this.state.Time,
        Description: this.state.Description,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteAnnouncement(e, announcementid) {
    const db = fire.firestore();
    const userRef = db
      .collection("Announcements")
      .doc(announcementid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, announcementid) {
    const announcementTitle = document.getElementById(announcementid + "title").value
    const Date = document.getElementById(announcementid + "date").value
    const Time = document.getElementById(announcementid + "time").value
    const Description = document.getElementById(announcementid + "description").value

    const db = fire.firestore();
    if (announcementTitle != null && Date != null && Time != null && Description != null) {
      const userRef = db
        .collection("Announcements")
        .doc(announcementid)
        .update({
            announcementTitle: announcementTitle,
          Date: Date,
          Time: Time,
          Description: Description,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editAnnouncement(e, announcementid) {
    document.getElementById(announcementid + "spantitle").removeAttribute("hidden");
    document.getElementById(announcementid + "spandate").removeAttribute("hidden");
    document.getElementById(announcementid + "spantime").removeAttribute("hidden");
    document.getElementById(announcementid + "spandescription").removeAttribute("hidden");
    document.getElementById(announcementid + "editbutton").setAttribute("hidden", "");
    document.getElementById(announcementid + "updatebutton").removeAttribute("hidden");
    document.getElementById(announcementid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        announcementid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, announcementid) {
    document.getElementById(announcementid + "spantitle").setAttribute("hidden", "");
    document.getElementById(announcementid + "spandate").setAttribute("hidden", "");
    document.getElementById(announcementid + "spantime").setAttribute("hidden", "");
    document.getElementById(announcementid + "spandescription").setAttribute("hidden", "");
    document.getElementById(announcementid + "editbutton").removeAttribute("hidden");
    document.getElementById(announcementid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(announcementid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        announcementid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
}

  logout() {
    fire.auth().signOut();
    history.push("/Login");
    window.location.reload();
  }

  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <tr>
              <th scope="col">Announcement Title</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Description</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.announcement &&
                this.state.announcement.map((announcement) => {
                  return (
                    <tr>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.announcementTitle} 
                        </span>  
                          <span id={announcement.id + "spantitle"} hidden>
                          <input
                            id={announcement.id + "title"}
                            defaultValue={announcement.announcementTitle}
                            type="text"
                            name={announcement.id + "title"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.announcementTitle}
                            required
                          />
                        </span>
                        </td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Date} 
                        </span>  
                          <span id={announcement.id + "spandate"} hidden>
                          <input
                            id={announcement.id + "date"}
                            defaultValue={announcement.Date}
                            type="date"
                            name={announcement.id + "date"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Date}
                            required
                          />
                        </span>
                        </td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Time}
                        </span>  
                          <span id={announcement.id + "spantime"} hidden>
                          <input
                            id={announcement.id + "time"}
                            defaultValue={announcement.Time}
                            type="time"
                            name={announcement.id + "time"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Time}
                            required
                          />
                        </span></td>
                      <td>
                      <span class={announcement.id + "text"}>
                      {announcement.Description}
                        </span>  
                          <span id={announcement.id + "spandescription"} hidden>
                          <input
                            id={announcement.id + "description"}
                            defaultValue={announcement.Description}
                            type="text"
                            name={announcement.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={announcement.Description}
                            required
                          />
                        </span>
                        </td>
                      <td>
                        <button
                          id={announcement.id + "editbutton"}
                          onClick={(e) => {
                            this.editAnnouncement(e, announcement.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={announcement.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, announcement.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={announcement.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, announcement.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteAnnouncement(e, announcement.id);
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
        <form onSubmit={this.addAnnouncement}>
          <input
            type="text"
            name="announcementTitle"
            placeholder="Announcement Title"
            onChange={this.updateInput}
            value={this.state.announcementTitle}
            required
          />
          <input
            type="date"
            name="Date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.Date}
            required
          />
          <input
            type="time"
            name="Time"
            placeholder="Time"
            onChange={this.updateInput}
            value={this.state.Time}
            required
          />
          <input
            type="text"
            name="Description"
            placeholder="Description"
            onChange={this.updateInput}
            value={this.state.Description}
            required
          />
          <button type="submit">Add Announcement</button>
        </form>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}
export default Announcement;