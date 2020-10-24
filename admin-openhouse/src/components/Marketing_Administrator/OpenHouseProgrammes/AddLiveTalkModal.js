import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/AddLiveTalkModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faLink, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';


// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class AddLiveTalkModal extends React.Component {

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
                    <Modal.Title id="addLiveTalkModalTitle" className="w-100">
                        Add Live Talk
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addLiveTalkModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* 1st Row */}
                        <Form.Row className="justify-content-center addLiveTalkFormRow">
                            {/* Programme Talk Name */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faMicrophone} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl type="text" name="talkName" id="addLiveTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" required />
                                </InputGroup>
                            </Col>

                            {/* Uni Name */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addLiveTalkFormSelect" required noValidate>
                                    <option value="chooseUni" className="addLiveTalkFormSelectOption">Choose a University</option>
                                    
                                    {/* To be retrieved from DB */}
                                    <option value="Grenoble" className="addLiveTalkFormSelectOption">Grenoble Ecole de Management</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 2nd Row */}
                        <Form.Row className="justify-content-center addLiveTalkFormRow">
                            {/* Programme Talk Venue */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faSchool} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl type="text" name="venue" id="addLiveTalkForm_Venue" placeholder="Venue*" required />
                                </InputGroup>
                            </Col>

                            {/* Discipline Name */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <Form.Control as="select" name="disciplineName" defaultValue="chooseDiscipline" className="addLiveTalkFormSelect" required noValidate>
                                    <option value="chooseDiscipline" className="addLiveTalkFormSelectOption">Choose a Discipline</option>
                                    
                                    {/* To be retrieved from DB */}
                                    <option value="ArtsSocialSciences" className="addLiveTalkFormSelectOption">Arts & Social Sciences</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 3rd Row */}
                        <Form.Row className="justify-content-center addLiveTalkFormRow">
                            {/* Live Stream Link */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faLink} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl type="text" name="date" id="addLiveTalkForm_LiveStreamLink" placeholder="Live Stream Link*" required />
                                </InputGroup>
                            </Col>

                            {/* Sub-Disciplines Name */}
                            <Col md="6" className="addLiveTalkFormCol text-center">
                                <Form.Control as="select" name="subDisciplineName" defaultValue="chooseSubDiscipline" className="addLiveTalkFormSelect" required noValidate>
                                    <option value="chooseSubDiscipline" className="addLiveTalkFormSelectOption">Choose a Sub-Discipline</option>

                                    {/* To be retrieved from DB */}
                                    <option value="Accounting" className="addLiveTalkFormSelectOption">Accounting</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 4th Row */}
                        <Form.Row className="justify-content-center addLiveTalkFormRow">
                            {/* Programme Talk Date */}
                            <Col md="4" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faCalendarAlt} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl type="text" name="date" id="addLiveTalkForm_ProgTalkDate" placeholder="Programme Talk Date*" required />
                                </InputGroup>
                            </Col>

                            {/* Programme Talk Start Time */}
                            <Col md="4" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassStart} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl type="text" name="startTime" id="addLiveTalkForm_ProgTalkStartTime" placeholder="Programme Talk Start Time*" required />
                                </InputGroup>
                            </Col>

                            {/* Programme Talk End Time */}
                            <Col md="4" className="addLiveTalkFormCol text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassEnd} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl type="text" name="endTime" id="addLiveTalkForm_ProgTalkEndTime" placeholder="Programme Talk End Time*" required />
                                </InputGroup>
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                     {/* Add Live Talk Submit Btn*/}
                    <Button type="submit" id="addLiveTalkFormBtn">Submit</Button>
                </Modal.Footer>
            </div>
        )
    }
}

