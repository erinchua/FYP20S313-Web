import React from 'react';
import { Modal, Form, Button, Row, Col, FormControl, Table, Container } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/EditProgTalkModal.css";

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

                <Modal.Body>
                    <Form noValidate id="editProgTalkForm"> {/* Need to add onSubmit later */}
                        <Form.Row className="justify-content-center" style={{paddingBottom: "2%"}}>
                            {/* Date */}
                            <Col md="3">
                                <Form.Group>
                                    <Form.Label className="editProgTalkFormLabel">Date</Form.Label>

                                    <Form.Control as="select" name="date" defaultValue="chooseDate" className="editProgTalkFormSelect" required noValidate>
                                        <option value="chooseDate" className="editProgTalkFormSelectOption">Choose an Openhouse Date</option>
                                        
                                        {/* To be retrieved from DB */}
                                        <option value="day1" className="editProgTalkFormSelectOption">21 October 2020</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            
                            {/* University */}
                            <Col md="3">
                                <Form.Group>
                                    <Form.Label className="editProgTalkFormLabel">University</Form.Label>

                                    <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editProgTalkFormSelect" required noValidate>
                                        <option value="chooseUni" className="editProgTalkFormSelectOption">Choose a University</option>
                                        
                                        {/* To be retrieved from DB */}
                                        <option value="Grenoble" className="editProgTalkFormSelectOption">Grenoble Ecole de Management</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {/* Discipline */}
                            <Col md="3">
                                <Form.Group>
                                    <Form.Label className="editProgTalkFormLabel">Discipline</Form.Label>
                                    
                                    <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editProgTalkFormSelect" required noValidate>
                                        <option value="chooseUni" className="editProgTalkFormSelectOption">Choose a Discipline</option>
                                        
                                        {/* To be retrieved from DB */}
                                        <option value="ArtsSocialSciences" className="editProgTalkFormSelectOption">Arts & Social Sciences</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {/* Sub Discipline */}
                            <Col md="3">
                                <Form.Group>
                                    <Form.Label className="editProgTalkFormLabel">Sub-Discipline</Form.Label>
                                    
                                    <Form.Control as="select" name="uniName" defaultValue="chooseUni" className="editProgTalkFormSelect" required noValidate>
                                        <option value="chooseUni" className="editProgTalkFormSelectOption">Choose a Sub-Discipline</option>
                                        
                                        {/* To be retrieved from DB */}
                                        <option value="Accounting" className="editProgTalkFormSelectOption">Accounting</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row className="justify-content-center editProgTalkFormRow">
                            <Col md="12" className="text-center">
                                <Table responsive="sm" bordered id="editProgTalkTable">
                                    <thead>
                                        <tr>
                                            <th className="editProgTalkHeader">Programme Talk</th>
                                            <th className="editProgTalkHeader">Programme Talk Details</th>
                                            <th className="editProgTalkHeader_Time">Start Time</th>
                                            <th className="editProgTalkHeader_Time">End Time</th>
                                            <th className="editProgTalkHeader">Venue</th>
                                            <th className="editProgTalkHeader_Capacity">Capacity Limit</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td className="editProgTalkData">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="Programme Talk" />
                                            </td>
                                            <td className="editProgTalkData">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="Programme Talk Details" />
                                            </td>
                                            <td className="editProgTalkData_Time">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="Start Time" />
                                            </td>
                                            <td className="editProgTalkData_Time">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="End Time" />
                                            </td>
                                            <td className="editProgTalkData">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="Venue" />
                                            </td>
                                            <td className="editProgTalkData_Capacity">
                                                <FormControl as="textarea" rows="8" required noValidate className="editProgTalkData_Form" placeholder="Capacity Limit" />
                                            </td>
                                        </tr>
                                    </tbody>

                                </Table>
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

