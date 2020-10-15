import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import "../css/Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'


export default class Footer extends React.Component {
    render(){
        return (
            <div>
                <Container fluid className="footerCon">   
                    <Navbar id="footerBar" sticky="bottom">
                        <Nav id="footerContent" className="justify-content-start">
                            <Navbar.Text id="footerText" id="copyrightText">
                                <FontAwesomeIcon size="sm" id="copyrightIcon" icon={faCopyright} /> 2020 SIM Open House
                            </Navbar.Text>
                        </Nav>
                    </Navbar>
                </Container>
            </div>
        )
    }
}
    

