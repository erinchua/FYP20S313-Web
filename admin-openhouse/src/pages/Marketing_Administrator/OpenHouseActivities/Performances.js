import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Performances.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHourglassEnd, faHourglassStart, faPlus, faSchool, faTrash, faMapPin, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const initialStates = {
    dateError: "",
    endTimeError: "",
    startTimeError: "",
    performanceNameError: "",
    venueError: "",
}

class Performances extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            id: "",
            date: "",
            endTime: "",
            startTime: "",
            performanceName: "",
            venue: "",
            counter: "",
            //Below states are for the functions
            performances: "",
            openHouseDates: "",
            //Below states are for the modals
            addModal: false,
            editModal: false,
            deleteModal: false,
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

    display = () => {
        // var getYear = new Date().getFullYear();
        // console.log(getYear);
    
        // const db = fire.firestore();
        // const performance = [];
        // const userRef = db
        // .collection("Performances")
        // .get()
        // .then((snapshot) => {
        //     snapshot.forEach((doc) => {
        //         performance.push(doc.data().date);
        //     });
        //     console.log(performance);
        //     function onlyUnique(value, index, self) {
        //         return self.indexOf(value) === index;
        //     }
        //     var unique = performance.filter(onlyUnique);
        //     console.log(unique);

        //     //day1
        //     /*const day1date = [];
        //     day1date.push(unique[0]);
        //     this.setState({ day1date: day1date });*/
        //     const day1 = db
        //     .collection("Performances")
        //     .where("date", "==", unique[0])
        //     .get()
        //     .then((snapshot) => {
        //         const performance = [];
        //         snapshot.forEach((doc) => {
        //             const data = {
        //                 docid : doc.id,
        //                 id: doc.data().id,
        //                 date: doc.data().date,
        //                 endTime: doc.data().endTime,
        //                 startTime: doc.data().startTime,
        //                 performanceName: doc.data().performanceName,
        //                 venue: doc.data().venue,
        //             };
        //             performance.push(data);
        //         });
        //         this.setState({ day1: performance });
                                
        //     });

        //     //day 2
        //     /*const day2date = [];
        //     day2date.push(unique[1]);
        //     this.setState({ day2date: day2date });*/
        //     const day2 = db
        //     .collection("Performances")
        //     .where("date", "==", unique[1])
        //     .get()
        //     .then((snapshot) => {
        //         const performance = [];
        //         snapshot.forEach((doc) => {
        //             const data = {
        //                 docid : doc.id,
        //                 id: doc.data().id,
        //                 date: doc.data().date,
        //                 endTime: doc.data().endTime,
        //                 startTime: doc.data().startTime,
        //                 performanceName: doc.data().performanceName,
        //                 venue: doc.data().venue,
        //             };
        //             performance.push(data);
        //         });
        //         this.setState({ day2: performance });
        //     });
        // });

        const db = fire.firestore();
        const dates = []
        var day1_counter = 1;
        var day2_counter = 1;

        //Retrieve Open House Dates from Openhouse Collection
        const retrieveDate = db
        .collection("Openhouse")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.get('day')
                for (var i = 0; i < Object.keys(data).length; i++) {
                    const retrieved = {
                        date: data[Object.keys(data)[i]].date
                    };
                    dates.push(retrieved)
                }
            });
            this.setState({openHouseDates: dates})
        })

        const userRef = db
        .collection("Performances").orderBy("endTime", "asc")
        .get()
        .then((snapshot) => {
            const performance = [];
            snapshot.forEach((doc) => {
                if (doc.data().date === dates[0].date) {
                    const data = {
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        performanceName: doc.data().performanceName,
                        venue: doc.data().venue,
                        id: doc.id,
                        counter: day1_counter,
                    };
                    day1_counter++;
                    performance.push(data);
                } else {
                    const data = {
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        performanceName: doc.data().performanceName,
                        venue: doc.data().venue,
                        id: doc.id,
                        counter: day2_counter,
                    };
                    day2_counter++;
                    performance.push(data);
                }
            });
            this.setState({ performances: performance });
        });
    }

    //Add performance when click on 'Submit' button in Add Modal - Integrated
    addPerformance = (e) => {
        e.preventDefault();
        const db = fire.firestore();
        
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            var lastdoc = db.collection("Performances").orderBy('id','desc')
            .limit(1).get().then((snapshot) =>  {
                snapshot.forEach((doc) => {
                    var docid= "";
                    var res = doc.data().id.substring(12);
                    var id = parseInt(res)
                    if (id.toString().length <= 1) {
                        docid= "performance-00" + (id +1) 
                    } else if(id.toString().length <= 2) {
                        docid= "performance-0" + (id +1) 
                    } else {
                        docid="performance-0" + (id +1) 
                    }

                    const userRef = db
                    .collection("Performances")
                    .doc(docid)
                    .set({
                        date: this.state.date,
                        endTime: this.state.endTime,
                        startTime: this.state.startTime,
                        performanceName: this.state.performanceName,
                        venue: this.state.venue,
                        id: docid,
                    })
                    .then(function() {
                        window.location.reload();
                    });
                })
            })
        }
    };

    //Delete performance when click on 'Confirm' button in Delete Modal - Integrated
    DeletePerformance(e, performanceid) {
        const db = fire.firestore();
        const userRef = db
        .collection("Performances")
        .doc(performanceid)
        .delete()
        .then(function () {
            console.log("Deleted the performance");
            window.location.reload();
        });
    }

    //Update performance when click on 'Save Changes' button in Edit Modal - Integrated
    update(e, performanceid) {
        // const performanceName = document.getElementById(performanceid + "performancename").value
        // const startTime = document.getElementById(performanceid + "starttime").value
        // const endTime = document.getElementById(performanceid + "endtime").value
        // const venue = document.getElementById(performanceid + "venue").value

        // const db = fire.firestore();
        // if (performanceName != null && startTime != null && endTime != null && venue != null) {
        //     const userRef = db
        //     .collection("Performances")
        //     .doc(performanceid)
        //     .update({
        //         endTime: endTime,
        //         startTime: startTime,
        //         performanceName: performanceName,
        //         venue: venue,
        //     })
        //     .then(function () {
        //         console.log("Updated the performance");
        //         window.location.reload();
        //     });
        // }

        //Update respective data by their ids for Edit Modal - Integrated.
        const db = fire.firestore();

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);
            const userRef = db
            .collection("Performances")
            .doc(performanceid)
            .set({
                id: performanceid,
                performanceName: this.state.performanceName,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                date: this.state.date,
                venue: this.state.venue
            })
            .then(function () {
                console.log("Updated the performance");
                window.location.reload();
            });
        }
    }

    //Get respective data out by their ids for Edit Modal when click on Edit Button - Integrated
    editPerformance(e, performanceid) {
        // document.getElementById(performanceid + "spanperformancename").removeAttribute("hidden");
        // document.getElementById(performanceid + "spanstarttime").removeAttribute("hidden");
        // document.getElementById(performanceid + "spanendtime").removeAttribute("hidden");
        // document.getElementById(performanceid + "spanvenue").removeAttribute("hidden");
        // document.getElementById(performanceid + "editbutton").setAttribute("hidden", "");
        // document.getElementById(performanceid + "updatebutton").removeAttribute("hidden");
        // document.getElementById(performanceid + "cancelbutton").removeAttribute("hidden");

        // var texttohide = document.getElementsByClassName(
        //     performanceid + "text"
        // );

        // for (var i = 0; i < texttohide.length; i++) {
        //     texttohide[i].setAttribute("hidden", "");
        // }  

        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
            });
            this.state.id = performanceid;
            const db = fire.firestore();
            db.collection("Performances").doc(performanceid).get()
            .then((doc) => {
                this.setState({ 
                    date: doc.data().date,
                    endTime: doc.data().endTime,
                    startTime: doc.data().startTime,
                    performanceName: doc.data().performanceName,
                    venue: doc.data().venue,
                });
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    /*//Don't need cancel function as we can just hide the modal if cancel
    CancelEdit(e, performanceid) {
        document.getElementById(performanceid + "spanperformancename").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanstarttime").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanendtime").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanvenue").setAttribute("hidden", "");
        document.getElementById(performanceid + "editbutton").removeAttribute("hidden");
        document.getElementById(performanceid + "updatebutton").setAttribute("hidden", "");
        document.getElementById(performanceid + "cancelbutton").setAttribute("hidden", "");

        var texttohide = document.getElementsByClassName(
            performanceid + "text"
        );

        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].removeAttribute("hidden", "");
        }
    }*/

    //Add Modal
    handleAdd = () => {
        this.resetForm();
        this.addModal = this.state.addModal;
        if (this.addModal == false) {
            this.setState({
                addModal: true,
            });
        } else {
            this.setState({
                addModal: false
            });
            this.resetForm();
        }
    }

    //Edit Modal
    handleEdit = () => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    //Delete Modal
    handleDelete(e, performanceId) {
        this.deleteModal = this.state.deleteModal;
        if (this.deleteModal == false) {
            this.setState({
                deleteModal: true
            });
            this.state.id = performanceId;
        } else {
            this.setState({
                deleteModal: false,
            });
        }
    }

    //Validations for the Forms in Modals
    validate = () => {
        let dateError = "";
        let endTimeError = "";
        let startTimeError = "";
        let performanceNameError = "";
        let venueError = "";

        if (!this.state.date) {
            dateError = "Please select a valid date.";
        }

        if (!this.state.endTime.includes(':')) {
            endTimeError = "Please enter a valid end time. E.g. 2:30PM";
        }

        if (!this.state.startTime.includes(':')) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.performanceName) {
            performanceNameError = "Please enter a valid performance name. E.g. DreamWerkz";
        }

        if (!this.state.venue) {
            venueError = "Please enter a valid value. E.g. SIM HQ BLK A Atrium";
        }

        if (dateError || endTimeError || startTimeError || performanceNameError || venueError) {
            this.setState({dateError, endTimeError, startTimeError, performanceNameError, venueError});
            return false;
        } 

        return true;
    }

    resetForm = () => {
        this.setState(initialStates);
        this.setState({date: '', performanceName: '', id: '', venue: '', startTime: '', endTime: ''})
    }

    render() {
        return (
            <div>
                <Container fluid className="Performances-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Performances-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Performances-topContentContainer">
                                        <Row id="Performances-firstRow">
                                            <Col md={6} className="text-left" id="Performances-firstRowCol">
                                                <h4 id="Performances-title">Performances</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="Performances-firstRowCol">
                                                <Button id="Performances-addBtn" onClick={this.handleAdd.bind(this)}><FontAwesomeIcon size="lg" icon={faPlus} /><span id="Performances-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="Performances-secondRow">
                                            <Col md={12} id="Performances-secondRowCol">
                                                <Tab.Container defaultActiveKey="day1">
                                                    <Row className="Performances-secondInnerRow">
                                                        <Col md={12} className="Performances-secondInnerCol">
                                                            {this.state.openHouseDates ? 
                                                                <Nav defaultActiveKey="day1" className="Performances-nav" variant="tabs">
                                                                    <Col md={6} className="text-center Performances-navItemCon">
                                                                        <Nav.Item className="Performances-navItems">
                                                                            <Nav.Link eventKey="day1" className="Performances-navLinks">{this.state.openHouseDates[0].date}</Nav.Link>
                                                                        </Nav.Item>
                                                                    </Col>

                                                                    <Col md={6} className="text-center Performances-navItemCon">
                                                                        <Nav.Item className="Performances-navItems">
                                                                            <Nav.Link eventKey="day2" className="Performances-navLinks">{this.state.openHouseDates[1].date}</Nav.Link>
                                                                        </Nav.Item>
                                                                    </Col>
                                                                </Nav> : ''
                                                            }
                                                        </Col>
                                                    </Row>

                                                    <Row className="Performances-secondInnerRow">
                                                        <Col md={12} className="Performances-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="day1">
                                                                    <Col md={12} className="text-center Performances-tableColCon">
                                                                        <Table responsive="sm" bordered className="Performances-tableCon">
                                                                            <thead className="Performances-tableHeader">
                                                                                <tr>
                                                                                    <th>S/N</th>
                                                                                    <th>Performance</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Performances-tableBody">
                                                                                {this.state.performances && this.state.performances.map((day1) => {
                                                                                    if(day1.date === this.state.openHouseDates[0].date) {
                                                                                        return (
                                                                                            <tr key={day1.id}>
                                                                                                <td>{day1.counter}</td>
                                                                                                <td>{day1.performanceName}</td>
                                                                                                <td>{day1.startTime}</td>
                                                                                                <td>{day1.endTime}</td>
                                                                                                <td>{day1.venue}</td>
                                                                                                <td><Button size="sm" id="Performances-editBtn" onClick={(e) => this.editPerformance(e, day1.id)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="Performances-deleteBtn" onClick={(e) => this.handleDelete(e, day1.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        return('')
                                                                                    }
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                <Tab.Pane eventKey="day2">
                                                                    <Col md={12} className="text-center Performances-tableColCon">
                                                                        <Table responsive="sm" bordered className="Performances-tableCon">
                                                                            <thead className="Performances-tableHeader">
                                                                                <tr>
                                                                                    <th>S/N</th>
                                                                                    <th>Performance</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Performances-tableBody">
                                                                                {this.state.performances && this.state.performances.map((day2) => {
                                                                                    if(day2.date === this.state.openHouseDates[1].date) {
                                                                                        return (
                                                                                            <tr key={day2.id}>
                                                                                                <td>{day2.counter}</td>
                                                                                                <td>{day2.performanceName}</td>
                                                                                                <td>{day2.startTime}</td>
                                                                                                <td>{day2.endTime}</td>
                                                                                                <td>{day2.venue}</td>
                                                                                                <td><Button size="sm" id="Performances-editBtn" onClick={(e) => this.editPerformance(e, day2.id)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="Performances-deleteBtn" onClick={(e) => this.handleDelete(e, day2.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        return('')
                                                                                    }
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

                {/* Add Modal */}
                {this.state.addModal == true ? 
                    <Modal show={this.state.addModal} onHide={this.handleAdd} size="md" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Performances-modalTitle" className="w-100">Add Performance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate onSubmit={this.addPerformance}>
                                <Form.Group>
                                    <Form.Group as={Row} className="Performances-formGroup">
                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faMapPin}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Performances-inputFields" type="text" name="performanceName" placeholder="Tour: e.g. DreamWerkz" required value={this.state.performanceName} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.performanceNameError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Performances-formGroup">
                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Performances-inputFields" name="date" as="select" required value={this.state.date} onChange={this.updateInput} noValidate>
                                                <option value="">Choose an Openhouse Date</option>
                                                <option>{this.state.openHouseDates[0].date}</option>
                                                <option>{this.state.openHouseDates[1].date}</option>
                                            </Form.Control>
                                            <div className="errorMessage">{this.state.dateError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Performances-formGroup">
                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Performances-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" required value={this.state.startTime} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Performances-formGroup">
                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Performances-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 2:30PM" required value={this.state.endTime} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Performances-formGroup">
                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Performances-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" required value={this.state.venue} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.venueError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Container>
                                <Row id="Performances-addFooter">
                                    <Col md={12} className="Performances-addFooterCol">
                                        <Button id="Performances-submitBtn" type="submit" onClick={this.addPerformance}>Submit</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Footer>
                    </Modal>: ''
                }

                {/* Edit Modal */}
                {this.state.editModal == true ? 
                    <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Performances-modalTitle" className="w-100">Edit Performance</Modal.Title>
                        </Modal.Header>
                        {this.state.performances && this.state.performances.map((editPerformance) => {
                            if (editPerformance.id === this.state.id) {
                                return (
                                    <div key={editPerformance.id}>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Performances-formGroup">
                                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faMapPin}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Performances-inputFields" type="text" name="performanceName" placeholder="Tour: e.g. DreamWerkz" onChange={this.updateInput} required defaultValue={editPerformance.performanceName} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.performanceNameError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Performances-formGroup">
                                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Performances-inputFields" as="select" name="date" onChange={this.updateInput} required defaultValue={editPerformance.date} noValidate>
                                                                <option value="">Choose an Openhouse Date</option>
                                                                <option>{this.state.openHouseDates[0].date}</option>
                                                                <option>{this.state.openHouseDates[1].date}</option>
                                                            </Form.Control>
                                                            <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Performances-formGroup">
                                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Performances-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" onChange={this.updateInput} required defaultValue={editPerformance.startTime} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Performances-formGroup">
                                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Performances-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 2:30PM" onChange={this.updateInput} required defaultValue={editPerformance.endTime} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Performances-formGroup">
                                                        <Form.Group as={Col} md="1" className="Performances-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Performances-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={editPerformance.venue} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.venueError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="Performances-editFooter">
                                                    <Col md={6} className="text-right Performances-editFooterCol">
                                                        <Button id="Performances-saveBtn" type="submit" onClick={(e) => {this.update(e, editPerformance.id)}}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="text-left Performances-editFooterCol">
                                                        <Button id="Performances-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
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

                {/* Delete Modal */}
                {this.state.deleteModal == true ? 
                    <Modal show={this.state.deleteModal} onHide={() => this.setState({deleteModal: false})} size="md" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Performances-modalTitle" className="w-100">Delete Performance</Modal.Title>
                        </Modal.Header>
                        {this.state.performances && this.state.performances.map((deletePerformance) => {
                            if (deletePerformance.id === this.state.id) {
                                return (
                                    <div key={deletePerformance.id}>
                                        <Modal.Body>
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center Performances-deleteFooterCol">
                                                    <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center Performances-deleteFooterCol">
                                                    <h5 id="Performances-deleteText">Do you want to delete this performance?</h5>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={6} className="text-right Performances-deleteFooterCol">
                                                    <Button id="Performances-deleteConfirmBtn" onClick={(e) => {this.DeletePerformance(e, deletePerformance.id)}}>Confirm</Button>
                                                </Col>
                                                <Col md={6} className="text-left Performances-deleteFooterCol">
                                                    <Button id="Performances-deleteCancelBtn" onClick={() => this.setState({deleteModal: false})}>Cancel</Button>
                                                </Col>
                                            </Row>
                                        </Modal.Body>
                                    </div>
                                )
                            } else {
                                return ('')
                            }
                        })}
                    </Modal>: ''
                }

            </div>




            // <div className="home">
            //     {/* day1 */}
            //     <div>
            //     {this.state.day1date &&
            //             this.state.day1date.map((day1) => {
            //             return (
            //                 <p>{day1}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">S/N</th>
            //             <th scope="col">Performance</th>
            //             <th scope="col">Start Time</th>
            //             <th scope="col">End Time</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day1 &&
            //             this.state.day1.map((day1,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.performanceName}
            //                     </span>
                                
            //                     <span id={day1.docid + "spanperformancename"} hidden>
            //                     <input
            //                         id={day1.docid + "performancename"}
            //                         defaultValue={day1.performanceName}
            //                         type="text"
            //                         name={day1.docid + "performancename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.performanceName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.startTime}
            //                     </span>
            //                     <span id={day1.docid + "spanstarttime"} hidden>
            //                     <input
            //                         id={day1.docid + "starttime"}
            //                         defaultValue={day1.startTime}
            //                         type="text"
            //                         name={day1.docid + "starttime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.startTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.endTime}
            //                     </span>
            //                     <span id={day1.docid + "spanendtime"} hidden>
            //                     <input
            //                         id={day1.docid + "endtime"}
            //                         defaultValue={day1.endTime}
            //                         type="text"
            //                         name={day1.docid + "endtime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.endTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.venue}
            //                     </span>
            //                     <span id={day1.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day1.docid + "venue"}
            //                         defaultValue={day1.venue}
            //                         type="text"
            //                         name={day1.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day1.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPerformance(e, day1.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day1.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day1.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day1.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day1.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeletePerformance(e, day1.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     {/* day2 */}
            //     <div>
            //     {this.state.day2date &&
            //             this.state.day2date.map((day2) => {
            //             return (
            //                 <p>{day2}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">S/N</th>
            //             <th scope="col">Performance</th>
            //             <th scope="col">Start Time</th>
            //             <th scope="col">End Time</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day2 &&
            //             this.state.day2.map((day2,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.performanceName}
            //                     </span>
                                
            //                     <span id={day2.docid + "spanperformancename"} hidden>
            //                     <input
            //                         id={day2.docid + "performancename"}
            //                         defaultValue={day2.performanceName}
            //                         type="text"
            //                         name={day2.docid + "performancename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.performanceName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.startTime}
            //                     </span>
            //                     <span id={day2.docid + "spanstarttime"} hidden>
            //                     <input
            //                         id={day2.docid + "starttime"}
            //                         defaultValue={day2.startTime}
            //                         type="text"
            //                         name={day2.docid + "starttime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.startTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.endTime}
            //                     </span>
            //                     <span id={day2.docid + "spanendtime"} hidden>
            //                     <input
            //                         id={day2.docid + "endtime"}
            //                         defaultValue={day2.endTime}
            //                         type="text"
            //                         name={day2.docid + "endtime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.endTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.venue}
            //                     </span>
            //                     <span id={day2.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day2.docid + "venue"}
            //                         defaultValue={day2.venue}
            //                         type="text"
            //                         name={day2.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day2.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPerformance(e, day2.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day2.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day2.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day2.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day2.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeletePerformance(e, day2.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     <form onSubmit={this.addPerformance}>
            //     <input
            //         type="text"
            //         name="performanceName"
            //         placeholder="Performance Name"
            //         onChange={this.updateInput}
            //         value={this.state.performanceName}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="date"
            //         placeholder="Date"
            //         onChange={this.updateInput}
            //         value={this.state.date}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="startTime"
            //         placeholder="Start Time"
            //         onChange={this.updateInput}
            //         value={this.state.startTime}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="endTime"
            //         placeholder="End Time"
            //         onChange={this.updateInput}
            //         value={this.state.endTime}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="venue"
            //         placeholder="Venue"
            //         onChange={this.updateInput}
            //         value={this.state.venue}
            //         required
            //     />
            //     <button type="submit">Add Performance</button>
            //     </form>
            // </div>
        );
    }
}
export default Performances;
