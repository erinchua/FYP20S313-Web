import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/GuidedTours.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

class GuidedTour extends Component {
    constructor() {
        super();
        this.state = {
            date: "",
            endTime: "",
            startTime: "",
            tourName: "",
            venue: "",
            counter: "",
            addModal: false,
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
        var day1_counter = 1;
        var day2_counter = 1;
        const userRef = db
        .collection("GuidedTours").orderBy("date", "asc")
        .get()
        .then((snapshot) => {
            const guidedTour = [];
            snapshot.forEach((doc) => {
                if (doc.data().date == "21-Nov-2020") {
                    const data = {
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        tourName: doc.data().tourName,
                        venue: doc.data().venue,
                        id: doc.id,
                        counter: day1_counter,
                    };
                    day1_counter++;
                    guidedTour.push(data);
                } else {
                    const data = {
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        tourName: doc.data().tourName,
                        venue: doc.data().venue,
                        id: doc.id,
                        counter: day2_counter,
                    };
                    day2_counter++;
                    guidedTour.push(data);
                }
            });
            
            this.setState({ guidedTour: guidedTour });
        });
    }

    addGuidedTour = (e) => {
        e.preventDefault();
        const db = fire.firestore();
        const userRef = db
        .collection("GuidedTours")
        .add({
            date: this.state.date,
            endTime: this.state.endTime,
            startTime: this.state.startTime,
            tourName: this.state.tourName,
            venue: this.state.venue,
        })
        .then(function () {
            window.location.reload();
        });
    };

    DeleteGuidedTour(e, guidedtourid) {
        const db = fire.firestore();
        const userRef = db
        .collection("GuidedTours")
        .doc(guidedtourid)
        .delete()
        .then(function () {
            alert("Deleted");
            window.location.reload();
        });
    }

    update(e, guidedtourid) {
        const tourName = document.getElementById(guidedtourid + "tourname").value
        const startTime = document.getElementById(guidedtourid + "starttime").value
        const endTime = document.getElementById(guidedtourid + "endtime").value
        const venue = document.getElementById(guidedtourid + "venue").value

        const db = fire.firestore();
        if (tourName != null && startTime != null && endTime != null && venue != null) {
        const userRef = db
            .collection("GuidedTours")
            .doc(guidedtourid)
            .update({
                endTime: endTime,
                startTime: startTime,
                tourName: tourName,
                venue: venue,
            })
            .then(function () {
                alert("Updated");
                window.location.reload();
            });
        }
    }

    editGuidedTour(e, guidedtourid) {
        document.getElementById(guidedtourid + "spantourname").removeAttribute("hidden");
        document.getElementById(guidedtourid + "spanstarttime").removeAttribute("hidden");
        document.getElementById(guidedtourid + "spanendtime").removeAttribute("hidden");
        document.getElementById(guidedtourid + "spanvenue").removeAttribute("hidden");
        document.getElementById(guidedtourid + "editbutton").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "updatebutton").removeAttribute("hidden");
        document.getElementById(guidedtourid + "cancelbutton").removeAttribute("hidden");
        var texttohide = document.getElementsByClassName(
            guidedtourid + "text"
        );
        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].setAttribute("hidden", "");
        }  
    }

    CancelEdit(e, guidedtourid) {
        document.getElementById(guidedtourid + "spantourname").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "spanstarttime").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "spanendtime").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "spanvenue").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "editbutton").removeAttribute("hidden");
        document.getElementById(guidedtourid + "updatebutton").setAttribute("hidden", "");
        document.getElementById(guidedtourid + "cancelbutton").setAttribute("hidden", "");
        var texttohide = document.getElementsByClassName(
            guidedtourid + "text"
        );
        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].removeAttribute("hidden", "");
        }
    }

    //Add Modal
    handleAdd = () => {
        this.addModal = this.state.addModal;
        if (this.addModal == false) {
            this.setState({
                addModal: true
            });
        } else {
            this.setState({
                addModal: false
            });
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="GuidedTours-container">
                    <NavBar isMA={true} />

                        <Container fluid className="GuidedTours-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="GuidedTours-topContentContainer">
                                        <Row id="GuidedTours-firstRow">
                                            <Col md={6} className="text-left" id="GuidedTours-firstRowCol">
                                                <h4 id="GuidedTours-title">Guided Tours</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="GuidedTours-firstRowCol">
                                                <Button id="GuidedTours-addBtn" onClick={this.handleAdd.bind(this)}><FontAwesomeIcon size="lg" icon={faPlus} /><span id="GuidedTours-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="GuidedTours-secondRow">
                                            <Col md={12} id="GuidedTours-secondRowCol">
                                                <Tab.Container defaultActiveKey="day1">
                                                    <Row className="GuidedTours-secondInnerRow">
                                                        <Col md={12} className="GuidedTours-secondInnerCol">
                                                            <Nav defaultActiveKey="day1" className="GuidedTours-nav" variant="tabs">
                                                                <Col md={6} className="text-center GuidedTours-navItemCon">
                                                                    <Nav.Item className="GuidedTours-navItems">
                                                                        <Nav.Link eventKey="day1" className="GuidedTours-navLinks">Day 1</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={6} className="text-center GuidedTours-navItemCon">
                                                                    <Nav.Item className="GuidedTours-navItems">
                                                                        <Nav.Link eventKey="day2" className="GuidedTours-navLinks">Day 2</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>

                                                    <Row className="GuidedTours-secondInnerRow">
                                                        <Col md={12} className="GuidedTours-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="day1">
                                                                    <Col md={12} className="text-center GuidedTours-tableColCon">
                                                                        <Table responsive="sm" bordered className="GuidedTours-tableCon">
                                                                            <thead className="GuidedTours-tableHeader">
                                                                                <tr>
                                                                                    <th>Tour No.</th>
                                                                                    <th>Tour</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GuidedTours-tableBody">
                                                                                {this.state.guidedTour && this.state.guidedTour.map((guidedTour) => {
                                                                                    return(
                                                                                        <>
                                                                                        {guidedTour.date == "21-Nov-2020" ? 
                                                                                        <tr>
                                                                                            <td>{guidedTour.counter}</td>
                                                                                            <td>{guidedTour.tourName}</td>
                                                                                            <td>{guidedTour.startTime}</td>
                                                                                            <td>{guidedTour.endTime}</td>
                                                                                            <td>{guidedTour.venue}</td>
                                                                                            <td><Button size="sm" id="GuidedTours-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            <td><Button size="sm" id="GuidedTours-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                        </tr> : ''
                                                                                        }
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>


                                                                <Tab.Pane eventKey="day2">
                                                                    <Col md={12} className="text-center GuidedTours-tableColCon">
                                                                        <Table responsive="sm" bordered className="GuidedTours-tableCon">
                                                                            <thead className="GuidedTours-tableHeader">
                                                                                <tr>
                                                                                    <th>Tour No.</th>
                                                                                    <th>Tour</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GuidedTours-tableBody">
                                                                                {this.state.guidedTour && this.state.guidedTour.map((guidedTour) => {
                                                                                    return(
                                                                                        <>
                                                                                        {guidedTour.date == "22-Nov-2020" ? 
                                                                                        <tr>
                                                                                            <td>{guidedTour.counter}</td>
                                                                                            <td>{guidedTour.tourName}</td>
                                                                                            <td>{guidedTour.startTime}</td>
                                                                                            <td>{guidedTour.endTime}</td>
                                                                                            <td>{guidedTour.venue}</td>
                                                                                            <td><Button size="sm" id="GuidedTours-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            <td><Button size="sm" id="GuidedTours-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                        </tr> : ''
                                                                                        }
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </tbody>
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

                
                {this.state.addModal == true ? 
                    <Modal show={this.state.addModal} onHide={this.handleAdd} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Form novalidate>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" />
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="date" placeholder="Date" required value="" noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" />
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="tour" placeholder="Tour" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg"/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="starttime" placeholder="Start Time" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg"/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="endtime" placeholder="End Time" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg"/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="description" placeholder="Description" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Container>
                                <Row id="OpenHouse-editFooter">
                                    <Col md={6} className="OpenHouse-editCol">
                                        <Button id="OpenHouse-saveBtn" type="submit">Save</Button>
                                    </Col>
                                    <Col md={6} className="OpenHouse-editCol">
                                        <Button id="OpenHouse-cancelBtn">Cancel</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Footer>
                    </Modal>: ''
                }
                

            </div>

                                                                                

    //   <div className="home">
    //     <div>
    //       <table id="users" class="table table-bordered"> 
    //         <tbody>
    //           <tr>
    //             <th scope="col">Tour No.</th>
    //             <th scope="col">Tour</th>
    //             <th scope="col">Start Time</th>
    //             <th scope="col">End Time</th>
    //             <th scope="col">Venue</th>
    //             <th scope="col">Edit</th>
    //             <th scope="col">Delete</th>
    //           </tr>
    //           {this.state.guidedTour &&
    //             this.state.guidedTour.map((guidedTour) => {
    //               return (
    //                 <tr>
    //                     <td>{guidedTour.counter}</td>
    //                   <td>
    //                   <span class={guidedTour.id + "text"}>
    //                   {guidedTour.tourName}
    //                     </span>
                          
    //                       <span id={guidedTour.id + "spantourname"} hidden>
    //                       <input
    //                         id={guidedTour.id + "tourname"}
    //                         defaultValue={guidedTour.tourName}
    //                         type="text"
    //                         name={guidedTour.id + "tourname"}
    //                         class="form-control"
    //                         aria-describedby="emailHelp"
    //                         placeholder={guidedTour.tourName}
    //                         required
    //                       />
    //                     </span>            
    //                   </td>
    //                   <td>
    //                   <span class={guidedTour.id + "text"}>
    //                   {guidedTour.startTime}
    //                     </span>
    //                       <span id={guidedTour.id + "spanstarttime"} hidden>
    //                       <input
    //                         id={guidedTour.id + "starttime"}
    //                         defaultValue={guidedTour.startTime}
    //                         type="text"
    //                         name={guidedTour.id + "starttime"}
    //                         class="form-control"
    //                         aria-describedby="emailHelp"
    //                         placeholder={guidedTour.startTime}
    //                         required
    //                       />
    //                     </span>  
    //                   </td>
    //                   <td>
    //                   <span class={guidedTour.id + "text"}>
    //                   {guidedTour.endTime}
    //                     </span>
    //                       <span id={guidedTour.id + "spanendtime"} hidden>
    //                       <input
    //                         id={guidedTour.id + "endtime"}
    //                         defaultValue={guidedTour.endTime}
    //                         type="text"
    //                         name={guidedTour.id + "endtime"}
    //                         class="form-control"
    //                         aria-describedby="emailHelp"
    //                         placeholder={guidedTour.endTime}
    //                         required
    //                       />
    //                     </span>  
    //                   </td>
    //                   <td>
    //                   <span class={guidedTour.id + "text"}>
    //                   {guidedTour.venue}
    //                     </span>
    //                       <span id={guidedTour.id + "spanvenue"} hidden>
    //                       <input
    //                         id={guidedTour.id + "venue"}
    //                         defaultValue={guidedTour.venue}
    //                         type="text"
    //                         name={guidedTour.id + "venue"}
    //                         class="form-control"
    //                         aria-describedby="emailHelp"
    //                         placeholder={guidedTour.venue}
    //                         required
    //                       />
    //                     </span>  
    //                   </td>
    //                   <td>
    //                     <button
    //                       id={guidedTour.id + "editbutton"}
    //                       onClick={(e) => {
    //                         this.editGuidedTour(e, guidedTour.id);
    //                       }}
    //                     >
    //                       Edit
    //                     </button>

    //                     <button
    //                       id={guidedTour.id + "updatebutton"}
    //                       hidden
    //                       onClick={(e) => {
    //                         this.update(e, guidedTour.id);
    //                       }}
    //                     >
    //                       Update
    //                     </button>
    //                     <button
    //                       hidden
    //                       id={guidedTour.id + "cancelbutton"}
    //                       onClick={(e) => {
    //                         this.CancelEdit(e, guidedTour.id);
    //                       }}
    //                     >
    //                       Cancel
    //                     </button>
    //                   </td>
    //                   <td>
    //                     <button
    //                       onClick={(e) => {
    //                         this.DeleteGuidedTour(e, guidedTour.id);
    //                       }}
    //                     >
    //                       Delete
    //                     </button>
    //                   </td>
    //                 </tr>
    //               );
    //             })}
    //         </tbody>
    //       </table>
    //     </div>
    //     <form onSubmit={this.addGuidedTour}>
    //       <input
    //         type="text"
    //         name="tourName"
    //         placeholder="Tour"
    //         onChange={this.updateInput}
    //         value={this.state.tourName}
    //         required
    //       />
    //       <input
    //         type="text"
    //         name="date"
    //         placeholder="Date"
    //         onChange={this.updateInput}
    //         value={this.state.date}
    //         required
    //       />
    //       <input
    //         type="text"
    //         name="startTime"
    //         placeholder="Start Time"
    //         onChange={this.updateInput}
    //         value={this.state.startTime}
    //         required
    //       />
    //       <input
    //         type="text"
    //         name="endTime"
    //         placeholder="End Time"
    //         onChange={this.updateInput}
    //         value={this.state.endTime}
    //         required
    //       />
    //       <input
    //         type="text"
    //         name="venue"
    //         placeholder="Venue"
    //         onChange={this.updateInput}
    //         value={this.state.venue}
    //         required
    //       />
    //       <button type="submit">Add Guided Tour</button>
    //     </form>
    //   </div>
        );
    }
}
export default GuidedTour;
