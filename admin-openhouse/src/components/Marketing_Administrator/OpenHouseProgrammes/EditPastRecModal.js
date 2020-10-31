import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/PastRecModals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';


// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class EditPastRecModal extends React.Component {
    constructor() {
        super();
        this.state = {
            fileLabel: "Recording File*",
            fileName: "",
        }
    }

    render(){
        //const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="editPastRecModalTitle" className="w-100">
                        Edit Recording
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="editPastRecModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* Main Row */}
                        <Form.Row className="justify-content-center">
                            {/* Left Col */}
                            <Col md="6" className="editPastRecCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faMicrophone} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="talkName" id="editPastRecForm_ProgTalkName" placeholder="Name of Recording*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Programme Talk Venue */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faSchool} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="venue" id="editPastRecForm_Venue" placeholder="Venue*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* File */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-left">
                                        <Form.File name="link" className="editPastRecForm_RecFile" label={this.state.fileLabel} onChange={console.log("set state of filename here")} custom required />
                                    </Col>
                                </Form.Row>

                                {/* Start/End Time */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    {/* Start Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faHourglassStart} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="startTime" id="editPastRecForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                        </InputGroup>
                                    </Col>

                                    {/* End Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faHourglassEnd} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="endTime" id="editPastRecForm_ProgTalkEndTime" placeholder="End Time*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                
                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="editPastRecFormCol text-center">
                                {/* Date */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faCalendarAlt} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <Form.Control as="select" name="date" defaultValue="chooseDate" className="editPastRecFormSelect" required noValidate>
                                                <option value="chooseDate" className="editPastRecFormSelectOption">Choose an Openhouse Date</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="day1" className="editPastRecFormSelectOption">21 October 2020</option>
                                            </Form.Control>                                        
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editPastRecFormIcon" icon={faUniversity} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editPastRecFormSelect" required noValidate>
                                                <option value="chooseUni" className="editPastRecFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="editPastRecFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Discipline Name */}
                                <Form.Row className="justify-content-center editPastRecForm_InnerRow">
                                    <Col md="10" className="text-left editPastRecForm_InnerCol">
                                        <Form.Label className="editPastRecFormLabel">Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="editPastRecForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" checked={this.checkDiscipline} value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="editPastRecForm_CheckBox" />
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
                     {/* Edit Past Rec Save Changes Btn */}
                    <Container>
                        <Row>
                            <Col md="6" className="text-right">
                                <Button id="saveChangesPastRecFormBtn">Save Changes</Button>
                            </Col>

                            <Col md="6" className="text-left">
                                <Button id="cancelEditPastRecFormBtn">Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}

