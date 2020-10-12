import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

import "../css/NavBar.css";
import WebAppLogo from "../img/WebAppLogo.png";


export default class NavBar extends React.Component {
    render(){
        return (
            <div>    
                <Navbar id="navbar" fixed="top">
                    <Navbar.Brand href="/SAHome" id="webAppLogoNav">
                        <img src={WebAppLogo} id="webAppLogo" />
                    </Navbar.Brand>
                    
                    <Nav id="navContent" className="justify-content-end">
                        <Nav.Item>
                            <Nav.Link id="SAEmail" className="text-center">super admin email</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/Login" id="logoutLink" className="text-center">Logout</Nav.Link>
                        </Nav.Item>
                        
                    </Nav>
                </Navbar>

            </div>
        )
    }
}
    

