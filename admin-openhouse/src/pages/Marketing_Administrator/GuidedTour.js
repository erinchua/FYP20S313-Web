import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/GuidedTours.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHourglassEnd, faHourglassStart, faPlus, faSchool, faTrash, faMapPin, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const initialStates = {
    dateError: "",
    endTimeError: "",
    startTimeError: "",
    tourNameError: "",
    venueError: "",
}

class GuidedTour extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            id: "",
            date: "",
            endTime: "",
            startTime: "",
            tourName: "",
            venue: "",
            counter: "",
            //Below states are for the functions
            guidedTours: "",
            openHouseDates: "",
            //Below states are for the modals
            addModal: false,
            editModal: false,
            deleteModal: false,
        };
        this.resetForm = this.resetForm.bind(this);
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
        const dates = [];
        var day1_counter = 1;
        var day2_counter = 1;

        //Retrieve Open House Dates from Openhouse Collection
        db.collection("Openhouse").get()
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

        db.collection("GuidedTours").orderBy("endTime", "asc").get()
        .then((snapshot) => {
            const guidedTour = [];
            snapshot.forEach((doc) => {
                if (doc.data().date === dates[0].date) {
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
            this.setState({ guidedTours: guidedTour });
        });
    }

    //Add tour when click on 'Submit' button in Add Modal - Integrated
    addGuidedTour = (e) => {
        e.preventDefault();
        const db = fire.firestore();

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            var lastdoc = db.collection("GuidedTours").orderBy('id', 'desc')
            .limit(1).get().then((snapshot) =>  {
                snapshot.forEach((doc) => {
                    var docid = "";
                    var res = doc.data().id.substring(8, 5);
                    var id = parseInt(res);
                    id += 1;

                    if (id.toString().length == 1) {
                        docid = "tour-00" + (id)
                    } else if(id.toString().length == 2) {
                        docid = "tour-0" + (id)
                    } else {
                        docid = "tour-" + (id)
                    }

                    db.collection("GuidedTours").doc(docid)
                    .set({
                        id: docid,
                        date: this.state.date,
                        endTime: this.state.endTime,
                        startTime: this.state.startTime,
                        tourName: this.state.tourName,
                        venue: this.state.venue,
                    })
                    .then(dataSnapshot => {
                        console.log("Added the tour");
                        this.setState({
                            addModal: false
                        });
                        this.display();
                    });
                })
            })

        }
    };

    //Delete tour when click on 'Confirm' button in Delete Modal - Integrated
    DeleteGuidedTour(e, guidedTourId) {
        const db = fire.firestore();
        db.collection("GuidedTours").doc(guidedTourId).delete()
        .then(dataSnapshot => {
            console.log("Deleted the tour");
            this.setState({
                deleteModal: false
            });
            this.display();
        });
    }

    //Update tour when click on 'Save Changes' button in Edit Modal - Integrated
    update(e, guidedTourId) {
        const db = fire.firestore();

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);
            db.collection("GuidedTours").doc(guidedTourId)
            .set({
                id: guidedTourId,
                tourName: this.state.tourName,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                date: this.state.date,
                venue: this.state.venue
            })
            .then(dataSnapshot => {
                console.log("Updated the tour");
                this.setState({
                    editModal: false,
                });
                this.display()
            });
        }
    }

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

    //Get respective data out for Edit Modal when click on Edit Button - Integrated
    handleEdit = (guidedTourId) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                id: guidedTourId.id,
                date: guidedTourId.date,
                endTime: guidedTourId.endTime,
                startTime: guidedTourId.startTime,
                tourName: guidedTourId.tourName,
                venue: guidedTourId.venue
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    //Delete Modal
    handleDelete(e, guidedTourId) {
        this.deleteModal = this.state.deleteModal;
        if (this.deleteModal == false) {
            this.setState({
                deleteModal: true
            });
            this.state.id = guidedTourId;
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
        let tourNameError = "";
        let venueError = "";

        if (!this.state.date) {
            dateError = "Please select a valid date.";
        }

        if ( !(this.state.endTime.includes(":") && (this.state.endTime.includes("AM") || this.state.endTime.includes("PM"))) ) {
            endTimeError = "Please enter a valid end time. E.g. 2:30PM";
        }

        if ( !(this.state.startTime.includes(":") && (this.state.startTime.includes("AM") || this.state.startTime.includes("PM"))) ) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.tourName) {
            tourNameError = "Please enter a valid tour name. E.g. Campus Tour BLK A";
        }

        if (!this.state.venue) {
            venueError = "Please enter a valid venue. E.g. SIM HQ BLK A Atrium";
        }

        if (dateError || endTimeError || startTimeError || tourNameError || venueError) {
            this.setState({dateError, endTimeError, startTimeError, tourNameError, venueError});
            return false;
        } 

        return true;
    }

    //Reset Forms
    resetForm = () => {
        this.setState(initialStates);
        this.setState({date: '', tourName: '', id: '', venue: '', startTime: '', endTime: ''})
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
                                                                {this.state.openHouseDates ?
                                                                    <Nav defaultActiveKey="day1" className="GuidedTours-nav" variant="tabs">
                                                                        <Col md={6} className="text-center GuidedTours-navItemCon">
                                                                            <Nav.Item className="GuidedTours-navItems">
                                                                                <Nav.Link eventKey="day1" className="GuidedTours-navLinks">{this.state.openHouseDates[0].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>

                                                                        <Col md={6} className="text-center GuidedTours-navItemCon">
                                                                            <Nav.Item className="GuidedTours-navItems">
                                                                                <Nav.Link eventKey="day2" className="GuidedTours-navLinks">{this.state.openHouseDates[1].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>
                                                                    </Nav> : ''
                                                                }
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
                                                                                {this.state.guidedTours && this.state.guidedTours.map((day1) => {
                                                                                    if (day1.date === this.state.openHouseDates[0].date) {
                                                                                        return (
                                                                                            <tr key={day1.id}>
                                                                                                <td>{day1.counter}</td>
                                                                                                <td>{day1.tourName}</td>
                                                                                                <td>{day1.startTime}</td>
                                                                                                <td>{day1.endTime}</td>
                                                                                                <td>{day1.venue}</td>
                                                                                                <td><Button size="sm" id="GuidedTours-editBtn" onClick={(e) => this.handleEdit(day1)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="GuidedTours-deleteBtn" onClick={(e) => this.handleDelete(e, day1.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        return ('')
                                                                                    }
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
                                                                                {this.state.guidedTours && this.state.guidedTours.map((day2) => {
                                                                                    if (day2.date === this.state.openHouseDates[1].date) {
                                                                                        return (
                                                                                            <tr key={day2.id}>
                                                                                                <td>{day2.counter}</td>
                                                                                                <td>{day2.tourName}</td>
                                                                                                <td>{day2.startTime}</td>
                                                                                                <td>{day2.endTime}</td>
                                                                                                <td>{day2.venue}</td>
                                                                                                <td><Button size="sm" id="GuidedTours-editBtn" onClick={(e) => this.handleEdit(day2)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="GuidedTours-deleteBtn" onClick={(e) => this.handleDelete(e, day2.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        return ('')
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
                            <Modal.Title id="GuidedTours-modalTitle" className="w-100">Add Tour</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate onSubmit={this.addGuidedTour}>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faMapPin}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GuidedTours-inputFields" type="text" name="tourName" placeholder="Tour: e.g. Campus Tour BLK A" required value={this.state.tourName} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.tourNameError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                        </Form.Group> 
                                        {this.state.openHouseDates ? 
                                             <Form.Group as={Col} md="7">
                                                <Form.Control id="GuidedTours-inputFields" name="date" as="select" required value={this.state.date} onChange={this.updateInput} noValidate>
                                                    <option value="">Choose an Openhouse Date</option>
                                                    <option>{this.state.openHouseDates[0].date}</option>
                                                    <option>{this.state.openHouseDates[1].date}</option>
                                                </Form.Control>
                                                <div className="errorMessage">{this.state.dateError}</div>
                                            </Form.Group> : ''
                                        }
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GuidedTours-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" required value={this.state.startTime} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GuidedTours-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 2:30PM" required value={this.state.endTime} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GuidedTours-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" required value={this.state.venue} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.venueError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Container>
                                <Row id="GuidedTours-addFooter">
                                    <Col md={12} className="GuidedTours-addFooterCol">
                                        <Button id="GuidedTours-submitBtn" type="submit" onClick={this.addGuidedTour}>Submit</Button>
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
                            <Modal.Title id="GuidedTours-modalTitle" className="w-100">Edit Tour</Modal.Title>
                        </Modal.Header>
                        {this.state.guidedTours && this.state.guidedTours.map((editGuidedTour) => {
                            if (editGuidedTour.id === this.state.id) {
                                return (
                                    <div key={editGuidedTour.id}>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faMapPin}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GuidedTours-inputFields" type="text" name="tourName" placeholder="Tour: e.g. Campus Tour BLK A" onChange={this.updateInput} required defaultValue={this.state.tourName} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.tourNameError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GuidedTours-inputFields" as="select" name="date" onChange={this.updateInput} required defaultValue={this.state.date} noValidate>
                                                                <option value="">Choose an Openhouse Date</option>
                                                                <option>{this.state.openHouseDates[0].date}</option>
                                                                <option>{this.state.openHouseDates[1].date}</option>
                                                            </Form.Control>
                                                            <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GuidedTours-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" onChange={this.updateInput} required defaultValue={this.state.startTime} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GuidedTours-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 2:30PM" onChange={this.updateInput} required defaultValue={this.state.endTime} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GuidedTours-formGroup">
                                                        <Form.Group as={Col} md="1" className="GuidedTours-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GuidedTours-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={this.state.venue} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.venueError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="GuidedTours-editFooter">
                                                    <Col md={6} className="text-right GuidedTours-editFooterCol">
                                                        <Button id="GuidedTours-saveBtn" type="submit" onClick={(e) => {this.update(e, editGuidedTour.id)}}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="text-left GuidedTours-editFooterCol">
                                                        <Button id="GuidedTours-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
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
                            <Modal.Title id="GuidedTours-modalTitle" className="w-100">Delete Tour</Modal.Title>
                        </Modal.Header>
                        {this.state.guidedTours && this.state.guidedTours.map((deleteGuidedTour) => {
                            if (deleteGuidedTour.id === this.state.id) {
                                return (
                                    <div key={deleteGuidedTour.id}>
                                        <Modal.Body>
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center GuidedTours-deleteFooterCol">
                                                    <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center GuidedTours-deleteFooterCol">
                                                    <h5 id="GuidedTours-deleteText">Do you want to delete this tour?</h5>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={6} className="text-right GuidedTours-deleteFooterCol">
                                                    <Button id="GuidedTours-deleteConfirmBtn" onClick={(e) => {this.DeleteGuidedTour(e, deleteGuidedTour.id)}}>Confirm</Button>
                                                </Col>
                                                <Col md={6} className="text-left GuidedTours-deleteFooterCol">
                                                    <Button id="GuidedTours-deleteCancelBtn" onClick={() => this.setState({deleteModal: false})}>Cancel</Button>
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
        );
    }
}
export default GuidedTour;
