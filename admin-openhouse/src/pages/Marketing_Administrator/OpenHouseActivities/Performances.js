import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
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

    display = () => {
        const dates = []
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

        db.collection("Performances").orderBy("endTime", "asc").get()
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
        
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("Performances").orderBy('id','desc')
            .limit(1).get().then((snapshot) =>  {
                snapshot.forEach((doc) => {
                    var docid= "";
                    var res = doc.data().id.substring(12);
                    var id = parseInt(res);
                    id += 1;

                    if (id.toString().length == 1) {
                        docid = "performance-00" + (id) 
                    } else if(id.toString().length == 2) {
                        docid = "performance-0" + (id) 
                    } else {
                        docid ="performance-" + (id) 
                    }

                    db.collection("Performances").doc(docid)
                    .set({
                        date: this.state.date,
                        endTime: this.state.endTime,
                        startTime: this.state.startTime,
                        performanceName: this.state.performanceName,
                        venue: this.state.venue,
                        id: docid,
                    })
                    .then(() => {
                        this.setState({
                            addModal: false
                        });
                        this.display();
                    });
                })
            })
        }
    };

    //Delete performance when click on 'Confirm' button in Delete Modal - Integrated
    DeletePerformance(e, performanceId) {
        db.collection("Performances").doc(performanceId).delete()
        .then(dataSnapshot => {
            this.setState({
                deleteModal: false
            });
            this.display();
        });
    }

    //Update performance when click on 'Save Changes' button in Edit Modal - Integrated
    update(e, performanceid) {
       //Update respective data by their ids for Edit Modal - Integrated.

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);
            db.collection("Performances").doc(performanceid)
            .set({
                id: performanceid,
                performanceName: this.state.performanceName,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                date: this.state.date,
                venue: this.state.venue
            })
            .then(() => {
                this.setState({
                    editModal: false
                });
                this.display();
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
    handleEdit = (performanceId) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                id: performanceId.id,
                date: performanceId.date,
                endTime: performanceId.endTime,
                startTime: performanceId.startTime,
                venue: performanceId.venue,
                performanceName: performanceId.performanceName,
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

        if ( !(this.state.endTime.includes(":") && (this.state.endTime.includes("AM") || this.state.endTime.includes("PM"))) ) {
            endTimeError = "Please enter a valid end time. E.g. 2:30PM";
        }

        if ( !(this.state.startTime.includes(":") && (this.state.startTime.includes("AM") || this.state.startTime.includes("PM"))) ) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.performanceName) {
            performanceNameError = "Please enter a valid performance name. E.g. DreamWerkz";
        }

        if (!this.state.venue) {
            venueError = "Please enter a valid venue. E.g. SIM HQ BLK A Atrium";
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
                                                                                                <td><Button size="sm" id="Performances-editBtn" onClick={(e) => this.handleEdit(day1)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                                <td><Button size="sm" id="Performances-editBtn" onClick={(e) => this.handleEdit(day2)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                            <Form.Control id="Performances-inputFields" type="text" name="performanceName" placeholder="Performance Name: e.g. DreamWerkz" required value={this.state.performanceName} onChange={this.updateInput} noValidate></Form.Control>
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
                                                            <Form.Control id="Performances-inputFields" type="text" name="performanceName" placeholder="Performance Name: e.g. DreamWerkz" onChange={this.updateInput} required defaultValue={this.state.performanceName} noValidate></Form.Control>
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
                                                            <Form.Control id="Performances-inputFields" as="select" name="date" onChange={this.updateInput} required defaultValue={this.state.date} noValidate>
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
                                                            <Form.Control id="Performances-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" onChange={this.updateInput} required defaultValue={this.state.startTime} noValidate></Form.Control>
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
                                                            <Form.Control id="Performances-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 2:30PM" onChange={this.updateInput} required defaultValue={this.state.endTime} noValidate></Form.Control>
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
                                                            <Form.Control id="Performances-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={this.state.venue} noValidate></Form.Control>
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
        );
    }
}
export default Performances;