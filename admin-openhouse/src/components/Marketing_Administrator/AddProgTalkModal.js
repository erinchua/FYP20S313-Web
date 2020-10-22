import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck, Button, InputGroup, Col, Row, FormControl } from 'react-bootstrap';

import fire from "../../config/firebase";
import history from "../../config/history";
import firecreate from "../../config/firebasecreate";

import "../../css/Marketing_Administrator/AddProgTalkModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';


// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class AddProgTalkModal extends React.Component {
    constructor() {
        super();
        this.state = {
            awardingUni: "",
            capacityLimit: "",
            date: "",
            endTime: "",
            hasRecording: "",
            isLive: "",
            noRegistered: "",
            startTime: "",
            talkName: "",
            venue: "",
            Link: "",
            id: "",
        };
    }

    addProgrammeTalks = (e) => { 
        e.preventDefault();
        var recordingvalue = document.getElementById("recordingvalue");
        var livestatus = document.getElementById("livestatus");
        recordingvalue = recordingvalue.options[recordingvalue.selectedIndex].value;
        livestatus = livestatus.options[livestatus.selectedIndex].value;
        recordingvalue = (recordingvalue === "true");
        livestatus = (livestatus === "true");
    
        const db = fire.firestore();
          var lastdoc = db.collection("ProgrammeTalks").orderBy('id','desc')
          .limit(1).get().then((snapshot) =>  {
            snapshot.forEach((doc) => {
            var docid= "";
            var res = doc.data().id.substring(5, 10);
            var id = parseInt(res)
            if(id.toString().length <= 1){
                docid= "talk-00" + (id +1) 
            }
            else if(id.toString().length <= 2){
                docid= "talk-0" + (id +1) 
            }
            else{
                docid="talk-0" + (id +1) 
            }
            const userRef = db
            .collection("ProgrammeTalks")
            .doc(docid)
            .set({
                awardingUni: this.state.awardingUni,
                capacityLimit: this.state.capacityLimit,
                date: this.state.date,
                endTime: this.state.endTime,
                hasRecording: recordingvalue,
                isLive: livestatus,
                noRegistered: this.state.noRegistered,
                startTime: this.state.startTime,
                talkName: this.state.talkName,
                venue: this.state.venue,
                Link: this.state.Link,
                id: docid,
                })
                .then(function () {
                    window.location.reload();
                });
            })
        })
    };


    /* Add Add Programme Talk Modal Validations */
    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        
        let errors = this.state.errors;
        
        switch (name) {
            case 'programmeTalkName': 
                errors.programmeTalkName = value.length == 0
                    ? 'Please enter a valid programme talk name!'
                    : '';
                break;

            case 'email': 
                errors.email = value.length == 1
                    ? ''
                    : 'Please enter a valid email!';
                break;

            default:
                break;
        }
        
        this.setState({errors, [e.target.name]: e.target.value}, ()=> {
            console.log(errors)
        })
    
    }


    render(){
        const {errors} = this.state;

        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addProgTalkModalTitle" className="w-100">
                        Add Programme Talk
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addProgTalkModalBody">
                    <Form noValidate> {/* Need to add onSubmit later */}
                        {/* 1st Row */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            {/* Programme Talk Name */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <InputGroup className="addProgTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faMicrophone} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl name="programmeTalkName" id="addProgTalkForm_ProgTalkName" placeholder="Name of Programme Talk*" />
                                </InputGroup>
                            </Col>

                            {/* Uni Name */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="addProgTalkFormSelect" required noValidate>
                                    <option value="chooseUni" className="addProgTalkFormSelectOption">Choose a University</option>
                                    
                                    {/* To be retrieved from DB */}
                                    <option value="Grenoble" className="addProgTalkFormSelectOption">Grenoble Ecole de Management</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 2nd Row */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            {/* Programme Talk Venue */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <InputGroup className="addProgTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faSchool} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <FormControl name="venue" id="addProgTalkForm_Venue" placeholder="Venue*" />
                                </InputGroup>
                            </Col>

                            {/* Disciplines Name */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <Form.Control as="select" name="disciplineName" defaultValue="chooseDiscipline" className="addProgTalkFormSelect" required noValidate>
                                    <option value="chooseDiscipline" className="addProgTalkFormSelectOption">Choose a Discipline</option>
                                    
                                    {/* To be retrieved from DB */}
                                    <option value="ArtsSocialSciences" className="addProgTalkFormSelectOption">Arts & Social Sciences</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 3rd Row */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            {/* Programme Talk Date */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <InputGroup className="addProgTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faCalendarAlt} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl id="addProgTalkForm_ProgTalkDate" placeholder="Programme Talk Date*" />
                                </InputGroup>
                            </Col>

                            {/* Sub-Disciplines Name */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <Form.Control as="select" name="subDisciplineName" defaultValue="chooseSubDiscipline" className="addProgTalkFormSelect" required noValidate>
                                    <option value="chooseSubDiscipline" className="addProgTalkFormSelectOption">Choose a Sub-Discipline</option>

                                    {/* To be retrieved from DB */}
                                    <option value="ArtsSocialSciences" className="addProgTalkFormSelectOption">Arts & Social Sciences</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>

                        {/* 4th Row */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            {/* Programme Talk Start Time */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <InputGroup className="addProgTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassStart} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl id="addProgTalkForm_ProgTalkStartTime" placeholder="Programme Talk Start Time*" />
                                </InputGroup>
                            </Col>

                            {/* Programme Talk End Time */}
                            <Col md="6" className="addProgTalkFormCol text-center">
                                <InputGroup className="addProgTalkFormColInputGrp">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="addProgTalkFormIconInputGrp">
                                            <FontAwesomeIcon size="lg" className="addProgTalkFormIcon" icon={faHourglassEnd} />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    
                                    <FormControl id="addProgTalkForm_ProgTalkEndTime" placeholder="Programme Talk End Time*" />
                                </InputGroup>
                            </Col>
                        </Form.Row>

                        {/* Programme Talk Details */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            <Col md="12" className="addProgTalkFormCol">
                                <FormControl as="textarea" rows="8" required noValidate id="addProgTalkForm_ProgTalkDetails" placeholder="Programme Talk Details" />
                            </Col>
                        </Form.Row>

                        {/* Add Programme Talk Submit Btn Row */}
                        <Form.Row className="justify-content-center addProgTalkFormRow">
                            <Col className="text-center">
                                <Button type="submit" id="addProgTalkFormBtn">Submit</Button>
                            </Col>
                        </Form.Row>

                    </Form>
                </Modal.Body>
            </div>
        )
    }
}

