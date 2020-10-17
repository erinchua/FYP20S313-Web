import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class Prizes extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      prizePointsCost: "",
      prizeName: "",
      isRedeemed: "",
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
      .collection("Prizes").orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const prize = [];
        snapshot.forEach((doc) => {
          const data = {
            date: doc.data().date,
            prizePointsCost: doc.data().prizePointsCost,
            prizeName: doc.data().prizeName,
            isRedeemed: doc.data().isRedeemed,
            id: doc.id,
            counter: counter,
          };
          counter++;
          prize.push(data);
        });

        this.setState({ prize: prize });
      });
  }

  addPrize = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("Prizes")
      .add({
      date: this.state.date,
      prizePointsCost: this.state.prizePointsCost,
      prizeName: this.state.prizeName,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeletePrize(e, prizeid) {
    const db = fire.firestore();
    const userRef = db
      .collection("Prizes")
      .doc(prizeid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, prizeid) {
    const prizeName = document.getElementById(prizeid + "prizename").value
    const prizePointsCost = document.getElementById(prizeid + "prizepointscost").value

    const db = fire.firestore();
    if (prizeName != null && prizePointsCost != null) {
      const userRef = db
        .collection("Prizes")
        .doc(prizeid)
        .update({
            prizeName: prizeName,
            prizePointsCost: prizePointsCost,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editPrize(e, prizeid) {
    document.getElementById(prizeid + "spanprizename").removeAttribute("hidden");
    document.getElementById(prizeid + "spanprizepointscost").removeAttribute("hidden");
    document.getElementById(prizeid + "editbutton").setAttribute("hidden", "");
    document.getElementById(prizeid + "updatebutton").removeAttribute("hidden");
    document.getElementById(prizeid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        prizeid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, prizeid) {
    document.getElementById(prizeid + "spanprizename").setAttribute("hidden", "");
    document.getElementById(prizeid + "spanprizepointscost").setAttribute("hidden", "");
    document.getElementById(prizeid + "editbutton").removeAttribute("hidden");
    document.getElementById(prizeid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(prizeid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        prizeid + "text"
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
                <th scope="col">Prize No.</th>
                <th scope="col">Prize</th>
                <th scope="col">Points</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.prize &&
                this.state.prize.map((prize) => {
                  return (
                    <tr>
                        <td>{prize.counter}</td>
                      <td>
                      <span class={prize.id + "text"}>
                      {prize.prizeName}
                        </span>
                          
                          <span id={prize.id + "spanprizename"} hidden>
                          <input
                            id={prize.id + "prizename"}
                            defaultValue={prize.prizeName}
                            type="text"
                            name={prize.id + "prizename"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prize.prizeName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={prize.id + "text"}>
                      {prize.prizePointsCost}
                        </span>
                          <span id={prize.id + "spanprizepointscost"} hidden>
                          <input
                            id={prize.id + "prizepointscost"}
                            defaultValue={prize.prizePointsCost}
                            type="text"
                            name={prize.id + "prizepointscost"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prize.prizePointsCost}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={prize.id + "editbutton"}
                          onClick={(e) => {
                            this.editPrize(e, prize.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={prize.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, prize.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={prize.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, prize.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeletePrize(e, prize.id);
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
        <form onSubmit={this.addPrize}>
          <input
            type="text"
            name="prizeName"
            placeholder="Prize Name"
            onChange={this.updateInput}
            value={this.state.prizeName}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.date}
            required
          />
          <input
            type="text"
            name="prizePointsCost"
            placeholder="Prize Points Cost"
            onChange={this.updateInput}
            value={this.state.prizePointsCost}
            required
          />
          <button type="submit">Add Prize</button>
        </form>
      </div>
    );
  }
}
export default Prizes;
