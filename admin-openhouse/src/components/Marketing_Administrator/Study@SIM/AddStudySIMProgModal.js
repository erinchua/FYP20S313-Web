import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck, Button, InputGroup, Col, Row, FormControl } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/AddStudySIMProgModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';


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
            awardingUni: "",
            capacityLimit: "",
            date: "",
            endTime: "",
            hasRecording: "",
            isLive: "",
            noRegistered: "",
            startTime: "",
            talkName: "",
            venue: "",
            Link: "",
            id: "",
        };
    }


    /* Add Add Programme Talk Modal Validations */
    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        
        let errors = this.state.errors;
        
        switch (name) {
            case 'programmeTalkName': 
                errors.programmeTalkName = value.length == 0
                    ? 'Please enter a valid programme talk name!'
                    : '';
                break;

            case 'email': 
                errors.email = value.length < 1
                    ? ''
                    : 'Please enter a valid email!';
                break;

            default:
                break;
        }
        
        this.setState({errors, [e.target.name]: e.target.value}, ()=> {
            console.log(errors)
        })
    
    }


    render(){
        //const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
                        Add Programme
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addStudySIMProgModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
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
                                            <Form.File name="logoFile" id="addStudySIMProgForm_LogoFile" label="Logo File*" custom required />
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

                                {/* Mode of Study */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="MoSName" defaultValue="chooseMoS" className="addStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseMoS" className="addStudySIMProgFormSelectOption">Choose a Mode of Study</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="fullTime" className="addStudySIMProgFormSelectOption">Full-Time</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Disciplines */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="addStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="disciplineName" defaultValue="chooseDiscipline" className="addStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseDiscipline" className="addStudySIMProgFormSelectOption">Choose a Discipline</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="artsSocialSciences" className="addStudySIMProgFormSelectOption">Arts & Social Sciences</option>
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

                                {/* Entry Qualifications */}
                                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="addStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>                        
                                        
                                        <Container className="addStudySIMProgForm_CheckBoxCon">
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
                                        <Form.Label>Choose Sub-Discipline(s):</Form.Label>                        
                                        
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

                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    {/* Add Programme Submit Btn Row */}
                    <Button type="submit" id="addStudySIMProgFormBtn">Submit</Button>
                </Modal.Footer>
            </div>
        )
    }
}

