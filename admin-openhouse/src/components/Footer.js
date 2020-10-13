import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

import "../css/Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'


export default class Footer extends React.Component {
    render(){
        return (
            <div>    
                <Navbar id="footer" fixed="bottom">
                    <Nav id="navContent" className="justify-content-start">
                        <Nav.Item>
                            <h5><FontAwesomeIcon icon="faCopyright" /></h5>
                        </Nav.Item>
                    </Nav>
                </Navbar>

            </div>
        )
    }
}
    

