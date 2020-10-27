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

const initialStates = {
    dateError: "",
    startTimeError: "",
    endTimeError: "",
    descriptionError: "",
}

class Openhouse extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            day: "",
            date: "",
            startTime: "",
            endTime: "",
            docid: "",
            description: "",
            //Below states are for functions
            users: "",
            //Below states are for modals
            editModal: false,
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
                    startTime: daydata[Object.keys(daydata)[i]].startTime,
                    endTime: daydata[Object.keys(daydata)[i]].endTime,
                    description: daydata[Object.keys(daydata)[i]].description,
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

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    update(e, openhouseid, day) {
        // var dateinput = document.getElementById(day + "date").value;
        // var starttimeinput = document.getElementById(day + "starttime").value;
        // var endttimeinput = document.getElementById(day + "endtime").value;

        // const updatedate = "day." + day + ".date";
        // const updatestarttime = "day." + day + ".startTime";
        // const updateendtime = "day." + day + ".endTime";

        // console.log(updatedate);

        // const db = fire.firestore();

        // const userRef = db
        // .collection("Openhouse")
        // .doc(openhouseid)
        // .update({
        //     [updatedate]: dateinput,
        //     [updatestarttime]: starttimeinput,
        //     [updateendtime]:endttimeinput,
        // })
        // .then(() => this.onAuthSuccess(e, openhouseid, day));

        //Update respective data by their ids and day number for Edit Modal - Integrated
        const db = fire.firestore();
        db.collection("Openhouse").doc(openhouseid).get()
        .then((doc) => {
            const daydata = doc.get('day');

            //Checked if day is 1
            if (day == Object.keys(daydata).length - 1) {
                for (var i = 0; i < Object.keys(daydata).length - 1; i++){
                    const isValid = this.validate();
                    if (isValid) {
                        this.setState(initialStates);
                        
                        const userRef = db
                        .collection("Openhouse")
                        .doc(openhouseid)
                        .update({
                            "day.1.date": this.state.date,
                            "day.1.startTime": this.state.startTime,
                            "day.1.endTime": this.state.endTime,
                            "day1.description": this.state.description,
                        })
                        .then(() => this.onAuthSuccess(e, openhouseid, day));
                        
                    }
                }
            }

            //Checked if day is 2
            if (day == Object.keys(daydata).length) {
                for (var i = 1; i < Object.keys(daydata).length; i++){
                    const isValid = this.validate();
                    if (isValid) {
                        this.setState(initialStates);
                        
                        const userRef = db
                        .collection("Openhouse")
                        .doc(openhouseid)
                        .update({
                            "day.2.date": this.state.date,
                            "day.2.startTime": this.state.startTime,
                            "day.2.endTime": this.state.endTime,
                            "day.2.description": this.state.description,
                        })
                        .then(() => this.onAuthSuccess(e, openhouseid, day));
                        
                    }
                }
            }
        });

    }

    onAuthSuccess = (e, openhouseid, day) => {
        console.log("Updated the information");
        window.location.reload();
        //this.cancel(e, openhouseid, day);
    };

    //Get respective data out by ids and the day number for Edit Modal - Integrated
    edit(e, openhouseid, day) {
        // document.getElementById(day + "editbutton").setAttribute("hidden", "");
        // document.getElementById(day + "updatebutton").removeAttribute("hidden");
        // document.getElementById(day + "cancelbutton").removeAttribute("hidden");

        // var inputtoshow = document.getElementsByClassName(
        //     openhouseid + day + "input"
        // );
        // var texttohide = document.getElementsByClassName(
        //     openhouseid + day + "text"
        // );
        // for (var i = 0; i < inputtoshow.length; i++) {
        //     inputtoshow[i].removeAttribute("hidden");
        //     texttohide[i].setAttribute("hidden", "");
        // }

        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
            });
            this.state.docid = openhouseid;
            this.state.day = day;
            const db = fire.firestore();
            db.collection("Openhouse").doc(openhouseid).get()
            .then((doc) => {
                const daydata = doc.get('day');

                if (day == Object.keys(daydata).length - 1) {
                    for (var i = 0; i < Object.keys(daydata).length - 1; i++){
                        this.setState({
                            day: day,
                            date: daydata[Object.keys(daydata)[i]].date,
                            startTime: daydata[Object.keys(daydata)[i]].startTime,
                            endTime: daydata[Object.keys(daydata)[i]].endTime,
                            description: daydata[Object.keys(daydata)[i]].description,
                            docid: doc.id,
                        });
                    }
                }

                if (day == Object.keys(daydata).length) {
                    for (var i = 1; i < Object.keys(daydata).length; i++){
                        this.setState({
                            day: day,
                            date: daydata[Object.keys(daydata)[i]].date,
                            startTime: daydata[Object.keys(daydata)[i]].startTime,
                            endTime: daydata[Object.keys(daydata)[i]].endTime,
                            description: daydata[Object.keys(daydata)[i]].description,
                            docid: doc.id,
                        });
                    }
                }
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    /*//Don't need cancel function as we can just hide the modal if cancel
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
    };*/

    //Validate Edit Modal
    validate = () => {
        let dateError = "";
        let startTimeError = "";
        let endTimeError = "";
        let descriptionError = "";

        if (!this.state.date) {
            dateError = "Please enter a valid date. E.g. 21-Nov-2020";
        }

        if (!this.state.startTime.includes(':')) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.endTime.includes(':')) {
            endTimeError = "Please enter a valid end time. E.g. 2:30PM";
        }

        if (!this.state.description) {
            descriptionError = "Please enter a valid description. E.g. Open House Day 1";
        }

        if (dateError || startTimeError || endTimeError || descriptionError) {
            this.setState({dateError, startTimeError, endTimeError, descriptionError});
            return false;
        } 

        return true;
    }

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
            this.resetForm();
        }
    }

    resetForm = () => {
        this.setState(initialStates);
        this.setState({date: '', starttime: '', endtime: '', description: ''})
    }

    render() {
        return (
            <div>
                <Container fluid className="OpenHouse-container">
                    <NavBar isMA={true} />

                        <Container fluid className="OpenHouse-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="OpenHouse-topContentContainer">
                                        <Row id="OpenHouse-firstRow">
                                            <Col md={12} className="text-left" id="OpenHouse-firstRowCol">
                                                <h4 id="OpenHouse-title">Open House Dates</h4>
                                            </Col>
                                        </Row>

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
                                                                    <td>{user.startTime}</td>
                                                                    <td>{user.endTime}</td>
                                                                    <td id="OpenHouse-descriptionData">{user.description}</td>
                                                                    <td><Button size="sm" id="OpenHouse-editBtn" onClick={(e) => {this.edit(e, user.docid, user.day)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                    <Modal show={this.state.editModal} onHide={this.handleEdit} size="md" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        {this.state.users && this.state.users.map((user) => {
                            if (user.docid === this.state.docid && user.day === this.state.day) {
                                return (
                                    <div>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt} />
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="date" placeholder="Date: e.g. 21-Nov-2020" required defaultValue={user.date} onChange={this.updateInput} noValidate></Form.Control>
                                                                <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarDay} />
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control readOnly id="OpenHouse-inputFields" type="text" name="day" placeholder="Day" required defaultValue={user.day} noValidate></Form.Control>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 9:00AM" required defaultValue={user.startTime} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 6:00PM" required defaultValue={user.endTime} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faKeyboard}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="description" placeholder="Description" required defaultValue={user.description} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.descriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="OpenHouse-editFooter">
                                                    <Col md={6} className="OpenHouse-editCol">
                                                        <Button id="OpenHouse-saveBtn" type="submit" onClick={(e) => this.update(e, user.docid, user.day)}>Save</Button>
                                                    </Col>
                                                    <Col md={6} className="OpenHouse-editCol">
                                                        <Button id="OpenHouse-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Modal.Footer>
                                    </div>
                                )
                            } else {
                                return ('')
                            }
                        })}
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