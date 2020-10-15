import { Tab, Nav, Row, Col, Form, Container, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../config/firebase";
import history from "../config/history";

import '../css/Login.css';
import simLogo from '../img/WebAppLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class Login extends Component {
  
<<<<<<< HEAD
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
            if (
                doc.data().administratorType === "Marketing Administrator"
              ) {
                this.setState({ user: "Marketing Administrator" });
                history.push("/StudentProfile");
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

  login(e,accounttype) {
       e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        if(accounttype ==="marketing") {
        this.marketingauthListener();
        }
        else  if(accounttype ==="super")
        {
          this.superauthListener();
        }
      })
      .catch((error) => {
        alert("Login Failure");
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  reset = () => {
    history.push("/ResetPassword")
    window.location.reload();
  }

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
                        <Button  onClick={(e) => {this.login(e,"marketing")}} type="submit" size="sm" id="login-button">Login</Button>
                       
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
                      <Button  onClick={(e) => {this.login(e,"super")}} type="submit" size="sm" id="login-button">Login</Button>
                      </Form.Group>
                    </Form>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
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
=======
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: "",
            password: "",
            user: "",
            errors: {
                email: '',
                password: ''
            }
        };
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
                                history.push("/StudentProfile");
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

    login(e,accounttype) {
        e.preventDefault();
        if (validateForm(this.state.errors)) {
            console.info('Valid form');
        } else {
            console.error('Invalid form');
        }
        fire
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
            if (accounttype ==="marketing") {
                this.marketingauthListener();
            }
            else if(accounttype ==="super") {
                this.superauthListener();
            }
        })
        .catch((error) => {
            console.log("Login Failure");
        });
    }

    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let errors = this.state.errors;

        switch(name) {
        case 'email':
            errors.email = validEmailRegex.test(value) ? '' 
            : 'Email is not valid!';
            break;
        case 'password':
            errors.password = value.length < 8 ? 
            'Password must be 8 characters long!' : '';
            break;

            default:
            break;
        }

        this.setState({ errors, [e.target.name]: e.target.value });
    }

    reset = () => {
        history.push("/ResetPassword")
        window.location.reload();
    }

    render() {
        const {errors} = this.state;
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
                                    <Form id="login-form" noValidate onSubmit={this.login}>
                                        <Form.Group>
                                            <Form.Group as={Row} className="login-formGroup">
                                                <Form.Group as={Col} md="1">
                                                    <FontAwesomeIcon size="lg" icon={faAt} />
                                                </Form.Group> 
                                                <Form.Group as={Col} md="7">
                                                    <Form.Control type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} noValidate></Form.Control>
                                                    {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
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
                                                    {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
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
                                            <Button onClick={(e) => {this.login(e,"marketing")}} type="submit" size="sm" id="login-button">Login</Button>
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
                                                    {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
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
                                                    {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                                                </Form.Group>
                                            </Form.Group>                      
                                        </Form.Group>

                                        <Form.Group className="login-formGroup">
                                            <Button onClick={(e) => {this.login(e,"super")}} type="submit" size="sm" id="login-button">Login</Button>
                                        </Form.Group>
                                    </Form>
                                </Container>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
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
>>>>>>> BeaBranch
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
