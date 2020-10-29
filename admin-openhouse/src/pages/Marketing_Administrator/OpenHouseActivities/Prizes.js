import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Prizes.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSchool, faTrash, faCalendarAlt, faExclamationCircle, faBoxes, faCalculator, faGifts } from '@fortawesome/free-solid-svg-icons';

const venueInitialStates = {
    venueError: "",
    dateError: "",
}

const initialStates = {
    prizeNameError: "",
    prizePointsCostError: "",
    stockError: "",
}

class Prizes extends Component {

    state = {venueInitialStates, initialStates};

    constructor() {
        super();
        this.state = {
            date: "",
            venue: "",
            id: "",
            prizePointsCost: "",
            prizeName: "",
            stock: "",
            counter: "",
            day: "",
            venueTab: true,
            isRedeemed: "",
            //Below states are for the functions
            prizes: "",
            venues: "",
            openHouseDates: "",
            //Below states are for the modals
            addModal: false,
            editModal: false,
            editVenueModal: false,
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
        // this.authListener();
        this.display();
    }

    display = () => {
        /*var getYear = new Date().getFullYear();
        console.log(getYear);

        const db = fire.firestore();
        const prize = [];
        const userRef = db
        .collection("Prizes")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                prize.push(doc.data().date);
            });

            console.log(prize);

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            var unique = prize.filter(onlyUnique);
            console.log(unique);
            //day1
            const day1date = [];
            day1date.push(unique[0]);
            this.setState({ day1date: day1date });
            const day1 = db
            .collection("Prizes")
            .where("date", "==", unique[0])
            .get()
            .then((snapshot) => {
                const prize = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid: doc.id,
                        id: doc.data().id,
                        date: doc.data().date,
                        prizePointsCost: doc.data().prizePointsCost,
                        prizeName: doc.data().prizeName,
                        isRedeemed: doc.data().isRedeemed,
                    };
                    prize.push(data);
                });
                this.setState({ day1: prize });
            });

            const day1venue = db
            .collection("Prizes")
            .where("collectionDate", "==", unique[0])
            .get()
            .then((snapshot) => {
                const day1venue = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid: doc.id,
                        venue: doc.data().venue,
                    };
                    day1venue.push(data);
                    console.log(data);
                });
                this.setState({ day1prizevenue: day1venue });
                console.log(this.state.day1prizevenue);
            });

            //day 2
            const day2date = [];
            day2date.push(unique[1]);
            this.setState({ day2date: day2date });
            const day2 = db
            .collection("Prizes")
            .where("date", "==", unique[1])
            .get()
            .then((snapshot) => {
                const prize = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid: doc.id,
                        id: doc.data().id,
                        date: doc.data().date,
                        prizePointsCost: doc.data().prizePointsCost,
                        prizeName: doc.data().prizeName,
                        isRedeemed: doc.data().isRedeemed,
                    };
                    prize.push(data);
                });
                this.setState({ day2: prize });
            });

            const day2venue = db
            .collection("Prizes")
            .where("collectionDate", "==", unique[1])
            .get()
            .then((snapshot) => {
                const day2venue = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid: doc.id,
                        venue: doc.data().venue,
                    };
                    day2venue.push(data);
                    console.log(data);
                });
                this.setState({ day2prizevenue: day2venue });
                console.log(this.state.day2prizevenue);
            });
        });*/

        const db = fire.firestore();
        const venue = [];
        const prize = [];
        var counter = 1;

        //Get Venues For Both Open House Days
        db.collection("Prizes").doc("venue").get().then((doc) => {
            const day = doc.get('day');
            for (var i = 0; i < Object.keys(day).length; i++) {
                const venueData = {
                    id: doc.id,
                    date: day[Object.keys(day)[i]].date,
                    venue: day[Object.keys(day)[i]].venue,
                    day: Object.keys(doc.data().day)[i],
                };
                venue.push(venueData);
            }
            this.setState({venues: venue});
        });

        //Get Prizes
        db.collection("Prizes").get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().hasOwnProperty('id')) {
                    const data = {
                        id: doc.id,
                        prizeName: doc.data().prizeName,
                        prizePointsCost: doc.data().prizePointsCost,
                        stock: doc.data().stock,
                        counter: counter,
                    }
                    counter++;
                    prize.push(data);
                }
            });
            this.setState({prizes: prize});
        });

    };

    //Add prize when click on 'Submit' button in Add Modal - Integrated
    addPrize = (e) => {
        e.preventDefault();
        const db = fire.firestore();
        
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("Prizes").orderBy("id", "desc").limit(1).get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    var docid = "";
                    var res = doc.data().id.substring(9, 6);
                    var id = parseInt(res);
                    if (id.toString().length <= 1) {
                        docid = "prize-00" + (id + 1);
                    } else if (id.toString().length <= 2) {
                        docid = "prize-0" + (id + 1);
                    } else {
                        docid = "prize-0" + (id + 1);
                    }
        
                    db.collection("Prizes").doc(docid)
                    .set({
                        prizePointsCost: +this.state.prizePointsCost,
                        prizeName: this.state.prizeName,
                        stock: +this.state.stock,
                        id: docid,
                    })
                    .then(function() {
                        window.location.reload();
                    });
                });
            });
        }
    };

    //Delete prize when click on 'Confirm' button in Delete Modal - Integrated
    DeletePrize(e, prizeId) {
        const db = fire.firestore();
        db.collection("Prizes").doc(prizeId).delete()
        .then(function () {
            console.log("Deleted the prize");
            window.location.reload();
        });
    }

    //Get respective data out by their ids for Edit Modal when click on Edit Button - Integrated
    editPrize(e, prizeId) {
        // document
        //     .getElementById(prizeid + "spanprizename")
        //     .removeAttribute("hidden");
        // document
        //     .getElementById(prizeid + "spanprizepointscost")
        //     .removeAttribute("hidden");
        // document.getElementById(prizeid + "editbutton").setAttribute("hidden", "");
        // document.getElementById(prizeid + "updatebutton").removeAttribute("hidden");
        // document.getElementById(prizeid + "cancelbutton").removeAttribute("hidden");
        // var texttohide = document.getElementsByClassName(prizeid + "text");
        // for (var i = 0; i < texttohide.length; i++) {
        //     texttohide[i].setAttribute("hidden", "");
        // }

        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
            });
            this.state.id = prizeId;
            const db = fire.firestore();
            db.collection("Prizes").doc(prizeId).get()
            .then((doc) => {

                var stock = doc.data().stock;
                var stringStock = stock.toString();
                var prizePointsCost = doc.data().prizePointsCost;
                var stringPrizePointsCost = prizePointsCost.toString();

                this.setState({
                    id: doc.data().id,
                    prizeName: doc.data().prizeName,
                    prizePointsCost: stringPrizePointsCost,
                    stock: stringStock,
                });
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    //Update prize when click on 'Save Changes' button in Edit Modal - Integrated
    updatePrize(e, prizeId) {
        // const prizeName = document.getElementById(prizeid + "prizename").value;
        // const prizePointsCost = document.getElementById(prizeid + "prizepointscost")
        // .value;

        // const db = fire.firestore();
        // if (prizeName != null && prizePointsCost != null) {
        // const userRef = db
        //     .collection("Prizes")
        //     .doc(prizeid)
        //     .update({
        //         prizeName: prizeName,
        //         prizePointsCost: prizePointsCost,
        //     })
        //     .then(function () {
        //         alert("Updated the prize");
        //         window.location.reload();
        //     });
        // }

        //Update respective data by their ids for Edit Modal - Integrated.
        const db = fire.firestore();

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("Prizes").doc(prizeId)
            .set({
                prizePointsCost: +this.state.prizePointsCost,
                prizeName: this.state.prizeName,
                stock: +this.state.stock,
                id: prizeId,
            })
            .then(function () {
                console.log("Updated the prize");
                window.location.reload();
            });
        }
    }

    //Get respective data out by venueId and the day number for Venue Edit Modal - Integrated
    editVenue(e, venueId, venueDay) {
        // document.getElementById(venue + "venuelocation").removeAttribute("hidden");
        // document.getElementById(venue + "text").setAttribute("hidden", "");
        // document
        //     .getElementById(venue + "venueeditbutton")
        //     .setAttribute("hidden", "");
        // document
        //     .getElementById(venue + "venueupdatebutton")
        //     .removeAttribute("hidden");
        // document
        //     .getElementById(venue + "venuecancelbutton")
        //     .removeAttribute("hidden");

        this.editVenueModal = this.state.editVenueModal;
        if (this.editVenueModal == false) {
            this.setState({
                editVenueModal: true,
            });
            this.state.id = venueId;
            this.state.day = venueDay;
            const db = fire.firestore();
            db.collection("Prizes").doc(venueId).get()
            .then((doc) => {
                const daydata = doc.get('day');

                if (venueDay == Object.keys(daydata).length - 1) {
                    for (var i = 0; i < Object.keys(daydata).length - 1; i++){
                        this.setState({
                            day: venueDay,
                            date: daydata[Object.keys(daydata)[i]].date,
                            venue: daydata[Object.keys(daydata)[i]].venue,
                            id: doc.id,
                        });
                    }
                }

                if (venueDay == Object.keys(daydata).length) {
                    for (var i = 1; i < Object.keys(daydata).length; i++){
                        this.setState({
                            day: venueDay,
                            date: daydata[Object.keys(daydata)[i]].date,
                            venue: daydata[Object.keys(daydata)[i]].venue,
                            id: doc.id
                        });
                    }
                }
            });
        } else {
            this.setState({
                editVenueModal: false
            });
            this.resetForm();
        }

    }

    updateVenue(e, venueId, venueDay) {
        // const venuetext = document.getElementById(venueid + "venuelocationtext")
        // .value;

        // const db = fire.firestore();
        // if (venuetext != null && venuetext != null) {
        // const userRef = db
        //     .collection("Prizes")
        //     .doc(venueid)
        //     .update({
        //         venue: venuetext,
        //     })
        //     .then(function () {
        //         console.log("Updated the venue");
        //         window.location.reload();
        //     });
        // }

        //Update respective data by their ids and day number for Edit Modal - Integrated
        const db = fire.firestore();
        db.collection("Prizes").doc(venueId).get()
        .then((doc) => {
            const daydata = doc.get('day');

            //Checked if day is 1
            if (venueDay == Object.keys(daydata).length - 1) {
                for (var i = 0; i < Object.keys(daydata).length - 1; i++){
                    const isValid = this.validateVenue();
                    if (isValid) {
                        this.setState(venueInitialStates);
                        
                        db.collection("Prizes").doc(venueId)
                        .update({
                            "day.1.date": this.state.date,
                            "day.1.venue": this.state.venue,
                        })
                        .then(function() {
                            console.log("Updated the venue");
                            window.location.reload();
                        });
                        
                    }
                }
            }

            //Checked if day is 2
            if (venueDay == Object.keys(daydata).length) {
                for (var i = 1; i < Object.keys(daydata).length; i++){
                    const isValid = this.validateVenue();
                    if (isValid) {
                        this.setState(venueInitialStates);
                        
                        db.collection("Prizes").doc(venueId)
                        .update({
                            "day.2.date": this.state.date,
                            "day.2.venue": this.state.venue,
                        })
                        .then(function() {
                            console.log("Updated the venue");
                            window.location.reload();
                        });                        
                    }
                }
            }
        });
    }

    /*//Don't need cancel function as we can just hide the modal if cancel
    CancelVenue(venue) {
        document.getElementById(venue + "venuelocation").setAttribute("hidden", "");
        document.getElementById(venue + "text").removeAttribute("hidden");
        document
            .getElementById(venue + "venueeditbutton")
            .removeAttribute("hidden");
        document
            .getElementById(venue + "venueupdatebutton")
            .setAttribute("hidden", "");
        document
            .getElementById(venue + "venuecancelbutton")
            .setAttribute("hidden", "");
    }

    CancelEdit(e, prizeid) {
        document
            .getElementById(prizeid + "spanprizename")
            .setAttribute("hidden", "");
        document
            .getElementById(prizeid + "spanprizepointscost")
            .setAttribute("hidden", "");
        document.getElementById(prizeid + "editbutton").removeAttribute("hidden");
        document
            .getElementById(prizeid + "updatebutton")
            .setAttribute("hidden", "");
        document
            .getElementById(prizeid + "cancelbutton")
            .setAttribute("hidden", "");
        var texttohide = document.getElementsByClassName(prizeid + "text");
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
                editModal: true
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    //Delete Modal
    handleDelete(e, prizeId) {
        this.deleteModal = this.state.deleteModal;
        if (this.deleteModal == false) {
            this.setState({
                deleteModal: true
            });
            this.state.id = prizeId;
        } else {
            this.setState({
                deleteModal: false,
            });
        }
    }

    //Edit Modal
    handleVenueEdit = () => {
        this.editVenueModal = this.state.editVenueModal;
        if (this.editVenueModal == false) {
            this.setState({
                editVenueModal: true,
            });
        } else {
            this.setState({
                editVenueModal: false
            });
            this.resetForm();
        }
    }

    //Venue Validations
    validateVenue = () => {
        let dateError = "";
        let venueError = "";

        if (!this.state.date) {
            dateError = "Please select a valid date.";
        }

        if (!this.state.venue) {
            venueError = "Please enter a valid value. E.g. SIM HQ BLK A Atrium";
        }

        if (dateError || venueError) {
            this.setState({dateError, venueError});
            return false;
        }

        return true;
    }

    //Validations for the Forms in Prize Modals
    validate = () => {
        let prizeNameError = "";
        let prizePointsCostError = "";
        let stockError = "";

        if (!this.state.prizeName) {
            prizeNameError = "Please enter a valid prize name. E.g. SIM Teddy Bear";
        }

        if (!this.state.prizePointsCost.match(/^\d+$/)) {
            prizePointsCostError = "Please enter valid redemption points. E.g. 50";
        }

        if (!this.state.stock.match(/^\d+$/)) {
            stockError = "Please enter valid available stocks. E.g. 100";
        }

        if (prizeNameError || prizePointsCostError || stockError) {
            this.setState({prizeNameError, prizePointsCostError, stockError});
            return false;
        } 

        return true;
    }

    //Reset Forms
    resetForm = () => {
        this.setState(venueInitialStates);
        this.setState(initialStates);
        this.setState({date: '', prizeName: '', id: '', venue: '', prizePointsCost: '', stock: ''})
    }

    render() {
        return (

            <div>
                <Container fluid className="Prizes-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Prizes-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Prizes-topContentContainer">
                                        <Row id="Prizes-firstRow">
                                            <Col md={6} className="text-left" id="Prizes-firstRowCol">
                                                <h4 id="Prizes-title">Prizes</h4>
                                            </Col>
                                            {this.state.venueTab === false ? 
                                                <Col md={6} className="text-right" id="Prizes-firstRowCol">
                                                    <Button id="Prizes-addBtn" onClick={this.handleAdd.bind(this)}><FontAwesomeIcon size="lg" icon={faPlus} /><span id="Prizes-addBtnText">Add</span></Button>
                                                </Col> : ''
                                            }
                                        </Row>

                                        <Row id="Prizes-secondRow">
                                            <Col md={12} id="Prizes-secondRowCol">
                                                <Tab.Container defaultActiveKey="venue">
                                                    <Row className="Prizes-secondInnerRow">
                                                        <Col md={12} className="Prizes-secondInnerCol">
                                                            <Nav defaultActiveKey="venue" className="Prizes-nav" variant="tabs">
                                                                <Col md={6} className="text-center Prizes-navItemCon">
                                                                    <Nav.Item className="Prizes-navItems" onClick={() => {this.setState({venueTab: true})}}>
                                                                        <Nav.Link eventKey="venue" className="Prizes-navLinks">Prize Redemption Venue</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={6} className="text-center Prizes-navItemCon">
                                                                    <Nav.Item className="Prizes-navItems" onClick={() => {this.setState({venueTab: false})}}>
                                                                        <Nav.Link eventKey="prize" className="Prizes-navLinks">Prize Redemption List</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>

                                                    <Row className="Prizes-secondInnerRow">
                                                        <Col md={12} className="Prizes-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="venue">
                                                                    <Col md={12} className="text-center Prizes-tableColCon">
                                                                        <Table responsive="sm" bordered className="Prizes-tableCon">
                                                                            <thead className="Prizes-tableHeader">
                                                                                <tr>
                                                                                    <th>Date</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Prizes-tableBody">
                                                                                {this.state.venues && this.state.venues.map((venue) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{venue.date}</td>
                                                                                            <td>{venue.venue}</td>
                                                                                            <td><Button size="sm" id="Prizes-editBtn" onClick={(e) => {this.editVenue(e, venue.id, venue.day)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>


                                                                <Tab.Pane eventKey="prize">
                                                                    <Col md={12} className="text-center Prizes-tableColCon">
                                                                        <Table responsive="sm" bordered className="Prizes-tableCon">
                                                                            <thead className="Prizes-tableHeader">
                                                                                <tr>
                                                                                    <th>Prize No.</th>
                                                                                    <th>Prize</th>
                                                                                    <th>Redemption Points</th>
                                                                                    <th>Stocks</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Prizes-tableBody">
                                                                                {this.state.prizes && this.state.prizes.map((prize) => {
                                                                                    return (
                                                                                        <tr key={prize.id}>
                                                                                            <td>{prize.counter}</td>
                                                                                            <td>{prize.prizeName}</td>
                                                                                            <td>{prize.prizePointsCost}</td>
                                                                                            <td>{prize.stock}</td>
                                                                                            <td><Button size="sm" id="Prizes-editBtn" onClick={(e) => {this.editPrize(e, prize.id)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            <td><Button size="sm" id="Prizes-deleteBtn" onClick={(e) => {this.handleDelete(e, prize.id)}}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                        </tr>
                                                                                    )
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

                {/* Edit Venue Modal */}
                {this.state.editVenueModal == true ? 
                    <Modal show={this.state.editVenueModal} onHide={this.handleVenueEdit} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Prizes-modalTitle" className="w-100">Edit Venue</Modal.Title>
                        </Modal.Header>
                        {this.state.venues && this.state.venues.map((venue) => {
                            if (venue.id === this.state.id && venue.day === this.state.day) {
                                return (
                                    <div key={venue.id}>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Prizes-formGroup">
                                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                        <Form.Control id="Prizes-inputFields" type="text" name="date" placeholder="Date: e.g. 21-Nov-2020" onChange={this.updateInput} required defaultValue={venue.date} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Prizes-formGroup">
                                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faSchool}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Prizes-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={venue.venue} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.venueError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="Prizes-editFooter">
                                                    <Col md={6} className="text-right Prizes-editFooterCol">
                                                        <Button id="Prizes-saveBtn" type="submit" onClick={(e) => this.updateVenue(e, venue.id, venue.day)}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="text-left Prizes-editFooterCol">
                                                        <Button id="Prizes-cancelBtn" onClick={this.handleVenueEdit}>Cancel</Button>
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

                {/* Add Modal */}
                {this.state.addModal == true ? 
                    <Modal show={this.state.addModal} onHide={this.handleAdd} size="md" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="Prizes-modalTitle" className="w-100">Add Prize</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate onSubmit={this.addPrize}>
                                <Form.Group>
                                    <Form.Group as={Row} className="Prizes-formGroup">
                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faGifts}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Prizes-inputFields" type="text" name="prizeName" placeholder="Prize: e.g. SIM Teddy Bear" required value={this.state.prizeName} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.prizeNameError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Prizes-formGroup">
                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faCalculator}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Prizes-inputFields" type="text" name="prizePointsCost" placeholder="Redemption Points: e.g. 50" required value={this.state.prizePointsCost} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.prizePointsCostError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group as={Row} className="Prizes-formGroup">
                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                            <FontAwesomeIcon size="lg" icon={faBoxes}/>
                                        </Form.Group> 
                                        <Form.Group as={Col} md="7">
                                            <Form.Control id="Prizes-inputFields" type="text" name="stock" placeholder="Available Stocks: e.g. 100" required value={this.state.stock} onChange={this.updateInput} noValidate></Form.Control>
                                            <div className="errorMessage">{this.state.stockError}</div>
                                        </Form.Group>
                                    </Form.Group>                     
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Container>
                                <Row id="Prizes-addFooter">
                                    <Col md={12} className="Prizes-addFooterCol">
                                        <Button id="Prizes-submitBtn" type="submit" onClick={this.addPrize}>Submit</Button>
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
                            <Modal.Title id="Prizes-modalTitle" className="w-100">Edit Prize</Modal.Title>
                        </Modal.Header>
                        {this.state.prizes && this.state.prizes.map((editPrize) => {
                            if (editPrize.id === this.state.id) {
                                return (
                                    <div key={editPrize.id}>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Prizes-formGroup">
                                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faGifts}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Prizes-inputFields" type="text" name="prizeName" placeholder="Prize: e.g. SIM Teddy Bear" onChange={this.updateInput} required defaultValue={editPrize.prizeName} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.prizeNameError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Prizes-formGroup">
                                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faCalculator}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Prizes-inputFields" type="text" name="prizePointsCost" placeholder="Redemption Points: e.g. 50" onChange={this.updateInput} required defaultValue={editPrize.prizePointsCost} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.prizePointsCostError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="Prizes-formGroup">
                                                        <Form.Group as={Col} md="1" className="Prizes-formGroup">
                                                            <FontAwesomeIcon size="lg" icon={faBoxes}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="Prizes-inputFields" type="text" name="stock" placeholder="Available Stocks: e.g. 100" onChange={this.updateInput} required defaultValue={editPrize.stock} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.stockError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="Prizes-editFooter">
                                                    <Col md={6} className="text-right Prizes-editFooterCol">
                                                        <Button id="Prizes-saveBtn" type="submit" onClick={(e) => {this.updatePrize(e, editPrize.id)}}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="text-left Prizes-editFooterCol">
                                                        <Button id="Prizes-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
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
                            <Modal.Title id="Prizes-modalTitle" className="w-100">Delete Prize</Modal.Title>
                        </Modal.Header>
                        {this.state.prizes && this.state.prizes.map((deletePrize) => {
                            if (deletePrize.id === this.state.id) {
                                return (
                                    <div key={deletePrize.id}>
                                        <Modal.Body>
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center Prizes-deleteFooterCol">
                                                    <FontAwesomeIcon size="3x" icon={faExclamationCircle}/>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={12} className="text-center Prizes-deleteFooterCol">
                                                    <h5 id="Prizes-deleteText">Do you want to delete this prize?</h5>
                                                </Col>
                                            </Row>
    
                                            <Row className="justify-content-center">
                                                <Col md={6} className="text-right Prizes-deleteFooterCol">
                                                    <Button id="Prizes-deleteConfirmBtn" onClick={(e) => {this.DeletePrize(e, deletePrize.id)}}>Confirm</Button>
                                                </Col>
                                                <Col md={6} className="text-left Prizes-deleteFooterCol">
                                                    <Button id="Prizes-deleteCancelBtn" onClick={() => this.setState({deleteModal: false})}>Cancel</Button>
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
            //         this.state.day1date.map((day1) => {
            //         return <p>{day1}</p>;
            //         })}

            //     {this.state.day1prizevenue &&
            //         this.state.day1prizevenue.map((day1) => {
            //         return (
            //             <table id="users" class="table table-bordered">
            //             <tbody>
            //                 <tr>
            //                 <th scope="col">Venue</th>
            //                 <td>
            //                     <span id={day1.docid + "text"}>{day1.venue}</span>
            //                     <span id={day1.docid + "venuelocation"} hidden>
            //                     <input
            //                         id={day1.docid + "venuelocationtext"}
            //                         defaultValue={day1.venue}
            //                         type="text"
            //                         name={day1.docid + "venuelocation"}
            //                         class="form-control"
            //                         placeholder={day1.venue}
            //                         required
            //                     />
            //                     </span>
            //                 </td>

            //                 <td>
            //                     <button
            //                     id={day1.docid + "venueeditbutton"}
            //                     onClick={(e) => {
            //                         this.editVenue(day1.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day1.docid + "venueupdatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.updateVenue(day1.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day1.docid + "venuecancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelVenue(day1.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             </tbody>
            //             </table>
            //         );
            //         })}
            //     <table id="users" class="table table-bordered">
            //         <tbody>
            //         <tr>
            //             <th scope="col">Prize No.</th>
            //             <th scope="col">Prize</th>
            //             <th scope="col">Points</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day1 &&
            //             this.state.day1.map((day1, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1}</td>
            //                 <td>
            //                     <span class={day1.docid + "text"}>
            //                     {day1.prizeName}
            //                     </span>

            //                     <span id={day1.docid + "spanprizename"} hidden>
            //                     <input
            //                         id={day1.docid + "prizename"}
            //                         defaultValue={day1.prizeName}
            //                         type="text"
            //                         name={day1.docid + "prizename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.prizeName}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={day1.docid + "text"}>
            //                     {day1.prizePointsCost}
            //                     </span>
            //                     <span id={day1.docid + "spanprizepointscost"} hidden>
            //                     <input
            //                         id={day1.docid + "prizepointscost"}
            //                         defaultValue={day1.prizePointsCost}
            //                         type="text"
            //                         name={day1.docid + "prizepointscost"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.prizePointsCost}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day1.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPrize(e, day1.docid);
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
            //                         this.DeletePrize(e, day1.docid);
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
            //         this.state.day2date.map((day2) => {
            //         return <p>{day2}</p>;
            //         })}

            //     {this.state.day2prizevenue &&
            //         this.state.day2prizevenue.map((day2) => {
            //         return (
            //             <table id="users" class="table table-bordered">
            //             <tbody>
            //                 <tr>
            //                 <th scope="col">Venue</th>
            //                 <td>
            //                     <span id={day2.docid + "text"}>{day2.venue}</span>
            //                     <span id={day2.docid + "venuelocation"} hidden>
            //                     <input
            //                         id={day2.docid + "venuelocationtext"}
            //                         defaultValue={day2.venue}
            //                         type="text"
            //                         name={day2.docid + "venuelocation"}
            //                         class="form-control"
            //                         placeholder={day2.venue}
            //                         required
            //                     />
            //                     </span>
            //                 </td>

            //                 <td>
            //                     <button
            //                     id={day2.docid + "venueeditbutton"}
            //                     onClick={(e) => {
            //                         this.editVenue(day2.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day2.docid + "venueupdatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.updateVenue(day2.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day2.docid + "venuecancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelVenue(day2.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 </tr>
            //             </tbody>
            //             </table>
            //         );
            //         })}

            //     <table id="users" class="table table-bordered">
            //         <tbody>
            //         <tr>
            //             <th scope="col">Prize No.</th>
            //             <th scope="col">Prize</th>
            //             <th scope="col">Points</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day2 &&
            //             this.state.day2.map((day2, index) => {
            //             return (
            //                 <tr>
            //                 <td>{index + 1}</td>
            //                 <td>
            //                     <span class={day2.docid + "text"}>
            //                     {day2.prizeName}
            //                     </span>

            //                     <span id={day2.docid + "spanprizename"} hidden>
            //                     <input
            //                         id={day2.docid + "prizename"}
            //                         defaultValue={day2.prizeName}
            //                         type="text"
            //                         name={day2.docid + "prizename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.prizeName}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <span class={day2.docid + "text"}>
            //                     {day2.prizePointsCost}
            //                     </span>
            //                     <span id={day2.docid + "spanprizepointscost"} hidden>
            //                     <input
            //                         id={day2.docid + "prizepointscost"}
            //                         defaultValue={day2.prizePointsCost}
            //                         type="text"
            //                         name={day2.docid + "prizepointscost"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.prizePointsCost}
            //                         required
            //                     />
            //                     </span>
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day2.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPrize(e, day2.docid);
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
            //                         this.DeletePrize(e, day2.docid);
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
            //     <form onSubmit={this.addPrize}>
            //     <input
            //         type="text"
            //         name="prizeName"
            //         placeholder="Prize Name"
            //         onChange={this.updateInput}
            //         value={this.state.prizeName}
            //         required
            //     />
            //     <input
            //         type="date"
            //         name="date"
            //         placeholder="Date"
            //         onChange={this.updateInput}
            //         value={this.state.date}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="prizePointsCost"
            //         placeholder="Prize Points Cost"
            //         onChange={this.updateInput}
            //         value={this.state.prizePointsCost}
            //         required
            //     />
            //     <button type="submit">Add Prize</button>
            //     </form>
            // </div>
        );
    }
}
export default Prizes;
