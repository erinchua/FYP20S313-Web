import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../config/firebase";
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

const initialStates = {
    mapUrlError: "",
    carDescriptionError: "",
    carParkingDescriptionError: "",
    busDescriptionError: "",
    busNoError: "",
    mrtDescriptionError: "",
    mrtLineError: "",
}

class GettingToSIMHQ extends Component {

    state = initialStates;

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
            editOppSimArray: "",
            editSimArray: "",
            busNo: "",
            busLocation: "",
            SIMHQbusNo1:"",
            SIMHQbusNo2:"",
            SIMHQbusNo3:"",
            SIMHQbusNo4:"",
            SIMHQbusNo5:"",
            SIMHQbusNo6:"",
            SIMHQbusNo7:"",
            SIMHQbusNo8:"",
            SIMHQbusNo9:"",
            busDescription:"",
           
            OppSIMHQbusNo1:"",
            OppSIMHQbusNo2:"",
            OppSIMHQbusNo3:"",
            OppSIMHQbusNo4:"",
            OppSIMHQbusNo5:"",
            OppSIMHQbusNo6:"",
            OppSIMHQbusNo7:"",
            OppSIMHQbusNo8:"",
            OppSIMHQbusNo9:"",
            OppSIMHQbusNo10:"",
            OppbusDescription:"",
            //Below states are for MRT 
            mrtId: "",
            downTownDescription: "",
            eastWestDescription: "",
            mrtArray: "",
            mrtDownTownArray: "",
            mrtEastWestArray: "",
            editDownTownArray: "",
            editEastWestArray: "",
            nearestMRT: "",
            mrtLine: "",
            DowntownmrtDescription: "",
            EastwestmrtDescription: "",
            Downtownstation1: "",
            Downtownstation2: "",
            Downtownstation3: "",
            Eastweststation1: "",
            Eastweststation2: "",
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
        auth.onAuthStateChanged((user) => {
            if (user) {

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

        if (e.target.title === "SIMHQbusNo"){
            this.setState({
                busLocation: "SIMHQbusNo"                
            });
        } else if (e.target.title === "OppSIMHQbusNo"){
            this.setState({
                busLocation: "OppSIMHQbusNo"                
            });
        }

        if (e.target.title === "Downtown"){
            this.setState({
                mrtLine: "Downtown"                
            });
        } else if (e.target.title === "Eastwest"){
            this.setState({
                mrtLine: "Eastwest"                
            });
        }
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
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

                    // set each SIMHQbus to state
                    for (var i = 0; i <simHq.length; i++) {
                        var statename = "SIMHQbusNo"+(i+1);
                        this.state[statename] =  simHq.sort(sortFunction)[i]
                    }
                    
                    // set each OppSIMHQbus to state
                    for (var i = 0; i <oppSimHq.length; i++) {
                        var statename = "OppSIMHQbusNo"+(i+1);
                        this.state[statename] =  oppSimHq.sort(sortFunction)[i]
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
                        editOppSimArray: oppSimHq,
                        editSimArray: simHq,
                    }));
                    this.state.SIMHQbusDescription  = doc.data().simHq.description;
                    this.state.OppSIMHQbusDescription  = doc.data().oppSimHq.description;
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

                    // set each downtownmrt to state
                    console.log(downTownLine.length)
                    for (var i = 0; i <downTownLine.length; i++) {
                        var statename = "Downtownstation"+(i+1);
                        this.state[statename] =  downTownLine.sort(sortAlphabet)[i]
                    }
                        
                    // set each eastwestmrt to state
                    for (var i = 0; i <eastWestLine.length; i++) {
                        var statename = "Eastweststation"+(i+1);
                        this.state[statename] =  eastWestLine.sort(sortAlphabet)[i]
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
                        mrtEastWestArray: eastWestLine.sort(sortAlphabet).join(", "),
                        editDownTownArray: downTownLine,
                        editEastWestArray: eastWestLine,
                    }));
                    this.state.DowntownmrtDescription  = doc.data().downtownLine.description;
                    this.state.EastwestmrtDescription  = doc.data().eastwestLine.description;
                }
                
                //Map Image File
                if (doc.id === "map") {
                    const maparray = [];
                    const data = {
                        mapId: doc.id,
                        url: doc.data().url,
                    };
                    maparray.push(data);
                    this.setState({ 
                        mapurl : doc.data().url,
                        mapArray: maparray 
                    });
                }
            });
        });;

    }

    carupdate = () => {
        const isValid = this.validateCar();

        if (isValid) {
            this.setState(initialStates);

            db.collection("CampusLocation").doc("car")
            .update({
                carDescription: this.state.carDescription,
            })
            .then(() => {
                console.log("Updated Car Info");
                this.setState({
                    carEditModal: false
                });
                this.display();
            });
        }
    };

    busupdate = () => {
        var title = this.state.busLocation;
        const isValid = this.validateBus();
        
        if (title == "SIMHQbusNo") {
            if (isValid) {
                this.setState(initialStates);

                db.collection("CampusLocation").doc("bus")
                .update({
                    "simHq.description": this.state.SIMHQbusDescription,
                    "simHq.buses.bus1": this.state.SIMHQbusNo1,
                    "simHq.buses.bus2": this.state.SIMHQbusNo2,
                    "simHq.buses.bus3": this.state.SIMHQbusNo3,
                    "simHq.buses.bus4": this.state.SIMHQbusNo4,
                    "simHq.buses.bus5": this.state.SIMHQbusNo5,
                    "simHq.buses.bus6": this.state.SIMHQbusNo6,
                    "simHq.buses.bus7": this.state.SIMHQbusNo7,
                    "simHq.buses.bus8": this.state.SIMHQbusNo8,
                    "simHq.buses.bus9": this.state.SIMHQbusNo9,
                    "simHq.buses.bus10": this.state.SIMHQbusNo10,
                })
                .then(() => {
                    console.log("Updated Bus Info");
                    this.setState({
                        busEditModal: false
                    });
                    this.display();
                });
            }

        } else if (title == "OppSIMHQbusNo") {
            if (isValid) {
                this.setState(initialStates);

                db.collection("CampusLocation").doc("bus")
                .update({
                    "oppSimHq.description": this.state.OppSIMHQbusDescription,
                    "oppSimHq.buses.bus1": this.state.OppSIMHQbusNo1,
                    "oppSimHq.buses.bus2": this.state.OppSIMHQbusNo2,
                    "oppSimHq.buses.bus3": this.state.OppSIMHQbusNo3,
                    "oppSimHq.buses.bus4": this.state.OppSIMHQbusNo4,
                    "oppSimHq.buses.bus5": this.state.OppSIMHQbusNo5,
                    "oppSimHq.buses.bus6": this.state.OppSIMHQbusNo6,
                    "oppSimHq.buses.bus7": this.state.OppSIMHQbusNo7,
                    "oppSimHq.buses.bus8": this.state.OppSIMHQbusNo8,
                    "oppSimHq.buses.bus9": this.state.OppSIMHQbusNo9,
                })
                .then(() => {
                    console.log("Updated Bus Info");
                    this.setState({
                        busEditModal: false
                    });
                    this.display();
                });
            }
        }
    };

    mrtupdate = () => {
        var title = this.state.mrtLine;
        const isValid = this.validateMrt();
                
        if (title == "Downtown") {
            if (isValid) {
                this.setState(initialStates);

                db.collection("CampusLocation").doc("mrt")
                .update({
                    "downtownLine.description": this.state.DowntownmrtDescription,
                    "downtownLine.stations.station1": this.state.Downtownstation1,
                    "downtownLine.stations.station2": this.state.Downtownstation2,
                    "downtownLine.stations.station3": this.state.Downtownstation3,
                })
                .then(() => {
                    console.log("Updated MRT Info");
                    this.setState({
                        mrtEditModal: false
                    });
                    this.display();
                });
            }

        } else if(title == "Eastwest") {
            if (isValid) {
                this.setState(initialStates);

                db.collection("CampusLocation").doc("mrt")
                .update({
                    "eastwestLine.description": this.state.EastwestmrtDescription,
                    "eastwestLine.stations.station1": this.state.Eastweststation1,
                    "eastwestLine.stations.station2": this.state.Eastweststation2,
                })
                .then(() => {
                    console.log("Updated MRT Info");
                    this.setState({
                        mrtEditModal: false
                    });
                    this.display();
                });
            }
        }
    };

    carparkupdate = () => {
        const isValid = this.validateCarParking();

        if (isValid) {
            this.setState(initialStates);

            db.collection("CampusLocation").doc("car")
            .update({
                carParkingDescription: this.state.carParkingDescription,
            })
            .then(() => {
                console.log("Updated Car Park Info");
                this.setState({
                    carParkEditModal: false
                });
                this.display();
            });
        }
    };

    handleFileUpload = (files) => {
        this.setState({
            files: files,
        });
    };

    handleSave = (mapImage) => {
        // Create a reference to the file to delete
        var desertRef = storage.refFromURL(this.state.mapurl)

        // Delete the file
        desertRef.delete();
        const parentthis = this;

        const isValid = this.validateCampusMap();

        if (this.state.files !== undefined) {
            const foldername = "CampusLocation";
            const file = this.state.files[0];
            const storageRef = storage.ref(foldername);
            const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log("File available at", downloadURL);

                    if (isValid) {
                        this.setState(initialStates);

                        db.collection("CampusLocation").doc("map")
                        .update({
                            url: downloadURL,
                        })
                        .then(function() {
                            console.log("Updated the Map Image");
                        });
                    }
                    
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
            this.setState({
                mapEditModal: false
            })
        } else {
            console.log("No Files Selected");
        }
    };

    handleMapEditModal = (map) => {
        if (this.state.mapEditModal == false) {
            this.setState({
                mapEditModal: true,
                mapId: map.id,
                mapUrl: map.url,
            })
        }
        else {
            this.setState({
                mapEditModal: false
            });
            this.setState(initialStates);
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
            this.setState(initialStates);
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
            this.setState(initialStates);
        }
    }

    handleBusEditModal = (bus) => {
        if (this.state.busEditModal == false) {
            this.setState({
                busEditModal: true,
                simBusDescription: bus,
                oppSimBusDescription: bus,
            });
        }
        else {
            this.setState({
                busEditModal: false
            });
            this.setState(initialStates);
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
            this.setState(initialStates);
        }
    }

    validateCampusMap = () => {
        let mapUrlError = "";

        if (!this.state.mapUrl) {
            mapUrlError = "Please browse a valid image."
        }

        if (mapUrlError) {
            this.setState({mapUrlError});
            return false;
        }

        return true;
    }

    validateCar = () => {
        let carDescriptionError = "";

        if (!this.state.carDescription) {
            carDescriptionError = "Please enter a valid description."
        }

        if (carDescriptionError) {
            this.setState({carDescriptionError});
            return false;
        }

        return true;
    }

    validateCarParking = () => {
        let carParkingDescriptionError = "";

        if (!this.state.carParkingDescription) {
            carParkingDescriptionError = "Please enter a valid description."
        }

        if (carParkingDescriptionError) {
            this.setState({carParkingDescriptionError});
            return false;
        }

        return true;
    }

    validateBus = () => {
        let busDescriptionError = "";
        let busNoError = "";

        if (!this.state.OppSIMHQbusDescription || !this.state.SIMHQbusDescription) {
            busDescriptionError = "Please enter a valid description."
        }

        /*//Dont delete this
        if (!this.state.oppSimBus) {
            busNoError = "Please enter valid bus numbers."
        }*/

        if (busDescriptionError || busNoError) {
            this.setState({busDescriptionError, busNoError});
            return false;
        }

        return true;
    }

    validateMrt = () => {
        let mrtDescriptionError = "";
        let mrtLineError = "";

        if (!this.state.DowntownmrtDescription || !this.state.EastwestmrtDescription) {
            mrtDescriptionError = "Please enter a valid description."
        }

        /*//Dont delete this
        if (!this.state.oppSimBus) {
            mrtLineError = "Please enter valid bus numbers."
        }*/

        if (mrtDescriptionError || mrtLineError) {
            this.setState({mrtDescriptionError, mrtLineError});
            return false;
        }

        return true;
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
                                                            <Nav defaultActiveKey="map" className="GettingToSimHq-nav" variant="tabs">
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
                                                                            {this.state.mapArray && this.state.mapArray.map((map) => {
                                                                                return (
                                                                                    <tbody id="GettingToSimHq-tableBody" key={map.mapId}>
                                                                                        <tr>
                                                                                            <td className="text-left">Getting to SIM HQ Map Image</td>
                                                                                            <td><Button size="sm" id="GettingToSimHq-editBtn" onClick={() => this.handleMapEditModal(map)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                            <img height="200px" width="400px" src={this.state.mapUrl} style={{marginBottom: "3%"}}/>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="GettingToSimHq-imgFile" label={this.state.mapUrl} onChange={(e) => {this.handleFileUpload(e.target.files)}} custom required></Form.File>
                                                <div className="errorMessage">{this.state.mapUrlError}</div>
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
                                                <div className="errorMessage">{this.state.carDescriptionError}</div>
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
                                                <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="4" type="text" name="carParkingDescription" placeholder="Car Park Information" required defaultValue={this.state.carParkingDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.carParkingDescriptionError}</div>
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
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="SIMHQbusDescription" placeholder="Location" required defaultValue={this.state.simBusDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.busDescriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                {this.state.editSimArray && this.state.editSimArray.map((bus, index) => {
                                                    this.state.busLocation = "SIMHQbusNo"
                                                    return (
                                                        <Form.Group>
                                                            <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                                <Form.Group as={Col} md="1">
                                                                    <FontAwesomeIcon size="lg" icon={faBus}/>
                                                                </Form.Group> 
                                                                <Form.Group as={Col} md="7">
                                                                    <Form.Control id="GettingToSimHq-textAreas" title="SIMHQbusNo" as="textarea" rows="2" type="text" name={"SIMHQbusNo"+ (index+1)} placeholder="Bus Numbers" required defaultValue={this.state.editSimArray[index]} onChange={this.updateInput} noValidate></Form.Control>
                                                                    <div className="errorMessage">{this.state.busNoError}</div>
                                                                </Form.Group>
                                                            </Form.Group>                     
                                                        </Form.Group>
                                                    )
                                                })}
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
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="OppSIMHQbusDescription" placeholder="Location" required defaultValue={this.state.oppSimBusDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.busDescriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                {this.state.editOppSimArray && this.state.editOppSimArray.map((bus, index) => {
                                                    return (
                                                        <Form.Group>
                                                            <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                                <Form.Group as={Col} md="1">
                                                                    <FontAwesomeIcon size="lg" icon={faBus}/>
                                                                </Form.Group> 
                                                                <Form.Group as={Col} md="7">
                                                                    <Form.Control id="GettingToSimHq-textAreas"  title="OppSIMHQbusNo" as="textarea" rows="2" type="text" name={"OppSIMHQbusNo"+ (index+1)} placeholder="Bus Numbers" required defaultValue={this.state.editOppSimArray[index]} onChange={this.updateInput} noValidate></Form.Control>
                                                                    <div className="errorMessage">{this.state.busNoError}</div>
                                                                </Form.Group>
                                                            </Form.Group>                     
                                                        </Form.Group>
                                                    )
                                                })}
                                            </Form>
                                        )
                                    }
                                })}
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit" onClick={this.busupdate}>Save Changes</Button>
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
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="DowntownmrtDescription" placeholder="MRT Line" required defaultValue={this.state.downTownDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.mrtDescriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                {this.state.editDownTownArray && this.state.editDownTownArray.map((mrt, index) => {
                                                    this.state.mrtLine = "Downtown"
                                                    return (
                                                        <Form.Group>
                                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                            <Form.Group as={Col} md="1">
                                                                <FontAwesomeIcon size="lg" icon={faTrain}/>
                                                            </Form.Group> 
                                                            <Form.Group as={Col} md="7">
                                                                <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" title="Downtown" name={"Downtownstation" + (index+1)} placeholder="MRT Station Names" required defaultValue={this.state.editDownTownArray[index]} onChange={this.updateInput} noValidate></Form.Control>
                                                                <div className="errorMessage">{this.state.mrtLineError}</div>
                                                            </Form.Group>
                                                        </Form.Group>                     
                                                    </Form.Group>
                                                    )
                                                })}
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
                                                            <Form.Control id="GettingToSimHq-inputFields" type="text" name="EastwestmrtDescription" placeholder="MRT Line" required defaultValue={this.state.eastWestDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.mrtDescriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                {this.state.editEastWestArray && this.state.editEastWestArray.map((mrt, index) => {
                                                    this.state.mrtLine = "Eastwest"
                                                    return (
                                                        <Form.Group>
                                                        <Form.Group as={Row} className="GettingToSimHq-formGroup">
                                                            <Form.Group as={Col} md="1">
                                                                <FontAwesomeIcon size="lg" icon={faTrain}/>
                                                            </Form.Group> 
                                                            <Form.Group as={Col} md="7">
                                                                <Form.Control id="GettingToSimHq-textAreas" as="textarea" rows="2" type="text" title="Eastwest" name={"Eastweststation" + (index+1)} placeholder="MRT Station Names" required defaultValue={this.state.editEastWestArray[index]} onChange={this.updateInput} noValidate></Form.Control>
                                                                <div className="errorMessage">{this.state.mrtLineError}</div>
                                                            </Form.Group>
                                                        </Form.Group>                     
                                                    </Form.Group>
                                                    )
                                                })}
                                            </Form>
                                        )
                                    }
                                })}
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="GettingToSimHq-editFooter">
                                        <Col md={6} className="GettingToSimHq-editCol">
                                            <Button id="GettingToSimHq-saveBtn" type="submit" onClick={this.mrtupdate}>Save Changes</Button>
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
        );
    }
}
export default GettingToSIMHQ;