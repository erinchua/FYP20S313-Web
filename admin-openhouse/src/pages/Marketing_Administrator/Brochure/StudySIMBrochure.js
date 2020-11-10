import { Container, Row, Col, Table, Button, Modal, Form, Accordion, Card, Nav, Tab } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Brochures.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faCalendarAlt, faEdit, faEnvelopeOpen, faFileAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons';

class StudySIMBrochure extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            brochureUrl: "",
            description: "",
            imageUrl: "",
            university: "",
            progress: "",
            //Below states are for the functions
            prospectusBrochures: "",
            programmeBrochures: "",
            //Below states are for the modals
        };
    }

    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
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

        //Display Prospectus Brochures
        db.collection("Brochures").where("id", ">=", "prospect-").where("id", "<=", "prospect-" + "\uf8ff")
        .get().then((snapshot) => {
            const prospectusBrochures = [];

            snapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    brochureUrl: doc.data().brochureUrl,
                    description: doc.data().description,
                    imageUrl: doc.data().imageUrl,
                };
                prospectusBrochures.push(data);
            });
            this.setState({
                prospectusBrochures: prospectusBrochures 
            });
        });

        //Display University Brochures
        db.collection("Brochures").where("university", "!=", "")
        .get().then((snapshot) => {
            const programmeBrochures = [];

            snapshot.forEach((doc) => {
                console.log(doc.data());
                const data = {
                    id: doc.id,
                    brochureUrl: doc.data().brochureUrl,
                    description: doc.data().description,
                    imageUrl: doc.data().imageUrl,
                    university: doc.data().university,
                };
                programmeBrochures.push(data);
            });
            this.setState({ 
                programmeBrochures: programmeBrochures 
            });
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

        if (description != null) {
            db.collection("Brochures").doc(brochureid)
            .update({
                description: description,
            })
            .then(function () {
                console.log("Updated");
                window.location.reload();
            });
        }
    }

    // editBrochure(e, brochureid, description) {
    //     var patt = new RegExp("Prospectus");
    //     document.getElementById(brochureid + "upload").removeAttribute("hidden");
    //     document.getElementById(brochureid + "upload1").removeAttribute("hidden");
    //     if(patt.test(description)=== false){
    //     document
    //     .getElementById(brochureid + "spandescription")
    //     .removeAttribute("hidden");
    //     }
    //     document
    //     .getElementById(brochureid + "spanbrochurefile")
    //     .removeAttribute("hidden");
    //     document
    //     .getElementById(brochureid + "spanimagefile")
    //     .removeAttribute("hidden");
    //     document
    //     .getElementById(brochureid + "editbutton")
    //     .setAttribute("hidden", "");
    //     document
    //     .getElementById(brochureid + "updatebutton")
    //     .removeAttribute("hidden");
    //     document
    //     .getElementById(brochureid + "cancelbutton")
    //     .removeAttribute("hidden");
    //     var texttohide = document.getElementsByClassName(brochureid + "text");
    //     for (var i = 0; i < texttohide.length; i++) {
    //         texttohide[i].setAttribute("hidden", "");
    //     }
    // }

    // CancelEdit(e, brochureid,description) {
    //     var patt = new RegExp("Prospectus");
    //     document.getElementById(brochureid + "upload").setAttribute("hidden", "");
    //     document.getElementById(brochureid + "upload1").setAttribute("hidden", "");
    //     if(patt.test(description)=== false){
    //         document
    //         .getElementById(brochureid + "spandescription")
    //         .setAttribute("hidden", "");
    //     }
    //     document
    //     .getElementById(brochureid + "spanbrochurefile")
    //     .setAttribute("hidden", "");
    //     document
    //     .getElementById(brochureid + "spanimagefile")
    //     .setAttribute("hidden", "");
    //     document
    //     .getElementById(brochureid + "editbutton")
    //     .removeAttribute("hidden");
    //     document
    //     .getElementById(brochureid + "updatebutton")
    //     .setAttribute("hidden", "");
    //     document
    //     .getElementById(brochureid + "cancelbutton")
    //     .setAttribute("hidden", "");
    //     var texttohide = document.getElementsByClassName(brochureid + "text");
    //     for (var i = 0; i < texttohide.length; i++) {
    //         texttohide[i].removeAttribute("hidden", "");
    //     }
    // }

  
    handleProspectSavePDF = (brochureid) => {
        const parentthis = this;

        console.log(this.state.files);

        if (this.state.brochurefiles !== undefined) {
            const foldername = "/Brochures/Prospectus";
            const storageRef = storage.ref(foldername);
            const fileRef = storageRef.child(this.state.brochurefiles[0].name).put(this.state.brochurefiles[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    db.collection("Brochures").doc(brochureid)
                    .update({
                        brochureUrl: downloadURL,
                    })
                    .then(function () {
                        console.log("Updated");
                        window.location.reload();
                    });
                });
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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

        console.log(this.state.files);

        if (this.state.imagefiles !== undefined) {
            const foldername = "/Brochures/Prospectus";
            const storageRef = storage.ref(foldername);
            const fileRef = storageRef.child(this.state.imagefiles[0].name).put(this.state.imagefiles[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    db.collection("Brochures").doc(brochureid)
                    .update({
                        imageUrl: downloadURL,
                    })
                    .then(function () {
                        console.log("Updated");
                        window.location.reload();
                    });
                });
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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

        console.log(this.state.files);

        if (this.state.brochurefiles !== undefined) {
            const storageRef = storage.ref(path);
            const fileRef = storageRef.child(this.state.brochurefiles[0].name).put(this.state.brochurefiles[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    db.collection("Brochures").doc(brochureid)
                    .update({
                        brochureUrl: downloadURL,
                    })
                    .then(function () {
                        console.log("Updated");
                        window.location.reload();
                    });
                });
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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

        console.log(this.state.files);

        if (this.state.imagefiles !== undefined) {
            // const foldername = "/Brochures/Prospectus";
            const storageRef = storage.ref(path);
            const fileRef = storageRef.child(this.state.imagefiles[0].name).put(this.state.imagefiles[0]);
            fileRef.on("state_changed", function (snapshot) {
                fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                    db.collection("Brochures").doc(brochureid)
                    .update({
                        imageUrl: downloadURL,
                    })
                    .then(function () {
                        console.log("Updated");
                        window.location.reload();
                    });
                });
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
            <div>
                <Container fluid className="Brochures-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Brochures-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Brochures-topContentContainer">
                                        <Row id="Brochures-firstRow">
                                            <Col md={12} className="text-left" id="Brochures-firstRowCol">
                                                <h4 id="Brochures-title">Study@SIM Brochures</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Brochures-secondRow">
                                            <Col md={12} id="Brochures-secondRowCol">
                                                <Tab.Container defaultActiveKey="prospectus">
                                                    <Row className="Brochures-secondInnerRow">
                                                        <Col md={12} className="Brochures-secondInnerCol">
                                                            <Nav defaultActiveKey="prospectus" className="Brochures-nav" variant="tabs">
                                                                <Col md={6} className="text-center Brochures-navItemCon">
                                                                    <Nav.Item className="Brochures-navItems">
                                                                        <Nav.Link eventKey="prospectus" className="Brochures-navLinks">Prospectus</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={6} className="text-center Brochures-navItemCon">
                                                                    <Nav.Item className="Brochures-navItems">
                                                                        <Nav.Link eventKey="programmes" className="Brochures-navLinks">Programmes</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>
                                                    
                                                    <Row className="Brochures-secondInnerRow">
                                                        <Col md={12} className="Brochures-secondInnerCol">
                                                            <Tab.Content>
                                                                
                                                                {/* Prospectus */}
                                                                <Tab.Pane eventKey="prospectus">
                                                                    <Col md={12} className="text-center Brochures-tableColCon">
                                                                        <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                            <thead id="Brochures-tableHeader">
                                                                                <tr>
                                                                                    <th id="Brochures-descHeading">Description</th>
                                                                                    <th id="Brochures-imageHeading">Image</th>
                                                                                    <th>Brochure</th>
                                                                                    <th id="Brochures-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.prospectusBrochures && this.state.prospectusBrochures.map((prospectus) => {
                                                                                return (
                                                                                    <tbody id="Brochures-tableBody" key={prospectus.id}>
                                                                                        <tr>
                                                                                            <td>{prospectus.description}</td>
                                                                                            <td>
                                                                                                <img src={prospectus.imageUrl} height="100" width="80"/>
                                                                                            </td>
                                                                                            <td className="text-left">{prospectus.brochureUrl}</td>
                                                                                            <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Programmes */}
                                                                <Tab.Pane eventKey="programmes">
                                                                    <Col md={12} className="Brochures-tableColCon">
                                                                        <Accordion defaultActiveKey="birmingham">
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="birmingham">University of Birmingham</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="birmingham">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.programmeBrochures && this.state.programmeBrochures.map((programme) => {
                                                                                                    if (programme.university === "University of Birmingham") {
                                                                                                        return (
                                                                                                            <tbody id="Brochures-tableBody" key={programme.id}>
                                                                                                                <tr>
                                                                                                                    <td>{programme.description}</td>
                                                                                                                    <td>
                                                                                                                        <img src={programme.imageUrl} height="100" width="80"/>
                                                                                                                    </td>
                                                                                                                    <td className="text-left">{programme.brochureUrl}</td>
                                                                                                                    <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    }
                                                                                                })}
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="buffalo">University of Buffalo</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="buffalo">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-SNoHeading">S/N</th>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="laTrobe">La Trobe University</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="laTrobe">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-SNoHeading">S/N</th>
                                                                                                        <th id="Brochures-descHeading">Description</th>
                                                                                                        <th id="Brochures-imageHeading">Image</th>
                                                                                                        <th>Brochure</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="rmit">RMIT University</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="rmit">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="sim">Singapore Institute of Management</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="sim">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Row id="Brochures-secondRow">
                                                                                            <Col md={12} className="text-center Brochures-tableColCon">
                                                                                                <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                    <thead id="Brochures-tableHeader">
                                                                                                        <tr>
                                                                                                            <th id="Brochures-emailHeading">Email</th>
                                                                                                            <th id="Brochures-contactHeading">Contact</th>
                                                                                                            <th>Website</th>
                                                                                                            <th>Description</th>
                                                                                                            <th id="Brochures-editHeading">Edit</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                    <tbody id="Brochures-tableBody">
                                                                                                        <tr>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td className="text-left"></td>
                                                                                                            <td className="text-left"></td>
                                                                                                            <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </Table>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="stirling">University of Stirling</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="stirling">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="sydney">The University of Sydney</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="sydney">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="london">University of London</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="london">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="warwick">The University of Warwick</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="warwick">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            <Card>
                                                                                <div className="Brochures-Header">
                                                                                    <Accordion.Toggle as={Card.Header} eventKey="wollongong">University of Wollongong</Accordion.Toggle>
                                                                                </div>
                                                                                <Accordion.Collapse eventKey="wollongong">
                                                                                    <Card.Body className="Brochures-cardBody">
                                                                                        <Col md={12} className="text-center Brochures-tableColCon">
                                                                                            <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                                                                <thead id="Brochures-tableHeader">
                                                                                                    <tr>
                                                                                                        <th id="Brochures-emailHeading">Email</th>
                                                                                                        <th id="Brochures-contactHeading">Contact</th>
                                                                                                        <th>Website</th>
                                                                                                        <th>Description</th>
                                                                                                        <th id="Brochures-editHeading">Edit</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="Brochures-tableBody">
                                                                                                    <tr>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td className="text-left"></td>
                                                                                                        <td><Button size="sm" id="Brochures-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </Col>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                        </Accordion>
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

            </div>


            // <div className="home">
            //     <h2>Study@SIM Brochures</h2>
            //     <div>
            //     <table id="users" class="table table-bordered">
            //         <tbody>
            //         <h4>Prospectus</h4>
            //         <tr>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.prospectbrochures &&
            //             this.state.prospectbrochures.map((prospectbrochures) => {
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={prospectbrochures.id + "text"}>
            //                     {prospectbrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={prospectbrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={prospectbrochures.id + "imagefile"}
            //                         defaultValue={prospectbrochures.imageUrl}
            //                         type="text"
            //                         name={prospectbrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={prospectbrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={prospectbrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={prospectbrochures.id + "text"}>
            //                     {prospectbrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={prospectbrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={prospectbrochures.id + "brochurefile"}
            //                         defaultValue={prospectbrochures.brochureUrl}
            //                         type="text"
            //                         name={prospectbrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={prospectbrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={prospectbrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={prospectbrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, prospectbrochures.id, prospectbrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={prospectbrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.handleProspectSavePDF(prospectbrochures.id);
            //                         this.handleProspectSaveImage(prospectbrochures.id);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={prospectbrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, prospectbrochures.id,prospectbrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         <br/>
            //         <h4>La Trobe University</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "La Trobe University")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}

            //             <br/>
            //         <h4>RMIT University</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "RMIT University")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}

            //             <br/>
            //         <h4>Singapore Institute of Management</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "Singapore Institute of Management")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })} 

            //             <br/>
            //         <h4>University of Stirling</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Stirling")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}

            //             <br/>
            //         <h4>University of Buffalo</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Buffalo")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })} 

            //             <br/>
            //         <h4>University of Birmingham</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Birmingham")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}  

            //             <br/>
            //         <h4>University of London</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of London")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })} 

            //             <br/>
            //         <h4>University of Wollongong</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Wollongong")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })} 

            //             <br/>
            //         <h4>University of Sydney</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Sydney")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })} 

            //             <br/>
            //         <h4>University of Warwick</h4>
            //         <tr>
            //             <th scope="col">Brochure Description</th>
            //             <th scope="col">Brochure Cover Image</th>
            //             <th scope="col">Brochure File</th>
            //             <th scope="col">Edit</th>
            //         </tr>
            //         {this.state.unibrochures &&
            //             this.state.unibrochures.map((unibrochures) => {
            //             if(unibrochures.university === "University of Warwick")
            //             return (
            //                 <tr>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.description}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spandescription"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "description"}
            //                         defaultValue={unibrochures.description}
            //                         type="text"
            //                         name={unibrochures.id + "description"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.description}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.imageUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanimagefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "imagefile"}
            //                         defaultValue={unibrochures.imageUrl}
            //                         type="text"
            //                         name={unibrochures.id + "imagefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.imageUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleImageFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={unibrochures.id + "text"}>
            //                     {unibrochures.brochureUrl}
            //                     </span>
            //                     <span
            //                     id={unibrochures.id + "spanbrochurefile"}
            //                     hidden
            //                     >
            //                     <input
            //                         id={unibrochures.id + "brochurefile"}
            //                         defaultValue={unibrochures.brochureUrl}
            //                         type="text"
            //                         name={unibrochures.id + "brochurefile"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={unibrochures.brochureUrl}
            //                         required
            //                         disabled={"disabled"}
            //                     />
            //                     </span>
            //                     <span id={unibrochures.id + "upload1"} hidden>
            //                     <input
            //                         type="file"
            //                         onChange={(e) => {
            //                         this.handleBrochureFileUpload(e.target.files);
            //                         }}
            //                     />

            //                     {this.state.progress}
            //                     <div>
            //                         <progress value={this.state.progress} max="100" />
            //                     </div>
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={unibrochures.id + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editBrochure(e, unibrochures.id, unibrochures.description);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={unibrochures.id + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(unibrochures.id);
            //                         this.handleUniSavePDF(unibrochures.id,unibrochures.university );
            //                         this.handleUniSaveImage(unibrochures.id,unibrochures.university);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={unibrochures.id + "cancelbutton"}
            //                     onClick={(e) => {
            //                     this.CancelEdit(e, unibrochures.id,unibrochures.description);
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
export default StudySIMBrochure;