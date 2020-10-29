import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl, Row, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/ProgTalkModals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';


// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class AddProgTalkModal extends React.Component {
    /* Add Add Programme Talk Modal Validations */
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
                    <Modal.Title id="addProgTalkModalTitle" className="w-100">
                        Add Programme Talk
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addProgTalkModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* Main Row */}
                        <Form.Row className="justify-content-center">
                            {/* Left Col */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                {/* Programme Name */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faMicrophone} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="talkName" id="addProgTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Programme Talk Venue */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faSchool} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <FormControl type="text" name="venue" id="addProgTalkForm_Venue" placeholder="Venue*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Capacity Limit */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faChair} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="number" min="0" name="capacityLimit" id="addProgTalkForm_Capacity" placeholder="Capacity Limit*" required />
                                        </InputGroup>
                                    </Col>
                                </ Form.Row>

                                {/* Start/End Time */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    {/* Start Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassStart} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="startTime" id="addProgTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                        </InputGroup>
                                    </Col>

                                    {/* End Time */}
                                    <Col md="5" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassEnd} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <FormControl type="text" name="endTime" id="addProgTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                                        </InputGroup>
                                    </Col>
                                </Form.Row>
                                
                            </Col>

                            {/* Right Col */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                {/* Date */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faCalendarAlt} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <Form.Control as="select" name="date" defaultValue="chooseDate" className="addProgTalkFormSelect" required noValidate>
                                                <option value="chooseDate" className="addProgTalkFormSelectOption">Choose an Openhouse Date</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="day1" className="addProgTalkFormSelectOption">21 October 2020</option>
                                            </Form.Control>                                        
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* University */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-center">
                                        <InputGroup className="addProgTalkFormColInputGrp">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                                    <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faUniversity} />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>

                                            <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addProgTalkFormSelect" required noValidate>
                                                <option value="chooseUni" className="addProgTalkFormSelectOption">Choose a University</option>
                                                
                                                {/* To be retrieved from DB */}
                                                <option value="Grenoble" className="addProgTalkFormSelectOption">Grenoble Ecole de Management</option>
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                </Form.Row>

                                {/* Discipline Name */}
                                <Form.Row className="justify-content-center addProgTalkForm_InnerRow">
                                    <Col md="10" className="text-left addProgTalkForm_InnerCol">
                                        <Form.Label className="addProgTalkFormLabel">Choose Discipline(s):</Form.Label>                                     
                                            
                                        <Container className="addProgTalkForm_DisciplineCon">
                                            {/* To be retrieved from db - row is generated dynamically */}
                                            <Row>
                                                <Col>
                                                    <Form.Check name="discipline" checked={this.checkDiscipline} value="ArtsSocialSciences" type="checkbox" label="Arts & SocialSciences" className="addProgTalkForm_CheckBox" />
                                                </Col>
                                            </Row>

                                        </Container>                                        
                                    </Col>
                                </Form.Row>

                            </Col>
                        </Form.Row>

                        {/* Programme Talk Details */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            <Col md="11" className="addProgTalkFormCol">
                                <Form.Label className="addProgTalkFormLabel">Programme Talk Details</Form.Label>

                                <FormControl as="textarea" rows="8" required noValidate id="addProgTalkForm_ProgTalkDetails" placeholder="Programme Talk Details" />
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                     {/* Add Programme Talk Submit Btn*/}
                    <Button type="submit" id="addProgTalkFormBtn">Submit</Button>
                </Modal.Footer>
            </div>
        )
    }
}

