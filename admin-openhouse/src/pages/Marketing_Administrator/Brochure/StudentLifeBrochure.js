import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Brochures.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import EditStudentLifeBrochuresModal from '../../../components/Marketing_Administrator/Brochures/EditStudentLifeBrochuresModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class StudentLifeBrochure extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            brochureUrl: "",
            description: "",
            progress: "",
            //Below states are for the functions
            studentLifeBrochure: "",
            //Below states are for the modals
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
        db.collection("Brochures").where("id", ">=", "study-").where("id", "<=", "study-" + "\uf8ff")
        .onSnapshot((snapshot) => {
            const studentLifeBrochure = [];
            
            snapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    description: doc.data().description,
                    brochureUrl: doc.data().brochureUrl,
                }
                studentLifeBrochure.push(data);     
            });
            this.setState({
                studentLifeBrochure: studentLifeBrochure
            }); 
        });
    }

    handleEdit = (parameter) => {
        this.editModal = this.state.editModal;
        if (this.editModal == false) {
            this.setState({
                editModal: true,
                id: parameter.id,
                description: parameter.description,
                brochureUrl: parameter.brochureUrl,
            });
        } else {
            this.setState({
                editModal: false
            });
            this.display();
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="Brochures-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Brochures-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Brochures-topContentContainer">
                                        <Row id="Brochures-firstRow">
                                            <Col md={12} className="text-left" id="Brochures-firstRowCol">
                                                <h4 id="Brochures-title">Student Life@SIM Brochures</h4>
                                            </Col>
                                        </Row>

                                        <Row id="Brochures-secondRow">
                                            <Col md={12} className="text-center" id="Brochures-secondRowCol">
                                                <Table responsive="sm" bordered hover className="Brochures-tableCon">
                                                    <thead id="Brochures-tableHeader">
                                                        <tr>
                                                            <th id="Brochures-descHeading">Description</th>
                                                            <th>Brochure</th>
                                                            <th id="Brochures-editHeading">Edit</th>
                                                        </tr>
                                                    </thead>
                                                    {this.state.studentLifeBrochure && this.state.studentLifeBrochure.map((studentLife) => {
                                                        return (
                                                            <tbody id="Brochures-tableBody" key={studentLife.id}>
                                                                <tr>
                                                                    <td>{studentLife.description}</td>
                                                                    <td className="text-left">{studentLife.brochureUrl}</td>
                                                                    <td><Button size="sm" id="Brochures-editBtn" onClick={() => this.handleEdit(studentLife)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
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

                {/* Edit Modal */}
                <Modal show={this.state.editModal} onHide={this.handleEdit} size="lg" centered keyboard={false}>
                    <EditStudentLifeBrochuresModal handleEdit={this.handleEdit} id={this.state.id} description={this.state.description} brochureUrl={this.state.brochureUrl} />
                </Modal>

            </div>
        );
    }
}
export default StudentLifeBrochure;