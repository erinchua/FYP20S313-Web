import React from 'react';
import { Modal, Table } from 'react-bootstrap';

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/ViewStudySIMProgDetailsModal.css";


export default class ViewStudySIMProgDetailsModal extends React.Component {

    render(){
        return (
            <div>
                <Modal.Header closeButton className="justify-content-center">
                    {/* To be retrieved from db */}
                    <Modal.Title id="viewStudySIMProgDetailsModalTitle" className="w-100">
                        Programme Name
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body id="viewStudySIMProgDetailsModalBody">
                    <Table responsive="sm" bordered className="viewStudySIMProgDetailsTable justify-content-center">
                        <thead>
                            <tr className="text-center">
                                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_AboutProg">About Programme</th>
                                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_ApplicationPeriod">Application Period</th>
                                <th colSpan="2" id="viewStudySIMProgDetailsHeader_ProgStructure">Programme Structure</th>
                                <th colSpan="2" id="viewStudySIMProgDetailsHeader_OverseasOpp">Overseas Opportunity</th>
                                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_IntakeMonth">Intake Month(s)</th>
                                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_Duration">Duration</th>
                            </tr>

                            <tr className="text-center">
                                <th id="viewStudySIMProgDetailsHeader_Coursework">Coursework</th>
                                <th id="viewStudySIMProgDetailsHeader_Examination">Examination</th>
                                <th id="viewStudySIMProgDetailsHeader_Exchange">Exchange</th>
                                <th id="viewStudySIMProgDetailsHeader_Transfer">Transfer</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td id="viewStudySIMProgDetailsData_AboutProg">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_ApplicationPeriod">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_Coursework">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_Examination">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_Exchange">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_Transfer">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_IntakeMonth">testtesttesttest</td>
                                <td id="viewStudySIMProgDetailsData_Duration">testtesttesttest</td>
                            </tr>
                        </tbody>

                    </Table>
                </Modal.Body>

            </div>
        );
    }
}