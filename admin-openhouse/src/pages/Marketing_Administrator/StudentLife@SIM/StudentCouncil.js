import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/StudentCouncil.css';
import '../../../css/Marketing_Administrator/StudentLife.css';
import NavBar from '../../../components/Navbar';
import SideNavBar from '../../../components/SideNavbar';
import Footer from '../../../components/Footer';
import AddClubsAndCouncilsModal from '../../../components/Marketing_Administrator/Student Life@SIM/AddClubsAndCouncilsModal';
import EditClubsAndCouncilsModal from '../../../components/Marketing_Administrator/Student Life@SIM/EditClubsAndCouncilsModal';
import DeleteClubsAndCouncilsModal from '../../../components/Marketing_Administrator/Student Life@SIM/DeleteClubsAndCouncilsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

class StudentCouncil extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            categoryType: "",
            clubsAndCouncilDescription: "",
            clubsAndCouncilTitle: "",
            clubsAndCouncilsLogo: "",
            counter: "",
            progress: "",
            //Below states are for functions
            studentCouncil: "",
            //Below states are for modals
            addModal: false,
            deleteModal: false,
            editModal: false,
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
        var counter = 1;
        db.collection("ClubsAndCouncils").where("categoryType", "==", "StudentCouncil").get()
        .then((snapshot) => {
            const studCouncil = [];
            snapshot.forEach((doc) => {
                const data = {
                    categoryType: doc.data().categoryType,
                    clubsAndCouncilDescription: doc.data().clubsAndCouncilDescription,
                    clubsAndCouncilTitle: doc.data().clubsAndCouncilTitle,
                    clubsAndCouncilsLogo: doc.data().clubsAndCouncilsLogo,
                    id: doc.id,
                    counter: counter,
                };
                counter++;
                studCouncil.push(data);
            });
            this.setState({ studentCouncil: studCouncil });
        });
    }

    //Add Modal
    handleAdd = () => {
        this.addModal = this.state.addModal;
        if (this.addModal == false) {
            this.setState({
                addModal: true,
            });
        } else {
            this.setState({
                addModal: false
            });
            this.display();
        }
    }

    //Edit Modal
    handleEdit = (studentCouncil) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                id: studentCouncil.id,
                categoryType: studentCouncil.categoryType,
                clubsAndCouncilDescription: studentCouncil.clubsAndCouncilDescription,
                clubsAndCouncilTitle: studentCouncil.clubsAndCouncilTitle,
                clubsAndCouncilsLogo: studentCouncil.clubsAndCouncilsLogo,
            });
        } else {
            this.setState({
                editModal: false
            });
            this.display();
        }
    }

    //Delete Modal
    handleDelete = () => {
        this.deleteModal = this.state.deleteModal;
        if (this.deleteModal == false) {
            this.setState({
                deleteModal: true,
            });
        } else {
            this.setState({
                deleteModal: false
            });
            this.display();
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="StudentCouncil-container">
                    <NavBar isMA={true} />

                        <Container fluid className="StudentCouncil-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="StudentCouncil-topContentContainer">
                                        <Row id="StudentCouncil-firstRow">
                                            <Col md={6} className="text-left" id="StudentCouncil-firstRowCol">
                                                <h4 id="StudentCouncil-title">Student Councils</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="StudentCouncil-firstRowCol">
                                                <Button id="StudentCouncil-addBtn" onClick={this.handleAdd}><FontAwesomeIcon size="lg" icon={faPlus} /><span id="StudentCouncil-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="StudentCouncil-secondRow">
                                            <Col md={12} className="text-center" id="StudentCouncil-secondRowCol">
                                                <Table responsive="sm" bordered id="StudentCouncil-tableContainer">
                                                    <thead id="StudentCouncil-tableHeader">
                                                        <tr>
                                                            <th>S/N</th>
                                                            <th>Name of Club/Council</th>
                                                            <th>Description</th>
                                                            <th>Logo File</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.studentCouncil && this.state.studentCouncil.map((studentCouncil) => {
                                                        return (
                                                            <tbody id="StudentCouncil-tableBody" key={studentCouncil.id}>
                                                                <tr>
                                                                    <td>{studentCouncil.counter}</td>
                                                                    <td>{studentCouncil.clubsAndCouncilTitle}</td>
                                                                    <td className="text-left">{studentCouncil.clubsAndCouncilDescription}</td>
                                                                    <td className="text-left">{studentCouncil.clubsAndCouncilTitle} Logo</td>
                                                                    <td><Button size="sm" id="StudentCouncil-editBtn" onClick={() => this.handleEdit(studentCouncil)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                    <td><Button size="sm" id="StudentCouncil-deleteBtn" onClick={() => [this.setState({id: studentCouncil.id, clubsAndCouncilTitle: studentCouncil.clubsAndCouncilTitle, categoryType: studentCouncil.categoryType, clubsAndCouncilsLogo: studentCouncil.clubsAndCouncilsLogo}), this.handleDelete()]}><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
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

                {/* Add Modal */}
                <Modal show={this.state.addModal} onHide={this.handleAdd} size="lg" centered keyboard={false}>
                    <AddClubsAndCouncilsModal handleClose={this.handleAdd}/>
                </Modal>

                {/* Edit Modal */}
                <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                    <EditClubsAndCouncilsModal handleEdit={this.handleEdit} id={this.state.id} categoryType={this.state.categoryType} clubsAndCouncilTitle={this.state.clubsAndCouncilTitle} clubsAndCouncilDescription={this.state.clubsAndCouncilDescription} clubsAndCouncilsLogo={this.state.clubsAndCouncilsLogo}/>
                </Modal>

                {/* Delete Modal */}
                <Modal show={this.state.deleteModal} onHide={this.handleDelete} size="md" centered keyboard={false}>
                    <DeleteClubsAndCouncilsModal handleDelete={this.handleDelete} id={this.state.id} categoryType={this.state.categoryType} clubsAndCouncilTitle={this.state.clubsAndCouncilTitle} clubsAndCouncilsLogo={this.state.clubsAndCouncilsLogo}/>
                </Modal>

            </div>
        );
    }
}
export default StudentCouncil;