import React, { Component } from "react";
import { auth, db } from "../../config/firebase";
import history from "../../config/history";
import { Container, Row, Col, Button, Table, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

import "../../css/Marketing_Administrator/CampusFacilitiesMap.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEdit } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';


const initialStates = {
    blockError: "",
    facilityNameError: "",
    facilityLocationError: ""
}

class CampusFacilitiesMap extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            blockName: "",
            facilityName: "",
            location: "",

            filteredBlock: [],
            editCampusFacilModal: false
        };
        this.resetForm = this.resetForm.bind(this);
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
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        db
        .collection("CampusFacilities").orderBy('blockName','asc')
        .get()
        .then((snapshot) => {
            const facilities = [];
            const block = [];
            snapshot.forEach((doc) => {
                const data = {
                    blockName: doc.data().blockName,
                    facilityName: doc.data().facilityName,
                    location: doc.data().location,
                    id: doc.id,
                };
                facilities.push(data);
                block.push(doc.data().blockName);
            });
            this.setState({ block: block });
            var filteredBlock = block.filter(onlyUnique);

            this.setState({ facilities: facilities,});
            this.setState({filteredBlock: filteredBlock});
        });
    }

    editFacilities(e, facilitiesid) {
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db
            .collection("CampusFacilities")
            .doc(this.state.id)
            .update({
                blockName: this.state.blockName,
                facilityName: this.state.facilityName,
                location: this.state.location,
            })
            .then(() => {
                this.setState({
                    editCampusFacilModal: false
                })
                this.display()
            }); 
        }
    }


    /* Edit Campus Facilities Modal */
    handleEditCampusFacilModal = (facility) => {
        if (this.state.editCampusFacilModal == false) {
            this.setState({
                id: facility.id,
                editCampusFacilModal: true,
                blockName: facility.blockName,
                facilityName: facility.facilityName,
                location: facility.location,
            });
        }
        else {
            this.setState({
                editCampusFacilModal: false
            });
            this.resetForm();
        }
    };

    //Validations for the Forms in Modals
    validate = () => {
        let blockError = "";
        let facilityNameError = "";
        let facilityLocationError = "";

        if (!this.state.blockName) {
            blockError = "Please select a valid block!";
        } 

        if (! (this.state.facilityName && this.state.facilityName.length >= 2) ) {
            facilityNameError = "Please enter a valid facility name!";
        }

        if (! (this.state.location && this.state.location.length >= 2) ) {
            facilityLocationError = "Please enter a valid facility location!";
        }

        if (blockError || facilityNameError || facilityLocationError) {
            this.setState({
                blockError, facilityNameError, facilityLocationError
            });
            return false;
        } 
        return true;
    }

    //Reset Forms
    resetForm = () => {
        this.setState({
            blockError: "",
            facilityNameError: "",
            facilityLocationError: "",
            id: "", 
            blockName: "",
            facilityName: "",
            location: "",
        })
    }

    render() {
        return (
            <div>
                <Container fluid className="campusFacilCon">
                    <NavBar isMA={true} />

                        <Container fluid className="campusFacilContent">
                            <Row>
                                {/* SideNavBar Col */}
                                <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                                    <SideNavBar />
                                </Col>

                                {/* Contents Col */}
                                <Col md="10" style={{paddingLeft:"0"}}>
                                    <Container fluid className="campusFacilContentCon">
                                        {/* Campus Facilities Map Page Header row */}
                                        <Row id="campusFacilContentHeaderRow" className="justify-content-center">
                                            <Col md="12" className="text-left campusFacilContentHeaderCol">
                                                <h4 id="campusFacilHeaderText">Campus Facilities Map</h4>
                                            </Col>
                                        </Row>

                                        {/* Campus Facilities Table */}
                                        <Row id="campusFacilTableRow" className="justify-content-center">
                                            <Col md="12">
                                                <Table responsive="sm" bordered id="campusFacilTable">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th id="campusFacilHeader_Block" className="text-center">Block</th>
                                                            <th id="campusFacilHeader_FacilName" className="text-center">Name of Facility</th>
                                                            <th id="campusFacilHeader_Location" className="text-center">Location</th>
                                                            <th id="campusFacilHeader_Edit" className="text-center">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    
                                                    <tbody>
                                                        {this.state.facilities && this.state.facilities.map((facility) => {
                                                            return (
                                                            <tr key={facility.id}>
                                                                <td id="campusFacilData_Block" className="text-center">{facility.blockName}</td>
                                                                <td id="campusFacilData_FacilName" className="text-left">{facility.facilityName}</td>
                                                                <td id="campusFacilData_Location" className="text-left">{facility.location}</td>
                                                                <td id="campusFacilData_Edit" className="text-center">
                                                                <Button id="editCampusFacilBtn" onClick={() => {this.handleEditCampusFacilModal(facility)}}>
                                                                    <FontAwesomeIcon size="lg" id="editCampusFacilBtnIcon" icon={faEdit} />
                                                                </Button>
                                                                </td>
                                                            </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </ Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    <Footer />
                </Container>


                {/* Edit Campus Facilities Modal */}
                <Modal 
                show={this.state.editCampusFacilModal}
                onHide={this.handleEditCampusFacilModal}
                aria-labelledby="editCampusFacilModalTitle"
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header closeButton className="justify-content-center">
                        <Modal.Title id="editCampusFacilModalTitle" className="w-100">
                        Edit Campus Facility
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body id="editCampusFacilModalBody">
                        <Form noValidate onSubmit={()=>{this.editFacilities()}}>
                            {/* Block */}
                            <Form.Row className="justify-content-center editCampusFacilFormRow">
                                <Col md="10" className="editCampusFacilFormCol">
                                    <InputGroup className="editCampusFacilFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editCampusFacilFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editCampusFacilFormIcon" icon={faBuilding} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <Form.Control as="select" name="blockName" defaultValue={this.state.blockName} onChange={this.updateInput} className="editCampusFacilFormSelect" required noValidate>
                                            <option value="" className="editCampusFacilFormSelectOption">Choose Block</option>
                                            {this.state.filteredBlock && this.state.filteredBlock.map((blockName) => {
                                                return (
                                                <>
                                                    <option value={blockName} className="editCampusFacilFormSelectOption">{blockName}</option>
                                                </>
                                                );
                                            })}
                                        </Form.Control> 
                                    </InputGroup>

                                    <div className="errorMessage text-left">{this.state.blockError}</div>
                                </Col>
                            </Form.Row>

                            {/* Facility Name */}
                            <Form.Row className="justify-content-center editCampusFacilFormRow">
                                <Col md="10">
                                    <Form.Label className="editCampusFacilFormLabel">Facility Name</Form.Label>
                                    <FormControl as="textarea" rows="4" name="facilityName" defaultValue={this.state.facilityName} onChange={this.updateInput} required noValidate id="editCampusFacilForm_FacilName" placeholder="Facility Name*" />                                       
                                
                                    <div className="errorMessage text-left">{this.state.facilityNameError}</div>
                                </Col>
                            </Form.Row>

                            {/* Facility Location */}
                            <Form.Row className="justify-content-center editCampusFacilFormRow">
                                <Col md="10">
                                    <Form.Label className="editCampusFacilFormLabel">Facility Location</Form.Label>
                                    <FormControl as="textarea" rows="4" name="location" defaultValue={this.state.location} onChange={this.updateInput} required noValidate id="editCampusFacilForm_FacilLocation" placeholder="Facility Location*" />                                       
                                
                                    <div className="errorMessage text-left">{this.state.facilityLocationError}</div>
                                </Col>
                            </Form.Row>

                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center">
                        {/* Edit Campus Facility Save Changes Btn */}
                        <Container>
                            <Row>
                                <Col md="6" className="text-right">
                                    <Button id="saveChangesCampusFacilFormBtn" onClick={(e)=>{this.editFacilities()}}>Save Changes</Button>
                                </Col>

                                <Col md="6" className="text-left">
                                    <Button id="cancelEditCampusFacilFormBtn" onClick={this.handleEditCampusFacilModal}>Cancel</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CampusFacilitiesMap;
