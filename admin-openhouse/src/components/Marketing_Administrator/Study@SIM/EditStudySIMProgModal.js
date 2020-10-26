import React from 'react';
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/EditStudySIMProgModal.css";

// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class EditStudySIMProgModal extends React.Component {
    constructor() {
        super();
        this.state = {
            handleSaveChanges: "",
            handleCancelEdit: "",
        };
    }


    /* Edit Programme Modal Validations */
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
        // const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
                        Edit Programme
                    </Modal.Title>
                </Modal.Header>

                <Form noValidate> {/* Need to add onSubmit later */}
                    <Modal.Body id="editStudySIMProgModalBody">
                        {/* Main Row */}
                        <Form.Row className="justify-content-center editStudySIMProgFormRow">
                            {/* Left Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">
                                            <FormControl type="text" name="talkName" id="editStudySIMProgForm_ProgName" placeholder="Name of Programme*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Logo File */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">
                                            <Form.File name="logoFile" id="editStudySIMProgForm_LogoFile" label="Logo File*" custom required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseUni" className="editStudySIMProgFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="editStudySIMProgFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Category */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="categoryName" defaultValue="chooseCategory" className="editStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseCategory" className="editStudySIMProgFormSelectOption">Choose a Category</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="undergraduateProgrammes" className="editStudySIMProgFormSelectOption">Undergraduate Programmes</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Academic Level */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">                                       
                                            <Form.Control as="select" name="academicLevelName" defaultValue="chooseAcademicLevel" className="editStudySIMProgFormSelect" required noValidate>
                                                <option value="chooseAcademicLevel" className="editStudySIMProgFormSelectOption">Choose an Academic Level</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="bachelor" className="editStudySIMProgFormSelectOption">Bachelor</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Mode of Study */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                                        <Form.Label className="editStudySIMProgFormLabel">Choose Mode of Study:</Form.Label>                                     
                                            
                                        <Container className="editStudySIMProgForm_MoSCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="mosName" value="fullTime" type="checkbox" label="Full-Time" className="editStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                                {/* Disciplines */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                                        <Form.Label className="editStudySIMProgFormLabel">Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="editStudySIMProgForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="editStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                                {/* Entry Qualifications */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                                        <Form.Label className="editStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>                        
                                        
                                        <Container className="editStudySIMProgForm_EntryQualCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="entryQual" value="ALevel" type="checkbox" label="'A' Level" className="editStudySIMProgForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>
                                    </Col>
                                </Form.Row>
                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
                                {/* Sub Disciplines */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                                        <Form.Label className="editStudySIMProgFormLabel">Choose Sub-Discipline(s):</Form.Label>                        
                                        
                                        <Container className="editStudySIMProgForm_SubDisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="subDiscipline" value="Accounting" type="checkbox" label="Accounting" className="editStudySIMProgForm_CheckBox" />
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
                        <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
                            Programme Details
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {/* Main Row */}
                        <Form.Row className="justify-content-center editStudySIMProgFormRow">
                            {/* Left Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
                                {/* About Programme */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">About Programme</Form.Label>

                                        <FormControl as="textarea" rows="6" required noValidate className="editStudySIMProgForm_TextArea" placeholder="About Programme" />
                                    </Col>
                                </Form.Row>

                                {/* Application Period */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Application Period</Form.Label>

                                        <FormControl as="textarea" rows="6" required noValidate className="editStudySIMProgForm_TextArea" placeholder="Application Period" />
                                    </Col>
                                </Form.Row>

                                {/* Programme Structure */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Programme Structure</Form.Label>

                                        
                                        <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                            {/* Coursework */}
                                            <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                                                <Form.Label className="editStudySIMProgFormLabel">Coursework</Form.Label>

                                                <Container className="editStudySIMProgForm_StructureOverseasCon">
                                                    {/* To be retrieved from db - row is generated dynamically */}
                                                    <Row>
                                                        <Col style={{paddingLeft: "10%"}}>
                                                            <Form.Check name="coursework" value="True" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" />
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Col>

                                            {/* Examination */}
                                            <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                                                <Form.Label className="editStudySIMProgFormLabel">Examination</Form.Label>

                                                <Container className="editStudySIMProgForm_StructureOverseasCon">
                                                    {/* To be retrieved from db - row is generated dynamically */}
                                                    <Row>
                                                        <Col style={{paddingLeft: "10%"}}>
                                                            <Form.Check name="examination" value="True" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" />
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
                                {/* Overseas Opportunity */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Overseas Opportunity</Form.Label>

                                        <Form.Row className="justify-content-center">
                                            {/* Exchange */}
                                            <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                                                <Form.Label className="editStudySIMProgFormLabel">Exchange</Form.Label>

                                                <Container className="editStudySIMProgForm_StructureOverseasCon">
                                                    {/* To be retrieved from db - row is generated dynamically */}
                                                    <Row>
                                                        <Col style={{paddingLeft: "10%"}}>
                                                            <Form.Check name="exchange" value="True" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" />
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Col>

                                            {/* Transfer */}
                                            <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                                                <Form.Label className="editStudySIMProgFormLabel">Transfer</Form.Label>

                                                <Container className="editStudySIMProgForm_StructureOverseasCon">
                                                    {/* To be retrieved from db - row is generated dynamically */}
                                                    <Row>
                                                        <Col style={{paddingLeft: "8%"}}>
                                                            <Form.Check name="transfer" value="True" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" />
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

                                {/* Intake Month(s) */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Intake Month(s)</Form.Label>

                                        <FormControl as="textarea" rows="4" required noValidate className="editStudySIMProgForm_TextArea" placeholder="Intake Month(s)" />
                                    </Col>
                                </Form.Row>

                                {/* Duration */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Duration</Form.Label>

                                        <FormControl as="textarea" rows="4" required noValidate className="editStudySIMProgForm_TextArea" placeholder="Duration" />
                                    </Col>
                                </Form.Row>

                            </Col>
                        </Form.Row>
                    </Modal.Body>

                </Form>

                <Modal.Footer className="justify-content-center">
                    {/* Edit Programme Talk Save Changes Btn */}
                    <Container>
                        <Row>
                            <Col md="6" className="text-right">
                                <Button id="saveChangesEditProgFormBtn" onClick={this.props.handleSaveChanges}>Save Changes</Button>
                            </Col>

                            <Col md="6" className="text-left">
                                <Button id="cancelEditProgFormBtn" onClick={this.props.handleCancelEdit}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}

