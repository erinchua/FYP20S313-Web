import React from "react";
import { Modal, Table } from "react-bootstrap";

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/ViewStudySIMProgDetailsModal.css";

export default class ViewStudySIMProgDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          {/* To be retrieved from db */}
          <Modal.Title id="viewStudySIMProgDetailsModalTitle" className="w-100">
            {this.props.programmeName}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body id="viewStudySIMProgDetailsModalBody">
          <Table
            responsive="sm"
            bordered
            className="viewStudySIMProgDetailsTable justify-content-center"
          >
            <thead>
              <tr className="text-center">
                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_AboutProg">
                  About Programme
                </th>
                <th
                  rowSpan="2"
                  id="viewStudySIMProgDetailsHeader_ApplicationPeriod"
                >
                  Application Period
                </th>
                <th
                  colSpan="2"
                  id="viewStudySIMProgDetailsHeader_ProgStructure"
                >
                  Programme Structure
                </th>
                <th colSpan="2" id="viewStudySIMProgDetailsHeader_OverseasOpp">
                  Overseas Opportunity
                </th>
                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_IntakeMonth">
                  Intake Month(s)
                </th>
                <th rowSpan="2" id="viewStudySIMProgDetailsHeader_Duration">
                  Duration
                </th>
              </tr>

              <tr className="text-center">
                <th id="viewStudySIMProgDetailsHeader_Coursework">
                  Coursework
                </th>
                <th id="viewStudySIMProgDetailsHeader_Examination">
                  Examination
                </th>
                <th id="viewStudySIMProgDetailsHeader_Exchange">Exchange</th>
                <th id="viewStudySIMProgDetailsHeader_Transfer">Transfer</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td id="viewStudySIMProgDetailsData_AboutProg">
                  <tr>
                    <p>{this.props.aboutprogramme1}</p>
                  </tr>

                  <tr>
                    <p>{this.props.aboutprogramme2} </p>
                  </tr>

                  <tr>
                    <p>{this.props.aboutprogramme3}</p>
                  </tr>
                </td>
                <td id="viewStudySIMProgDetailsData_ApplicationPeriod">
                  <tr>Period 1: {this.props.applicationperiod1}</tr>
                  <tr>Period 2: {this.props.applicationperiod2}</tr>
                </td>
                <td id="viewStudySIMProgDetailsData_Coursework">
                  {this.props.programmestructurecoursework === true && (
                    <span>Yes</span>
                  )}
                  {this.props.programmestructurecoursework !== true && (
                    <span>No</span>
                  )}
                </td>
                <td id="viewStudySIMProgDetailsData_Examination">
                  {this.props.programmestructureexamination === true && (
                    <span>Yes</span>
                  )}
                  {this.props.programmestructureexamination !== true && (
                    <span>No</span>
                  )}
                </td>
                <td id="viewStudySIMProgDetailsData_Exchange">
                  {this.props.overseaopportunityexchange === true && (
                    <span>Yes</span>
                  )}
                  {this.props.overseaopportunityexchange !== true && (
                    <span>No</span>
                  )}
                </td>
                <td id="viewStudySIMProgDetailsData_Transfer">
                  {this.props.overseaopportunitytransfer === true && (
                    <span>Yes</span>
                  )}
                  {this.props.overseaopportunitytransfer !== true && (
                    <span>No</span>
                  )}
                </td>
                <td id="viewStudySIMProgDetailsData_IntakeMonth">
                  <tr>Full-Time: {this.props.intakemonthsfulltime}</tr>
                  <tr>Part-Time: {this.props.intakemonthsparttime}</tr>
                </td>
                <td id="viewStudySIMProgDetailsData_Duration">
                  <tr>Full-Time: {this.props.durationfulltime}</tr>
                  <tr>Part-Time: {this.props.durationparttime}</tr>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </div>
    );
  }
}
