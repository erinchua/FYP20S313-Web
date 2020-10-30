import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Marketing_Administrator/GettingToSIMHQ.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class GettingToSIMHQ extends Component {
    constructor() {
        super();
        this.state = {
            carId: "",
            busId: "",
            mrtId: "",
            carParkId: "",
            carDescription: "",
            carParkingDescription: "",
            modeOfTransport: "",
            busNo: "",
            nearestMRT: "",
            url: "",
            progress: "",
            //Below states are for functions
            mapArray: "",
            carArray: "",
            busArray: "",
            busOppSimArray: "",
            busSimArray: "",
            mrtArray: "",
            carParkArray: "",
            //Below states are for modals
            mapEditModal: false,
            carEditModal: false,
            busEditModal: false,
            mrtEditModal: false,
            carParkEditModal: false,
        };
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();

                var getrole = db.collection("Administrators").where("email", "==", user.email);
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
        const image = db.collection("CampusLocation").doc("map").get()
        .then((snapshot) => {
            const maparray = [];
            const image = snapshot.data();
            const data = {
                url: image.url,
            };
            maparray.push(data);
            this.setState({ mapArray: maparray });
        });

        //car
        const car = db.collection("CampusLocation").doc("car").get()
        .then((snapshot) => {
            const cararray = [];
            const car = snapshot.data();
            const data = {
                carDescription: car.carDescription,
                carId: car.id,
            };
            cararray.push(data);
            this.setState({ carArray: cararray });
        });

        //bus
        const bust = db.collection("CampusLocation").doc("bus").get()
        .then((snapshot) => {
            const busarray = [];
            const oppSimHq = [];
            const simHq = []
            const oppSim = snapshot.get('oppSimHq');
            for (var i = 0; i < Object.keys(oppSim).length; i++) {
                const data = {
                    oppSimHq: oppSim[Object.keys(oppSim)[i]]
                };
                oppSimHq.push(data)
            }

            const sim = snapshot.get('simHq');
            for (var i = 0; i < Object.keys(sim).length; i++) {
                const data = {
                    simHq: sim[Object.keys(sim)[i]]
                };
                simHq.push(data)
            }
            const data = {
                busId: snapshot.id,
            };
            busarray.push(data);
            this.setState(() => ({ busArray: busarray, busOppSimArray: oppSimHq, busSimArray: simHq }));
        });

        //mrt
        const mrt = db.collection("CampusLocation").doc("mrt").get()
        .then((snapshot) => {
            const mrtarray = [];
            const data = {
                mrtId: snapshot.id,
                downtownLine: snapshot.data().downtownLine,
                eastwestLine: snapshot.data().eastwestLine,
            };
            mrtarray.push(data);
            this.setState(() => ({ mrtArray: mrtarray }));
        });

        //carpark
        const carpark = db.collection("CampusLocation").doc("car").get()
        .then((snapshot) => {
            const carparkarray = [];
            const carpark = snapshot.data();
            const data = {
                carParkingDescription: carpark.carParkingDescription,
                carParkId: carpark.id,
            };
            carparkarray.push(data);
            this.setState({ carParkArray: carparkarray });
        });
    }

    carupdate = (e, locationid) => {
        var value = document.getElementById(locationid + "carDes").value;
        if (value !== "") {
            value = document.getElementById(locationid + "carDes").value;
            const db = fire.firestore();

            const userRef = db.collection("CampusLocation").doc("car")
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

            const userRef = db.collection("CampusLocation").doc("bus")
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

            const userRef = db.collection("CampusLocation").doc("mrt")
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

            const userRef = db.collection("CampusLocation").doc("car")
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
            const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log("File available at", downloadURL);

                    const userRef = db.collection("CampusLocation").doc("mapImage")
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
            <div>
                <Container fluid className="GettingToSimHq-container">
                    <NavBar isMA={true} />

                        <Container fluid className="GettingToSimHq-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="GettingToSimHq-topContentContainer">
                                        <Row id="GettingToSimHq-firstRow">
                                            <Col md={12} className="text-left" id="GettingToSimHq-firstRowCol">
                                                <h4 id="GettingToSimHq-title">Getting To SIM HQ</h4>
                                            </Col>
                                        </Row>

                                        <Row id="GettingToSimHq-secondRow">
                                            <Col md={12} className="text-center" id="GettingToSimHq-secondRowCol">
                                                <Table responsive="sm" bordered id="GettingToSimHq-tableContainer">
                                                    <thead id="GettingToSimHq-tableHeader">
                                                        <tr>
                                                            <th>Image</th>
                                                            <th id="GettingToSimHq-tableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="GettingToSimHq-tableBody">
                                                        <tr>
                                                            <td className="text-left">Getting To SIM HQ Map Image</td>
                                                            <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row> 

                                        <div id="border"></div>
                                        <Row id="GettingToSimHq-titleRow">
                                            <Col md={12} className="text-left" id="GettingToSimHq-titleRowCol">
                                                <h6 id="GettingToSimHq-title">By Car</h6>
                                            </Col>
                                        </Row>

                                        <Row id="GettingToSimHq-secondRow">
                                            <Col md={12} className="text-center" id="GettingToSimHq-secondRowCol">
                                                <Table responsive="sm" bordered id="GettingToSimHq-tableContainer">
                                                    <thead id="GettingToSimHq-tableHeader">
                                                        <tr>
                                                            <th id="GettingToSimHq-tableHeading">S/N</th>
                                                            <th>Information</th>
                                                            <th id="GettingToSimHq-tableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.carArray && this.state.carArray.map((carArr, index) => {
                                                        return (
                                                            <tbody id="GettingToSimHq-tableBody" key={carArr.carId}>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td className="text-left">{carArr.carDescription}</td>
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row> 

                                        <div id="border"></div>
                                        <Row id="GettingToSimHq-titleRow">
                                            <Col md={12} className="text-left" id="GettingToSimHq-titleRowCol">
                                                <h6 id="GettingToSimHq-title">By Bus</h6>
                                            </Col>
                                        </Row>

                                        <Row id="GettingToSimHq-secondRow">
                                            <Col md={12} className="text-center" id="GettingToSimHq-secondRowCol">
                                                <Table responsive="sm" bordered id="GettingToSimHq-tableContainer">
                                                    <thead id="GettingToSimHq-tableHeader">
                                                        <tr>
                                                            <th id="GettingToSimHq-tableHeading">S/N</th>
                                                            <th>Location</th>
                                                            <th>Bus Number</th>
                                                            <th id="GettingToSimHq-tableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.busArray && this.state.busArray.map((busArr, index) => {
                                                        return (
                                                            <tbody id="GettingToSimHq-tableBody">
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>SIM HQ <br/>12091 <br/>Clementi Rd</td>
                                                                    {this.state.busOppSimArray && this.state.busOppSimArray.map((oppSimHq) => {
                                                                        return (
                                                                            <td>{oppSimHq.oppSimHq}</td>
                                                                        )
                                                                    })}
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                                
                                                                <tr>
                                                                    <td>{index + 2}</td>
                                                                    <td>Opp SIM HQ <br/>12099 <br/>Clementi Rd</td>
                                                                    <td>{busArr.simHq}</td>
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row>

                                        <div id="border"></div>
                                        <Row id="GettingToSimHq-titleRow">
                                            <Col md={12} className="text-left" id="GettingToSimHq-titleRowCol">
                                                <h6 id="GettingToSimHq-title">By MRT</h6>
                                            </Col>
                                        </Row>

                                        <Row id="GettingToSimHq-secondRow">
                                            <Col md={12} className="text-center" id="GettingToSimHq-secondRowCol">
                                                <Table responsive="sm" bordered id="GettingToSimHq-tableContainer">
                                                    <thead id="GettingToSimHq-tableHeader">
                                                        <tr>
                                                            <th id="GettingToSimHq-tableHeading">S/N</th>
                                                            <th>MRT Line</th>
                                                            <th>Nearest MRT</th>
                                                            <th id="GettingToSimHq-tableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.mrtArray && this.state.mrtArray.map((mrtArr, index) => {
                                                        return (
                                                            <tbody id="GettingToSimHq-tableBody">
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>Downtown Line</td>
                                                                    <td></td>
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>{index + 2}</td>
                                                                    <td>East West Line</td>
                                                                    <td></td>
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row>

                                        <div id="border"></div>
                                        <Row id="GettingToSimHq-titleRow">
                                            <Col md={12} className="text-left" id="GettingToSimHq-titleRowCol">
                                                <h6 id="GettingToSimHq-title">Car Park Info</h6>
                                            </Col>
                                        </Row>

                                        <Row id="GettingToSimHq-secondRow">
                                            <Col md={12} className="text-center" id="GettingToSimHq-secondRowCol">
                                                <Table responsive="sm" bordered id="GettingToSimHq-tableContainer">
                                                    <thead id="GettingToSimHq-tableHeader">
                                                        <tr>
                                                            <th id="GettingToSimHq-tableHeading">S/N</th>
                                                            <th>Information</th>
                                                            <th id="GettingToSimHq-tableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.carParkArray && this.state.carParkArray.map((carPark, index) => {
                                                        return (
                                                            <tbody id="GettingToSimHq-tableBody" key={carPark.carParkId}>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td className="text-left">{carPark.carParkingDescription}</td>
                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

            </div>





            // <div className="home">
            //     <div>
            //     <table id="users" class="table table-bordered">
            //         <tbody>
            //         {this.state.maparr &&
            //             this.state.maparr.map((image) => {
            //             return (
            //                 <tr>
            //                 <td>Map Image File</td>
            //                 <td>
            //                     <span class={image.id + "text"}>{image.URL}</span>
            //                     <span id={image.id + "spanimagelink"} hidden>
            //                     <input
            //                         id={image.id + "imagelink"}
            //                         defaultValue={image.URL}
            //                         type="text"
            //                         name={image.id + "imagelink"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={image.URL}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={image.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>{" "}
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={image.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editLocation(e, image.id, "mapImage");
            //                     }}
            //                     >
            //                     Browse
            //                     </button>
            //                     <button
            //                     id={image.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.handleSave(image.id);
            //                     }}
            //                     >
            //                     Save
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={image.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, image.id, "mapImage");
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         <h5>By Car</h5>
            //         <tr>
            //             <th scope="col">ID</th>
            //             <th scope="col">Information</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.cararr &&
            //             this.state.cararr.map((car, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1}</td>
            //                 <td>
            //                     <span class={car.id + "text"}>
            //                     {car.carDescription}
            //                     </span>

            //                     <span id={car.id + "spancardes"} hidden>
            //                     <input
            //                         id={car.id + "carDes"}
            //                         defaultValue={car.carDescription}
            //                         type="text"
            //                         name={car.id + "carDes"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={car.carDescription}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={car.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editLocation(e, car.id, "car");
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={car.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.carupdate(e, car.id);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={car.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, car.id, "car");
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         <h5>By Bus</h5>
            //         <tr>
            //             <th scope="col">ID</th>
            //             <th scope="col">Location</th>
            //             <th scope="col">Bus Number</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.busarray &&
            //             this.state.busarray.map((bus, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1} </td>
            //                 <td>
            //                     <tr>SIM HQ</tr>
            //                     <tr>12091</tr>
            //                     <tr>Clementi Road</tr>
            //                 </td>

            //                 <td>
            //                     {bus.simHq.bus1},{bus.simHq.bus2},{bus.simHq.bus3},
            //                     {bus.simHq.bus4},{bus.simHq.bus5},{bus.simHq.bus6},
            //                     {bus.simHq.bus7},{bus.simHq.bus8},{bus.simHq.bus9},
            //                     {bus.simHq.bus10}
            //                     {/* <span class={bus.busid + "text"}>{bus.busno}</span>
            //                     <span id={bus.busid + "spanbusno"} hidden>
            //                         <input
            //                         id={bus.busid + "busno"}
            //                         defaultValue={bus.busno}
            //                         type="text"
            //                         name={bus.busid + "busno"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={bus.busNo}
            //                         required
            //                         />
            //                 </span>{" "}*/}
            //                 </td>

            //                 <td>
            //                     {/*<button
            //                         id={bus.busid + "editbutton"}
            //                         onClick={(e) => {
            //                         this.editLocation(e, bus.busid, "bus");
            //                         }}
            //                     >
            //                         Edit
            //                     </button>

            //                     <button
            //                         id={bus.busid + "updatebutton"}
            //                         hidden
            //                         onClick={(e) => {
            //                         this.busupdate(e, bus.busid);
            //                         }}
            //                     >
            //                         Update
            //                     </button>
            //                     <button
            //                         hidden
            //                         id={bus.busid + "cancelbutton"}
            //                         onClick={(e) => {
            //                         this.CancelEdit(e, bus.busid, "bus");
            //                         }}
            //                     >
            //                         Cancel
            //                     </button>*/}
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         {this.state.busarray &&
            //             this.state.busarray.map((bus, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 2} </td>
            //                 <td>
            //                     <tr>SIM HQ</tr>
            //                     <tr>12099</tr>
            //                     <tr>Clementi Road</tr>
            //                 </td>

            //                 <td>
            //                     {bus.oppSimHq.bus1},{bus.oppSimHq.bus2},
            //                     {bus.oppSimHq.bus3},{bus.oppSimHq.bus4},
            //                     {bus.oppSimHq.bus5},{bus.oppSimHq.bus6},
            //                     {bus.oppSimHq.bus7},{bus.oppSimHq.bus8},
            //                     {bus.oppSimHq.bus9}
            //                     {/* <span class={bus.busid + "text"}>{bus.busno}</span>
            //                     <span id={bus.busid + "spanbusno"} hidden>
            //                         <input
            //                         id={bus.busid + "busno"}
            //                         defaultValue={bus.busno}
            //                         type="text"
            //                         name={bus.busid + "busno"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={bus.busNo}
            //                         required
            //                         />
            //                 </span>{" "}*/}
            //                 </td>

            //                 <td>
            //                     {/*<button
            //                         id={bus.busid + "editbutton"}
            //                         onClick={(e) => {
            //                         this.editLocation(e, bus.busid, "bus");
            //                         }}
            //                     >
            //                         Edit
            //                     </button>

            //                     <button
            //                         id={bus.busid + "updatebutton"}
            //                         hidden
            //                         onClick={(e) => {
            //                         this.busupdate(e, bus.busid);
            //                         }}
            //                     >
            //                         Update
            //                     </button>
            //                     <button
            //                         hidden
            //                         id={bus.busid + "cancelbutton"}
            //                         onClick={(e) => {
            //                         this.CancelEdit(e, bus.busid, "bus");
            //                         }}
            //                     >
            //                         Cancel
            //                     </button>*/}
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         <h5>By MRT</h5>
            //         <tr>
            //             <th scope="col">ID</th>
            //             <th scope="col">MRT line</th>
            //             <th scope="col">Nearest MRT</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.mrtarr &&
            //             this.state.mrtarr.map((mrt, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1} </td>
            //                 <td>
            //                     Downtown Line
            //                     {/*  <span class={mrt.id + "text"}>{mrt.nearestMRT}</span>

            //                     <span id={mrt.id + "spannearmrt"} hidden>
            //                     <input
            //                         id={mrt.id + "nearmrt"}
            //                         defaultValue={mrt.nearestMRT}
            //                         type="text"
            //                         name={mrt.id + "nearmrt"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={mrt.nearestMRT}
            //                         required
            //                     />
            //             </span>*/}
            //                 </td>
            //                 <td>
            //                     <tr>{mrt.downtownLine.station1}</tr>
            //                     <tr>{mrt.downtownLine.station2}</tr>
            //                     <tr>{mrt.downtownLine.station3}</tr>{" "}
            //                 </td>
            //                 <td>
            //                     {/*  <button
            //                     id={mrt.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editLocation(e, mrt.id, "mrt");
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={mrt.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.mrtupdate(e, mrt.id);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={mrt.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, mrt.id, "mrt");
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>*/}
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         {this.state.mrtarr &&
            //             this.state.mrtarr.map((mrt, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 2} </td>
            //                 <td>
            //                     East West Line
            //                     {/*  <span class={mrt.id + "text"}>{mrt.nearestMRT}</span>

            //                     <span id={mrt.id + "spannearmrt"} hidden>
            //                     <input
            //                         id={mrt.id + "nearmrt"}
            //                         defaultValue={mrt.nearestMRT}
            //                         type="text"
            //                         name={mrt.id + "nearmrt"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={mrt.nearestMRT}
            //                         required
            //                     />
            //             </span>*/}
            //                 </td>
            //                 <td>
            //                     <tr>{mrt.eastwestLine.station1}</tr>
            //                     <tr>{mrt.eastwestLine.station2}</tr>
            //                     <tr></tr>
            //                 </td>
            //                 <td>
            //                     {/*  <button
            //                     id={mrt.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editLocation(e, mrt.id, "mrt");
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={mrt.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.mrtupdate(e, mrt.id);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={mrt.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, mrt.id, "mrt");
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>*/}
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         <h5>Car Park Info</h5>
            //         <tr>
            //             <th scope="col">ID</th>
            //             <th scope="col">Car Park Information</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.carparkarr &&
            //             this.state.carparkarr.map((carpark, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1} </td>
            //                 <td>
            //                     <span class="carparktext">
            //                     {carpark.carparkDescription}
            //                     </span>

            //                     <span id={"carparkspan"} hidden>
            //                     <input
            //                         id="carparkinput"
            //                         defaultValue={carpark.carparkDescription}
            //                         type="text"
            //                         name={carpark.id + "carpark"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={carpark.carparkDescription}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id="carparkeditbutton"
            //                     onClick={(e) => {
            //                         this.editLocation(e, carpark.id, "carpark");
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={"carparkupdatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.carparkupdate(e, carpark.id);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={"carparkcancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, carpark.id, "carpark");
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            // </div>
        );
    }
}
export default GettingToSIMHQ;