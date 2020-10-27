import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/EditLiveTalkModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faUniversity, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';


export default class EditLiveTalkModal extends React.Component {

    render(){
        //const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="editLiveTalkModalTitle" className="w-100">
                    Edit Live Talk
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="editLiveTalkModalBody">
                    <Form noValidate> {/* onSubmit={this.editLiveTalk} */}
                    {/* Main Row */}
                    <Form.Row className="justify-content-center">
                        {/* Left Col */}
                        <Col md="6" className="editLiveTalkFormCol text-center">
                            {/* Live Talk Name */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                <InputGroup className="editLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faMicrophone} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl type="text" name="talkName" id="editLiveTalkForm_ProgTalkName" placeholder="Name of Live Talk*" required />
                                </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Live Talk Venue */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="editLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faSchool} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <FormControl type="text" name="venue" id="editLiveTalkForm_Venue" placeholder="Venue*" required />
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Start/End Time */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                {/* Start Time */}
                                <Col md="5" className="text-center">
                                    <InputGroup className="editLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faHourglassStart} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    
                                        <FormControl type="text" name="startTime" id="editLiveTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                    </InputGroup>
                                </Col>

                                {/* End Time */}
                                <Col md="5" className="text-center">
                                    <InputGroup className="editLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faHourglassEnd} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        
                                        <FormControl type="text" name="endTime" id="editLiveTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                                    </InputGroup>
                                </Col>
                            </Form.Row>
                        </Col>

                        {/* Right Col */}
                        <Col md="6" className="editLiveTalkFormCol text-center">
                            {/* Date */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="editLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faCalendarAlt} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    
                                        <Form.Control as="select" name="date" defaultValue="chooseDate" className="editLiveTalkFormSelect" required noValidate>
                                            <option value="chooseDate" className="editLiveTalkFormSelectOption">Choose an Openhouse Date</option>
                                            
                                            {/* To be retrieved from DB */}
                                            <option value={this.state.day1Date} className="editLiveTalkFormSelectOption">{this.state.day1Date}</option>
                                            <option value={this.state.day2Date} className="editLiveTalkFormSelectOption">{this.state.day2Date}</option>

                                        </Form.Control>                                        
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* University */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="editLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="editLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="editLiveTalkFormIcon" icon={faUniversity} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editLiveTalkFormSelect" required noValidate>
                                            <option value="chooseUni" className="editLiveTalkFormSelectOption">Choose a University</option>
                                            
                                            {/* To be retrieved from DB */}
                                            {this.state.uniList && this.state.uniList.map((uni) => {
                                                return (
                                                <>
                                                    <option value={uni.universityName} className="editLiveTalkFormSelectOption">{uni.universityName}</option>
                                                </>
                                                );
                                            })}

                                        </Form.Control>
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Link */}
                            <Form.Row className="justify-content-center editLiveTalkForm_InnerRow">
                                <Col md="10" className="text-left editLiveTalkForm_InnerCol">
                                    <Form.Label className="editLiveTalkFormLabel">Live Talk URL</Form.Label>                                     
                                        
                                    <FormControl as="textarea" rows="4" required noValidate id="editLiveTalkForm_LiveTalkURL" placeholder="Live Talk URL*" />                                       
                                </Col>
                            </Form.Row>

                        </Col>
                    </Form.Row>

                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    {/* Edit Live Talk Save Changes Btn */}
                    <Container>
                        <Row>
                            <Col md="6" className="text-right">
                                <Button id="saveChangesLiveTalkFormBtn">Save Changes</Button>
                            </Col>

                            <Col md="6" className="text-left">
                                <Button id="cancelEditLiveTalkFormBtn">Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </div>
        )
    }
}

