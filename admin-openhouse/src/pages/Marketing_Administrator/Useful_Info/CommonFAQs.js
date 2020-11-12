import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";

import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/CommonFAQs.css";
import "../../../css/Marketing_Administrator/CommonFAQsModal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import DeleteCommonFAQModal from "../../../components/Marketing_Administrator/Useful_Info/DeleteCommonFAQModal";


const initialStates = {
    faqTypeError: "",
    faqQuestionError: "",
    faqAnswerError: "",
}

class CommonFAQs extends Component {
  state = initialStates;
  
  constructor() {
    super();
        this.state = {
            faqAnswer: "",
            faqQuestion: "",
            faqType: "",
            id: "",

            filteredFAQType: [],
            addCommonFAQModal: false,
            editCommonFAQModal: false,
            deleteCommonFAQModal: false
        };
        this.resetForm = this.resetForm.bind(this);
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

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        this.authListener();
    }

    display() {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        var openhouse_counter = 1;
        var general_counter = 1;
        db.collection("CommonFAQ").get()
        .then((snapshot) => {
            const commonfaq_openhouse = [];
            const commonfaq_general = [];
            const faqTypeList = []
            snapshot.forEach((doc) => {
                const data = {
                    faqAnswer: doc.data().faqAnswer,
                    faqQuestion: doc.data().faqQuestion,
                    faqType: doc.data().faqType,
                    id: doc.id,
                    openhouse_counter: openhouse_counter,
                    general_counter: general_counter
                };

                if (doc.data().faqType === "Openhouse") {
                    openhouse_counter++;
                    commonfaq_openhouse.push(data)
                }
                if (doc.data().faqType === "General") {
                    general_counter++;
                    commonfaq_general.push(data)
                }
                faqTypeList.push(doc.data().faqType);
            });

            this.setState({ faqTypeList: faqTypeList });
            var filteredFAQType = faqTypeList.filter(onlyUnique);

            this.setState({ 
                commonfaq_openhouse: commonfaq_openhouse,
                commonfaq_general: commonfaq_general,
                filteredFAQType: filteredFAQType
            });
        });
    }

