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
      .collection("CampusLocation").doc("bus")
      .get()
      .then((snapshot) => {
        //const location = [];
        console.log(snapshot.data());
        const bus = snapshot.data();
        console.log(Object.keys(bus.busNo)[0])
        console.log(Object.keys(bus.busNo)[1])
        for (var i = 0; i <Object.keys(bus.busNo).length; i++) {

        console.log(Object.keys(bus.busNo)[0])
        }
         /* const data = {
            carDescription: doc.data().carDescription,
            carParkingDescription: doc.data().carParkingDescription,
            modeOfTransport: doc.data().modeOfTransport,
            busNo: doc.data().busNo,
            nearestMRT: doc.data().nearestMRT,
            id: doc.id,
            counter : counter,
          };*/
          counter++;
          //location.push(data); 
    

        //this.setState({ location: location });
      });
  }

  carupdate= (e, locationid) => {
    var value = document.getElementById(locationid + "carDes").value;
    if(value !== ""  ){
    value = document.getElementById(locationid + "carDes").value;
    const db = fire.firestore();
     
      const userRef = db
        .collection("CampusLocation")
        .doc(locationid)
        .update({
         carDescription: value
        
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
        
    }else{
    alert("Fields cannot be empty ");
    }
    
  }

  busupdate= (e, locationid) => {
    var value = document.getElementById(locationid + "busno").value;
    if(value !== ""  ){
    value = document.getElementById(locationid + "busno").value;
    const db = fire.firestore();
     
      const userRef = db
        .collection("CampusLocation")
        .doc(locationid)
        .update({
         busNo: value
        
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
        
    }else{
    alert("Fields cannot be empty ");
    }

  }

  mrtupdate= (e, locationid) => {
    var value = document.getElementById(locationid + "nearmrt").value;
    if(value !== ""  ){
    value = document.getElementById(locationid + "nearmrt").value;
    const db = fire.firestore();
     
      const userRef = db
        .collection("CampusLocation")
        .doc(locationid)
        .update({
         nearestMRT: value
        
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
        
    }else{
    alert("Fields cannot be empty ");
    }

  }
  carparkupdate= (e, locationid) => {
    var value = document.getElementById(locationid + "carpark").value;
    if(value !== ""  ){
    value = document.getElementById(locationid + "carpark").value;
    const db = fire.firestore();
     
      const userRef = db
        .collection("CampusLocation")
        .doc(locationid)
        .update({
          carParkingDescription: value
        
        })
        .then(function () {
          alert("Updated");
          window.location.reload();
        });
        
    }else{
    alert("Fields cannot be empty ");
    }

  }

  editLocation(e, locationid,type) {
    
    if(type==="car"){
      document.getElementById(locationid + "spancardes").removeAttribute("hidden");
      document.getElementById(locationid + "editbutton").setAttribute("hidden", "");
      document.getElementById(locationid + "updatebutton").removeAttribute("hidden");
      document.getElementById(locationid + "cancelbutton").removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }  
    }
    if(type==="bus"){
      document.getElementById(locationid + "spanbusno").removeAttribute("hidden");
      document.getElementById(locationid + "editbutton").setAttribute("hidden", "");
      document.getElementById(locationid + "updatebutton").removeAttribute("hidden");
      document.getElementById(locationid + "cancelbutton").removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
    if(type==="mrt"){
      document.getElementById(locationid + "spannearmrt").removeAttribute("hidden");
      document.getElementById(locationid + "editbutton").setAttribute("hidden", "");
      document.getElementById(locationid + "updatebutton").removeAttribute("hidden");
      document.getElementById(locationid + "cancelbutton").removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
    if(type==="carpark"){
      document.getElementById(locationid + "spancarpark").removeAttribute("hidden");      
      document.getElementById(locationid + "editbutton").setAttribute("hidden", "");
      document.getElementById(locationid + "updatebutton").removeAttribute("hidden");
      document.getElementById(locationid + "cancelbutton").removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
  
}

  CancelEdit(e, locationid,type) {
    
    if(type==="car"){
      document.getElementById(locationid + "spancardes").setAttribute("hidden", "");  
      document.getElementById(locationid + "editbutton").removeAttribute("hidden");
      document.getElementById(locationid + "updatebutton").setAttribute("hidden", "");
      document.getElementById(locationid + "cancelbutton").setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
    }

    }
    if(type==="bus"){
      document.getElementById(locationid + "spanbusno").setAttribute("hidden", "");
      document.getElementById(locationid + "editbutton").removeAttribute("hidden");
      document.getElementById(locationid + "updatebutton").setAttribute("hidden", "");
      document.getElementById(locationid + "cancelbutton").setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if(type==="mrt"){
      document.getElementById(locationid + "spannearmrt").setAttribute("hidden", "")
      document.getElementById(locationid + "editbutton").removeAttribute("hidden");
      document.getElementById(locationid + "updatebutton").setAttribute("hidden", "");
      document.getElementById(locationid + "cancelbutton").setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
    if(type==="carpark"){
      document.getElementById(locationid + "spancarpark").setAttribute("hidden", "")
      document.getElementById(locationid + "editbutton").removeAttribute("hidden");
      document.getElementById(locationid + "updatebutton").setAttribute("hidden", "");
      document.getElementById(locationid + "cancelbutton").setAttribute("hidden", "");
      var texttohide = document.getElementsByClassName(
        locationid + "text"
      );
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].removeAttribute("hidden", "");
      }
    }
   
}

  render() {
    return (
      <div className="home">
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
                <h5>By Car</h5>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Information</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.location &&
                this.state.location.map((location) => {
                    if(location.modeOfTransport === "Car"){
                        return (
                            <tr>
                              <td>{location.counter}</td>
                              <td>
                              <span class={location.id + "text"}>
                              {location.carDescription} 
                        </span>
                          
                          <span id={location.id + "spancardes"} hidden>
                          <input
                            id={location.id + "carDes"}
                            defaultValue={location.carDescription}
                            type="text"
                            name={location.id + "carDes"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={location.carDescription}
                            required
                          />
                        </span></td>
                        <td>
                        <button
                          id={location.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, location.id,"car");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={location.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.carupdate(e, location.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={location.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, location.id,"car");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                            </tr>
                          );
                    }
                })}
                <h5>By Bus</h5>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Bus Number</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.location &&
                this.state.location.map((location,index) => {
                  if(location.modeOfTransport === "Bus"){
                    
                        return (
                            <tr>
                              <td>{index} </td>
                              <td>
                              <span class={location.id + "text"}>
                              {location.busNo} 
                        </span>
                          
                          <span id={location.id + "spanbusno"} hidden>
                          <input
                            id={location.id + "busno"}
                            defaultValue={location.busNo}
                            type="text"
                            name={location.id + "busno"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={location.busNo}
                            required
                          />
                        </span> </td>
                        <td>
                        <button
                          id={location.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, location.id,"bus");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={location.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.busupdate(e, location.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={location.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, location.id,"bus");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                            </tr>
                          );
                          
                        }
                })}
                <h5>By MRT</h5>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Nearest MRT</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.location &&
                this.state.location.map((location,index) => {
                    if(location.modeOfTransport === "MRT"){
                     console.log(index);
                        return (
                            <tr>
                              <td>{index} </td>
                              <td>
                              <span class={location.id + "text"}>
                              {location.nearestMRT}
                        </span>
                          
                          <span id={location.id + "spannearmrt"} hidden>
                          <input
                            id={location.id + "nearmrt"}
                            defaultValue={location.nearestMRT}
                            type="text"
                            name={location.id + "nearmrt"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={location.nearestMRT}
                            required
                          />
                        </span></td>
                        <td>
                        <button
                          id={location.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, location.id,"mrt");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={location.id + "updatebutton"}
                         hidden
                          onClick={(e) => {
                            this.mrtupdate(e, location.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={location.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, location.id,"mrt");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                            </tr>
                          );
                    }
                })}
                <h5>Car Park Info</h5>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Car Park Information</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.location &&
                this.state.location.map((location) => {
                    if(location.modeOfTransport === "Car"){
                        return (
                            <tr>
                              <td>{location.counter} </td>
                              <td>
                              <span class={location.id + "text"}>
                              {location.carParkingDescription}  
                        </span>
                          
                          <span id={location.id + "spancarpark"} hidden>
                          <input
                            id={location.id + "carpark"}
                            defaultValue={location.carParkingDescription}
                            type="text"
                            name={location.id + "carpark"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={location.carParkingDescription}
                            required
                          />
                        </span></td>
                              <td>
                        <button
                          id={location.id + "editbutton"}
                          onClick={(e) => {
                            this.editLocation(e, location.id,"carpark");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={location.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.carparkupdate(e, location.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={location.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, location.id,"carpark");
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                            </tr>
                          );
                    }
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default GettingToSIMHQ;
