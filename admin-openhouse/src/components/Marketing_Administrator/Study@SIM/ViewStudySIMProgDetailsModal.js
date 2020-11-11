import React from "react";
import { Modal, Table, Row, Col } from "react-bootstrap";

import "../../../css/Marketing_Administrator/ViewStudySIMProgDetailsModal.css";

export default class ViewStudySIMProgDetailsModal extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title id="viewStudySIMProgDetailsModalTitle" className="w-100">
            {this.props.programmeName}
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
                <td id="viewStudySIMProgDetailsData_AboutProg">
                  <Row className="justify-content-center">
                    <Col className="text-left">{this.props.aboutprogramme1}</Col>
                  </Row>

                  <br/>

                  <Row className="justify-content-center">
                    <Col className="text-left">{this.props.aboutprogramme2}</Col>
                  </Row>

                  <br/>

                  <Row className="justify-content-center">
                    <Col className="text-left">{this.props.aboutprogramme3}</Col>
                  </Row>
                </td>

                <td id="viewStudySIMProgDetailsData_ApplicationPeriod">
                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Period 1: </b><br/>{this.props.applicationperiod1}</Col>
                  </Row>

                  <br/>

                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Period 2: </b><br/>{this.props.applicationperiod2}</Col>
                  </Row>
                </td>

                <td id="viewStudySIMProgDetailsData_Coursework">
                  {this.props.programmestructurecoursework === true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">Yes</Col>
                    </Row>
                  )}

                  {this.props.programmestructurecoursework !== true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">No</Col>
                    </Row>
                  )}
                </td>

                <td id="viewStudySIMProgDetailsData_Examination">
                  {this.props.programmestructureexamination === true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">Yes</Col>
                    </Row>
                  )}

                  {this.props.programmestructureexamination !== true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">No</Col>
                    </Row>
                  )}
                </td>

                <td id="viewStudySIMProgDetailsData_Exchange">
                  {this.props.overseaopportunityexchange === true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">Yes</Col>
                    </Row>
                  )}

                  {this.props.overseaopportunityexchange !== true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">No</Col>
                    </Row>
                  )}
                </td>

                <td id="viewStudySIMProgDetailsData_Transfer">
                  {this.props.overseaopportunitytransfer === true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">Yes</Col>
                    </Row>
                  )}

                  {this.props.overseaopportunitytransfer !== true && (
                    <Row className="justify-content-center">
                      <Col className="text-left">No</Col>
                    </Row>
                  )}
                </td>

                <td id="viewStudySIMProgDetailsData_IntakeMonth">
                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Full-Time: </b><br/>{this.props.intakemonthsfulltime}</Col>
                  </Row>

                  <br/>

                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Part-Time: </b><br/>{this.props.intakemonthsparttime}</Col>
                  </Row>
                </td>
                
                <td id="viewStudySIMProgDetailsData_Duration">
                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Full-Time: </b><br/>{this.props.durationfulltime}</Col>
                  </Row>

                  <br/>

                  <Row className="justify-content-center">
                    <Col className="text-left"><b>Part-Time: </b><br/>{this.props.durationparttime}</Col>
                  </Row>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </div>
    );
  }
}
