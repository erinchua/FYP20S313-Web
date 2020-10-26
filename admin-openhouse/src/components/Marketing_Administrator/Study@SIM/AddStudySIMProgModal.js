import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck, Button, InputGroup, Col, Row, FormControl } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/AddStudySIMProgModal.css";
import bsCustomFileInput from "bs-custom-file-input"

// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class AddStudySIMProgModal extends React.Component {
    constructor() {
        super();
        this.state = {
            fileLabel: "Logo File*",
            fileName: "",
    //         awardingUni: "",
    //         capacityLimit: "",
    //         date: "",
    //         endTime: "",
    //         hasRecording: "",
    //         isLive: "",
    //         noRegistered: "",
    //         startTime: "",
    //         talkName: "",
    //         venue: "",
    //         Link: "",
    //         id: "",
        };
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }

    /* Add Programme Modal Validations */
    // handleChange = (e) => {
    //     e.preventDefault();
    //     const { name, value } = e.target;
        
    //     let errors = this.state.errors;
        
    //     switch (name) {
    //         case 'programmeTalkName': 
    //             errors.programmeTalkName = value.length == 0
    //                 ? 'Please enter a valid programme talk name!'
    //                 : '';
    //             break;

    //         case 'email': 
    //             errors.email = value.length < 1
    //                 ? ''
    //                 : 'Please enter a valid email!';
    //             break;

    //         default:
    //             break;
    //     }
        
    //     this.setState({errors, [e.target.name]: e.target.value}, ()=> {
    //         console.log(errors)
    //     })
    
    // }


    render(){
        //const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
                        Add Programme
                    </Modal.Title>
                </Modal.Header>

                <Form noValidate> {/* Need to add onSubmit later */}
                    <Modal.Body id="addStudySIMProgModalBody">
                        {/* Main Row */}
                        <Form.Row className="justify-content-center addStudySIMProgFormRow">
                            {/* Left Col */}
                            <Col md="6" className="addStudySIMProgFormCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">
                                            <FormControl type="text" name="talkName" id="addStudySIMProgForm_ProgName" placeholder="Name of Programme*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Logo File */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">
                                            <Form.File name="logoFile" id="addStudySIMProgForm_LogoFile" label={this.state.fileLabel} onChange={console.log("set state of filename here")} custom required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseUni" className="addStudySIMProgFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="addStudySIMProgFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Category */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="categoryName" defaultValue="chooseCategory" className="addStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseCategory" className="addStudySIMProgFormSelectOption">Choose a Category</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="undergraduateProgrammes" className="addStudySIMProgFormSelectOption">Undergraduate Programmes</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Academic Level */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="academicLevelName" defaultValue="chooseAcademicLevel" className="addStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseAcademicLevel" className="addStudySIMProgFormSelectOption">Choose an Academic Level</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="bachelor" className="addStudySIMProgFormSelectOption">Bachelor</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Mode of Study */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                                        <Form.Label className="addStudySIMProgFormLabel">Choose Mode of Study:</Form.Label>                                     
                                            
                                        <Container className="addStudySIMProgForm_MoSCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="mosName" value="fullTime" type="checkbox" label="Full-Time" className="addStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                                {/* Disciplines */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                                        <Form.Label className="addStudySIMProgFormLabel">Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="addStudySIMProgForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="addStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                                {/* Entry Qualifications */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                                        <Form.Label className="addStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>                        
                                        
                                        <Container className="addStudySIMProgForm_EntryQualCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="entryQual" value="ALevel" type="checkbox" label="'A' Level" className="addStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>
                                    </Col>
                                </Form.Row>
                            </Col>


                            {/* Right Col */}
                            <Col md="6" className="addStudySIMProgFormCol text-center">
                                {/* Sub Disciplines */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                                        <Form.Label className="addStudySIMProgFormLabel">Choose Sub-Discipline(s):</Form.Label>                        
                                        
                                        <Container className="addStudySIMProgForm_SubDisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="subDiscipline" value="Accounting" type="checkbox" label="Accounting" className="addStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Form.Row>
                            </Col>
                        </Form.Row>

                    </Modal.Body>

                    {/* Programme Details Section */}
                    <Modal.Header>
                        <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
                            Programme Details
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {/* Main Row */}
                        <Form.Row className="justify-content-center addStudySIMProgFormRow">
                            {/* Left Col */}
                            <Col md="6" className="addStudySIMProgFormCol text-center">
                                {/* About Programme */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">About Programme</Form.Label>

                                        <FormControl as="textarea" rows="6" required noValidate className="addStudySIMProgForm_TextArea" placeholder="About Programme" />
                                    </Col>
                                </Form.Row>

                                {/* Application Period */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Application Period</Form.Label>

                                        <FormControl as="textarea" rows="6" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Application Period" />
                                    </Col>
                                </Form.Row>

                                {/* Programme Structure */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Programme Structure</Form.Label>

                                        <Form.Row className="justify-content-center">
                                            <Col md="6" className="text-left">
                                                <Form.Label className="addStudySIMProgFormLabel">Coursework</Form.Label>

                                                <FormControl as="textarea" rows="3" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Coursework" />
                                            </Col>

                                            <Col md="6" className="text-left">
                                                <Form.Label className="addStudySIMProgFormLabel">Examination</Form.Label>

                                                <FormControl as="textarea" rows="3" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Examination" />
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="addStudySIMProgFormCol text-center">
                                {/* Overseas Opportunity */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Overseas Opportunity</Form.Label>

                                        <Form.Row className="justify-content-center">
                                            <Col md="6" className="text-left">
                                                <Form.Label className="addStudySIMProgFormLabel">Exchange</Form.Label>

                                                <FormControl as="textarea" rows="3" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Exchange" />
                                            </Col>

                                            <Col md="6" className="text-left">
                                                <Form.Label className="addStudySIMProgFormLabel">Transfer</Form.Label>

                                                <FormControl as="textarea" rows="3" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Transfer" />
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

                                {/* Intake Month(s) */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Intake Month(s)</Form.Label>

                                        <FormControl as="textarea" rows="4" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Intake Month(s)" />
                                    </Col>
                                </Form.Row>

                                {/* Duration */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Duration</Form.Label>

                                        <FormControl as="textarea" rows="4" required noValidate className="addStudySIMProgForm_TextArea" placeholder="Duration" />
                                    </Col>
                                </Form.Row>

                            </Col>
                        </Form.Row>
                    </Modal.Body>
                </Form>


                <Modal.Footer className="justify-content-center">
                    {/* Add Programme Submit Btn*/}
                    <Button type="submit" id="addStudySIMProgFormBtn">Submit</Button>
                </Modal.Footer>
            </div>
        )
    }
}

