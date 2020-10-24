import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class CommonFAQs extends Component {
  constructor() {
    super();
    this.state = {
      faqAnswer: "",
      faqQuestion: "",
      faqType: "",
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
      .collection("CommonFAQ")
      .get()
      .then((snapshot) => {
        const commonfaq = [];
        snapshot.forEach((doc) => {
          const data = {
            faqAnswer: doc.data().faqAnswer,
            faqQuestion: doc.data().faqQuestion,
            faqType: doc.data().faqType,
            id: doc.id,
            counter: counter,
          };
          counter++;
          commonfaq.push(data);
        });

        this.setState({ commonfaq: commonfaq });
      });
  }

  addCommonFAQ = (e) => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db
      .collection("CommonFAQ")
      .add({
        faqType: this.state.faqType,
        faqQuestion: this.state.faqQuestion,
        faqAnswer: this.state.faqAnswer,
      })
      .then(function () {
        window.location.reload();
      });
  };

  DeleteCommonFAQ(e, commonfaqid) {
    const db = fire.firestore();
    const userRef = db
      .collection("CommonFAQ")
      .doc(commonfaqid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  update(e, commonfaqid) {
    const faqQuestion = document.getElementById(commonfaqid + "faqquestion").value
    const faqAnswer = document.getElementById(commonfaqid + "faqanswer").value

    const db = fire.firestore();
    if (faqQuestion != null && faqAnswer != null) {
      const userRef = db
        .collection("CommonFAQ")
        .doc(commonfaqid)
        .update({
            faqQuestion: faqQuestion,
            faqAnswer: faqAnswer,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    }
  }

  editCommonFAQ(e, commonfaqid) {
    document.getElementById(commonfaqid + "spanfaqquestion").removeAttribute("hidden");
    document.getElementById(commonfaqid + "spanfaqanswer").removeAttribute("hidden");
    document.getElementById(commonfaqid + "editbutton").setAttribute("hidden", "");
    document.getElementById(commonfaqid + "updatebutton").removeAttribute("hidden");
    document.getElementById(commonfaqid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
        commonfaqid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
}

  CancelEdit(e, commonfaqid) {
    document.getElementById(commonfaqid + "spanfaqquestion").setAttribute("hidden", "");
    document.getElementById(commonfaqid + "spanfaqanswer").setAttribute("hidden", "");
    document.getElementById(commonfaqid + "editbutton").removeAttribute("hidden");
    document.getElementById(commonfaqid + "updatebutton").setAttribute("hidden", "");
    document.getElementById(commonfaqid + "cancelbutton").setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(
        commonfaqid + "text"
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
                <th scope="col">Question</th>
                <th scope="col">Answer</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.commonfaq &&
                this.state.commonfaq.map((commonfaq) => {
                  return (
                    <tr>
                        <td>{commonfaq.counter}</td>
                      <td>
                      <span class={commonfaq.id + "text"}>
                      {commonfaq.faqQuestion}
                        </span>
                          
                          <span id={commonfaq.id + "spanfaqquestion"} hidden>
                          <input
                            id={commonfaq.id + "faqquestion"}
                            defaultValue={commonfaq.faqQuestion}
                            type="text"
                            name={commonfaq.id + "faqquestion"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={commonfaq.faqQuestion}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={commonfaq.id + "text"}>
                      {commonfaq.faqAnswer}
                        </span>
                          <span id={commonfaq.id + "spanfaqanswer"} hidden>
                          <input
                            id={commonfaq.id + "faqanswer"}
                            defaultValue={commonfaq.faqAnswer}
                            type="text"
                            name={commonfaq.id + "faqanswer"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={commonfaq.faqAnswer}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                        <button
                          id={commonfaq.id + "editbutton"}
                          onClick={(e) => {
                            this.editCommonFAQ(e, commonfaq.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={commonfaq.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, commonfaq.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={commonfaq.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, commonfaq.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteCommonFAQ(e, commonfaq.id);
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
        <form onSubmit={this.addCommonFAQ}>
          <input
            type="text"
            name="faqType"
            placeholder="Type of FAQ"
            onChange={this.updateInput}
            value={this.state.faqType}
            required
          />
          <input
            type="text"
            name="faqQuestion"
            placeholder="Question"
            onChange={this.updateInput}
            value={this.state.faqQuestion}
            required
          />
          <input
            type="text"
            name="faqAnswer"
            placeholder="Answer"
            onChange={this.updateInput}
            value={this.state.faqAnswer}
            required
          />
          <button type="submit">Add FAQ</button>
        </form>
      </div>
    );
  }
}
export default CommonFAQs;
