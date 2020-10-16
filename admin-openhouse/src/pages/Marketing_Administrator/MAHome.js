import { Container } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';

class MAHome extends Component {

    render() {
        return (
            <div>
                <Container fluid className="MAHome-container">
                    <NavBar />

                    <Container fluid className="MAHome-content">
                        <SideNavBar />


                    </Container>

                    <Footer />

                </Container>
            </div>
        )
    }

}

export default MAHome;