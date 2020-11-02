import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Marketing_Administrator/GettingToSIMHQ.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faCar, faEdit, faFileImage, faLocationArrow, faParking, faTrain } from '@fortawesome/free-solid-svg-icons';

//Sort Bus Numbers
export function sortFunction(a, b) {
    const aSplit = a;
    const bSplit = b;
    let aSplitNumberAlpha = aSplit.match(/[a-zA-Z]+|\d+/ig)
    let bSplitNumberAlpha = bSplit.match(/[a-zA-Z]+|\d+/ig)  

    if (+aSplitNumberAlpha[0] > +bSplitNumberAlpha[0]) {
        return 1;
    }
    
    if (+aSplitNumberAlpha[0] < +bSplitNumberAlpha[0]) {
        return -1;
    }

    if (+aSplitNumberAlpha[0] == +bSplitNumberAlpha[0]) {
        if (aSplitNumberAlpha[1] == '' && bSplitNumberAlpha[1] != '') {
            return 1;
        }
        if (bSplitNumberAlpha[1] == '' && aSplitNumberAlpha[1] != '') {
            return -1;
        }
    }
    return 0;
}

//Sort MRT Lines
export function sortAlphabet(a, b) {
    const aSplit = a;
    const bSplit = b;
    let aSplitAlpha = aSplit.match(/[A-Z][a-z]+/g)
    let bSplitAlpha = bSplit.match(/[A-Z][a-z]+/g)

    if (aSplitAlpha[0] < bSplitAlpha[0]) {
        return -1;
    }

    if (aSplitAlpha[0] > bSplitAlpha[0]) {
        return 1;
    }

    return 0;
}

class GettingToSIMHQ extends Component {

