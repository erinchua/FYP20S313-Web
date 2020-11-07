import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/Sponsors.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileAlt } from '@fortawesome/free-solid-svg-icons';

class Sponsors extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            description: "",
            email: "",
            website: "",
            applicationPeriods: "",
            //Below states are for the functions
            sponsors: "",
            applicationPeriodsFunc: "",
            //Below states are for the modals
            editModal: false,
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
        db.collection("Scholarship").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.id == "scholarship-09") {
                    const applicationPeriods = [];
                    const sponsors = [];

                    for (var i = 0; i < doc.data().applicationPeriods.length; i++) {
                        const appData = {
                            applicationPeriods: doc.data().applicationPeriods[i]
                        }
                        applicationPeriods.push(appData);
                    }

                    const sponsorsData = {
                        description: doc.data().description,
                        email: doc.data().email,
                        website: doc.data().website,
                        id: doc.id,
                    }
                    sponsors.push(sponsorsData);

                    this.setState({
                        applicationPeriodsFunc: applicationPeriods,
                        sponsors: sponsors
                    });
                }
            });
        });

        // //Sponsors
        // const otherfinancialassistance = db.collection("Scholarship")
        // .onSnapshot((snapshot) => {
        //     snapshot.forEach((doc) => {

        //         if(doc.id === "sponsors"){
        //             const sponsorarray = [];
        //             const data = {
        //                 description: doc.data().description,
        //                 id: doc.data().id,
        //             };
        //             sponsorarray.push(data);
        //             this.setState({ sponsorarray: sponsorarray });
        //         }

        //         //SAFRA-SIM GE SPONSORSHIP
        //         if(doc.id === "safraSIMGESponsorship"){
        //             const safraSIMGEarray = [];
        //             const data = {
        //                 description1: doc.data().description1,
        //                 description2: doc.data().description2,
        //                 id: doc.data().id,
        //                 period1: doc.data().period1,
        //                 period2: doc.data().period2,
        //             };
        //             safraSIMGEarray.push(data);
        //             this.setState({ safraSIMGEarray: safraSIMGEarray });
        //         }
            
        //     });
        // });
    }

  /*editStudentCare(e, studentcareid, type) {
    if (type === "workPlayLiveWell") {
      document
        .getElementById(studentcareid + "spanactivitiesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "studentWellnessCentre") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanwelllogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "counsellingService") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounseldes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spancounsellogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simPeerSupport") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanpeerlogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }

    if (type === "simWellnessAdvocates") {
      document
        .getElementById(studentcareid + "upload")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocatesdes")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "spanadvocateslogo")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "editbutton")
        .setAttribute("hidden", "");
      document
        .getElementById(studentcareid + "updatebutton")
        .removeAttribute("hidden");
      document
        .getElementById(studentcareid + "cancelbutton")
        .removeAttribute("hidden");
      var texttohide = document.getElementsByClassName(studentcareid + "text");
      for (var i = 0; i < texttohide.length; i++) {
        texttohide[i].setAttribute("hidden", "");
      }
    }
  }*/

    render() {
        return (
            <div>
                <Container fluid className="Sponsors-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Sponsors-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Sponsors-topContentContainer">
                                        <Row id="Sponsors-firstRow">
                                            <Col md={12} className="text-left" id="Sponsors-firstRowCol">
                                                <h4 id="Sponsors-title">Sponsors</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Sponsors-secondRow">
                                            <Col md={12} className="text-center" id="Sponsors-secondRowCol">
                                                <Table responsive="sm" bordered id="Sponsors-tableContainer">
                                                    <thead id="Sponsors-tableHeader">
                                                        <tr>
                                                            <th colSpan="2">SAFRA-SIM GE Sponsorship</th>
                                                            <th id="Sponsors-editHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                        {this.state.sponsors && this.state.sponsors.map((sponsor) => {
                                                            return (
                                                                <tbody id="Sponsors-tableBody">
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Email</b></td>
                                                                        <td className="text-left">{sponsor.email}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Website</b></td>
                                                                        <td className="text-left">{sponsor.website}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td id="Sponsors-titleHeading"><b>Description</b></td>
                                                                        <td className="text-left">{sponsor.description}</td>
                                                                        <td><Button size="sm" id="Sponsors-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="3"><b>Application Period</b></td>
                                                                    </tr>
                                                                    {this.state.applicationPeriodsFunc && this.state.applicationPeriodsFunc.map((appPeriod) => {
                                                                        return (
                                                                            <tr>
                                                                                <td colSpan="2">{appPeriod.applicationPeriods}</td>
                                                                                <td><Button size="sm" id="Sponsors-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                            </tr>
                                                                        )
                                                                    })}
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

        );
    }
}
export default Sponsors;
