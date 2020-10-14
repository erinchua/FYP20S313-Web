import { Tab, Nav, Row, Col, Form, Container, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../config/firebase";
import history from "../config/history";

import '../css/Login.css';
import simLogo from '../img/WebAppLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';

class Login extends Component {
  
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      password: "",
      user: "",
    };
  }
  componentDidMount() {
    fire.auth().signOut();
  }
  authListener() {
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
              } else if (
                doc.data().administratorType === "Marketing Administrator"
              ) {
                this.setState({ user: "Marketing Administrator" });
                history.push("/StudentProfile");
              } else {
                history.push("/Login");
              }
            });
          }
        });
      } else {
        this.setState({ user: null });
      }
    });
  }
  login(e) {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        this.authListener();
      })
      .catch((error) => {
        alert("Login Failure");
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  reset = () => {
    history.push("/ResetPassword");
  };

  render() {
    return (
      <div id="login-content-container">
        <Tab.Container defaultActiveKey="marketingAdministrator">
          <Row className="justify-content-center">
            <Col md={5}>
              <Nav justify className="login-tabContainer" variant="tabs" as="ul">
                <Nav.Item as="li">
                  <Nav.Link eventKey="marketingAdministrator" className="login-tabHeading">Marketing Administrator</Nav.Link>
                </Nav.Item>

                <Nav.Item as="li">
                  <Nav.Link eventKey="superAdministrator" className="login-tabHeading">Super Administrator</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content id="login-tabContent">
                <Tab.Pane eventKey="marketingAdministrator">
                  <Container>
                    <div id="simLogo-container">
                      <img src={simLogo} id="simLogo"/>
                    </div>
                    <Form id="login-form">
                      <Form.Group>
                          <Form.Group as={Row} className="login-formGroup">
                            <Form.Group as={Col} md="1">
                              <FontAwesomeIcon size="lg" icon={faAt} />
                            </Form.Group> 
                            <Form.Group as={Col} md="7">
                                <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange}></Form.Control>
                                <Form.Control.Feedback type="invalid">Please enter your email</Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>                     
                      </Form.Group>
                      <Form.Group>
                          <Form.Group as={Row} className="login-formGroup">
                            <Form.Group as={Col} md="1">
                              <FontAwesomeIcon size="lg" icon={faLock} />
                            </Form.Group> 
                            <Form.Group as={Col} md="7">
                              <Form.Control type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange}></Form.Control>
                              <Form.Control.Feedback type="invalid">Please enter your password</Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>  
                          <Form.Group as={Row} id="login-forgetPassword">
                            <Form.Group as={Col} md="3"></Form.Group>
                            <Form.Group as={Col} md="7">
                              <div className="text-right">
                                <Button type="submit" variant="link" size="sm" onClick={this.reset}>Forget Password?</Button>
                              </div>   
                            </Form.Group> 
                          </Form.Group>                          
                      </Form.Group>
                      <Form.Group className="login-formGroup">
                        <Button onClick={this.login} type="submit" size="sm" id="login-button">Login</Button>
                      </Form.Group>
                    </Form>
                  </Container>
                </Tab.Pane>

                <Tab.Pane eventKey="superAdministrator">
                  <Container>
                    <div id="simLogo-container">
                      <img src={simLogo} id="simLogo"/>
                    </div>
                    <Form id="login-form">
                      <Form.Group>
                          <Form.Group as={Row} className="login-formGroup">
                            <Form.Group as={Col} md="1">
                              <FontAwesomeIcon size="lg" icon={faAt} />
                            </Form.Group> 
                            <Form.Group as={Col} md="7">
                                <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange}></Form.Control>
                                <Form.Control.Feedback type="invalid">Please enter your email</Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>                     
                      </Form.Group>
                      <Form.Group>
                          <Form.Group as={Row} className="login-formGroup">
                            <Form.Group as={Col} md="1">
                              <FontAwesomeIcon size="lg" icon={faLock} />
                            </Form.Group> 
                            <Form.Group as={Col} md="7">
                              <Form.Control type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange}></Form.Control>
                              <Form.Control.Feedback type="invalid">Please enter your password</Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>                      
                      </Form.Group>
                      <Form.Group className="login-formGroup">
                        <Button onClick={this.login} type="submit" size="sm" id="login-button">Login</Button>
                      </Form.Group>
                    </Form>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}
export default Login;
