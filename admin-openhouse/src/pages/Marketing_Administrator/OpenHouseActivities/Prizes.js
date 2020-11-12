import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
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
        const venue = [];
        const prize = [];
        var counter = 1;

        //Get Venues For Both Open House Days
        db.collection("Prizes").doc("venue").get().then((doc) => {
            const day = doc.get('day');
            for (var i = 0; i < Object.keys(day).length; i++) {
                const venueData = {
                    id: doc.data().id,
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
                if (doc.data().hasOwnProperty('prizeName')) {
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
        
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("Prizes").orderBy("id", "desc").where("id", "!=", "venue").limit(1).get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    var docid = "";
                    var res = doc.data().id.substring(9, 6);
                    var id = parseInt(res);
                    id += 1;

                    if (id.toString().length == 1) {
                        docid = "prize-00" + (id);
                    } else if (id.toString().length == 2) {
                        docid = "prize-0" + (id);
                    } else {
                        docid = "prize-" + (id);
                    }
        
                    db.collection("Prizes").doc(docid)
                    .set({
                        prizePointsCost: +this.state.prizePointsCost,
                        prizeName: this.state.prizeName,
                        stock: +this.state.stock,
                        id: docid,
                    })
                    .then(dataSnapshot => {
                        this.setState({
                            addModal: false,
                        });
                        this.display();
                    });
                });
            });
        }
    };

    //Delete prize when click on 'Confirm' button in Delete Modal - Integrated
    DeletePrize(e, prizeId) {
        db.collection("Prizes").doc(prizeId).delete()
        .then(dataSnapshot => {
            this.setState({
                deleteModal: false
            });
            this.display();
        });
    }

    //Update prize when click on 'Save Changes' button in Edit Modal - Integrated
    updatePrize(e, prizeId) {
        //Update respective data by their ids for Edit Modal - Integrated.

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
            .then(dataSnapshot => {
                this.setState({
                    editModal: false
                });
                this.display();
            });
        }
    }

    
    updateVenue(e, venueId, venueDay) {
        //Update respective data by their ids and day number for Edit Modal - Integrated
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
                        .then(dataSnapshot => {
                            this.setState ({
                                editVenueModal: false
                            });
                            this.display();
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
                        .then(dataSnapshot => {
                            this.setState ({
                                editVenueModal: false
                            });
                            this.display();
                        });                        
                    }
                }
            }
        });
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
    handleEdit = (prizeId) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {

            var stock = prizeId.stock;
            var stringStock = stock.toString();
            var prizePointsCost = prizeId.prizePointsCost;
            var stringPrizePointsCost = prizePointsCost.toString();

            this.setState({
                editModal: true,
                id: prizeId.id,
                prizeName: prizeId.prizeName,
                prizePointsCost: stringPrizePointsCost,
                stock: stringStock,
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
    handleVenueEdit = (venueId) => {
        this.editVenueModal = this.state.editVenueModal;
        if (this.editVenueModal == false) {
            this.setState({
                editVenueModal: true,
            });

            if (venueId.day == 1) {
                for (var i = 0; i < 1; i++){
                    this.setState({
                        day: venueId.day,
                        date: venueId.date,
                        venue: venueId.venue,
                        id: venueId.id,
                    });
                }
            }

            if (venueId.day == 2) {
                for (var i = 1; i < 2; i++){
                    this.setState({
                        day: venueId.day,
                        date: venueId.date,
                        venue: venueId.venue,
                        id: venueId.id,
                    });
                }
            }
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
            venueError = "Please enter a valid venue. E.g. SIM HQ BLK A Atrium";
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
                                                                                        <tr key={venue.id}>
                                                                                            <td>{venue.date}</td>
                                                                                            <td>{venue.venue}</td>
                                                                                            <td><Button size="sm" id="Prizes-editBtn" onClick={(e) => {this.handleVenueEdit(venue)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                                                            <td><Button size="sm" id="Prizes-editBtn" onClick={(e) => {this.handleEdit(prize)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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
                                                        <Form.Control id="Prizes-inputFields" type="text" name="date" placeholder="Date: e.g. 21-Nov-2020" onChange={this.updateInput} required defaultValue={this.state.date} noValidate></Form.Control>
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
                                                            <Form.Control id="Prizes-inputFields" type="text" name="venue" placeholder="Venue: e.g. SIM HQ BLK A Atrium" onChange={this.updateInput} required defaultValue={this.state.venue} noValidate></Form.Control>
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
        );
    }
}
export default Prizes;
