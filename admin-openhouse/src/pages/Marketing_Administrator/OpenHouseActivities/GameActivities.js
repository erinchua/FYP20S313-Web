import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/GameActivities.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHourglassStart, faPlus, faSchool, faTrash, faCalendarAlt, faExclamationCircle, faCalculator, faDice, faGamepad } from '@fortawesome/free-solid-svg-icons';

//Function for Sorting Booth Number by String
export function sortFunction(a, b) {
    const aSplit = a.boothNumber;
    const bSplit = b.boothNumber;
    let aSplitNumberAlpha = aSplit.match(/[a-zA-Z]+|\d+/ig)
    let bSplitNumberAlpha = bSplit.match(/[a-zA-Z]+|\d+/ig)    

    if (+aSplitNumberAlpha[0] > +bSplitNumberAlpha[0]) {
        return 1;
    }
    
    if (+aSplitNumberAlpha[0] < +bSplitNumberAlpha[0]) {
        return -1;
    }

    if (+aSplitNumberAlpha[0] == +bSplitNumberAlpha[0]) {
        if (bSplitNumberAlpha[1] != '') {
            return -1;
        }
        if (aSplitNumberAlpha[1] != '') {
            return -1;
        }

        if (aSplitNumberAlpha[1] > bSplitNumberAlpha[1]) {
            return 1;
        }

        if (aSplitNumberAlpha[1] < bSplitNumberAlpha[1]) {
            return -1;
        }
    }
    
}

function toGamesActivities(doc) {
    return { ...doc.data() }
}

const initialStates = {
    dateError: "",
    pointsAwardError: "",
    startTimeError: "",
    gameBoothNameError: "",
    venueError: "",
    boothNumberError: "",
}

