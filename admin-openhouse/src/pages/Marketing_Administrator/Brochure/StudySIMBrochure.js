import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

//import "../../../node_modules/bootstrap/dist/css/bootstrap.css";

class StudySIMBrochure extends Component {
  constructor() {
    super();
    this.state = {
      brochureUrl: "",
      description: "",
      imageUrl: "",
      university: "",
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
    this.authListener();
  }

  display() {
    const db = fire.firestore();
    var counter = 1;
    //Display of Prospectus Brochures
    const userRef = db
      .collection("Brochures")
      .where("id", ">=", "prospect-")
      .where("id", "<=", "prospect-" + "\uf8ff")
      .onSnapshot((snapshot) => {
        const prospectbrochures = [];
        snapshot.forEach((doc) => {
          console.log(doc.data());
          const data = {
            brochureUrl: doc.data().brochureUrl,
            description: doc.data().description,
            imageUrl: doc.data().imageUrl,
            university: doc.data().university,
            id: doc.id,
            counter: counter,
          };
          counter++;
          prospectbrochures.push(data);
        });

        this.setState({ prospectbrochures: prospectbrochures });
      });

  //Display of University Brochures
      const userRef1 = db
      .collection("Brochures")
      .where("university", ">", "")
      .onSnapshot((snapshot) => {
        const unibrochures = [];
        snapshot.forEach((doc) => {
          console.log(doc.data());
          const data = {
            brochureUrl: doc.data().brochureUrl,
            description: doc.data().description,
            imageUrl: doc.data().imageUrl,
            university: doc.data().university,
            id: doc.id,
            counter: counter,
          };
          counter++;
          unibrochures.push(data);
        });

        this.setState({ unibrochures: unibrochures });
      });
  }
  handleImageFileUpload = (imagefiles) => {
    this.setState({
      imagefiles: imagefiles,
    });
    console.log(imagefiles)
  };

  handleBrochureFileUpload = (brochurefiles) => {
    this.setState({
      brochurefiles: brochurefiles,
    });
    console.log(brochurefiles)
  };

  update(brochureid) {
    const description = document.getElementById(brochureid + "description").value

    const db = fire.firestore();
    if (description != null) {
      const userRef = db
      .collection("Brochures")
      .doc(brochureid)
      .update({
        description: description,
      })
      .then(function () {
        alert("Updated");
        window.location.reload();
      });
    }
  }

  editBrochure(e, brochureid, description) {

  var patt = new RegExp("Prospectus");


    document.getElementById(brochureid + "upload").removeAttribute("hidden");
    document.getElementById(brochureid + "upload1").removeAttribute("hidden");
    if(patt.test(description)=== false){
    document
      .getElementById(brochureid + "spandescription")
      .removeAttribute("hidden");
    }
    document
      .getElementById(brochureid + "spanbrochurefile")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "spanimagefile")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "editbutton")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "updatebutton")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "cancelbutton")
      .removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(brochureid + "text");
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].setAttribute("hidden", "");
    }
  }

  CancelEdit(e, brochureid,description) {
    var patt = new RegExp("Prospectus");
    document.getElementById(brochureid + "upload").setAttribute("hidden", "");
    document.getElementById(brochureid + "upload1").setAttribute("hidden", "");
    if(patt.test(description)=== false){
    document
      .getElementById(brochureid + "spandescription")
      .setAttribute("hidden", "");
    }
    document
      .getElementById(brochureid + "spanbrochurefile")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "spanimagefile")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "editbutton")
      .removeAttribute("hidden");
    document
      .getElementById(brochureid + "updatebutton")
      .setAttribute("hidden", "");
    document
      .getElementById(brochureid + "cancelbutton")
      .setAttribute("hidden", "");
    var texttohide = document.getElementsByClassName(brochureid + "text");
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].removeAttribute("hidden", "");
    }
  }

  

  handleProspectSavePDF = (brochureid) => {
    const parentthis = this;
    const db = fire.firestore();

    console.log(this.state.files);

    if (this.state.brochurefiles !== undefined) {
      const foldername = "/Brochures/Prospectus";
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef
        .child(this.state.brochurefiles[0].name)
        .put(this.state.brochurefiles[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const userRef = db
            .collection("Brochures")
            .doc(brochureid)
            .update({
              brochureUrl: downloadURL,
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
    } 
  };

  handleProspectSaveImage = (brochureid) => {
    const parentthis = this;
    const db = fire.firestore();

    console.log(this.state.files);

    if (this.state.imagefiles !== undefined) {
      const foldername = "/Brochures/Prospectus";
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef
        .child(this.state.imagefiles[0].name)
        .put(this.state.imagefiles[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const userRef = db
            .collection("Brochures")
            .doc(brochureid)
            .update({
              imageUrl: downloadURL,
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
    } 
  };

  handleUniSavePDF = (brochureid, university) => {
    console.log(brochureid)
    console.log(university)
    var path= "";
    if(university==="La Trobe University"){
      path = "/Brochures/Programmes/LaTrobe"

    }
    if(university==="RMIT University"){
      path = "/Brochures/Programmes/RMIT"

    }
    if(university==="Singapore Institute of Management"){
      path = "/Brochures/Programmes/SIM"

    }
    if(university==="University of Stirling"){
      path = "/Brochures/Programmes/Stirling"

    }
    if(university==="University of Buffalo"){
      path = "/Brochures/Programmes/Buffalo"

    }
    if(university==="University of Birmingham"){
      path = "/Brochures/Programmes/Birmingham"

    }
    if(university==="University of London"){
      path = "/Brochures/Programmes/UOL"

    }
    if(university==="University of Wollongong"){
      path = "/Brochures/Programmes/Wollongong"

    }
    if(university==="University of Sydney"){
      path = "/Brochures/Programmes/Sydney"

    }
    if(university==="University of Warwick"){
      path = "/Brochures/Programmes/Warwick"

    }
    console.log(path)
    const parentthis = this;
    const db = fire.firestore();

    console.log(this.state.files);

    if (this.state.brochurefiles !== undefined) {
      
      const storageRef = fire.storage().ref(path);
      const fileRef = storageRef
        .child(this.state.brochurefiles[0].name)
        .put(this.state.brochurefiles[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const userRef = db
            .collection("Brochures")
            .doc(brochureid)
            .update({
              brochureUrl: downloadURL,
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
    } 
  };

  handleUniSaveImage = (brochureid, university) => {
    console.log(brochureid)
    console.log(university)
    var path= "";
    if(university==="La Trobe University"){
      path = "/Brochures/Programmes/LaTrobe"

    }
    if(university==="RMIT University"){
      path = "/Brochures/Programmes/RMIT"

    }
    if(university==="Singapore Institute of Management"){
      path = "/Brochures/Programmes/SIM"

    }
    if(university==="University of Stirling"){
      path = "/Brochures/Programmes/Stirling"

    }
    if(university==="University of Buffalo"){
      path = "/Brochures/Programmes/Buffalo"

    }
    if(university==="University of Birmingham"){
      path = "/Brochures/Programmes/Birmingham"

    }
    if(university==="University of London"){
      path = "/Brochures/Programmes/UOL"

    }
    if(university==="University of Wollongong"){
      path = "/Brochures/Programmes/Wollongong"

    }
    if(university==="University of Sydney"){
      path = "/Brochures/Programmes/Sydney"

    }
    if(university==="University of Warwick"){
      path = "/Brochures/Programmes/Warwick"

    }
    console.log(path)
    const parentthis = this;
    const db = fire.firestore();

    console.log(this.state.files);

    if (this.state.imagefiles !== undefined) {
     // const foldername = "/Brochures/Prospectus";
      const storageRef = fire.storage().ref(path);
      const fileRef = storageRef
        .child(this.state.imagefiles[0].name)
        .put(this.state.imagefiles[0]);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

       
          const userRef = db
            .collection("Brochures")
            .doc(brochureid)
            .update({
              imageUrl: downloadURL,
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
    } 
  };
  

  render() {
    return (
      <div className="home">
        <h2>Study@SIM Brochures</h2>
        <div>
          <table id="users" class="table table-bordered">
            <tbody>
              <h4>Prospectus</h4>
              <tr>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.prospectbrochures &&
                this.state.prospectbrochures.map((prospectbrochures) => {
                  return (
                    <tr>
                      <td>
                        <span class={prospectbrochures.id + "text"}>
                          {prospectbrochures.imageUrl}
                        </span>
                        <span
                          id={prospectbrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={prospectbrochures.id + "imagefile"}
                            defaultValue={prospectbrochures.imageUrl}
                            type="text"
                            name={prospectbrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prospectbrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={prospectbrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={prospectbrochures.id + "text"}>
                          {prospectbrochures.brochureUrl}
                        </span>
                        <span
                          id={prospectbrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={prospectbrochures.id + "brochurefile"}
                            defaultValue={prospectbrochures.brochureUrl}
                            type="text"
                            name={prospectbrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={prospectbrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={prospectbrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={prospectbrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, prospectbrochures.id, prospectbrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={prospectbrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.handleProspectSavePDF(prospectbrochures.id);
                            this.handleProspectSaveImage(prospectbrochures.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={prospectbrochures.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, prospectbrochures.id,prospectbrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
            <br/>
            <h4>La Trobe University</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "La Trobe University")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}

                <br/>
            <h4>RMIT University</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "RMIT University")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}

                <br/>
            <h4>Singapore Institute of Management</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "Singapore Institute of Management")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })} 

                <br/>
            <h4>University of Stirling</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Stirling")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}

                <br/>
            <h4>University of Buffalo</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Buffalo")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })} 

                <br/>
            <h4>University of Birmingham</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Birmingham")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}  

                <br/>
            <h4>University of London</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of London")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })} 

                <br/>
            <h4>University of Wollongong</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Wollongong")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })} 

                <br/>
            <h4>University of Sydney</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Sydney")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })} 

                 <br/>
            <h4>University of Warwick</h4>
              <tr>
                <th scope="col">Brochure Description</th>
                <th scope="col">Brochure Cover Image</th>
                <th scope="col">Brochure File</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.unibrochures &&
                this.state.unibrochures.map((unibrochures) => {
                  if(unibrochures.university === "University of Warwick")
                  return (
                    <tr>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.description}
                        </span>
                        <span
                          id={unibrochures.id + "spandescription"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "description"}
                            defaultValue={unibrochures.description}
                            type="text"
                            name={unibrochures.id + "description"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.description}
                            required
                          />
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.imageUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanimagefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "imagefile"}
                            defaultValue={unibrochures.imageUrl}
                            type="text"
                            name={unibrochures.id + "imagefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.imageUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleImageFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <span class={unibrochures.id + "text"}>
                          {unibrochures.brochureUrl}
                        </span>
                        <span
                          id={unibrochures.id + "spanbrochurefile"}
                          hidden
                        >
                          <input
                            id={unibrochures.id + "brochurefile"}
                            defaultValue={unibrochures.brochureUrl}
                            type="text"
                            name={unibrochures.id + "brochurefile"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={unibrochures.brochureUrl}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id={unibrochures.id + "upload1"} hidden>
                          <input
                            type="file"
                            onChange={(e) => {
                              this.handleBrochureFileUpload(e.target.files);
                            }}
                          />

                          {this.state.progress}
                          <div>
                            <progress value={this.state.progress} max="100" />
                          </div>
                        </span>
                      </td>
                      <td>
                        <button
                          id={unibrochures.id + "editbutton"}
                          onClick={(e) => {
                            this.editBrochure(e, unibrochures.id, unibrochures.description);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={unibrochures.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(unibrochures.id);
                            this.handleUniSavePDF(unibrochures.id,unibrochures.university );
                            this.handleUniSaveImage(unibrochures.id,unibrochures.university);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={unibrochures.id + "cancelbutton"}
                          onClick={(e) => {
                           this.CancelEdit(e, unibrochures.id,unibrochures.description);
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
export default StudySIMBrochure;