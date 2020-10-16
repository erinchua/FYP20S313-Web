import { Navbar, Nav, Container, Button, Accordion, useAccordionToggle } from 'react-bootstrap';
import React from 'react';

import '../css/SideNavBar.css';
import { faAngleDown, faBars, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class SideNavBar extends React.Component {

    // constructor () {
    //     super();
    //     this.state = {
    //         open: false
    //     }
    // }

    render(){
        return (
            <div>
                <Navbar bg="dark" className="sideNavBar-container">
                    <Nav defaultActiveKey="/MAHome" className="sideNavBar-content flex-column">
                        <Nav.Item className="sideNavBar-navItems">
                            <Nav.Link href="/MAHome" className="sideNavBar-navLinks"><FontAwesomeIcon icon={faBars} id="sideNavBar-homeIcon" />Home</Nav.Link>
                        </Nav.Item>
                        <div className="border"></div>
                        <Nav.Item className="sideNavBar-navItems">
                            <Nav.Link href="/Openhouse" className="sideNavBar-navLinks">Open House</Nav.Link>
                        </Nav.Item>
                        <div className="border"></div>
                        <Nav.Item className="sideNavBar-navItems">
                            <Accordion>
                                <Accordion.Toggle eventKey="0" className="sideNavBar-accordion">User Accounts<FontAwesomeIcon icon={faChevronDown} className="sideNavBar-icons" /></Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Nav.Link href="/StudentProfile" className="sideNavBar-navLinks">Prospective Students</Nav.Link>
                                </Accordion.Collapse>
                            </Accordion>
                        </Nav.Item>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}