    constructor() {
        super();
        this.state = {
            //Below states are for Map 
            mapId: "",
            mapUrl: "",
            mapArray: "",
            //Below states are for Car 
            carId: "",
            carDescription: "",
            carArray: "",
            //Below states are for Bus 
            busId: "",
            oppSimBusDescription: "",
            simBusDescription: "",
            busArray: "",
            busOppSimArray: "",
            busSimArray: "",
            busNo: "",
            //Below states are for MRT 
            mrtId: "",
            downTownDescription: "",
            eastWestDescription: "",
            mrtArray: "",
            mrtDownTownArray: "",
            mrtEastWestArray: "",
            nearestMRT: "",
            //Below states are for Car Park Info
            carParkId: "",
            carParkingDescription: "",
            carParkArray: "",
            //Below states are for modals
            mapEditModal: false,
            carEditModal: false,
            busEditModal: false,
            mrtEditModal: false,
            carParkEditModal: false,
            //
            modeOfTransport: "",
            progress: "",
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
        console.log(e.target.name)
        console.log(e.target.value)
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
        const db = fire.firestore();

        db.collection("CampusLocation").onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {

                //Bus
                if (doc.id === "bus") {
                    const busarray = [];
                    const oppSimHq = [];
                    const simHq = [];

                    const oppSim = doc.data().oppSimHq.buses;
                    for (var i = 0; i < Object.keys(oppSim).length; i++) {
                        oppSimHq.push(oppSim[Object.keys(oppSim)[i]]);
                    }

                    const sim = doc.data().simHq.buses;
                    for (var i = 0; i < Object.keys(sim).length; i++) {
                        simHq.push(sim[Object.keys(sim)[i]]);
                    }

                    const data = {
                        busId: doc.id,
                        oppSimBusDescription: doc.data().oppSimHq.description,
                        simBusDescription: doc.data().simHq.description,
                    };
                    busarray.push(data);

                    this.setState(() => ({ 
                        busArray: busarray, 
                        busOppSimArray: oppSimHq.sort(sortFunction).join(", "), 
                        busSimArray: simHq.sort(sortFunction).join(", "),
                    }));
                }

                //Car and Car Park Info
                if (doc.id === "car") {
                    const cararray = [];
                    const carparkarray = [];

                    const carData = {
                        carDescription: doc.data().carDescription,
                        carId: doc.id,
                    };
                    cararray.push(carData);

                    const carParkData = {
                        carParkingDescription: doc.data().carParkingDescription,
                        carParkId: doc.id,
                    };
                    carparkarray.push(carParkData);

                    this.setState({ 
                        carArray: cararray,
                        carParkArray: carparkarray
                    });
                }

                //MRT
                if (doc.id === "mrt") {
                    const mrtarray = [];
                    const downTownLine = [];
                    const eastWestLine = [];

                    const downTown = doc.data().downtownLine.stations;
                    for (var i = 0; i < Object.keys(downTown).length; i++) {
                        downTownLine.push(downTown[Object.keys(downTown)[i]]);
                    }

                    const eastWest = doc.data().eastwestLine.stations;
                    for (var i = 0; i < Object.keys(eastWest).length; i++) {
                        eastWestLine.push(eastWest[Object.keys(eastWest)[i]]);
                    }

                    const data = {
                        mrtId: doc.id,
                        downTownDescription: doc.data().downtownLine.description,
                        eastWestDescription: doc.data().eastwestLine.description,
                    };
                    mrtarray.push(data);

                    this.setState(() => ({ 
                        mrtArray: mrtarray, 
                        mrtDownTownArray: downTownLine.sort(sortAlphabet).join(", "), 
                        mrtEastWestArray: eastWestLine.sort(sortAlphabet).join(", ")
                    }));
                }

                //Map Image File
                if (doc.id === "map") {
                    const maparray = [];
                    const data = {
                        mapId: doc.id,
                        url: doc.data().url,
                    };
                    maparray.push(data);
                    this.setState({ mapArray: maparray });
                }

            });
        });;

    }

    carupdate = (e, locationid) => {
            const db = fire.firestore();

            const userRef = db.collection("CampusLocation").doc("car")
            .update({
                carDescription: this.state.carDescription,
            })
            .then(function () {
                alert("Updated");
            });
        
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
            });
        } else {
            alert("Fields cannot be empty ");
        }
    };

    carparkupdate = (e, locationid) => {
            const db = fire.firestore();
            const userRef = db.collection("CampusLocation").doc("car")
            .update({
                carParkingDescription: this.state.carParkDescription,
            })
            .then(function () {
                alert("Updated");
            });
    };

    handleFileUpload = (files) => {
        this.setState({
            files: files,
        });
    };

    handleSave = (mapImage) => {
        const parentthis = this;
        const db = fire.firestore();

        if (this.state.files !== undefined) {
            const foldername = "CampusLocation";
            const file = this.state.files[0];
            const storageRef = fire.storage().ref(foldername);
            const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log("File available at", downloadURL);

                    const userRef = db.collection("CampusLocation").doc("map")
                    .update({
                        url: downloadURL,
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

    handleMapEditModal = () => {
        if (this.state.mapEditModal == false) {
            this.setState({
                mapEditModal: true,
            })
        }
        else {
            this.setState({
                mapEditModal: false
            });
        }
    }

    handleCarEditModal = (car) => {
        if (this.state.carEditModal == false) {
            this.setState({
                carEditModal: true,
                carId: car.id,
                carDescription: car.carDescription, 
            });
        }
        else {
            this.setState({
                carEditModal: false
            });
        }
    }

    handleCarParkEditModal = (carPark) => {
        if (this.state.carParkEditModal == false) {
            this.setState({
                carParkEditModal: true,
                carParkId: carPark.id,
                carParkingDescription: carPark.carParkingDescription, 
            });
        }
        else {
            this.setState({
                carParkEditModal: false
            });
        }
    }

    handleBusEditModal = (busDescription) => {
        if (this.state.busEditModal == false) {
            this.setState({
                busEditModal: true,
                simBusDescription: busDescription,
                oppSimBusDescription: busDescription,
            });
        }
        else {
            this.setState({
                busEditModal: false
            });
        }
    }

    handleMrtEditModal = (mrtDescription) => {
        if (this.state.mrtEditModal == false) {
            this.setState({
                mrtEditModal: true,
                downTownDescription: mrtDescription,
                eastWestDescription: mrtDescription,
            });
        }
        else {
            this.setState({
                mrtEditModal: false
            });
        }
    }

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
                                            <Col md={12} id="GettingToSimHq-secondRowCol">
                                                <Tab.Container defaultActiveKey="map">
                                                    <Row className="GettingToSimHq-secondInnerRow">
                                                        <Col md={12} className="GettingToSimHq-secondInnerCol">
                                                            <Nav defaultActiveKey="day1" className="GettingToSimHq-nav" variant="tabs">
                                                                <Col md={3} className="text-center GettingToSimHq-navItemCon">
                                                                    <Nav.Item className="GettingToSimHq-navItems">
                                                                        <Nav.Link eventKey="map" className="GettingToSimHq-navLinks">Campus Map</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center GettingToSimHq-navItemCon">
                                                                    <Nav.Item className="GettingToSimHq-navItems">
                                                                        <Nav.Link eventKey="car" className="GettingToSimHq-navLinks">Car Information</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center GettingToSimHq-navItemCon">
                                                                    <Nav.Item className="GettingToSimHq-navItems">
                                                                        <Nav.Link eventKey="bus" className="GettingToSimHq-navLinks">Bus Information</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={3} className="text-center GettingToSimHq-navItemCon">
                                                                    <Nav.Item className="GettingToSimHq-navItems">
                                                                        <Nav.Link eventKey="mrt" className="GettingToSimHq-navLinks">MRT Information</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>

                                                    
                                                    <Row className="GettingToSimHq-secondInnerRow">
                                                        <Col md={12} className="GettingToSimHq-secondInnerCol">
                                                            <Tab.Content>

                                                                {/* Map */}
                                                                <Tab.Pane eventKey="map">
                                                                    <Col md={12} className="text-center GettingToSimHq-tableColCon">
                                                                        <Table responsive="sm" bordered className="GettingToSimHq-tableCon">
                                                                            <thead id="GettingToSimHq-tableHeader">
                                                                                <tr>
                                                                                    <th>Image</th>
                                                                                    <th id="GettingToSimHq-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.mapArray && this.state.mapArray.map((mapArray) => {
                                                                                    return (
                                                                            <tbody id="GettingToSimHq-tableBody" key={mapArray.mapId}>
                                                                                <tr>
                                                                                    <td className="text-left">{mapArray.url}</td>
                                                                                    <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={this.handleMapEditModal}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                </tr>
                                                                            </tbody>
                                                                            )
                                                                        })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Car and Car Park */}
                                                                <Tab.Pane eventKey="car">
                                                                    <Row id="GettingToSimHq-secondRow">
                                                                        <Col md={12} className="text-center GettingToSimHq-tableColCon">
                                                                            <Table responsive="sm" bordered className="GettingToSimHq-tableCon">
                                                                                <thead id="GettingToSimHq-tableHeader">
                                                                                    <tr>
                                                                                        <th id="GettingToSimHq-SNoHeading">S/N</th>
                                                                                        <th>Information</th>
                                                                                        <th id="GettingToSimHq-editHeading">Edit</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                {this.state.carArray && this.state.carArray.map((carArr, index) => {
                                                                                    return (
                                                                                        <tbody id="GettingToSimHq-tableBody" key={carArr.carId}>
                                                                                            <tr>
                                                                                                <td>{index + 1}</td>
                                                                                                <td className="text-left">{carArr.carDescription}</td>
                                                                                                <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleCarEditModal(carArr)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                        <th id="GettingToSimHq-SNoHeading">S/N</th>
                                                                                        <th>Information</th>
                                                                                        <th id="GettingToSimHq-editHeading">Edit</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                {this.state.carParkArray && this.state.carParkArray.map((carPark, index) => {
                                                                                    return (
                                                                                        <tbody id="GettingToSimHq-tableBody" key={carPark.carParkId}>
                                                                                            <tr>
                                                                                                <td>{index + 1}</td>
                                                                                                <td className="text-left">{carPark.carParkingDescription}</td>
                                                                                                <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleCarParkEditModal(carPark)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    )
                                                                                })}
                                                                            </Table>
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>

                                                                {/* Bus */}
                                                                <Tab.Pane eventKey="bus">
                                                                    <Col md={12} className="text-center GettingToSimHq-tableColCon">
                                                                        <Table responsive="sm" bordered className="GettingToSimHq-tableCon">
                                                                            <thead id="GettingToSimHq-tableHeader">
                                                                                <tr>
                                                                                    <th id="GettingToSimHq-SNoHeading">S/N</th>
                                                                                    <th>Location</th>
                                                                                    <th>Bus Number</th>
                                                                                    <th id="GettingToSimHq-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.busArray && this.state.busArray.map((busArr, index) => {
                                                                                return(
                                                                                    <tbody id="GettingToSimHq-tableBody" key={busArr.busId}>
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td id="GettingToSimHq-busLocation">{busArr.simBusDescription}</td>
                                                                                            {this.state.busSimArray ?
                                                                                                <td>{this.state.busSimArray}</td> : ''
                                                                                            }
                                                                                            <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleBusEditModal(busArr.simBusDescription)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>{index + 2}</td>
                                                                                            <td id="GettingToSimHq-busLocation">{busArr.oppSimBusDescription}</td>
                                                                                            {this.state.busOppSimArray ?
                                                                                                <td>{this.state.busOppSimArray}</td> : ''
                                                                                            }
                                                                                            <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleBusEditModal(busArr.oppSimBusDescription)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                                
                                                                {/* MRT */}
                                                                <Tab.Pane eventKey="mrt">
                                                                    <Col md={12} className="text-center GettingToSimHq-tableColCon">
                                                                        <Table responsive="sm" bordered className="GettingToSimHq-tableCon">
                                                                            <thead id="GettingToSimHq-tableHeader">
                                                                                <tr>
                                                                                    <th id="GettingToSimHq-SNoHeading">S/N</th>
                                                                                    <th>MRT Line</th>
                                                                                    <th>Nearest MRT</th>
                                                                                    <th id="GettingToSimHq-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.mrtArray && this.state.mrtArray.map((mrtArr, index) => {
                                                                                return (
                                                                                    <tbody id="GettingToSimHq-tableBody" key={mrtArr.mrtId}>
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td id="GettingToSimHq-mrtLocation">{mrtArr.downTownDescription}</td>
                                                                                            {this.state.mrtDownTownArray ? 
                                                                                                <td>{this.state.mrtDownTownArray}</td> : ''
                                                                                            }
                                                                                            <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleMrtEditModal(mrtArr.downTownDescription)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>{index + 2}</td>
                                                                                            <td id="GettingToSimHq-mrtLocation">{mrtArr.eastWestDescription}</td>
                                                                                            {this.state.mrtEastWestArray ? 
                                                                                                <td>{this.state.mrtEastWestArray}</td> : ''
                                                                                            }
                                                                                            <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleMrtEditModal(mrtArr.eastWestDescription)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Col>
                                                    </Row>

                                                </Tab.Container>
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {/* Map Image Edit Modal */}
                {this.state.mapEditModal == true ? 
                    <Modal show={this.state.mapEditModal} onHide={this.handleMapEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="GettingToSimHq-modalTitle" className="w-100">Edit Map Image</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="GettingToSimHq-imgFile" label={this.state.mapUrl} onChange={(e) => {this.handleFileUpload(e.target.files)}} custom required></Form.File>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit" onClick={this.handleSave}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-cancelBtn" onClick={this.handleMapEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Car Edit Modal */}
                {this.state.carEditModal == true ? 
                    <Modal show={this.state.carEditModal} onHide={this.handleCarEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="GettingToSimHq-modalTitle" className="w-100">Edit Car Information</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="2x" icon={faCar}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="4" type="text" name="carDescription" placeholder="Car Information" required defaultValue={this.state.carDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit" onClick={this.carupdate}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-cancelBtn" onClick={this.handleCarEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Car Park Info Edit Modal */}
                {this.state.carParkEditModal == true ? 
                    <Modal show={this.state.carParkEditModal} onHide={this.handleCarParkEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="GettingToSimHq-modalTitle" className="w-100">Edit Car Park Info</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="2x" icon={faParking}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="4" type="text" name="carParkDescription" placeholder="Car Park Information" required defaultValue={this.state.carParkingDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit" onClick={this.carparkupdate}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-cancelBtn" onClick={this.handleCarParkEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Bus Edit Modal */}
                {this.state.busEditModal == true ? 
                    <Modal show={this.state.busEditModal} onHide={this.handleBusEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="GettingToSimHq-modalTitle" className="w-100">Edit Bus Information</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                {this.state.busArray && this.state.busArray.map((busArr) => {
                                    if(busArr.simBusDescription === this.state.simBusDescription) {
                                        return (
                                            <Form noValidate key={busArr.busId}>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faLocationArrow}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="busDescription" placeholder="Location" required defaultValue={this.state.simBusDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faBus}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" name="busNo" placeholder="Bus Numbers" required defaultValue={this.state.busSimArray} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        )
                                    } else {
                                        return (
                                            <Form noValidate key={busArr.busId}>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faLocationArrow}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="busDescription" placeholder="Location" required defaultValue={this.state.oppSimBusDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faBus}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" name="busNo" placeholder="Bus Numbers" required defaultValue={this.state.busOppSimArray} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        )
                                    }
                                })}
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-cancelBtn" onClick={this.handleBusEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* MRT Edit Modal */}
                {this.state.mrtEditModal == true ? 
                    <Modal show={this.state.mrtEditModal} onHide={this.handleMrtEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="GettingToSimHq-modalTitle" className="w-100">Edit MRT Information</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                {this.state.mrtArray && this.state.mrtArray.map((mrtArr) => {
                                    if (mrtArr.downTownDescription === this.state.downTownDescription) {
                                        return (
                                            <Form noValidate key={mrtArr.mrtId}>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faLocationArrow}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="mrtDescription" placeholder="MRT Line" required defaultValue={this.state.downTownDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faTrain}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" name="mrtStation" placeholder="MRT Station Names" required defaultValue={this.state.mrtDownTownArray} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        )
                                    } else {
                                        return (
                                            <Form noValidate key={mrtArr.mrtId}>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faLocationArrow}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="mrtDescription" placeholder="MRT Line" required defaultValue={this.state.eastWestDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faTrain}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" name="mrtStation" placeholder="MRT Station Names" required defaultValue={this.state.mrtEastWestArray} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage"></div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        )
                                    }
                                })}
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit">Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-cancelBtn" onClick={this.handleMrtEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }


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