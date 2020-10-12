import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";

import Navbar from "../../components/Navbar";


class SAHome extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      administratorType: "",
      email: "",
      fullname: "",
      password: "",
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
            if (doc.data().administratorType === "Super Administrator") {
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

  DeleteUser(e, administratorid) {
    const db = fire.firestore();

    const userRef = db
      .collection("Administrators")
      .doc(administratorid)
      .delete()
      .then(function () {
        alert("Deleted");
        window.location.reload();
      });
  }

  addUser = (e) => {
    e.preventDefault();
    firecreate
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((useraction) => {
        const db = fire.firestore();

        const userRef = db
          .collection("Administrators")
          .add({
            administratorType: this.state.administratorType,
            email: this.state.email,
            name: this.state.fullname,
            password: this.state.password,
          })
          .then(function () {
            alert("Added");
            window.location.reload();
          });
        this.setState({
          fullname: "",
          email: "",
        });
      });
  };
  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();

    const userRef = db
      .collection("Administrators")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          const data = {
            administratorType: doc.data().administratorType,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data.password,
            id: doc.id,
          };
          users.push(data);
        });

        this.setState({ users: users });
      });
  }
  changepasswordpage = () => {
    history.push("/ChangePassword");
  };
  logout() {
    fire.auth().signOut();
    history.push("/Login");
  }

  render() {
    return (
      <div className="home">
        <Navbar />

        <div>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Type of User</th>
              </tr>
              {this.state.users &&
                this.state.users.map((user) => {
                  return (
                    <tr>
                      <td>{user.id} </td>

                      <td>{user.name} </td>
                      <td>{user.email} </td>
                      <td>{user.administratorType} </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteUser(e, user.id);
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
        <form onSubmit={this.addUser}>
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            onChange={this.updateInput}
            value={this.state.fullname}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={this.updateInput}
            value={this.state.email}
            required
          />
          <input
            type="text"
            name="administratorType"
            placeholder="Type of User"
            onChange={this.updateInput}
            value={this.state.administratorType}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.updateInput}
            value={this.state.password}
            required
          />
          <button type="submit">Add User</button>
        </form>
        <button onClick={this.changepasswordpage}>Change Password</button>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}
export default SAHome;
