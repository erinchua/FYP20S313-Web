import { Tab, Nav, Row, Col, Form, Container, Button, Modal, Alert } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../config/firebase";
import history from "../config/history";

import '../css/Login.css';
import simLogo from '../img/WebAppLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';
import ForgetPasswordModal from "../components/ForgetPasswordModal";
 

const marketingInitialState = {
    marketingEmailError: "",
    marketingPasswordError: "",
    
}

const superInitialState = {
    superEmailError: "",
    superPasswordError: "",
}

const crewInitialState = {
    crewEmailError: "",
    crewPasswordError: "",
}

class Login extends Component {

    state = {marketingInitialState, superInitialState, crewInitialState};
  
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.state = {
            email: "",
            password: "",
            user: "",
            forgetPasswordModal: false,
            showAlert: false,
        };
        this.handleForgetPasswordModal = this.handleForgetPasswordModal.bind(this);
    }

    componentDidMount() {
        fire.auth().signOut();
    }

    marketingauthListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();

                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    if (snapshot.empty) {
                        console.log("No such user!");
                        this.setState({showAlert: true});
                    } else {
                        snapshot.forEach((doc) => {
                            if (doc.data().administratorType === "Marketing Administrator") {
                                this.setState({ user: "Marketing Administrator" });
                                history.push("/MAHome");
                                window.location.reload();
                            } else {
                                history.push("/Login");
                                window.location.reload();
                            }
                        });
                    }
                });
            } else {
                this.setState({ user: null });
            }
        });
    }

    superauthListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();

                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    if (snapshot.empty) {
                        console.log("No such user!");
                        this.setState({showAlert: true});
                    } else {
                        snapshot.forEach((doc) => {
                            if (doc.data().administratorType === "Super Administrator") {
                                this.setState({ user: "Super Administrator" });
                                history.push("/SAHome");
                                window.location.reload();
                            }  else {
                                history.push("/Login");
                                window.location.reload();
                            }
                        });
                    }
                });
            } else {
                this.setState({ user: null });
            }
        });
    }

    crewauthListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();

                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    if (snapshot.empty) {
                        console.log("No such user!");
                        this.setState({showAlert: true});
                    } else {
                        snapshot.forEach((doc) => {
                            if (doc.data().administratorType === "Crew") {
                                this.setState({ user: "Crew" });
                                history.push("/AttendanceMarkingScanner");
                                window.location.reload();
                            }  else {
                                history.push("/Login");
                                window.location.reload();
                            }
                        });
                    }
                });
            } else {
                this.setState({ user: null });
            }
        });
    }

    validateMarketing = () => {
        let marketingEmailError = "";
        let marketingPasswordError = "";

        if (!this.state.email.includes('@')) {
            marketingEmailError = "Please enter valid email!";
        }

        if (!this.state.password) {
            marketingPasswordError = "Please enter valid password!";
        }

        if (marketingEmailError || marketingPasswordError) {
            this.setState({marketingEmailError, marketingPasswordError});
            return false;
        } 

        return true;
    }

    validateSuper = () => {
        let superEmailError = "";
        let superPasswordError = "";

        if (!this.state.email.includes('@')) {
            superEmailError = "Please enter valid email!";
        }

        if (!this.state.password) {
            superPasswordError = "Please enter valid password!";
        }

        if (superEmailError || superPasswordError) {
            this.setState({superEmailError, superPasswordError});
            return false;
        }

        return true;
    }

    validateCrew = () => {
        let crewEmailError = "";
        let crewPasswordError = "";

        if (!this.state.email.includes('@')) {
            crewEmailError = "Please enter valid email!";
        }

        if (!this.state.password) {
            crewPasswordError = "Please enter valid password!";
        }

        if (crewEmailError || crewPasswordError) {
            this.setState({crewEmailError, crewPasswordError});
            return false;
        }

        return true;
    }

    resetForm () {
        this.setState({email: '', password: ''});
        this.setState(marketingInitialState);
        this.setState(superInitialState);
        this.setState(crewInitialState);
    }

    login(e, accounttype) {
        e.preventDefault();

        const isMarketingValid = this.validateMarketing();
        const isSuperValid = this.validateSuper();
        const isCrewValid = this.validateCrew();

        if (accounttype === "marketing") {
            this.setState(superInitialState);
            this.setState(crewInitialState);
            if (isMarketingValid) {
                this.setState(marketingInitialState);
            }
        } else if (accounttype === "super") {
            this.setState(marketingInitialState);
            this.setState(crewInitialState);
            if (isSuperValid) {
                this.setState(superInitialState);
            }
        } else if (accounttype === "crew") {
            this.setState(marketingInitialState);
            this.setState(superInitialState);
            if(isCrewValid) {
                this.setState(crewInitialState);
            }
        }

        fire
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
            if (accounttype === "marketing") {
                this.marketingauthListener();
            } else if (accounttype === "super") {
                this.superauthListener();
            } else if (accounttype === "crew") {
                this.crewauthListener();
            }
        })
        .catch((error) => {
            //Alert box for login failure
            this.setState({showAlert: true});
            console.log("Login Failure");
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    reset = () => {
        history.push("/ResetPassword")
        window.location.reload();
    }

    /* Forget Password Modal */
    handleForgetPasswordModal = () => {
        this.resetForm();
        this.forgetPasswordModal = this.state.forgetPasswordModal;
        if (this.forgetPasswordModal == false) {
            this.setState({
                forgetPasswordModal: true
            });
            }
            else {
            this.setState({
                forgetPasswordModal: false
            });
        }
    };

    render() {
        return (
            <div id="login-content-container">
                <Tab.Container defaultActiveKey="marketingAdministrator">
                    <Row className="justify-content-center">
                        <Col md={7}>
                            <Nav fill className="login-tabContainer" variant="tabs" as="ul">
                                <Nav.Item as="li">
                                    <Nav.Link eventKey="marketingAdministrator" onSelect={this.resetForm} className="login-tabHeading">Marketing Administrator</Nav.Link>
                                </Nav.Item>

                                <Nav.Item as="li">
                                    <Nav.Link eventKey="superAdministrator" onSelect={this.resetForm} className="login-tabHeading">Super Administrator</Nav.Link>
                                </Nav.Item>

                                <Nav.Item as="li">
                                    <Nav.Link eventKey="eventCrew" onSelect={this.resetForm} className="login-tabHeading">Event Crew</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content id="login-tabContent">
                                
                                <Tab.Pane eventKey="marketingAdministrator">
                                    <Container>
                                        <div id="simLogo-container">
                                            <img src={simLogo} id="simLogo"/>
                                        </div>
                                        <Form id="login-form" noValidate onSubmit={this.login}>
                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faAt} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.marketingEmailError}</div>
                                                    </Form.Group>
                                                </Form.Group>                     
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faLock} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.marketingPasswordError}</div>
                                                    </Form.Group>
                                                </Form.Group>  
                                                <Form.Group as={Row} id="login-forgetPassword">
                                                    <Form.Group as={Col} md="3"></Form.Group>
                                                    <Form.Group as={Col} md="7">
                                                        <div className="text-right">
                                                            <Button variant="link" size="sm" onClick={this.handleForgetPasswordModal.bind(this)}>Forget Password?</Button>
                                                        </div>   
                                                    </Form.Group> 
                                                </Form.Group>                          
                                            </Form.Group>
                                            <Form.Group className="login-formGroup">
                                                <Button onClick={(e) => {this.login(e, "marketing")}} type="submit" size="sm" id="login-button">Login</Button>
                                            </Form.Group>
                                        </Form>
                                    </Container>
                                </Tab.Pane>

                                <Tab.Pane eventKey="superAdministrator">
                                    <Container>
                                        <div id="simLogo-container">
                                            <img src={simLogo} id="simLogo"/>
                                        </div>
                                        <Form id="login-form" noValidate onSubmit={this.login}>
                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faAt} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.superEmailError}</div>
                                                    </Form.Group>
                                                </Form.Group>                     
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faLock} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.superPasswordError}</div>
                                                    </Form.Group>
                                                </Form.Group>  
                                                <Form.Group as={Row} id="login-forgetPassword">
                                                    <Form.Group as={Col} md="3"></Form.Group>
                                                    <Form.Group as={Col} md="7">
                                                        <div className="text-right">
                                                            <Button variant="link" size="sm" onClick={this.handleForgetPasswordModal.bind(this)}>Forget Password?</Button>
                                                        </div>   
                                                    </Form.Group> 
                                                </Form.Group>                          
                                            </Form.Group>
                                            <Form.Group className="login-formGroup">
                                                <Button onClick={(e) => {this.login(e, "super")}} type="submit" size="sm" id="login-button">Login</Button>
                                            </Form.Group>
                                        </Form>
                                    </Container>
                                </Tab.Pane>


                                <Tab.Pane eventKey="eventCrew">
                                    <Container>
                                        <div id="simLogo-container">
                                            <img src={simLogo} id="simLogo"/>
                                        </div>
                                        <Form id="login-form" noValidate onSubmit={this.login}>
                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faAt} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.crewEmailError}</div>
                                                    </Form.Group>
                                                </Form.Group>                     
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Group as={Row} className="login-formGroup">
                                                    <Form.Group as={Col} md="1">
                                                        <FontAwesomeIcon size="lg" icon={faLock} />
                                                    </Form.Group> 
                                                    <Form.Group as={Col} md="7">
                                                        <Form.Control type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} noValidate></Form.Control>
                                                        <div className="errorMessage">{this.state.crewPasswordError}</div>
                                                    </Form.Group>
                                                </Form.Group>                            
                                            </Form.Group>

                                            <Form.Group className="login-formGroup">
                                                <Button onClick={(e) => {this.login(e, "crew")}} type="submit" size="sm" id="login-button">Login</Button>
                                            </Form.Group>
                                        </Form>
                                    </Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

                {this.state.forgetPasswordModal == true ?
                    <Modal
                        show={this.state.forgetPasswordModal}
                        onHide={this.handleForgetPasswordModal}
                        size="lg"
                        centered
                        backdrop="static"
                        keyboard={false}
                    >
                        <ForgetPasswordModal />
                    </Modal>
                    :''
                }

                {this.state.showAlert == true ?
                    <Modal show={this.state.showAlert} onHide={() => this.setState({showAlert: false})} size="sm" centered backdrop="static" keyboard={false}>
                        <Alert show={this.state.showAlert} onClose={() => this.setState({showAlert: false})} dismissible>
                            <Alert.Heading>Error Occurred!</Alert.Heading>
                            <p id="login-alertFail-data">Please enter the correct email and password.</p>
                        </Alert>
                    </Modal> : ''
                }

            </div>
        );
    }
}
export default Login;
