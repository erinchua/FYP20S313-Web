import { Navbar, Nav, Accordion, useAccordionToggle, AccordionContext, OverlayTrigger, Card, Popover } from 'react-bootstrap';
import React, { useContext } from 'react';

import '../css/SideNavBar.css';
import { faBars, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Method for Toggling Accordion Arrows
function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);
  
    const decoratedOnClick = useAccordionToggle(
        eventKey, () => callback && callback(eventKey),
    );
  
    const isCurrentEventKey = currentEventKey === eventKey;
  
    return (
        <Accordion.Toggle eventKey="0" className="sideNavBar-accordion" onClick={decoratedOnClick}>{children}{isCurrentEventKey ? <FontAwesomeIcon icon={faChevronUp} className="sideNavBar-icons" /> : <FontAwesomeIcon icon={faChevronDown} className="sideNavBar-icons" />}</Accordion.Toggle>
    );
}

const renderTooltip = (props) => (
    <Popover {...props}>
            <Nav.Link href="#" className="sideNavBar-inner-navLinks">Admission & Application</Nav.Link>
            <Nav.Link href="#" className="sideNavBar-inner-navLinks">Contact Information</Nav.Link>
            <Nav.Link href="#" className="sideNavBar-inner-navLinks">Open House Feedback Form</Nav.Link>
            <Nav.Link href="#" className="sideNavBar-inner-navLinks">Common FAQs</Nav.Link>
    </Popover>
);

export default class SideNavBar extends React.Component {

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
                            <Nav.Link href="/Openhouse" className="sideNavBar-navLinks">Open House Dates</Nav.Link>
                        </Nav.Item>
                        <div className="border"></div>
                        <Nav.Item className="sideNavBar-navItems">
                            <Accordion>
                                <ContextAwareToggle eventKey="0">User Accounts</ContextAwareToggle>
                                <Accordion.Collapse eventKey="0">
                                    <div>
                                        <Nav.Link href="/StudentAccounts" className="sideNavBar-navLinks">Prospective Students</Nav.Link>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </Nav.Item>
                        <div className="border"></div>
                        <Nav.Item className="sideNavBar-navItems">
                            <Accordion>
                                <ContextAwareToggle eventKey="1">Mobile Application</ContextAwareToggle>
                                <Accordion.Collapse eventKey="1">
                                    <div>
                                        <Nav.Link href="/MobileHome" className="sideNavBar-navLinks">Home</Nav.Link>
                                        <Accordion>
                                            <ContextAwareToggle eventKey="2">Open House Programmes</ContextAwareToggle>
                                            <Accordion.Collapse eventKey="2">
                                                <div>
                                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                                                        <Nav.Link href="#" className="sideNavBar-inner-navLinks">Programmes Talks</Nav.Link>
                                                    </OverlayTrigger>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Guided Tours</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Open House Activities</Nav.Link>
                                                </div>
                                            </Accordion.Collapse>
                                        </Accordion>
                                        <Nav.Link href="/Forum" className="sideNavBar-navLinks">Forum</Nav.Link>
                                        <Nav.Link href="/CampusFacilitiesMap" className="sideNavBar-navLinks">Campus Facilities Map</Nav.Link>
                                        <Nav.Link href="/GettingToSIMHQ" className="sideNavBar-navLinks">Getting To SIM HQ</Nav.Link>
                                        <Accordion>
                                            <ContextAwareToggle eventKey="3">Useful Info</ContextAwareToggle>
                                            <Accordion.Collapse eventKey="3">
                                                <div>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Admission & Application</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Contact Information</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Open House Feedback Form</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Common FAQs</Nav.Link>
                                                </div>
                                            </Accordion.Collapse>
                                        </Accordion>
                                        <Nav.Link href="/SocialMediaCampaigns" className="sideNavBar-navLinks">Social Media Campaigns</Nav.Link>
                                        <Accordion>
                                            <ContextAwareToggle eventKey="4">Study@SIM</ContextAwareToggle>
                                            <Accordion.Collapse eventKey="4">
                                                <div>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Arts & Social Sciences</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Business</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">IT & Computer Sciences</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Nursing</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Speciality</Nav.Link>
                                                </div>
                                            </Accordion.Collapse>
                                        </Accordion>
                                        <Accordion>
                                            <ContextAwareToggle eventKey="5">Student Life@SIM</ContextAwareToggle>
                                            <Accordion.Collapse eventKey="5">
                                                <div>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Clubs & Councils@SIM</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Student Care</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Scholarships</Nav.Link>
                                                    <Nav.Link href="#" className="sideNavBar-inner-navLinks">Bursary</Nav.Link>
                                                </div>
                                            </Accordion.Collapse>
                                        </Accordion>
                                        <Nav.Link href="/Announcement" className="sideNavBar-navLinks">Announcement</Nav.Link>
                                        <Nav.Link href="#" className="sideNavBar-navLinks">Brochures</Nav.Link>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </Nav.Item>
                        <div className="border"></div>
                        <Nav.Item className="sideNavBar-navItems">
                            <Accordion>
                                <ContextAwareToggle eventKey="6">Generate Report</ContextAwareToggle>
                                <Accordion.Collapse eventKey="6">
                                    <div>
                                        <Nav.Link href="#" className="sideNavBar-navLinks">Report on the total number of registrations for open house mobile application</Nav.Link>
                                        <Nav.Link href="#" className="sideNavBar-navLinks">Report on the total number of attendees for programme talks</Nav.Link>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </Nav.Item>
                        <div className="border"></div>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}