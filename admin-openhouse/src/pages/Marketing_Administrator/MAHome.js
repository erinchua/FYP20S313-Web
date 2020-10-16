import { Container } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";

import '../../css/Marketing_Administrator/MAHome.css';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';

class MAHome extends Component {

    render() {
        return (
            <div>
                <Container fluid className="MAHome-container">
                    <NavBar />

                    <Container fluid className="MAHome-content">
                        


                    </Container>

                    <Footer />

                </Container>
            </div>
        )
    }

}

export default MAHome;