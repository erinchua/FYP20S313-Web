import React from 'react';
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup } from 'react-bootstrap';
import {auth,db} from "../../../config/firebase";

import "../../../css/Marketing_Administrator/EditStudySIMProgModal.css";


export default class EditStudySIMProgModal extends React.Component {

    constructor(props){
        super(props)
        this.setState({})

    }
    render(){
        const {programme,universities,disciplines,subDisciplines} = this.props
        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
                        Edit Programme
                    </Modal.Title>
                </Modal.Header>

                <Form noValidate>
                    <Modal.Body id="editStudySIMProgModalBody">
                        {/* Main Row */}
                        <Form.Row className="justify-content-center editStudySIMProgFormRow">
                            {/* Left Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp"> {/* Add the programme name in defaultValue */}
                                            <FormControl type="text" name="programmeTitle" defaultValue={programme.programmeTitle} id="editStudySIMProgForm_ProgName" placeholder="Name of Programme*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Logo File */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">
                                            <Form.File name="logoFile" className="editStudySIMProgForm_LogoFile" label="Logo File*" custom required /> {/* label will follow the name of the file uploaded so need to replace later */}
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">     
                                            {/* Change value to e.g. {this.state.academicLevelName} */}                                      
                                            <Form.Control as="select" name="awardedBy" defaultValue={programme.awardedBy} className="editStudySIMProgFormSelect" required noValidate>
                                                <option value="" className="editStudySIMProgFormSelectOption">Choose University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                {universities.map((uni)=>{
                                                    return(<option value={uni} className="editStudySIMProgFormSelectOption">{uni}</option>)
                                                })}
                                                
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Academic Level */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-center">
                                        <InputGroup className="editStudySIMProgFormColInputGrp">
                                            {/* Change value to e.g. {this.state.academicLevelName} */}                                       
                                            <Form.Control as="select" name="academicLevelName" defaultValue={programme.academicLevel} className="editStudySIMProgFormSelect" required noValidate>
                                                <option value="" className="editStudySIMProgFormSelectOption" >Choose Academic Level</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="bachelor" className="editStudySIMProgFormSelectOption">Bachelor</option>
                                                <option value="diploma" className="editStudySIMProgFormSelectOption">Diploma</option>
                                                <option value="masters" className="editStudySIMProgFormSelectOption">Masters</option>
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
                                                    <Form.Check name="mosName" value="fullTime" type="checkbox" label="Full-Time" className="editStudySIMProgForm_CheckBox" checked={programme.modeOfStudy.fullTime}/>
                                                    <Form.Check name="mosName" value="partTime" type="checkbox" label="Part-Time" className="editStudySIMProgForm_CheckBox" checked={programme.modeOfStudy.partTime}/>
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
                                                {disciplines.map((discipline)=>{
                                                    return(<Form.Check name="discipline" value={discipline} type="checkbox" label={discipline} className="editStudySIMProgForm_CheckBox" checked={programme.discipline.includes(discipline)}/>
                                                    )
                                                })}
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
                                                    <Form.Check name="entryQual" value="oLevel" type="checkbox" label="'O' Level" className="editStudySIMProgForm_CheckBox" checked={programme.entryQualifications.oLevel}/>
                                                    <Form.Check name="entryQual" value="aLevel" type="checkbox" label="'A' Level" className="editStudySIMProgForm_CheckBox" checked={programme.entryQualifications.aLevel}/>
                                                    <Form.Check name="entryQual" value="diploma" type="checkbox" label="Diploma" className="editStudySIMProgForm_CheckBox" checked={programme.entryQualifications.diploma}/>
                                                    <Form.Check name="entryQual" value="degree" type="checkbox" label="Degree" className="editStudySIMProgForm_CheckBox" checked={programme.entryQualifications.degree}/>
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
                                                {subDisciplines.map((subDisc)=>{
                                                    return(<Form.Check name="subDiscipline" value={subDisc} type="checkbox" label={subDisc} className="editStudySIMProgForm_CheckBox" checked={programme.subDiscipline.includes(subDisc)}/>)
                                                })}
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

                                        <FormControl as="textarea" rows="6" name="aboutProgramme" defaultValue={programme.programOverview} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Program Overview" defaultValue={programme.programOverview}/>
                                    </Col>
                                </Form.Row>

                                {/* Application Period */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Application Period</Form.Label>
                                        
                                        <Container className="editStudySIMProgForm_applicationPeriodMainCon">
                                            {/* Intake and Period rows to be generated together for each application period */}
                                            {/* Application Period Intake */}
                                            {programme.applicationPeriod.map((appPeriod,index)=>{
                                                index+=1;
                                                return(<div>
                                                    <Form.Row className="justify-content-center">
                                                <Col className="text-left editStudySIMProgForm_InnerCol">
                                                    <Form.Label className="editStudySIMProgFormLabel">Intake {index}</Form.Label>

                                                    <Container className="editStudySIMProgForm_applicationPeriodCon">
                                                        {/* To be retrieved from db - row is generated dynamically */}
                                                        <Row>
                                                            <Col>
                                                                <FormControl as="textarea" rows="2" name="intake" defaultValue={appPeriod.intake} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Application Intake"/>
                                                            </Col>
                                                        </Row>

                                                    </Container>
                                                </Col>
                                            </Form.Row>
                                                    {/* Application Period */}
                                                    <Form.Row className="justify-content-center">
                                                <Col className="text-left editStudySIMProgForm_InnerCol">
                                                    <Form.Label className="editStudySIMProgFormLabel">Period {index}</Form.Label>

                                                    <Container className="editStudySIMProgForm_applicationPeriodCon">
                                                        {/* To be retrieved from db - row is generated dynamically */}
                                                        <Row>
                                                            <Col>
                                                                <FormControl as="textarea" rows="2" name="period" defaultValue={appPeriod.period} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Application Period"/>
                                                            </Col>
                                                        </Row>

                                                    </Container>
                                                </Col>
                                            </Form.Row>

                                                </div>)
                                            })}
                                            
                                        </Container>
                                    </Col>
                                </Form.Row>

                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="editStudySIMProgFormCol text-center">
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
                                                            <Form.Check name="coursework" value="true" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" checked={programme.programmeStructure.coursework}/>
                                                            <Form.Check name="coursework" value="false" type="radio" label="No" className="editStudySIMProgForm_CheckBox" checked={!programme.programmeStructure.coursework}/>
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
                                                            <Form.Check name="examination" value="true" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" checked={programme.programmeStructure.examination}/>
                                                            <Form.Check name="examination" value="false" type="radio" label="No" className="editStudySIMProgForm_CheckBox" checked={!programme.programmeStructure.examination}/>

                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

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
                                                            <Form.Check name="exchange" value="true" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" checked={programme.overseaOpportunity.exchange}/>
                                                            <Form.Check name="exchange" value="false" type="radio" label="No" className="editStudySIMProgForm_CheckBox" checked={!programme.overseaOpportunity.exchange}/>
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
                                                            <Form.Check name="transfer" value="true" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" checked={programme.overseaOpportunity.transfer}/>
                                                            <Form.Check name="transfer" value="false" type="radio" label="Yes" className="editStudySIMProgForm_CheckBox" checked={!programme.overseaOpportunity.transfer}/>
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

                                        <Form.Row className="justify-content-center">
                                            <Col md="6" className="text-left">
                                                <Form.Label className="editStudySIMProgFormLabel">Full-Time</Form.Label>

                                                <FormControl as="textarea" rows="3" name="intakeMonths_fullTime" defaultValue={programme.intakeMonths.fullTime} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Full-Time" />
                                            </Col>

                                            <Col md="6" className="text-left">
                                                <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label>

                                                <FormControl as="textarea" rows="3" name="intakeMonths_partTime" defaultValue={programme.intakeMonths.partTime} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Part-Time" />
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Form.Row>

                                {/* Duration */}
                                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                                    <Col md="9" className="text-left">
                                        <Form.Label className="editStudySIMProgFormLabel">Duration</Form.Label>

                                        <Form.Row className="justify-content-center">
                                            <Col md="6" className="text-left">
                                                <Form.Label className="editStudySIMProgFormLabel">Full-Time</Form.Label>

                                                <FormControl as="textarea" rows="3" name="duration_fullTime" defaultValue={programme.duration.fullTime} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Full-Time" />
                                            </Col>

                                            <Col md="6" className="text-left">
                                                <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label>

                                                <FormControl as="textarea" rows="3" name="duration_partTime" defaultValue={programme.duration.partTime} required noValidate className="editStudySIMProgForm_TextArea" placeholder="Part-Time" />
                                            </Col>
                                        </Form.Row>                                    
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
                                <Button id="saveChangesEditProgFormBtn" onClick={this.handleSaveChanges}>Save Changes</Button>
                            </Col>

                            <Col md="6" className="text-left">
                                <Button id="cancelEditProgFormBtn" onClick={this.handleCancelEdit}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}

