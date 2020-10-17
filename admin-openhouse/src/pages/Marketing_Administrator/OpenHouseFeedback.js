import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class OpenHouseFeedback extends Component {
  constructor() {
    super();
    this.state = {
      attendedDate: "",
      natureOfFeedback: "",
      feedbackDescription: "",
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
      .collection("Feedback")
      .get()
      .then((snapshot) => {
        const feedback = [];
        snapshot.forEach((doc) => {
          const data = {
            attendedDate: doc.data().attendedDate,
            natureOfFeedback: doc.data().natureOfFeedback,
            feedbackDescription: doc.data().feedbackDescription,
            id: doc.id,
            counter: counter,
          };
          counter++;
          feedback.push(data);
        });

        this.setState({ feedback: feedback });
      });
  }


  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered"> 
            <tbody>
              <tr>
                <th scope="col">Attended Open House Date</th>
                <th scope="col">Nature of Feedback</th>
                <th scope="col">Feedback/Comments</th>
              </tr>
              {this.state.feedback &&
                this.state.feedback.map((feedback) => {
                  return (
                    <tr>
                        <td>{feedback.attendedDate}</td>
                        <td>{feedback.natureOfFeedback}</td>
                        <td>{feedback.feedbackDescription}</td>
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
export default OpenHouseFeedback;
