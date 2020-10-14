import React from 'react';
import { Navbar, Nav, Container, Modal, Form, FormGroup, FormCheck } from 'react-bootstrap';

import "../../css/Super_Administrator/AddUserModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'


export default class AddUserModal extends React.Component {
    render(){
        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title id="addUserModalTitle" className="w-100">
                        Add Administrator
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="addUserModalBody">
                    
                </Modal.Body>
            </div>
        )
    }
}