import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class GameActivities extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      pointsAward: "",
      startTime: "",
      gameBoothName: "",
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
      .collection("GamesActivities").orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const gameActivities = [];
        snapshot.forEach((doc) => {
          const data = {
            date: doc.data().date,
            pointsAward: doc.data().pointsAward,
            startTime: doc.data().startTime,
            gameBoothName: doc.data().gameBoothName,
            venue: doc.data().venue,
            id: doc.id,
            counter: counter,
          };
          counter++;
          gameActivities.push(data);
        });

        this.setState({ gameActivities: gameActivities });
      });
  }

  addGameActivities = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("GamesActivities")
      .add({
      date: this.state.date,
      pointsAward: this.state.pointsAward,
      startTime: this.state.startTime,
      gameBoothName: this.state.gameBoothName,
      venue: this.state.venue,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteGameActivities(e, gameactivitiesid) {
    const db = fire.firestore();
    const userRef = db
      .collection("GamesActivities")
      .doc(gameactivitiesid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, gameactivitiesid) {
    const gameBoothName = document.getElementById(gameactivitiesid + "gameboothname").value
    const pointsAward = document.getElementById(gameactivitiesid + "pointsaward").value
    const venue = document.getElementById(gameactivitiesid + "venue").value

    const db = fire.firestore();
    if (gameBoothName != null && pointsAward != null && venue != null) {
      const userRef = db
        .collection("GamesActivities")
        .doc(gameactivitiesid)
        .update({
            pointsAward: pointsAward,
            gameBoothName: gameBoothName,
            venue: venue,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editGameActivities(e, gameactivitiesid) {
    document.getElementById(gameactivitiesid + "spangameboothname").removeAttribute("hidden");
    document.getElementById(gameactivitiesid + "spanpointsaward").removeAttribute("hidden");
    document.getElementById(gameactivitiesid + "spanvenue").removeAttribute("hidden");
    document.getElementById(gameactivitiesid + "editbutton").setAttribute("hidden", "");
    document.getElementById(gameactivitiesid + "updatebutton").removeAttribute("hidden");
    document.getElementById(gameactivitiesid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        gameactivitiesid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, gameactivitiesid) {
    document.getElementById(gameactivitiesid + "spangameboothname").setAttribute("hidden", "");
    document.getElementById(gameactivitiesid + "spanpointsaward").setAttribute("hidden", "");
    document.getElementById(gameactivitiesid + "spanvenue").setAttribute("hidden", "");
    document.getElementById(gameactivitiesid + "editbutton").removeAttribute("hidden");
    document.getElementById(gameactivitiesid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(gameactivitiesid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        gameactivitiesid + "text"
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
                <th scope="col">Booth No.</th>
                <th scope="col">Booth Name</th>
                <th scope="col">Venue</th>
                <th scope="col">Points</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.gameActivities &&
                this.state.gameActivities.map((gameActivities) => {
                  return (
                    <tr>
                        <td>{gameActivities.counter}</td>
                      <td>
                      <span class={gameActivities.id + "text"}>
                      {gameActivities.gameBoothName}
                        </span>
                          
                          <span id={gameActivities.id + "spangameboothname"} hidden>
                          <input
                            id={gameActivities.id + "gameboothname"}
                            defaultValue={gameActivities.gameBoothName}
                            type="text"
                            name={gameActivities.id + "gameboothname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={gameActivities.gameBoothName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={gameActivities.id + "text"}>
                      {gameActivities.venue}
                        </span>
                          <span id={gameActivities.id + "spanvenue"} hidden>
                          <input
                            id={gameActivities.id + "venue"}
                            defaultValue={gameActivities.venue}
                            type="text"
                            name={gameActivities.id + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={gameActivities.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={gameActivities.id + "text"}>
                      {gameActivities.pointsAward}
                        </span>
                          <span id={gameActivities.id + "spanpointsaward"} hidden>
                          <input
                            id={gameActivities.id + "pointsaward"}
                            defaultValue={gameActivities.pointsAward}
                            type="text"
                            name={gameActivities.id + "pointsaward"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={gameActivities.pointsAward}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={gameActivities.id + "editbutton"}
                          onClick={(e) => {
                            this.editGameActivities(e, gameActivities.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={gameActivities.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, gameActivities.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={gameActivities.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, gameActivities.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteGameActivities(e, gameActivities.id);
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
        <form onSubmit={this.addGameActivities}>
          <input
            type="text"
            name="gameBoothName"
            placeholder="Game Booth Name"
            onChange={this.updateInput}
            value={this.state.gameBoothName}
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
            name="pointsAward"
            placeholder="Points"
            onChange={this.updateInput}
            value={this.state.pointsAward}
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
          <button type="submit">Add Game Activities</button>
        </form>
      </div>
    );
  }
}
export default GameActivities;
