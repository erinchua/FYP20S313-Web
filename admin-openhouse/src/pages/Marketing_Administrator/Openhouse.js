import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Marketing_Administrator/OpenHouse.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCalendarDay, faEdit, faHourglassEnd, faHourglassStart, faKeyboard } from '@fortawesome/free-solid-svg-icons';

const initialState = {
    dateError: "",
    dayError: "",
    startTimeError: "",
    EndTimeError: "",
    descriptionError: ""
}

class Openhouse extends Component {

    state = initialState;

    constructor() {
        super();
        this.state = {
            day: "",
            date: "",
            startdate: "",
            enddate: "",
            editModal: false,
        };
        // this.handleSave = this.handleSave.bind(this);
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

    componentDidMount() {
        this.authListener();
        /* const db = fire.firestore();

        const userRef = db.collection("Openhouse").doc("openhouse-003");

        userRef.set({
        id: "openhouse-001",
        day: {
            1: {
            date: "23-Nov-2020",
            startTime: "9:00AM",
            endTime: "6:30PM",
            },
            2: {
            endTime: "7:00PM",
            startTime: "9:00AM",
            date: "24-Nov-2020",
            },
        },
        openhouseTitle: "SIM Openhouse 2020",
        });*/
    }

    display() {
        const db = fire.firestore();

        const userRef = db
        .collection("Openhouse")
        .get()
        .then((snapshot) => {
            const users = [];

            snapshot.forEach((doc) => {
            const daydata = doc.get("day");
            if (Array.isArray(daydata)) {
                for (var i = 0; i < Object.keys(daydata).length; i++) {
                    console.log(daydata[i].date);
                    console.log(daydata[i].startTime);
                    console.log(daydata[i].endTime);
                }
            }
            for (var i = 0; i < Object.keys(daydata).length; i++) {
                const data = {
                    day: Object.keys(doc.data().day)[i],
                    date: daydata[Object.keys(daydata)[i]].date,
                    starttime: daydata[Object.keys(daydata)[i]].startTime,
                    endtime: daydata[Object.keys(daydata)[i]].endTime,
                    docid: doc.id,
                };
                users.push(data);
                const date = daydata[Object.keys(daydata)[i]].date;
                //   console.log(date);
            }

            /** for (var i = 0; i < Object.keys(doc.data().day).length; i++) {
                const data = {
                    day: Object.keys(doc.data().day)[i],
                    date: doc.data().day[i + 1].date,
                    starttime: doc.data().day[i + 1].startTime,
                    endtime: doc.data().day[i + 1].endTime,
                    docid: doc.id,
                };
                users.push(data);
            }*/
            });

            this.setState({ users: users });
        });
    }

    update(e, openhouseid, day) {
        var dateinput = document.getElementById(day + "date").value;
        var starttimeinput = document.getElementById(day + "starttime").value;
        var endttimeinput = document.getElementById(day + "endtime").value;

        const updatedate = "day." + day + ".date";
        const updatestarttime = "day." + day + ".startTime";
        const updateendtime = "day." + day + ".endTime";

        console.log(updatedate);
        const db = fire.firestore();

        const userRef = db
        .collection("Openhouse")
        .doc(openhouseid)
        .update({
            [updatedate]: dateinput,
            [updatestarttime]: starttimeinput,
            [updateendtime]:endttimeinput,
        })
        .then(() => this.onAuthSuccess(e, openhouseid, day));
    }

    onAuthSuccess = (e, openhouseid, day) => {
        alert("Updated");
        window.location.reload();
        this.cancel(e, openhouseid, day);
    };

    edit(e, openhouseid, day) {
        document.getElementById(day + "editbutton").setAttribute("hidden", "");
        document.getElementById(day + "updatebutton").removeAttribute("hidden");
        document.getElementById(day + "cancelbutton").removeAttribute("hidden");

        var inputtoshow = document.getElementsByClassName(
            openhouseid + day + "input"
        );
        var texttohide = document.getElementsByClassName(
            openhouseid + day + "text"
        );
        for (var i = 0; i < inputtoshow.length; i++) {
            inputtoshow[i].removeAttribute("hidden");
            texttohide[i].setAttribute("hidden", "");
        }
    }

    cancel = (e, openhouseid, day) => {
        document.getElementById(day + "editbutton").removeAttribute("hidden");
        document.getElementById(day + "updatebutton").setAttribute("hidden", "");
        document.getElementById(day + "cancelbutton").setAttribute("hidden", "");
        var inputtoshow = document.getElementsByClassName(
            openhouseid + day + "input"
        );
        var texttohide = document.getElementsByClassName(
            openhouseid + day + "text"
        );
        for (var i = 0; i < inputtoshow.length; i++) {
            inputtoshow[i].setAttribute("hidden", "");

            texttohide[i].removeAttribute("hidden");
        }
    };

    // //Validate Edit Modal
    // validate = () => {
    //     let dateError = "";
    //     let dayError = "";
    //     let startTimeError = "";
    //     let endTimeError = "";
    //     let descriptionError = "";

    //     if (!this.state.date) {
    //         dateError = "Please enter a date!";
    //     }

    //     if (!this.state.day) {
    //         dayError = "Please enter a day!";
    //     }

    //     //Start time, End Time, Description


    //     if (dateError || dayError) {
    //         this.setState({dateError, dayError});
    //         return false;
    //     } 

    //     return true;
    // }

    //Edit Modal
    handleEdit = () => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true
            });
        } else {
            this.setState({
                editModal: false
            });
        }
    }

    // handleSave = () => {
    //     const isValid = this.validate();

    //     this.setState(initialState);
    //     if (isValid) {
    //         this.setState(initialState);
    //     }
    // }

    render() {
        return (
            <div>
                <Container fluid className="OpenHouse-container">
                    <NavBar isMA={true} />

                        <Container fluid className="OpenHouse-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row style={{ marginRight: 0 }}>
                                <Col md={2}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} id="OpenHouse-topContentContainer">
                                    <Container fluid id="OpenHouse-topContentContainer">
                                        <Row id="OpenHouse-firstRow"></Row>

                                        <Row id="OpenHouse-secondRow">
                                            <Col md={12} className="text-center" id="OpenHouse-secondRowCol">
                                                <Table responsive="sm" bordered id="OpenHouse-tableContainer">
                                                    <thead id="OpenHouse-tableHeader">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Day</th>
                                                            <th>Start Time</th>
                                                            <th>End Time</th>
                                                            <th>Description</th>
                                                            <th>Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="OpenHouse-tableBody">
                                                        {this.state.users && this.state.users.map((user) => {
                                                            return(
                                                                <tr>
                                                                    <td>{user.date}</td>
                                                                    <td>{user.day}</td>
                                                                    <td>{user.starttime}</td>
                                                                    <td>{user.endtime}</td>
                                                                    <td>{user.docid}</td>
                                                                    <td><Button size="sm" id="OpenHouse-editBtn" onClick={this.handleEdit.bind(this)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {this.state.editModal == true ? 
                    <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <Form novalidate>
                                <Form.Group>
                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt} />
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="date" placeholder="Date" required value="" noValidate></Form.Control>
                                                <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" icon={faCalendarDay} />
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="day" placeholder="Day" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="starttime" placeholder="Start Time" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control type="text" name="endtime" placeholder="End Time" required value="" noValidate></Form.Control>
                                            <div className="errorMessage"></div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                        <Form.Group as={Col} md="1">
                                            <FontAwesomeIcon size="lg" icon={faKeyboard}/>
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
    //       <table class="table table-bordered">
    //         <tbody>
    //           <tr>
    //             <th scope="col">Open House </th>
    //             <th scope="col">Day</th>
    //             <th scope="col">Date</th>
    //             <th scope="col">Start Time</th>
    //             <th scope="col">End Time</th>
    //           </tr>
    //           {this.state.users &&
    //             this.state.users.map((user) => {
    //               return (
    //                 <tr>
    //                   <td>{user.docid}</td>
    //                   <td>{user.day}</td>
    //                   <td>
    //                     <span class={user.docid + user.day + "text"}>
    //                       {user.date}
    //                     </span>
    //                     <span class={user.docid + user.day + "input"} hidden>
    //                       <input
    //                         defaultValue={user.date}
    //                         id={user.day + "date"}
    //                         type="text"
    //                         class="form-control"
    //                         required
    //                       />
    //                     </span>
    //                   </td>
    //                   <td>
    //                     <span class={user.docid + user.day + "text"}>
    //                       {user.starttime}
    //                     </span>
    //                     <span class={user.docid + user.day + "input"} hidden>
    //                       <input
    //                         defaultValue={user.starttime}
    //                         id={user.day + "starttime"}
    //                         type="text"
    //                         class="form-control"
    //                         required
    //                       />
    //                     </span>
    //                   </td>
    //                   <td>
    //                     {" "}
    //                     <span class={user.docid + user.day + "text"}>
    //                       {user.endtime}
    //                     </span>
    //                     <span class={user.docid + user.day + "input"} hidden>
    //                       <input
    //                         defaultValue={user.endtime}
    //                         id={user.day + "endtime"}
    //                         type="text"
    //                         class="form-control"
    //                         required
    //                       />
    //                     </span>{" "}
    //                   </td>

    //                   <td>
    //                     <button
    //                       id={user.day + "editbutton"}
    //                       onClick={(e) => {
    //                         this.edit(e, user.docid, user.day);
    //                       }}
    //                     >
    //                       Edit
    //                     </button>

    //                     <button
    //                       id={user.day + "updatebutton"}
    //                       hidden
    //                       onClick={(e) => {
    //                         this.update(e, user.docid, user.day);
    //                       }}
    //                     >
    //                       Update
    //                     </button>
    //                     <button
    //                       id={user.day + "cancelbutton"}
    //                       hidden
    //                       onClick={(e) => {
    //                         this.cancel(e, user.docid, user.day);
    //                       }}
    //                     >
    //                       Cancel
    //                     </button>
    //                   </td>
    //                 </tr>
    //               );
    //             })}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
        );
    }
}
export default Openhouse;