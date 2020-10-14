import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
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
                <Navbar id="navbar" fixed="top">
                    <Navbar.Brand href="/SAHome" id="webAppLogoNav">
                        <img src={WebAppLogo} id="webAppLogo" />
                    </Navbar.Brand>
                    
                    <Nav id="navContent" className="justify-content-end">
                        <Nav.Item>
                            <Nav.Link id="SAEmail" className="text-center">{this.state.useremail}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/Login" id="logoutLink" onclick={this.logout} className="text-center">Logout</Nav.Link>
                        </Nav.Item>
                        
                    </Nav>
                </Navbar>

            </div>
        )
    }
}
    

