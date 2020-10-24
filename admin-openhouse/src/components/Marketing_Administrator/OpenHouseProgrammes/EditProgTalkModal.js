import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/EditProgTalkModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';

// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class EditProgTalkModal extends React.Component {
    constructor() {
        super();
        this.state = {
            handleSaveChanges: "",
            handleCancelEdit: "",
            checkDiscipline: false,
        };
    }


    /* Edit Programme Talk Modal Validations */
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
                    <Modal.Title id="editProgTalkModalTitle" className="w-100">
                        Edit Programme Talk
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="editProgTalkModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* Main Row */}
                        <Form.Row className="justify-content-center">
                            {/* Left Col */}
                            <Col md="6" className="editProgTalkFormCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faMicrophone} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="talkName" id="editProgTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Programme Talk Venue */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faSchool} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="venue" id="editProgTalkForm_Venue" placeholder="Venue*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Capacity Limit */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faChair} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="number" min="0" name="endTime" id="editProgTalkForm_Capacity" placeholder="Capacity Limit*" required />
                                        </InputGroup>
                                    </Col>
                                </ Form.Row>

                                {/* Start/End Time */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    {/* Start Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faHourglassStart} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="startTime" id="editProgTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                        </InputGroup>
                                    </Col>

                                    {/* End Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faHourglassEnd} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="endTime" id="editProgTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                
                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="editProgTalkFormCol text-center">
                                {/* Date */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faCalendarAlt} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <Form.Control as="select" name="date" defaultValue="chooseDate" className="editProgTalkFormSelect" required noValidate>
                                                <option value="chooseDate" className="editProgTalkFormSelectOption">Choose an Openhouse Date</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="day1" className="editProgTalkFormSelectOption">21 October 2020</option>
                                            </Form.Control>                                        
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="editProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="editProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="editProgTalkFormIcon" icon={faUniversity} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editProgTalkFormSelect" required noValidate>
                                                <option value="chooseUni" className="editProgTalkFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="editProgTalkFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Discipline Name */}
                                <Form.Row className="justify-content-center editProgTalkForm_InnerRow">
                                    <Col md="10" className="text-left editProgTalkForm_InnerCol">
                                        <Form.Label>Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="editProgTalkForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" checked={this.handleCheckDiscipline} value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="editProgTalkForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                            </Col>
                        </Form.Row>

                        {/* Programme Talk Details */}
                        <Form.Row className="justify-content-center editProgTalkFormRow">
                            <Col md="11" className="editProgTalkFormCol">
                                <FormControl as="textarea" rows="8" required noValidate id="editProgTalkForm_ProgTalkDetails" placeholder="Programme Talk Details" />
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    {/* Edit Programme Talk Save Changes Btn */}
                    <Container>
                        <Row>
                            <Col md="6" className="text-right">
                                <Button id="saveChangesProgTalkFormBtn" onClick={this.props.handleSaveChanges}>Save Changes</Button>
                            </Col>

                            <Col md="6" className="text-left">
                                <Button id="cancelEditProgTalkFormBtn" onClick={this.props.handleCancelEdit}>Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>

            </div>
        )
    }
}

