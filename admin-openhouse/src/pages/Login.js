import { Tab, Nav, Row, Col, Form, Container, Button, Modal } from 'react-bootstrap';
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

class Login extends Component {

    state = {marketingInitialState, superInitialState};
  
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
                        alert("no such users");
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
                        alert("no such users");
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

    resetForm () {
        this.setState({email: '', password: ''});
        this.setState(marketingInitialState);
        this.setState(superInitialState);
    }

    login(e, accounttype) {
        e.preventDefault();

        const isMarketingValid = this.validateMarketing();
        const isSuperValid = this.validateSuper();

        if (accounttype === "marketing") {
            this.setState(superInitialState);
            if (isMarketingValid) {
                this.setState(marketingInitialState);
            }
        } else if (accounttype === "super") {
            this.setState(marketingInitialState);
            if (isSuperValid) {
                this.setState(superInitialState);
            }
        }

        fire
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
            if (accounttype === "marketing") {
                this.marketingauthListener();
            }
            else if(accounttype === "super") {
                this.superauthListener();
            }
        })
        .catch((error) => {
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
                    <Col md={5}>
                        <Nav fill className="login-tabContainer" variant="tabs" as="ul">
                            <Nav.Item as="li">
                                <Nav.Link eventKey="marketingAdministrator" onSelect={this.resetForm} className="login-tabHeading">Marketing Administrator</Nav.Link>
                            </Nav.Item>

                            <Nav.Item as="li">
                                <Nav.Link eventKey="superAdministrator" onSelect={this.resetForm} className="login-tabHeading">Super Administrator</Nav.Link>
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

        </div>

        /*<div className="App">
            <form>
            <div className="col-and-6">
                <div class="form-group">
                <label for="exampleInputEmaill">Email address</label>
                <input
                    value={this.state.email}
                    onChange={this.handleChange}
                    type="email"
                    name="email"
                    class="form-control"
                    id="exampleInputEmaill"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                />
                <small id="emailHelp" class="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
                </div>
                <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    class="form-control"
                    id="exampleInputPasswordl"
                    placeholder="Password"
                />
                </div>
                <button type="submit" onClick={this.login} class="btn btn-primary">
                Login
                </button>
            </div>
            </form>
            <button
            type="submit"
            class="btn btn-warning"
            style={{ marginLeft: "25px" }}
            onClick={this.reset}
            >
            Reset Password
            </button>
        </div>*/
        );
    }
}
export default Login;
