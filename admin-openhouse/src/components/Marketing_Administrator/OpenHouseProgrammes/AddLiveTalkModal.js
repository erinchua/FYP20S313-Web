import React from 'react';
import { Modal, Form, Button, InputGroup, Col, FormControl } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/LiveTalkModals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faUniversity, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';


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
                    <Form noValidate> {/* onSubmit={this.addLiveTalk} */}
                    {/* Main Row */}
                    <Form.Row className="justify-content-center">
                        {/* Left Col */}
                        <Col md="6" className="addLiveTalkFormCol text-center">
                            {/* Live Talk Name */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                <InputGroup className="addLiveTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                        <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faMicrophone} />
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl type="text" name="talkName" id="addLiveTalkForm_ProgTalkName" placeholder="Name of Live Talk*" required />
                                </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Live Talk Venue */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="addLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faSchool} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <FormControl type="text" name="venue" id="addLiveTalkForm_Venue" placeholder="Venue*" required />
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Start/End Time */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                {/* Start Time */}
                                <Col md="5" className="text-center">
                                    <InputGroup className="addLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassStart} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    
                                        <FormControl type="text" name="startTime" id="addLiveTalkForm_ProgTalkStartTime" placeholder="Start Time*" required />
                                    </InputGroup>
                                </Col>

                                {/* End Time */}
                                <Col md="5" className="text-center">
                                    <InputGroup className="addLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faHourglassEnd} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        
                                        <FormControl type="text" name="endTime" id="addLiveTalkForm_ProgTalkEndTime" placeholder="End Time*" required />
                                    </InputGroup>
                                </Col>
                            </Form.Row>
                        </Col>

                        {/* Right Col */}
                        <Col md="6" className="addLiveTalkFormCol text-center">
                            {/* Date */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="addLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faCalendarAlt} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    
                                        <Form.Control as="select" name="date" defaultValue="chooseDate" className="addLiveTalkFormSelect" required noValidate>
                                            <option value="chooseDate" className="addLiveTalkFormSelectOption">Choose an Openhouse Date</option>
                                            
                                            {/* To be retrieved from DB */}
                                            <option value={this.state.day1Date} className="addLiveTalkFormSelectOption">{this.state.day1Date}</option>
                                            <option value={this.state.day2Date} className="addLiveTalkFormSelectOption">{this.state.day2Date}</option>

                                        </Form.Control>                                        
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* University */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                <Col md="10" className="text-center">
                                    <InputGroup className="addLiveTalkFormColInputGrp">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text className="addLiveTalkFormIconInputGrp">
                                                <FontAwesomeIcon size="lg" className="addLiveTalkFormIcon" icon={faUniversity} />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addLiveTalkFormSelect" required noValidate>
                                            <option value="chooseUni" className="addLiveTalkFormSelectOption">Choose a University</option>
                                            
                                            {/* To be retrieved from DB */}
                                            {this.state.uniList && this.state.uniList.map((uni) => {
                                                return (
                                                <>
                                                    <option value={uni.universityName} className="addLiveTalkFormSelectOption">{uni.universityName}</option>
                                                </>
                                                );
                                            })}

                                        </Form.Control>
                                    </InputGroup>
                                </Col>
                            </Form.Row>

                            {/* Link */}
                            <Form.Row className="justify-content-center addLiveTalkForm_InnerRow">
                                <Col md="10" className="text-left addLiveTalkForm_InnerCol">
                                    <Form.Label className="addLiveTalkFormLabel">Live Talk URL</Form.Label>                                     
                                        
                                    <FormControl as="textarea" rows="4" required noValidate id="addLiveTalkForm_LiveTalkURL" placeholder="Live Talk URL*" />                                       
                                </Col>
                            </Form.Row>

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

