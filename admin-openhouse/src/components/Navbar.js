import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

import fire from "../config/firebase";
import history from "../config/history";
import "../css/NavBar.css";
import WebAppLogo from "../img/WebAppLogo.png";


export default class NavBar extends React.Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.state = {
            useremail: null
          }
      }
    componentDidMount=() =>{
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
              const db = fire.firestore();
              var a  = this;
                    a.setState(() => ({
                      useremail: user.email, })
                    )
                  }  else {
            
            }
          });
         
    }
    logout() {
        fire.auth().signOut();
        history.push("/Login");
      }
    render(){
        return (
            <div>
                <Container fluid className="navbarCon">    
                    <Navbar id="navbar" sticky="top">
                        <Navbar.Brand href="/SAHome" id="webAppLogoNav">
                            <img src={WebAppLogo} id="webAppLogo" />
                        </Navbar.Brand>
                        
                        <Nav id="navContent" className="justify-content-end">
                            <Nav.Item>
                                <Nav.Link id="SAEmail" className="text-center">{this.state.useremail}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Button id="logoutBtn" href="/Login" onClick={this.logout} className="text-center">Logout</Button>
                            </Nav.Item>
                            
                        </Nav>
                    </Navbar>

                </Container>
            </div>
        )
    }
}
    

