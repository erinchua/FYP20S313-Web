import React from 'react';
import { Navbar } from 'react-bootstrap';

import "../css/NavBar.css";
import WebAppLogo from "../img/WebAppLogo.png";


export default class NavBar extends React.Component {
    render(){
        return (
            <div>    
                <Navbar id="navbar">
                    <Navbar.Brand>
                        <img src={WebAppLogo} id="webAppLogo" />
                    </Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}
    

