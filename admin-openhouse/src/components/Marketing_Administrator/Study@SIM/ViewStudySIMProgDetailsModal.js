import React from "react";
import { Modal, Table } from "react-bootstrap";
import "../../../css/Marketing_Administrator/ViewStudySIMProgDetailsModal.css";


export default class ViewStudySIMProgDetailsModal extends React.Component {

  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          {/* To be retrieved from db */}
          <Modal.Title id="viewStudySIMProgDetailsModalTitle" className="w-100">
            {this.props.programme.programmeTitle}
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
                  {this.props.programme.programOverview.split('\n').map((overview)=>{return(<tr><p>{overview}</p></tr>) })}
                </td>

                <td id="viewStudySIMProgDetailsData_ApplicationPeriod">
                  {this.props.programme.applicationPeriod.map((period)=>{return ( 
                  <div><span>Intake: {period.intake}</span> 
                  <br/> 
                  <span>Period: {period.period}</span></div> )})}
                </td>

                <td id="viewStudySIMProgDetailsData_Coursework">
                  {this.props.programme.programmeStructure.coursework? <span>Yes</span> : <span>No</span> }
                </td>

                <td id="viewStudySIMProgDetailsData_Examination">
                  {this.props.programme.programmeStructure.examination? <span>Yes</span> : <span>No</span> }
                </td>

                <td id="viewStudySIMProgDetailsData_Exchange">
                  {this.props.programme.overseaOpportunity.exchange? <span>Yes</span> : <span>No</span> }
                </td>

                <td id="viewStudySIMProgDetailsData_Transfer">
                  {this.props.programme.overseaOpportunity.transfer? <span>Yes</span> : <span>No</span> }
                </td>

                <td id="viewStudySIMProgDetailsData_IntakeMonth">
                <span>Full Time: {this.props.programme.intakeMonths.fullTime}</span>
                  <br/> 
                <span>Part Time: {this.props.programme.intakeMonths.partTime}</span>
                </td>
                
                <td id="viewStudySIMProgDetailsData_Duration">
                <span>Full Time: {this.props.programme.duration.fullTime}</span>
                  <br/> 
                <span>Part Time: {this.props.programme.duration.partTime}</span>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </div>
    );
  }
}
