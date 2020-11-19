import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../config/firebase";
import history from "../../config/history";
import firebase from "firebase/app";

import '../../css/Marketing_Administrator/OpenHouse.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCalendarDay, faEdit, faFileImage, faHourglassEnd, faHourglassStart, faKeyboard } from '@fortawesome/free-solid-svg-icons';

const initialStates = {
    dateError: "",
    startTimeError: "",
    endTimeError: "",
    descriptionError: "",
}

async function savePicture(blobURL, imageFile) {
    const pictureRef = storage.ref(`/Openhouse/`).child(imageFile);
    const response = await fetch(blobURL);
    const blob = await response.blob(); //fetch blob object
    const snapshot = await pictureRef.put(blob); //upload
    const url = await snapshot.ref.getDownloadURL(); //url in storage
    return url;
}

class Openhouse extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            day: "",
            date: "",
            startTime: "",
            endTime: "",
            docid: "",
            description: "",
            mobileHomeImage: "",
            mobileOpenHouseProgImage: "",
            mobileHomeImage_title: "",
            mobileOpenHouseProgImage_title: "",
            //Below states are for functions
            users: "",
            images: "",
            //Below states are for modals
            editModal: false,
            editHomeModal: false,
            editProgrammeModal: false,
        };
    }

    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.data().administratorType === "Marketing Administrator") {
                            this.display();
                        } else {
                            history.push("/Login");
                        }
                    });
                });
            } else {
                history.push("/Login");
            }
        });
    }

    componentDidMount() {
        this.authListener();
    }

    display() {
        const users = [];
        const images = [];

        db.collection("Openhouse").get().then((snapshot) => {
            snapshot.forEach((doc) => {
                const daydata = doc.get("day");
                if (Array.isArray(daydata)) {
                    for (var i = 0; i < Object.keys(daydata).length; i++) {
                        console.log(daydata[i].date);
                        console.log(daydata[i].startTime);
                        console.log(daydata[i].endTime);
                    }
                }
                for (var i = 0; i < Object.keys(daydata).length; i++) {
                    const data = {
                        day: Object.keys(doc.data().day)[i],
                        date: daydata[Object.keys(daydata)[i]].date,
                        startTime: daydata[Object.keys(daydata)[i]].startTime,
                        endTime: daydata[Object.keys(daydata)[i]].endTime,
                        description: daydata[Object.keys(daydata)[i]].description,
                        docid: doc.id,
                    };
                    users.push(data);
                    const date = daydata[Object.keys(daydata)[i]].date;
                }

                const data = {
                    docid: doc.id,
                    mobileHomeImage: doc.data().mobileHomeImage,
                    mobileOpenHouseProgImage: doc.data().mobileOpenHouseProgImage,
                };
                images.push(data);
            });

            this.setState({ users: users, images: images });
        });

    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    //Get respective data out by ids and the day number for Edit Modal - Integrated
    edit(e, user) {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                day: user.day,
                date: user.date,
                startTime: user.startTime,
                endTime: user.endTime,
                description: user.description,
                docid: user.docid
            });
        }
    }

    update(e, openhouseid, day) {
        //Update respective data by their ids and day number for Edit Modal - Integrated
        db.collection("Openhouse").doc(openhouseid).get()
        .then((doc) => {
            const daydata = doc.get('day');

            //Checked if day is 1
            if (day == Object.keys(daydata).length - 1) {
                for (var i = 0; i < Object.keys(daydata).length - 1; i++){
                    const isValid = this.validate();
                    if (isValid) {
                        this.setState(initialStates);
                        
                        db.collection("Openhouse").doc(openhouseid)
                        .update({
                            "day.1.date": this.state.date,
                            "day.1.startTime": this.state.startTime,
                            "day.1.endTime": this.state.endTime,
                            "day.1.description": this.state.description,
                        })
                        .then(() => {
                            this.setState({
                                editModal: false,
                            });
                            this.display()
                        });
                        
                    }
                }
            }

            //Checked if day is 2
            if (day == Object.keys(daydata).length) {
                for (var i = 1; i < Object.keys(daydata).length; i++){
                    const isValid = this.validate();
                    if (isValid) {
                        this.setState(initialStates);
                        
                        db.collection("Openhouse").doc(openhouseid)
                        .update({
                            "day.2.date": this.state.date,
                            "day.2.startTime": this.state.startTime,
                            "day.2.endTime": this.state.endTime,
                            "day.2.description": this.state.description,
                        })
                        .then(() => {
                            this.setState({
                                editModal: false,
                            });
                            this.display()
                        });
                    }
                }
            }
        });

    }

    //Get respective data out by ids and the day number for Edit Modal - Integrated
    editHomeImage(e, imageFile) {
        this.editHomeModal = this.state.editHomeModal;
        if (this.editHomeModal == false) {
            this.setState({
                editHomeModal: true,
                mobileHomeImage: imageFile,
                mobileHomeImage_title: imageFile,
            });
        } else {
            this.setState({
                editHomeModal: false
            });
            this.resetForm();
        }
    }

    //Get respective data out by ids and the day number for Edit Modal - Integrated
    editProgrammeImage(e, imageFile) {
        this.editProgrammeModal = this.state.editProgrammeModal;
        if (this.editProgrammeModal == false) {
            this.setState({
                editProgrammeModal: true,
                mobileOpenHouseProgImage: imageFile,
                mobileOpenHouseProgImage_title: imageFile,
            });
        } else {
            this.setState({
                editProgrammeModal: false
            });
            this.resetForm();
        }
    }

    componentWillUnmount() {
        if (this.mobileHomeImage.startsWith('blob:')) {
            URL.revokeObjectURL(this.mobileHomeImage); //cleanup blob
        };

        if (this.mobileOpenHouseProgImage.startsWith('blob:')) {
            URL.revokeObjectURL(this.mobileOpenHouseProgImage); //cleanup blob
        };
    };

    //Handle "Mobile Application - Home Screen" Change
    handleHomeChange = (e) => {
        if (e.target.files?.length > 0){
            const file = e.target.files?.item(0);
            const homeURL = URL.createObjectURL(file);

            this.setState({
                mobileHomeImage: homeURL,
            })
        }
    }

    //Handle "Mobile Application - Open House Programme Screen" Change
    handleProgrammeChange = (e) => {
        if (e.target.files?.length > 0){
            const file = e.target.files?.item(0);
            const programmeURL = URL.createObjectURL(file);

            this.setState({
                mobileOpenHouseProgImage: programmeURL,
            })
        }
    }

    //Upload image when click on "Save Changes" in Edit Modal
    uploadHomeImage = async() => {
        var title = "";
        var res = "";
        var extension = "";
        var fileName = "";

        if (this.state.mobileHomeImage.startsWith('blob:')) {

            title = this.state.mobileHomeImage_title.split(/\%2F(.*?)\?alt/)[1].split(".")[0]
            res = this.state.mobileHomeImage_title.split("?alt=")[0];
            extension = res.substr(res.length - 4);

            if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG') && !extension.includes('.gif') && !extension.includes('.GIF')) {
                fileName = title;
                const url = await savePicture(this.state.mobileHomeImage, fileName);
                this.setState({
                    url: url
                });
            } else {
                fileName = title + extension;
                const url = await savePicture(this.state.mobileHomeImage, fileName);
                this.setState({
                    url: url
                });
            }

            db.collection("Openhouse").doc("openhouse")
            .update({
                mobileHomeImage: this.state.url,
            })
            .then(() => {
                this.setState({
                    editHomeModal: false
                });
                this.display();
            });
        }
    }

    //Upload image when click on "Save Changes" in Edit Modal
    uploadProgrammeImage = async() => {
        var title = "";
        var res = "";
        var extension = "";
        var fileName = "";

        if (this.state.mobileOpenHouseProgImage.startsWith('blob:')) {

            title = this.state.mobileOpenHouseProgImage_title.split(/\%2F(.*?)\?alt/)[1].split(".")[0]
            res = this.state.mobileOpenHouseProgImage_title.split("?alt=")[0];
            extension = res.substr(res.length - 4);

            if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG') && !extension.includes('.gif') && !extension.includes('.GIF')) {
                fileName = title;
                const url = await savePicture(this.state.mobileOpenHouseProgImage, fileName);
                this.setState({
                    url: url
                });
            } else {
                fileName = title + extension;
                const url = await savePicture(this.state.mobileOpenHouseProgImage, fileName);
                this.setState({
                    url: url
                });
            }

            db.collection("Openhouse").doc("openhouse")
            .update({
                mobileOpenHouseProgImage: this.state.url,
            })
            .then(() => {
                this.setState({
                    editProgrammeModal: false
                });
                this.display();
            });
        }
    }
    

    //Validate Edit Modal
    validate = () => {
        let dateError = "";
        let startTimeError = "";
        let endTimeError = "";
        let descriptionError = "";

        if (!this.state.date) {
            dateError = "Please enter a valid date. E.g. 21-Nov-2020";
        }

        if (!this.state.startTime.includes(':')) {
            startTimeError = "Please enter a valid start time. E.g. 1:30PM";
        }

        if (!this.state.endTime.includes(':')) {
            endTimeError = "Please enter a valid end time. E.g. 2:30PM";
        }

        if (!this.state.description) {
            descriptionError = "Please enter a valid description. E.g. Open House Day 1";
        }

        if (dateError || startTimeError || endTimeError || descriptionError) {
            this.setState({dateError, startTimeError, endTimeError, descriptionError});
            return false;
        } 

        return true;
    }

    //Edit Modal
    handleEdit = () => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true
            });
        } else {
            this.setState({
                editModal: false
            });
            this.resetForm();
        }
    }

    resetForm = () => {
        this.setState(initialStates);
        this.setState({date: '', starttime: '', endtime: '', description: ''})
    }

    render() {
        return (
            <div>
                <Container fluid className="OpenHouse-container">
                    <NavBar isMA={true} />

                        <Container fluid className="OpenHouse-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="OpenHouse-topContentContainer">
                                        <Row id="OpenHouse-firstRow">
                                            <Col md={12} className="text-left" id="OpenHouse-firstRowCol">
                                                <h4 id="OpenHouse-title">Open House Details</h4>
                                            </Col>
                                        </Row>

                                        <Row id="OpenHouse-secondRow">
                                            <Col md={12} className="text-center" id="OpenHouse-secondRowCol">
                                                <Table responsive="sm" bordered id="OpenHouse-tableContainer">
                                                    <thead id="OpenHouse-tableHeader">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Day</th>
                                                            <th>Start Time</th>
                                                            <th>End Time</th>
                                                            <th>Description</th>
                                                            <th>Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="OpenHouse-tableBody">
                                                        {this.state.users && this.state.users.map((user) => {
                                                            return(
                                                                <tr>
                                                                    <td>{user.date}</td>
                                                                    <td>{user.day}</td>
                                                                    <td>{user.startTime}</td>
                                                                    <td>{user.endTime}</td>
                                                                    <td id="OpenHouse-descriptionData">{user.description}</td>
                                                                    <td><Button size="sm" id="OpenHouse-editBtn" onClick={(e) => {this.edit(e, user)}}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>

                                        <div id="border"></div>
                                        <Row id="OpenHouse-thirdRow">
                                            <Col md={12} className="text-left" id="OpenHouse-thirdRowColHeading">
                                                <h6 id="OpenHouse-title">Mobile Application Details</h6>
                                            </Col>
                                        </Row>
                                        
                                        <Row id="OpenHouse-thirdRow">
                                            <Col md={12} className="text-center" id="OpenHouse-thirdRowCol">
                                                <Table responsive="sm" bordered id="OpenHouse-tableContainer">
                                                    <thead id="OpenHouse-tableHeader">
                                                        <tr>
                                                            <th>Images</th>
                                                            <th id="OpenHouse-thirdTableHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.images && this.state.images.map((image) => {
                                                        return (
                                                            <tbody id="OpenHouse-tableBody">
                                                                <tr>
                                                                    <td className="text-left">Mobile Application - Home Screen</td>
                                                                    <td><Button size="sm" id="OpenHouse-editBtn" onClick={(e) => [this.editHomeImage(e, image.mobileHomeImage)]}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-left">Mobile Application - Open House Programme Screen</td>
                                                                    <td><Button size="sm" id="OpenHouse-editBtn" onClick={(e) => [this.editProgrammeImage(e, image.mobileOpenHouseProgImage)]}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {this.state.editModal == true ? 
                    <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                        {this.state.users && this.state.users.map((user) => {
                            if (user.docid === this.state.docid && user.day === this.state.day) {
                                return (
                                    <div>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarAlt} />
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="date" placeholder="Date: e.g. 21-Nov-2020" required defaultValue={user.date} onChange={this.updateInput} noValidate></Form.Control>
                                                                <div className="errorMessage">{this.state.dateError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faCalendarDay} />
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control readOnly id="OpenHouse-inputFields" type="text" name="day" placeholder="Day" required defaultValue={user.day} noValidate></Form.Control>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassStart}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="startTime" placeholder="Start Time: e.g. 9:00AM" required defaultValue={user.startTime} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.startTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faHourglassEnd}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="endTime" placeholder="End Time: e.g. 6:00PM" required defaultValue={user.endTime} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.endTimeError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="OpenHouse-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faKeyboard}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="OpenHouse-inputFields" type="text" name="description" placeholder="Description" required defaultValue={user.description} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.descriptionError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="OpenHouse-editFooter">
                                                    <Col md={6} className="OpenHouse-editCol">
                                                        <Button id="OpenHouse-saveBtn" type="submit" onClick={(e) => this.update(e, user.docid, user.day)}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="OpenHouse-editCol">
                                                        <Button id="OpenHouse-cancelBtn" onClick={this.handleEdit}>Cancel</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Modal.Footer>
                                    </div>
                                )
                            } else {
                                return ('')
                            }
                        })}
                    </Modal>: ''
                }

                {this.state.editHomeModal == true ? 
                    <Modal show={this.state.editHomeModal} onHide={() => {this.setState({editHomeModal: false})}} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                            <div>
                                <Modal.Body>
                                    <Form noValidate>
                                        <Form.Group>
                                            <Form.Group as={Row} className="OpenHouse-formGroup">
                                                <img height="150px" width="300px" src={this.state.mobileHomeImage} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                            </Form.Group>                     
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Group as={Row} className="OpenHouse-formGroup">
                                                <Form.Group as={Col} md="1">
                                                    <FontAwesomeIcon size="lg" icon={faFileImage} />
                                                </Form.Group> 
                                                <Form.Group as={Col} md="7">
                                                    <Form.File type="file" name="imgFile" className="OpenHouse-imgFile" label={this.state.mobileHomeImage} onChange={this.handleHomeChange} custom required></Form.File>
                                                </Form.Group>
                                            </Form.Group>                     
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Container>
                                        <Row id="OpenHouse-editFooter">
                                            <Col md={6} className="OpenHouse-editCol">
                                                <Button id="OpenHouse-saveBtn" type="submit" onClick={() => this.uploadHomeImage()}>Save Changes</Button>
                                            </Col>
                                            <Col md={6} className="OpenHouse-editCol">
                                                <Button id="OpenHouse-cancelBtn" onClick={() => {this.setState({editHomeModal: false})}}>Cancel</Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Footer>
                            </div>
                    </Modal>: ''
                }

                {this.state.editProgrammeModal == true ? 
                    <Modal show={this.state.editProgrammeModal} onHide={() => {this.setState({editProgrammeModal: false})}} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton></Modal.Header>
                            <div>
                                <Modal.Body>
                                    <Form noValidate>
                                        <Form.Group>
                                            <Form.Group as={Row} className="OpenHouse-formGroup">
                                                <img height="150px" width="300px" src={this.state.mobileOpenHouseProgImage} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                            </Form.Group>                     
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Group as={Row} className="OpenHouse-formGroup">
                                                <Form.Group as={Col} md="1">
                                                    <FontAwesomeIcon size="lg" icon={faFileImage} />
                                                </Form.Group> 
                                                <Form.Group as={Col} md="7">
                                                    <Form.File name="imgFile" className="OpenHouse-imgFile" label={this.state.mobileOpenHouseProgImage} onChange={this.handleProgrammeChange} custom required></Form.File>
                                                </Form.Group>
                                            </Form.Group>                     
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Container>
                                        <Row id="OpenHouse-editFooter">
                                            <Col md={6} className="OpenHouse-editCol">
                                                <Button id="OpenHouse-saveBtn" type="submit" onClick={() => this.uploadProgrammeImage()}>Save Changes</Button>
                                            </Col>
                                            <Col md={6} className="OpenHouse-editCol">
                                                <Button id="OpenHouse-cancelBtn" onClick={() => {this.setState({editProgrammeModal: false})}}>Cancel</Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Footer>
                            </div>
                    </Modal>: ''
                }

            </div>
        );
    }
}
export default Openhouse;