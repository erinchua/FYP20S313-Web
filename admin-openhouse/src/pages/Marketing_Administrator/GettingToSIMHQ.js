import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class GettingToSIMHQ extends Component {
  constructor() {
    super();
    this.state = {
      carDescription: "",
      carParkingDescription: "",
      modeOfTransport: "",
      busNo: "",
      nearestMRT: "",
      url: "",
      progress: "",
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
    //this.authListener();
    this.display();
  }

  display() {
    const db = fire.firestore();

    //Map Image File
    const image = db
      .collection("CampusLocation")
      .doc("map")
      .get()
      .then((snapshot) => {
        const maparray = [];
        const image = snapshot.data();
        const data = {
          url: image.url,
        };
        maparray.push(data);
        this.setState({ maparr: maparray });
      });

    //car
    const car = db
      .collection("CampusLocation")
      .doc("car")
      .get()
      .then((snapshot) => {
        const cararray = [];
        const car = snapshot.data();
        const data = {
          carDescription: car.carDescription,
        };
        cararray.push(data);
        this.setState({ cararr: cararray });
      });
    //bus
    const bust = db
      .collection("CampusLocation")
      .doc("bus")
      .get()
      .then((snapshot) => {
        const busarray = [];

        const data = {
          busid: snapshot.id,
          oppSimHq: snapshot.data().oppSimHq,
          simHq: snapshot.data().simHq,
        };
        busarray.push(data);
        console.log(busarray);
        this.setState(() => ({ busarray: busarray }));
      });

    //mrt
    const mrt = db
      .collection("CampusLocation")
      .doc("mrt")
      .get()
      .then((snapshot) => {
        const mrtarray = [];

        const data = {
          mrtid: snapshot.id,
          downtownLine: snapshot.data().downtownLine,
          eastwestLine: snapshot.data().eastwestLine,
        };
        mrtarray.push(data);
        this.setState(() => ({ mrtarr: mrtarray }));
      });

    //carpark
    const carpark = db
      .collection("CampusLocation")
      .doc("car")
      .get()
      .then((snapshot) => {
        const carparkarray = [];
        const carpark = snapshot.data();
        const data = {
          carparkDescription: carpark.carParkingDescription,
        };
        carparkarray.push(data);
        this.setState({ carparkarr: carparkarray });
      });
  }

  carupdate = (e, locationid) => {
    var value = document.getElementById(locationid + "carDes").value;
    if (value !== "") {
      value = document.getElementById(locationid + "carDes").value;
      const db = fire.firestore();

      const userRef = db
        .collection("CampusLocation")
        .doc("car")
        .update({
          carDescription: value,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    } else {
      alert("Fields cannot be empty ");
    }
  };

  busupdate = (e, locationid) => {
    const dbfiled = "busNo." + locationid;
    var value = document.getElementById(locationid + "busno").value;
    if (value !== "") {
      value = document.getElementById(locationid + "busno").value;
      const db = fire.firestore();

      const userRef = db
        .collection("CampusLocation")
        .doc("bus")
        .update({
          [dbfiled]: value,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    } else {
      alert("Fields cannot be empty ");
    }
  };

  mrtupdate = (e, locationid) => {
    var value = document.getElementById(locationid + "nearmrt").value;
    if (value !== "") {
      value = document.getElementById(locationid + "nearmrt").value;
      var dbfield = "mrt." + locationid;
      const db = fire.firestore();

      const userRef = db
        .collection("CampusLocation")
        .doc("mrt")
        .update({
          [dbfield]: value,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    } else {
      alert("Fields cannot be empty ");
    }
  };
  carparkupdate = (e, locationid) => {
    var value = document.getElementById("carparkinput").value;
    if (value !== "") {
      value = document.getElementById("carparkinput").value;
      const db = fire.firestore();

      const userRef = db
        .collection("CampusLocation")
        .doc("car")
        .update({
          carparkDescription: value,
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
    } else {
      alert("Fields cannot be empty ");
    }
  };

  editLocation(e, locationid, type) {
    if (type === "mapImage") {
      document.getElementById(locationid + "upload").removeAttribute("hidden");
      document
        .getElementById(locationid + "spanimagelink")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "car") {
      document
        .getElementById(locationid + "spancardes")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
    if (type === "bus") {
      document
        .getElementById(locationid + "spanbusno")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
    if (type === "mrt") {
      document
        .getElementById(locationid + "spannearmrt")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
    if (type === "carpark") {
      document.getElementById("carparkspan").removeAttribute("hidden");
      document.getElementById("carparkeditbutton").setAttribute("hidden", "");
      document.getElementById("carparkupdatebutton").removeAttribute("hidden");
      document.getElementById("carparkcancelbutton").removeAttribute("hidden");
      var texttohide = document.getElementsByClassName("carparktext");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
  }

  CancelEdit(e, locationid, type) {
    if (type === "mapImage") {
      document.getElementById(locationid + "upload").setAttribute("hidden", "");
      document
        .getElementById(locationid + "spanimagelink")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }

    if (type === "car") {
      document
        .getElementById(locationid + "spancardes")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if (type === "bus") {
      document
        .getElementById(locationid + "spanbusno")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if (type === "mrt") {
      document
        .getElementById(locationid + "spannearmrt")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "editbutton")
        .removeAttribute("hidden");
      document
        .getElementById(locationid + "updatebutton")
        .setAttribute("hidden", "");
      document
        .getElementById(locationid + "cancelbutton")
        .setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(locationid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if (type === "carpark") {
      document.getElementById("carparkspan").setAttribute("hidden", "");
      document.getElementById("carparkeditbutton").removeAttribute("hidden");
      document.getElementById("carparkupdatebutton").setAttribute("hidden", "");
      document.getElementById("carparkcancelbutton").setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName("carparktext");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
  }

  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };
  handleSave = (mapImage) => {
    const parentthis = this;
    const db = fire.firestore();

    if (this.state.files !== undefined) {
      const foldername = "Map";
      const file = this.state.files[0];
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef
        .child(this.state.files[0].name)
        .put(this.state.files[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          const userRef = db
            .collection("CampusLocation")
            .doc("mapImage")
            .update({
              URL: downloadURL,
            })
            .then(function () {
              alert("Updated");
              window.location.reload();
            });
        });
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (progress != "100") {
          parentthis.setState({ progress: progress });
        } else {
          parentthis.setState({ progress: "Uploaded!" });
        }
      });
      console.log();
    } else {
      alert("No Files Selected");
    }
  };

  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              {this.state.maparr &&
                this.state.maparr.map((image) => {
                  return (
                    <tr>
                      <td>Map Image File</td>
                      <td>
                        <span class={image.id + "text"}>{image.URL}</span>
                        <span id={image.id + "spanimagelink"} hidden>
                          <input
                            id={image.id + "imagelink"}
                            defaultValue={image.URL}
                            type="text"
                            name={image.id + "imagelink"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={image.URL}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={image.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>{" "}
                      </td>
                      <td>
                        <button
                          id={image.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, image.id, "mapImage");
                          }}
                        >
                          Browse
                        </button>
                        <button
                          id={image.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleSave(image.id);
                          }}
                        >
                          Save
                        </button>
                        <button
                          hidden
                          id={image.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, image.id, "mapImage");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <h5>By Car</h5>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Information</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.cararr &&
                this.state.cararr.map((car, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <span class={car.id + "text"}>
                          {car.carDescription}
                        </span>

                        <span id={car.id + "spancardes"} hidden>
                          <input
                            id={car.id + "carDes"}
                            defaultValue={car.carDescription}
                            type="text"
                            name={car.id + "carDes"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={car.carDescription}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <button
                          id={car.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, car.id, "car");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={car.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.carupdate(e, car.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={car.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, car.id, "car");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <h5>By Bus</h5>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Location</th>
                <th scope="col">Bus Number</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.busarray &&
                this.state.busarray.map((bus, index) => {
                  return (
                    <tr>
                      <td>{index + 1} </td>
                      <td>
                        <tr>SIM HQ</tr>
                        <tr>12091</tr>
                        <tr>Clementi Road</tr>
                      </td>

                      <td>
                        {bus.simHq.bus1},{bus.simHq.bus2},{bus.simHq.bus3},
                        {bus.simHq.bus4},{bus.simHq.bus5},{bus.simHq.bus6},
                        {bus.simHq.bus7},{bus.simHq.bus8},{bus.simHq.bus9},
                        {bus.simHq.bus10}
                        {/* <span class={bus.busid + "text"}>{bus.busno}</span>
                          <span id={bus.busid + "spanbusno"} hidden>
                            <input
                              id={bus.busid + "busno"}
                              defaultValue={bus.busno}
                              type="text"
                              name={bus.busid + "busno"}
                              class="form-control"
                              aria-describedby="emailHelp"
                              placeholder={bus.busNo}
                              required
                            />
                    </span>{" "}*/}
                      </td>

                      <td>
                        {/*<button
                            id={bus.busid + "editbutton"}
                            onClick={(e) => {
                              this.editLocation(e, bus.busid, "bus");
                            }}
                          >
                            Edit
                          </button>

                          <button
                            id={bus.busid + "updatebutton"}
                            hidden
                            onClick={(e) => {
                              this.busupdate(e, bus.busid);
                            }}
                          >
                            Update
                          </button>
                          <button
                            hidden
                            id={bus.busid + "cancelbutton"}
                            onClick={(e) => {
                              this.CancelEdit(e, bus.busid, "bus");
                            }}
                          >
                            Cancel
                          </button>*/}
                      </td>
                    </tr>
                  );
                })}
              {this.state.busarray &&
                this.state.busarray.map((bus, index) => {
                  return (
                    <tr>
                      <td>{index + 2} </td>
                      <td>
                        <tr>SIM HQ</tr>
                        <tr>12099</tr>
                        <tr>Clementi Road</tr>
                      </td>

                      <td>
                        {bus.oppSimHq.bus1},{bus.oppSimHq.bus2},
                        {bus.oppSimHq.bus3},{bus.oppSimHq.bus4},
                        {bus.oppSimHq.bus5},{bus.oppSimHq.bus6},
                        {bus.oppSimHq.bus7},{bus.oppSimHq.bus8},
                        {bus.oppSimHq.bus9}
                        {/* <span class={bus.busid + "text"}>{bus.busno}</span>
                          <span id={bus.busid + "spanbusno"} hidden>
                            <input
                              id={bus.busid + "busno"}
                              defaultValue={bus.busno}
                              type="text"
                              name={bus.busid + "busno"}
                              class="form-control"
                              aria-describedby="emailHelp"
                              placeholder={bus.busNo}
                              required
                            />
                    </span>{" "}*/}
                      </td>

                      <td>
                        {/*<button
                            id={bus.busid + "editbutton"}
                            onClick={(e) => {
                              this.editLocation(e, bus.busid, "bus");
                            }}
                          >
                            Edit
                          </button>

                          <button
                            id={bus.busid + "updatebutton"}
                            hidden
                            onClick={(e) => {
                              this.busupdate(e, bus.busid);
                            }}
                          >
                            Update
                          </button>
                          <button
                            hidden
                            id={bus.busid + "cancelbutton"}
                            onClick={(e) => {
                              this.CancelEdit(e, bus.busid, "bus");
                            }}
                          >
                            Cancel
                          </button>*/}
                      </td>
                    </tr>
                  );
                })}
              <h5>By MRT</h5>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">MRT line</th>
                <th scope="col">Nearest MRT</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.mrtarr &&
                this.state.mrtarr.map((mrt, index) => {
                  return (
                    <tr>
                      <td>{index + 1} </td>
                      <td>
                        Downtown Line
                        {/*  <span class={mrt.id + "text"}>{mrt.nearestMRT}</span>

                        <span id={mrt.id + "spannearmrt"} hidden>
                          <input
                            id={mrt.id + "nearmrt"}
                            defaultValue={mrt.nearestMRT}
                            type="text"
                            name={mrt.id + "nearmrt"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={mrt.nearestMRT}
                            required
                          />
                  </span>*/}
                      </td>
                      <td>
                        <tr>{mrt.downtownLine.station1}</tr>
                        <tr>{mrt.downtownLine.station2}</tr>
                        <tr>{mrt.downtownLine.station3}</tr>{" "}
                      </td>
                      <td>
                        {/*  <button
                          id={mrt.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, mrt.id, "mrt");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={mrt.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.mrtupdate(e, mrt.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={mrt.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, mrt.id, "mrt");
                          }}
                        >
                          Cancel
                        </button>*/}
                      </td>
                    </tr>
                  );
                })}
              {this.state.mrtarr &&
                this.state.mrtarr.map((mrt, index) => {
                  return (
                    <tr>
                      <td>{index + 2} </td>
                      <td>
                        East West Line
                        {/*  <span class={mrt.id + "text"}>{mrt.nearestMRT}</span>

                        <span id={mrt.id + "spannearmrt"} hidden>
                          <input
                            id={mrt.id + "nearmrt"}
                            defaultValue={mrt.nearestMRT}
                            type="text"
                            name={mrt.id + "nearmrt"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={mrt.nearestMRT}
                            required
                          />
                  </span>*/}
                      </td>
                      <td>
                        <tr>{mrt.eastwestLine.station1}</tr>
                        <tr>{mrt.eastwestLine.station2}</tr>
                        <tr></tr>
                      </td>
                      <td>
                        {/*  <button
                          id={mrt.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, mrt.id, "mrt");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={mrt.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.mrtupdate(e, mrt.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={mrt.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, mrt.id, "mrt");
                          }}
                        >
                          Cancel
                        </button>*/}
                      </td>
                    </tr>
                  );
                })}
              <h5>Car Park Info</h5>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Car Park Information</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.carparkarr &&
                this.state.carparkarr.map((carpark, index) => {
                  return (
                    <tr>
                      <td>{index + 1} </td>
                      <td>
                        <span class="carparktext">
                          {carpark.carparkDescription}
                        </span>

                        <span id={"carparkspan"} hidden>
                          <input
                            id="carparkinput"
                            defaultValue={carpark.carparkDescription}
                            type="text"
                            name={carpark.id + "carpark"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={carpark.carparkDescription}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <button
                          id="carparkeditbutton"
                          onClick={(e) => {
                            this.editLocation(e, carpark.id, "carpark");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={"carparkupdatebutton"}
                          hidden
                          onClick={(e) => {
                            this.carparkupdate(e, carpark.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={"carparkcancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, carpark.id, "carpark");
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
export default GettingToSIMHQ;