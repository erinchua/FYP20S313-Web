import { Navbar, Nav, Accordion, useAccordionToggle, AccordionContext, OverlayTrigger, Tooltip, Container } from 'react-bootstrap';
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
        <Accordion.Toggle className="sideNavBar-accordion" onClick={decoratedOnClick}>{children}{isCurrentEventKey ? <FontAwesomeIcon icon={faChevronUp} className="sideNavBar-icons" /> : <FontAwesomeIcon icon={faChevronDown} className="sideNavBar-icons" />}</Accordion.Toggle>
    );
}

//Tooltip for Programme Talks
const renderProgrammeTalks = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="/ProgrammeTalkSchedule" className="sideNavBar-navLinks">Schedule</Nav.Link>
        <Nav.Link href="/LiveTalk" className="sideNavBar-navLinks">Live Streams</Nav.Link>
        <Nav.Link href="/PastRecording" className="sideNavBar-navLinks">Past Recordings</Nav.Link>
    </Tooltip>
);

//Tooltip for Guided Tours
const renderGuidedTours = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="/GuidedTour" className="sideNavBar-navLinks">Schedule</Nav.Link>
    </Tooltip>
);

//Tooltip for Open House Activities
const renderOpenHouseActivities = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="/Performances" className="sideNavBar-navLinks">Performances</Nav.Link>
        <Nav.Link href="/GameActivities" className="sideNavBar-navLinks">Games & Activities</Nav.Link>
        <Nav.Link href="/Prizes" className="sideNavBar-navLinks">Prizes</Nav.Link>
    </Tooltip>
);

//Tooltip for Forum
const renderForum = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="/Forum" className="sideNavBar-navLinks">View Forum</Nav.Link>
        <Nav.Link href="/ForumFlagged" className="sideNavBar-navLinks">Flagged Forum</Nav.Link>
        <Nav.Link href="/ForumSettings" className="sideNavBar-navLinks">Settings</Nav.Link>
    </Tooltip>
);

//Tooltip for Clubs & Councils@SIM
const renderClubs_Councils_SIM = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="/ArtsAndCulture" className="sideNavBar-navLinks">Arts & Culture</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">International Students Clubs</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Student Councils</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Special Interest Club</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Sports & Fitness</Nav.Link>
    </Tooltip>
);

//Tooltip for Scholarships
const renderScholarships = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="#" className="sideNavBar-navLinks">SIM GE Scholarship</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Sponsors</Nav.Link>
    </Tooltip>
);

//Tooltip for Bursary
const renderBursary = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="#" className="sideNavBar-navLinks">SIM GE Bursary</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Other Financial Assistance</Nav.Link>
    </Tooltip>
);

//Tooltip for Brochures
const renderBrochures = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <Nav.Link href="#" className="sideNavBar-navLinks">Study@SIM</Nav.Link>
        <Nav.Link href="#" className="sideNavBar-navLinks">Student Life@SIM</Nav.Link>
    </Tooltip>
);

//State for show tooltip to false
const initialState = {
    show: false,
}

export default class SideNavBar extends React.Component {

    state = initialState;

    render(){
        return (
            <div className="full-height">
                <Container fluid className="sideNavBar-con">
                    <Navbar bg="dark" className="sideNavBar-container">
                        <Nav defaultActiveKey="/MAHome" className="sideNavBar-content flex-column">
                            <Nav.Item className="sideNavBar-navItems">
                                <Nav.Link href="/MAHome" className="sideNavBar-navLinks"><FontAwesomeIcon icon={faBars} id="sideNavBar-homeIcon" />Home</Nav.Link>
                            </Nav.Item>
                            <div className="border"></div>
                            <Nav.Item className="sideNavBar-navItems">
                                <Nav.Link href="/Openhouse" className="sideNavBar-navLinks">Open House Dates</Nav.Link>
                                <Nav.Link href="/" className="sideNavBar-navLinks">Attendance Taking Scanner</Nav.Link>
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
                                            <Accordion>
                                                <ContextAwareToggle eventKey="2">Open House Programmes</ContextAwareToggle>
                                                <Accordion.Collapse eventKey="2">
                                                    <div>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderProgrammeTalks}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Programmes Talks</Nav.Link>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderGuidedTours}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Guided Tours</Nav.Link>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderOpenHouseActivities}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Open House Activities</Nav.Link>
                                                        </OverlayTrigger>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderForum}>
                                                <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-navLinks">Forum</Nav.Link>
                                            </OverlayTrigger>
                                            <Nav.Link href="/CampusFacilitiesMap" className="sideNavBar-navLinks">Campus Facilities Map</Nav.Link>
                                            <Nav.Link href="/GettingToSIMHQ" className="sideNavBar-navLinks">Getting To SIM HQ</Nav.Link>
                                            <Accordion>
                                                <ContextAwareToggle eventKey="3">Useful Info</ContextAwareToggle>
                                                <Accordion.Collapse eventKey="3">
                                                    <div>
                                                        <Nav.Link href="#" className="sideNavBar-inner-navLinks">Admission & Application</Nav.Link>
                                                        <Nav.Link href="#" className="sideNavBar-inner-navLinks">Contact Information</Nav.Link>
                                                        <Nav.Link href="/OpenHouseFeedback" className="sideNavBar-inner-navLinks">Open House Feedback Form</Nav.Link>
                                                        <Nav.Link href="/CommonFAQs" className="sideNavBar-inner-navLinks">Common FAQs</Nav.Link>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <Nav.Link href="/SocialMediaCampaigns" className="sideNavBar-navLinks">Social Media Campaigns</Nav.Link>
                                            <Accordion>
                                                <ContextAwareToggle eventKey="4">Study@SIM</ContextAwareToggle>
                                                <Accordion.Collapse eventKey="4">
                                                    <div>
                                                        <Nav.Link href="/Arts&SocialSciences" className="sideNavBar-inner-navLinks">Arts & Social Sciences</Nav.Link>
                                                        <Nav.Link href="/Business" className="sideNavBar-inner-navLinks">Business</Nav.Link>
                                                        <Nav.Link href="/IT&ComputerSciences" className="sideNavBar-inner-navLinks">IT & Computer Sciences</Nav.Link>
                                                        <Nav.Link href="/Nursing" className="sideNavBar-inner-navLinks">Nursing</Nav.Link>
                                                        <Nav.Link href="/Specialty" className="sideNavBar-inner-navLinks">Specialty</Nav.Link>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <Accordion>
                                                <ContextAwareToggle eventKey="5">Student Life@SIM</ContextAwareToggle>
                                                <Accordion.Collapse eventKey="5">
                                                    <div>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderClubs_Councils_SIM}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Clubs & Councils@SIM</Nav.Link>
                                                        </OverlayTrigger>
                                                        <Nav.Link href="#" className="sideNavBar-inner-navLinks">Student Care</Nav.Link>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderScholarships}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Scholarships</Nav.Link>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderBursary}>
                                                            <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-inner-navLinks">Bursary</Nav.Link>
                                                        </OverlayTrigger>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <Nav.Link href="/Announcement" className="sideNavBar-navLinks">Announcement</Nav.Link>
                                            <OverlayTrigger placement="right" defaultShow={this.state.show} trigger="focus" overlay={renderBrochures}>
                                                <Nav.Link onClick={() => this.setState({show: true})} className="sideNavBar-navLinks">Brochures</Nav.Link>
                                            </OverlayTrigger>
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
                </Container>
            </div>
        )
    }
}