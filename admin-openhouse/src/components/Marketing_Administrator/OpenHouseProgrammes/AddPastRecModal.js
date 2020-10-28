import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/AddPastRecModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';


// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class AddPastRecModal extends React.Component {
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
                    <Modal.Title id="addPastRecModalTitle" className="w-100">
                        Add Recording
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addPastRecModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* Main Row */}
                        <Form.Row className="justify-content-center">
                            {/* Left Col */}
                            <Col md="6" className="addPastRecCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faMicrophone} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="talkName" id="addPastRecForm_ProgTalkName" placeholder="Name of Recording*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Programme Talk Venue */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faSchool} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="venue" id="addPastRecForm_Venue" placeholder="Venue*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* File */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-left">
                                        <Form.File name="link" className="addPastRecForm_RecFile" label={this.state.fileLabel} onChange={console.log("set state of filename here")} custom required />
                                    </Col>
                                </Form.Row>

                                {/* Start/End Time */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    {/* Start Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faHourglassStart} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="startTime" id="addPastRecForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                        </InputGroup>
                                    </Col>

                                    {/* End Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faHourglassEnd} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="endTime" id="addPastRecForm_ProgTalkEndTime" placeholder="End Time*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                
                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="addPastRecFormCol text-center">
                                {/* Date */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faCalendarAlt} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <Form.Control as="select" name="date" defaultValue="chooseDate" className="addPastRecFormSelect" required noValidate>
                                                <option value="chooseDate" className="addPastRecFormSelectOption">Choose an Openhouse Date</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="day1" className="addPastRecFormSelectOption">21 October 2020</option>
                                            </Form.Control>                                        
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addPastRecFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addPastRecFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addPastRecFormIcon" icon={faUniversity} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addPastRecFormSelect" required noValidate>
                                                <option value="chooseUni" className="addPastRecFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="addPastRecFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Discipline Name */}
                                <Form.Row className="justify-content-center addPastRecForm_InnerRow">
                                    <Col md="10" className="text-left addPastRecForm_InnerCol">
                                        <Form.Label className="addPastRecFormLabel">Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="addPastRecForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" checked={this.checkDiscipline} value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="addPastRecForm_CheckBox" />
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
                     {/* Add Past Rec Submit Btn*/}
                    <Button type="submit" id="addPastRecFormBtn">Submit</Button>
                </Modal.Footer>
            </div>
        )
    }
}