class GameActivities extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            id: "",
            date: "",
            pointsAward: "",
            startTime: "",
            gameBoothName: "",
            venue: "",
            boothNumber: "",
            //Below states are for the functions
            openHouseDates: "",
            gamesActivities: "",
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

    display= () => {
        const dates = [];

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

        //Retrieve Games & Activities Data, Sorting by Booth Number
        db.collection("GamesActivities").get().then(({docs}) => {
            const data = docs.map(toGamesActivities)
            const sorted = data.sort(sortFunction);

            this.setState({gamesActivities: sorted})
        })
        
    }

    //Add game/activity when click on 'Submit' button in Add Modal - Integrated
    addGameActivities = (e) => {
        e.preventDefault();
        
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("GamesActivities").orderBy('id', 'desc').limit(1).get()
            .then((snapshot) =>  {
                snapshot.forEach((doc) => {
                    var docid= "";
                    var res = doc.data().id.substring(12, 9);
                    var id = parseInt(res);
                    id += 1;

                    if(id.toString().length == 1) {
                        docid = "activity-00" + (id) 
                    } else if(id.toString().length == 2) {
                        docid = "activity-0" + (id) 
                    } else {
                        docid = "activity-" + (id) 
                    }
                    
                    db.collection("GamesActivities").doc(docid)
                    .set({
                        date: this.state.date,
                        pointsAward: +this.state.pointsAward,
                        startTime: this.state.startTime,
                        gameBoothName: this.state.gameBoothName,
                        venue: this.state.venue,
                        id: docid,
                        boothNumber: this.state.boothNumber,
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

    //Delete game/activity when click on 'Confirm' button in Delete Modal - Integrated
    DeleteGameActivities(e, gamesActivitiesId) {
        db.collection("GamesActivities").doc(gamesActivitiesId).delete()
        .then(() => {
            this.setState({
                deleteModal: false
            });
            this.display();
        });
    }

    //Update game/activity when click on 'Save Changes' button in Edit Modal - Integrated
    update(e, gamesActivitiesId) {
        //Update respective data by their ids for Edit Modal - Integrated.

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);
            db.collection("GamesActivities").doc(gamesActivitiesId)
            .set({
                id: gamesActivitiesId,
                gameBoothName: this.state.gameBoothName,
                startTime: this.state.startTime,
                boothNumber: this.state.boothNumber,
                date: this.state.date,
                venue: this.state.venue,
                pointsAward: +this.state.pointsAward,
            })
            .then(() => {
                this.setState({
                    editModal: false
                });
                this.display();
            });
        }

    }

    //Validations for the Forms in Modals
    validate = () => {
        let dateError = "";
        let boothNumberError = "";
        let startTimeError = "";
        let gameBoothNameError = "";
        let pointsAwardError = "";
        let venueError = "";

        if (!this.state.date) {
            dateError = "Please select a valid date.";
        }

        if (!this.state.boothNumber) {
            boothNumberError = "Please enter a valid booth number. E.g. 10 or 10A";
        }

        if ( !(this.state.startTime.includes(":") && (this.state.startTime.includes("AM") || this.state.startTime.includes("PM"))) ) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.gameBoothName) {
            gameBoothNameError = "Please enter a valid game booth name. E.g. Amazing Race - Canteen Xplore";
        }

        if (!this.state.pointsAward.match(/^\d+$/)) {
            pointsAwardError = "Please enter valid points. E.g. 5";
        }

        if (!this.state.venue) {
            venueError = "Please enter a valid venue. E.g. SIM HQ BLK A Atrium";
        }

        if (dateError || boothNumberError || startTimeError || gameBoothNameError || venueError || pointsAwardError) {
            this.setState({dateError, boothNumberError, startTimeError, gameBoothNameError, venueError, pointsAwardError});
            return false;
        } 

        return true;
    }

    //Reset Forms
    resetForm = () => {
        this.setState(initialStates);
        this.setState({date: '', gameBoothName: '', id: '', venue: '', startTime: '', boothNumber: '', pointsAward: ''})
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
    handleEdit = (gameActivitiesId) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {

            var pointsAward = gameActivitiesId.pointsAward;
            var stringPointsAward = pointsAward.toString();

            this.setState({
                editModal: true,
                id: gameActivitiesId.id,
                date: gameActivitiesId.date,
                startTime: gameActivitiesId.startTime,
                gameBoothName: gameActivitiesId.gameBoothName,
                boothNumber: gameActivitiesId.boothNumber,
                venue: gameActivitiesId.venue,
                pointsAward: stringPointsAward,
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    //Delete Modal
    handleDelete(e, gamesActivitiesId) {
        this.deleteModal = this.state.deleteModal;
        if (this.deleteModal == false) {
            this.setState({
                deleteModal: true
            });
            this.state.id = gamesActivitiesId;
        } else {
            this.setState({
                deleteModal: false,
            });
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="GamesActivities-container">
                    <NavBar isMA={true} />

                        <Container fluid className="GamesActivities-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="GamesActivities-topContentContainer">
                                        <Row id="GamesActivities-firstRow">
                                            <Col md={6} className="text-left" id="GamesActivities-firstRowCol">
                                                <h4 id="GamesActivities-title">Games & Activities</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="GamesActivities-firstRowCol">
                                                <Button id="GamesActivities-addBtn" onClick={this.handleAdd.bind(this)}><FontAwesomeIcon size="lg" icon={faPlus} /><span id="GamesActivities-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="GamesActivities-secondRow">
                                            <Col md={12} id="GamesActivities-secondRowCol">
                                                <Tab.Container defaultActiveKey="day1">
                                                    <Row className="GamesActivities-secondInnerRow">
                                                        <Col md={12} className="GamesActivities-secondInnerCol">
                                                                {this.state.openHouseDates ?
                                                                    <Nav defaultActiveKey="day1" className="GamesActivities-nav" variant="tabs">
                                                                        <Col md={6} className="text-center GamesActivities-navItemCon">
                                                                            <Nav.Item className="GamesActivities-navItems">
                                                                                <Nav.Link eventKey="day1" className="GamesActivities-navLinks">{this.state.openHouseDates[0].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>

                                                                        <Col md={6} className="text-center GamesActivities-navItemCon">
                                                                            <Nav.Item className="GamesActivities-navItems">
                                                                                <Nav.Link eventKey="day2" className="GamesActivities-navLinks">{this.state.openHouseDates[1].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>
                                                                    </Nav> : ''
                                                                }
                                                        </Col>
                                                    </Row>

                                                    <Row className="GamesActivities-secondInnerRow">
                                                        <Col md={12} className="GamesActivities-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="day1">
                                                                    <Col md={12} className="text-center GamesActivities-tableColCon">
                                                                        <Table responsive="sm" bordered className="GamesActivities-tableCon">
                                                                            <thead className="GamesActivities-tableHeader">
                                                                                <tr>
                                                                                    <th>Booth No.</th>
                                                                                    <th>Booth Name</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Points</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GamesActivities-tableBody">
                                                                                {this.state.gamesActivities && this.state.gamesActivities.map((day1) => {
                                                                                    if (day1.date === this.state.openHouseDates[0].date) {
                                                                                        return (
                                                                                            <tr key={day1.id}>
                                                                                                <td>{day1.boothNumber}</td>
                                                                                                <td id="GamesActivities-gameBoothNameData">{day1.gameBoothName}</td>
                                                                                                <td>{day1.startTime}</td>
                                                                                                <td>{day1.venue}</td>
                                                                                                <td>{day1.pointsAward}</td>
                                                                                                <td><Button size="sm" id="GamesActivities-editBtn" onClick={(e) => {this.handleEdit(day1)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="GamesActivities-deleteBtn" onClick={(e) => this.handleDelete(e, day1.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
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
                                                                    <Col md={12} className="text-center GamesActivities-tableColCon">
                                                                        <Table responsive="sm" bordered className="GamesActivities-tableCon">
                                                                            <thead className="GamesActivities-tableHeader">
                                                                                <tr>
                                                                                    <th>Booth No.</th>
                                                                                    <th>Booth Name</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Points</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GamesActivities-tableBody">
                                                                                {this.state.gamesActivities && this.state.gamesActivities.map((day2) => {
                                                                                    if (day2.date === this.state.openHouseDates[1].date) {
                                                                                        return (
                                                                                            <tr key={day2.id}>
                                                                                                <td>{day2.boothNumber}</td>
                                                                                                <td id="GamesActivities-gameBoothNameData">{day2.gameBoothName}</td>
                                                                                                <td>{day2.startTime}</td>
                                                                                                <td>{day2.venue}</td>
                                                                                                <td>{day2.pointsAward}</td>
                                                                                                <td><Button size="sm" id="GamesActivities-editBtn" onClick={(e) => {this.handleEdit(day2)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="GamesActivities-deleteBtn" onClick={(e) => this.handleDelete(e, day2.id)}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
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
                            <Modal.Title id="GamesActivities-modalTitle" className="w-100">Add Game/Activity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate onSubmit={this.addGameActivities}>
                                <Form.Group>
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faDice}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GamesActivities-inputFields" type="text" name="boothNumber" placeholder="Booth Number: e.g. 10 or 10A" required value={this.state.boothNumber} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.boothNumberError}</div>
                                        </Form.Group>
                                    </Form.Group>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faGamepad}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GamesActivities-inputFields" type="text" name="gameBoothName" placeholder="Game Booth Name: e.g. Amazing Race - Canteen Xplore" required value={this.state.gameBoothName} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.gameBoothNameError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                        </Form.Group> 
                                        {this.state.openHouseDates ? 
                                             <Form.Group as={Col} md="7">
                                                <Form.Control id="GamesActivities-inputFields" name="date" as="select" required value={this.state.date} onChange={this.updateInput} noValidate>
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
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GamesActivities-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" required value={this.state.startTime} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faCalculator}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GamesActivities-inputFields" type="text" name="pointsAward" placeholder="Points Award: e.g. 5" required value={this.state.pointsAward} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.pointsAwardError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="GamesActivities-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" required value={this.state.venue} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.venueError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Container>
                                <Row id="GamesActivities-addFooter">
                                    <Col md={12} className="GamesActivities-addFooterCol">
                                        <Button id="GamesActivities-submitBtn" type="submit" onClick={this.addGameActivities}>Submit</Button>
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
                            <Modal.Title id="GamesActivities-modalTitle" className="w-100">Edit Game/Activity</Modal.Title>
                        </Modal.Header>
                        {this.state.gamesActivities && this.state.gamesActivities.map((editGamesActivities) => {
                            if (editGamesActivities.id === this.state.id) {
                                return (
                                    <div key={editGamesActivities.id}>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faDice}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" type="text" name="boothNumber" placeholder="Booth Number: e.g. 10 or 10A" required defaultValue={this.state.boothNumber} onChange={this.updateInput} noValidate></Form.Control>
                                                                <div className="errorMessage">{this.state.boothNumberError}</div>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faGamepad}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" type="text" name="gameBoothName" placeholder="Tour: e.g. Amazing Race - Canteen Xplore" onChange={this.updateInput} required defaultValue={this.state.gameBoothName} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.gameBoothNameError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" as="select" name="date" onChange={this.updateInput} required defaultValue={this.state.date} noValidate>
                                                                <option value="">Choose an Openhouse Date</option>
                                                                <option>{this.state.openHouseDates[0].date}</option>
                                                                <option>{this.state.openHouseDates[1].date}</option>
                                                            </Form.Control>
                                                            <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 1:30PM" onChange={this.updateInput} required defaultValue={this.state.startTime} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalculator}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" type="text" name="pointsAward" placeholder="Points Award: e.g. 5" required defaultValue={this.state.pointsAward} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.pointsAwardError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="GamesActivities-formGroup">
                                                        <Form.Group as={Col} md="1" className="GamesActivities-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="GamesActivities-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={this.state.venue} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.venueError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="GamesActivities-editFooter">
                                                    <Col md={6} className="text-right GamesActivities-editFooterCol">
                                                        <Button id="GamesActivities-saveBtn" type="submit" onClick={(e) => {this.update(e, editGamesActivities.id)}}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="text-left GamesActivities-editFooterCol">
                                                        <Button id="GamesActivities-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
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
                            <Modal.Title id="GamesActivities-modalTitle" className="w-100">Delete Game/Activity</Modal.Title>
                        </Modal.Header>
                        {this.state.gamesActivities && this.state.gamesActivities.map((deleteGamesActivities) => {
                            if (deleteGamesActivities.id === this.state.id) {
                                return (
                                    <div key={deleteGamesActivities.id}>
                                        <Modal.Body>
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center GamesActivities-deleteFooterCol">
                                                    <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center GamesActivities-deleteFooterCol">
                                                    <h5 id="GamesActivities-deleteText">Do you want to delete this game/activity?</h5>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={6} className="text-right GamesActivities-deleteFooterCol">
                                                    <Button id="GamesActivities-deleteConfirmBtn" onClick={(e) => {this.DeleteGameActivities(e, deleteGamesActivities.id)}}>Confirm</Button>
                                                </Col>
                                                <Col md={6} className="text-left GamesActivities-deleteFooterCol">
                                                    <Button id="GamesActivities-deleteCancelBtn" onClick={() => this.setState({deleteModal: false})}>Cancel</Button>
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

export default GameActivities;