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

                <Modal.Body id="editStudySIMProgModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
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
                                        <Form.Label>Choose Mode of Study:</Form.Label>                                     
                                            
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
                                        <Form.Label>Choose Discipline(s):</Form.Label>                                     
                                            
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
                                        <Form.Label>Choose Sub-Discipline(s):</Form.Label>                        
                                        
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

                    </Form>
                </Modal.Body>

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