    addCommonFAQ = (e) => {
        e.preventDefault();

        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("CommonFAQ").orderBy("id", "desc").limit(1).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var docid = "";
                    var res = doc.data().id.substring(12,9);
                    var id = parseInt(res);
                    id += 1

                    if(id.toString().length == 1){
                        docid= "question-00" + (id) 
                    }
                    else if(id.toString().length == 2){
                        docid= "question-0" + (id) 
                        }
                    else{
                        docid="question-" + (id) 
                    }

                    db.collection("CommonFAQ").doc(docid)
                    .set({
                        faqAnswer: this.state.faqAnswer,
                        faqQuestion: this.state.faqQuestion,
                        faqType: this.state.faqType,
                        id: docid,
                    })
                    .then(() => {
                        this.display();
                        this.setState({addCommonFAQModal: false}); 
                    });
                });
            });
        }
    };

    DeleteCommonFAQ(e, commonfaqid) {
        db.collection("CommonFAQ").doc(commonfaqid).delete()
        .then(() => {
            this.display();
            this.setState({deleteCommonFAQModal: false}); 
        });
    }

    editCommonFAQ(e, commonfaqid) {
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialStates);

            db.collection("CommonFAQ").doc(this.state.id)
            .update({
                faqQuestion: this.state.faqQuestion,
                faqAnswer: this.state.faqAnswer,
                faqType: this.state.faqType
            })
            .then(() => {
                this.setState({
                    editCommonFAQModal: false
                })
                this.display()
            }); 
        }
    }

    /* Add Live Talk Modal */
    handleAddCommonFAQModal = () => {
        if (this.state.addCommonFAQModal == false) {
            this.setState({
                addCommonFAQModal: true,
            });
        }
        else {
            this.setState({
                addCommonFAQModal: false
            });
            this.resetForm();
        }
    };

    /* Edit Common FAQ Modal */
    handleEditCommonFAQModal = (faq) => {
        if (this.state.editCommonFAQModal == false) {
            this.setState({
                id: faq.id,
                editCommonFAQModal: true,
                faqType: faq.faqType,
                faqQuestion: faq.faqQuestion,
                faqAnswer: faq.faqAnswer
            });
        }
        else {
            this.setState({
                editCommonFAQModal: false
            });
            this.resetForm();
        }
    };

    /* Delete Common FAQ Modal */
    handleDeleteCommonFAQModal = (id) => {
        if (this.state.deleteCommonFAQModal == false) {
            this.setState({
                deleteCommonFAQModal: true,
            });
            this.state.id = id;
        }
        else {
            this.setState({
                deleteCommonFAQModal: false
            });
        }
    };
    
    //Validations for the Forms in Modals
    validate = () => {
        let faqTypeError = "";
        let faqQuestionError = "";
        let faqAnswerError = "";
        
        if (!this.state.faqType) {
            faqTypeError = "Please select a valid FAQ type!";
        }

        if (! (this.state.faqQuestion && this.state.faqQuestion.length >= 3) ) {
            faqQuestionError = "Please enter a question!";
        }

        if (! (this.state.faqAnswer && this.state.faqAnswer.length >= 3) ) {
            faqAnswerError = "Please enter a FAQ answer!";
        }

        if (faqTypeError || faqQuestionError || faqAnswerError) {
            this.setState({
                faqTypeError, faqQuestionError, faqAnswerError
            });
            return false;
        } 
        return true;
    }

    //Reset Forms
    resetForm = () => {
        this.setState({
            faqTypeError: "",
            faqQuestionError: "",
            faqAnswerError: "",
            id: "", 
            faqType: "", 
            faqQuestion: "", 
            faqAnswer: ""
        })
    }

  render() {
        return (
            <div>
                <Container fluid className="commonFAQCon">
                    <NavBar isMA={true} />

                        <Container fluid className="commonFAQContent">
                            <Row>
                                {/* SideNavBar Col */}
                                <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                                    <SideNavBar />
                                </Col>

                                {/* Contents Col */}
                                <Col md="10" style={{paddingLeft:"0"}}>
                                    <Container fluid className="commonFAQContentCon">
                                        {/* Common FAQs Page Header row */}
                                        <Row id="commonFAQContentHeaderRow" className="justify-content-center">
                                            <Col md="6" className="text-left commonFAQContentHeaderCol">
                                                <h4 id="commonFAQHeaderText">Common FAQs</h4>
                                            </Col>

                                            <Col md="6" className="text-right commonFAQContentHeaderCol">
                                                <Button id="addCommonFAQBtn" onClick={this.handleAddCommonFAQModal}>
                                                    <FontAwesomeIcon size="lg" id="addCommonFAQBtnIcon" icon={faPlus} />
                                                    <span id="addCommonFAQBtnText">Add</span>
                                                </Button>
                                            </Col>
                                        </Row>

                                        {/* Tabs row */}
                                        <Row className="commonFAQContentTabRow">
                                            <Col md="12" className="commonFAQContentTabCol">

                                                <Tab.Container defaultActiveKey="openhouse">
                                                    <Row className="commonFAQTabConRow">
                                                        <Col md="12" className="commonFAQTabConCol">
                                                            <Nav defaultActiveKey="openhouse" className="commonFAQTabNav" variant="tabs">
                                                                <Col md="6" className="commonFAQTabConInnerCol text-center">
                                                                    <Nav.Item className="commonFAQTab_NavItem">
                                                                    <Nav.Link eventKey="openhouse" className="commonFAQTab_FAQ">Open House FAQs</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md="6" className="commonFAQTabConInnerCol text-center">
                                                                    <Nav.Item className="commonFAQTab_NavItem">
                                                                    <Nav.Link eventKey="general" className="commonFAQTab_FAQ">General FAQs</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>

                                                    <Row className="commonFAQTabConRow justify-content-center">
                                                        <Col md="12" className="commonFAQTabConCol text-center">
                                                            <Tab.Content id="commonFAQTabPane_Openhouse">
                                                                {/* Tab Pane 1 */}
                                                                <Tab.Pane eventKey="openhouse">
                                                                    <Col md="12" className="commonFAQTabpaneCol">
                                                                        <Table responsive="sm" bordered id="commonFAQTable_Openhouse">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="commonFAQHeader_SNo">S/N</th>
                                                                                    <th className="commonFAQHeader_Question">Question</th>
                                                                                    <th className="commonFAQHeader_Answer">Answer</th>
                                                                                    <th className="commonFAQHeader_Edit">Edit</th>
                                                                                    <th className="commonFAQHeader_Delete">Delete</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {this.state.commonfaq_openhouse && this.state.commonfaq_openhouse.map((openhouse) => {
                                                                                    return (
                                                                                        <tr key={openhouse.id}>
                                                                                            <td className="commonFAQData_SNo text-center">{openhouse.openhouse_counter}</td>
                                                                                            <td className="commonFAQData_Question text-left">{openhouse.faqQuestion}</td>
                                                                                            <td className="commonFAQData_Answer text-left">{openhouse.faqAnswer}</td>
                                                                                            <td className="commonFAQData_Edit text-center">
                                                                                                <Button id="editCommonFAQBtn" onClick={()=>this.handleEditCommonFAQModal(openhouse)}>
                                                                                                    <FontAwesomeIcon size="lg" id="editCommonFAQBtnIcon" icon={faEdit} />
                                                                                                </Button>
                                                                                            </td>
                                                                                            <td className="commonFAQData_Delete text-center">
                                                                                                <Button id="deleteCommonFAQBtn" onClick={(e) => this.handleDeleteCommonFAQModal(openhouse.id)}>
                                                                                                    <FontAwesomeIcon size="lg" id="deleteCommonFAQBtnIcon" icon={faTrashAlt} />
                                                                                                </Button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                })}
                                                                            </tbody>
                                                                            
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Tab Pane 2 */}
                                                                <Tab.Pane eventKey="general">
                                                                    <Col md="12" className="commonFAQTabpaneCol">
                                                                        <Table responsive="sm" bordered id="commonFAQTable_General">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="commonFAQHeader_SNo">S/N</th>
                                                                                    <th className="commonFAQHeader_Question">Question</th>
                                                                                    <th className="commonFAQHeader_Answer">Answer</th>
                                                                                    <th className="commonFAQHeader_Edit">Edit</th>
                                                                                    <th className="commonFAQHeader_Delete">Delete</th>
                                                                                </tr>
                                                                            </thead>

                                                                            {this.state.commonfaq_general && this.state.commonfaq_general.map((general) => {
                                                                                return (
                                                                                    <>
                                                                                    <tbody>
                                                                                        <tr key={general.id}>
                                                                                        <td className="commonFAQData_SNo text-center">{general.general_counter}</td>
                                                                                        <td className="commonFAQData_Question text-left">{general.faqQuestion}</td>
                                                                                        <td className="commonFAQData_Answer text-left">{general.faqAnswer}</td>
                                                                                        <td className="commonFAQData_Edit text-center">
                                                                                            <Button id="editCommonFAQBtn" onClick={()=>this.handleEditCommonFAQModal(general)}>
                                                                                                <FontAwesomeIcon size="lg" id="editCommonFAQBtnIcon" icon={faEdit} />
                                                                                            </Button>
                                                                                        </td>
                                                                                        <td className="commonFAQData_Delete text-center">
                                                                                            <Button id="deleteCommonFAQBtn" onClick={(e) => this.handleDeleteCommonFAQModal(general.id)}>
                                                                                                <FontAwesomeIcon size="lg" id="deleteCommonFAQBtnIcon" icon={faTrashAlt} />
                                                                                            </Button>
                                                                                        </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                    </>
                                                                                );
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Col>
                                                    </Row>
                                                </Tab.Container>

                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>
                        </Container>

                    <Footer />
                </Container>


                {/* Add Common FAQ Modal */}
                <Modal 
                show={this.state.addCommonFAQModal}
                onHide={this.handleAddCommonFAQModal}
                aria-labelledby="addCommonFAQModalTitle"
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header closeButton className="justify-content-center">
                        <Modal.Title id="addCommonFAQModalTitle" className="w-100">
                        Add Common FAQ
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body id="addCommonFAQModalBody">
                        <Form noValidate>
                            {/* FAQ Type */}
                            <Form.Row className="justify-content-center addCommonFAQFormRow">
                                <Col md="10">
                                    <Form.Label className="addCommonFAQFormLabel">Type of FAQ</Form.Label>
                                    
                                    <Form.Control as="select" name="faqType" onChange={this.updateInput} defaultValue="" className="addCommonFAQFormSelect" required noValidate>
                                        <option value="" className="addCommonFAQFormSelectOption">Choose FAQ Type</option>

                                        {this.state.filteredFAQType && this.state.filteredFAQType.map((faqType) => {
                                            return (
                                            <>
                                                <option value={faqType} className="addCommonFAQFormSelectOption">{faqType}</option>
                                            </>
                                            );
                                        })}
                                    </Form.Control>

                                    <div className="errorMessage text-left">{this.state.faqTypeError}</div>
                                </Col>
                            </Form.Row>

                            {/* FAQ Question */}
                            <Form.Row className="justify-content-center addCommonFAQFormRow">
                                <Col md="10">
                                    <Form.Label className="addCommonFAQFormLabel">FAQ</Form.Label>
                                    <FormControl as="textarea" name="faqQuestion" onChange={this.updateInput} rows="4" required noValidate className="addCommonFAQForm_Textarea" placeholder="FAQ*" />                                       
                                    
                                    <div className="errorMessage text-left">{this.state.faqQuestionError}</div>
                                </Col>
                            </Form.Row>

                            {/* FAQ Question */}
                            <Form.Row className="justify-content-center addCommonFAQFormRow">
                                <Col md="10">
                                    <Form.Label className="addCommonFAQFormLabel">FAQ Answer</Form.Label>
                                    <FormControl as="textarea" name="faqAnswer" onChange={this.updateInput} rows="4" required noValidate className="addCommonFAQForm_Textarea" placeholder="FAQ Answer*" />                                       
                                    
                                    <div className="errorMessage text-left">{this.state.faqAnswerError}</div>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center">
                        {/* Add Common FAQ Submit Btn*/}
                        <Button type="submit" id="addCommonFAQFormBtn" onClick={this.addCommonFAQ}>Submit</Button>
                    </Modal.Footer>
                </Modal>


                {/* Edit Common FAQ Modal */}
                <Modal 
                show={this.state.editCommonFAQModal}
                onHide={this.handleEditCommonFAQModal}
                aria-labelledby="editCommonFAQModalTitle"
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header closeButton className="justify-content-center">
                        <Modal.Title id="editCommonFAQModalTitle" className="w-100">
                        Edit Common FAQ
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body id="editCommonFAQModalBody">
                        <Form noValidate onSubmit={()=>{this.editCommonFAQ()}}>
                        {/* FAQ Type */}
                        <Form.Row className="justify-content-center editCommonFAQFormRow">
                            <Col md="10">
                                <Form.Label className="editCommonFAQFormLabel">Type of FAQ</Form.Label>
                                
                                <Form.Control as="select" name="faqType" defaultValue={this.state.faqType} onChange={this.updateInput} className="editCommonFAQFormSelect" required noValidate>
                                    <option value="" className="editCommonFAQFormSelectOption">Choose FAQ Type</option>

                                    {this.state.filteredFAQType && this.state.filteredFAQType.map((faqType) => {
                                        return (
                                        <>
                                            <option value={faqType} className="editCommonFAQFormSelectOption">{faqType}</option>
                                        </>
                                        );
                                    })}
                                </Form.Control>                                        

                                <div className="errorMessage text-left">{this.state.faqTypeError}</div>
                            </Col>
                        </Form.Row>

                        {/* FAQ Question */}
                        <Form.Row className="justify-content-center editCommonFAQFormRow">
                            <Col md="10">
                                <Form.Label className="editCommonFAQFormLabel">FAQ</Form.Label>
                                <FormControl as="textarea" name="faqQuestion" defaultValue={this.state.faqQuestion} onChange={this.updateInput} rows="4" required noValidate className="editCommonFAQForm_Textarea" placeholder="FAQ*" />                                       
                                
                                <div className="errorMessage text-left">{this.state.faqQuestionError}</div>
                            </Col>
                        </Form.Row>

                        {/* FAQ Question */}
                        <Form.Row className="justify-content-center editCommonFAQFormRow">
                            <Col md="10">
                                <Form.Label className="editCommonFAQFormLabel">FAQ Answer</Form.Label>
                                <FormControl as="textarea" name="faqAnswer" defaultValue={this.state.faqAnswer} onChange={this.updateInput} rows="4" required noValidate className="editCommonFAQForm_Textarea" placeholder="FAQ Answer*" />                                       
                                
                                <div className="errorMessage text-left">{this.state.faqAnswerError}</div>
                            </Col>
                        </Form.Row>

                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center">
                        {/* Edit Common FAQ Submit Save Changes Btn */}
                        <Container>
                            <Row>
                                <Col md="6" className="text-right">
                                    <Button id="saveChangesCommonFAQFormBtn" onClick={(e)=>{this.editCommonFAQ()}}>Save Changes</Button>
                                </Col>

                                <Col md="6" className="text-left">
                                    <Button id="cancelEditCommonFAQFormBtn" onClick={this.handleEditCommonFAQModal}>Cancel</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Footer>
                </Modal>


                {/* Delete Common FAQ Modal */}
                <Modal 
                show={this.state.deleteCommonFAQModal}
                onHide={this.handleDeleteCommonFAQModal}
                aria-labelledby="deleteCommonFAQModalTitle"
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                >
                    <DeleteCommonFAQModal handleConfirmDelete={ (e) => {this.DeleteCommonFAQ(e, this.state.id)} } handleCancelDelete={this.handleDeleteCommonFAQModal} />
                </Modal>

            </div>
        );
    }
}

export default CommonFAQs;
