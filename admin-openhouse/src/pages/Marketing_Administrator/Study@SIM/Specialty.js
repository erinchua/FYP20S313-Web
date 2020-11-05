import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";

import "../../../css/Marketing_Administrator/Study@SIM.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";
import AddStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/AddStudySIMProgModal";
import EditStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/EditStudySIMProgModal";
import DeleteStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/DeleteStudySIMProgModal";
import ViewStudySIMProgDetailsModal from "../../../components/Marketing_Administrator/Study@SIM/ViewStudySIMProgDetailsModal";


class StudySIM_Speciality extends Component {
  constructor() {
    super();
    this.state = {
      addStudySIMProgModal: false,
      editStudySIMProgModal: false,
      deleteStudySIMProgModal: false,
      viewStudySIMProgDetailsModal: false,
    };
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();
        var getrole = db
        .collection("Administrators")
        .where("email", "==", user.email);

        getrole.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().administratorType === "Marketing Administrator") {
              this.display();
            } else {
              history.push("/Login");
            }
          });
        });
      } else {
        history.push("/Login");
      }
    });
  }

  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();

    const userRe1 = db.collection("Programmes").onSnapshot((snapshot) => {
      const Specialty = [];
      snapshot.forEach((doc) => {
        const getdiscipline = doc.get("discipline");
        if (
          getdiscipline.disciplineName1 === "Specialty" ||
          getdiscipline.disciplineName2 === "Specialty"
        ) {
          function getKeyByValue(object, value) {
            return Object.keys(object).find((key) => object[key] === value);
          }

          var disciplinepath = "discipline." + getKeyByValue(getdiscipline, "Specialty");

          const data = {
            docid: doc.id,
            programmeName: doc.data().programmeTitle,
            awardBy: doc.data().awardedBy,
            Logofile: doc.data().logoFile,
            CategoryProgramme: doc.data().category,
            ModeOfStudy: doc.data().modeOfStudy,
            discipline1: doc.data().discipline.disciplineName1,
            discipline2: doc.data().discipline.disciplineName2,
            disciplinepath: disciplinepath,
            AcademicLevel: doc.data().academicLevel,
            Qualification: doc.data().entryQualifications,

            subDiscipline: doc.data().subDiscipline,

            aboutprogramme: doc.data().programmeOverview,
            applicationperiod: doc.data().applicationPeriod,
            programmestructure: doc.data().programmeStructure,
            overseaopportunity: doc.data().overseaOpportunity,
            intakemonths: doc.data().intakeMonths,
            duration: doc.data().duration,
          };

          Specialty.push(data);
        }
      });

      this.setState({ Specialty: Specialty });
    });
  }

  /* Add Programme Talk Modal */
  handleAddStudySIMProgModal = () => {
    if (this.state.addStudySIMProgModal == false) {
      this.setState({
        addStudySIMProgModal: true,
        test: "test",
      });
    } else {
      this.setState({
        addStudySIMProgModal: false,
      });
    }
  };

  /* Edit Programme Talk Modal */
  handleEditStudySIMProgModal = () => {
    if (this.state.editStudySIMProgModal == false) {
      this.setState({
        editStudySIMProgModal: true,
      });
    } else {
      this.setState({
        editStudySIMProgModal: false,
      });
    }
  };

  /* Delete Programme Modal */
  handleDeleteStudySIMProgModal = () => {
    if (this.state.deleteStudySIMProgModal == false) {
      this.setState({
        deleteStudySIMProgModal: true,
      });
    } else {
      this.setState({
        deleteStudySIMProgModal: false,
      });
    }
  };

  /* View Programme Details Modal */
  handleViewStudySIMProgDetailsModal = () => {
    if (this.state.viewStudySIMProgDetailsModal == false) {
      this.setState({
        viewStudySIMProgDetailsModal: true,
      });
    } else {
      this.setState({
        viewStudySIMProgDetailsModal: false,
      });
    }
  };


  render() {
    return (
      <div>
        <Container fluid className="MAStudySIMCon">
          <NavBar isMA={true} />

          <Container fluid className="MAStudySIMContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{ paddingRight: "0" }} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="MAStudySIMContentCon">
                  {/* Study@SIM Page Header row */}
                  <Row className="justify-content-center MAStudySIMContentHeaderRow">
                    <Col md="6" className="text-left MAStudySIMContentHeaderCol">
                      <h4 className="MAStudySIMHeaderText">Programmes for Specialty</h4>
                    </Col>

                    <Col md="6" className="text-right MAStudySIMContentHeaderCol">
                      <Button className="addStudySIMProgBtn" onClick={this.handleAddStudySIMProgModal}>
                        <FontAwesomeIcon size="lg" className="addStudySIMProgBtnIcon" icon={faPlus} />
                        <span className="addStudySIMProgBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Table Row */}
                  <Row className="justify-content-center MAStudySIMTableRow">
                    <Col md="12" className="text-center">
                      <Table responsive="sm" hover bordered className="MAStudySIMTable">
                        <thead>
                          <tr>
                            <th className="studySIMProgHeader_SNo">S/N</th>
                            <th className="studySIMProgHeader_ProgName">Programme Name</th>
                            <th className="studySIMProgHeader_AwardedBy">Awarded By</th>
                            <th className="studySIMProgHeader_LogoFile">Logo File</th>
                            <th className="studySIMProgHeader_Category">Category</th>
                            <th className="studySIMProgHeader_MoS">Mode of Study</th>
                            <th className="studySIMProgHeader_Discipline">Disciplines</th>
                            <th className="studySIMProgHeader_AcademicLvl">Academic Level</th>
                            <th className="studySIMProgHeader_EntryQual">Entry Qualifications</th>
                            <th className="studySIMProgHeader_SubDiscipline">Sub-Disciplines</th>
                            <th className="studySIMProgHeader_Edit">Edit</th>
                            <th className="studySIMProgHeader_Delete">Delete</th>
                          </tr>
                        </thead>

                        {this.state.Specialty && this.state.Specialty.map((Specialty, index) => {
                          index = index + 1;
                          return (
                            <tbody>
                              <tr>
                                <td className="studySIMProgData_SNo text-center">{index}</td>
                                <td className="studySIMProgData_ProgName text-left">
                                  <a className="studySIMProgData_ProgNameLink" onClick={() => 
                                    {
                                      this.setState({
                                        programmeName: Specialty.programmeName,
                                        aboutprogramme1: Specialty.aboutprogramme.aboutProgramme1,
                                        aboutprogramme2: Specialty.aboutprogramme.aboutProgramme2,
                                        aboutprogramme3: Specialty.aboutprogramme.aboutProgramme3,
                                        applicationperiod1: Specialty.applicationperiod.period1,
                                        applicationperiod2: Specialty.applicationperiod.period2,
                                        programmestructurecoursework: Specialty.programmestructure.coursework,
                                        programmestructureexamination: Specialty.programmestructure.examination,
                                        overseaopportunityexchange: Specialty.overseaopportunity.exchange,
                                        overseaopportunitytransfer: Specialty.overseaopportunity.transfer,
                                        intakemonthsfulltime: Specialty.intakemonths.fullTime,
                                        intakemonthsparttime: Specialty.intakemonths.partTime,
                                        durationfulltime: Specialty.duration.fullTime,
                                        durationparttime: Specialty.duration.partTime,
                                      });
                                      this.handleViewStudySIMProgDetailsModal();
                                    }}
                                  >
                                    {Specialty.programmeName}
                                  </a>
                                </td>

                                <td className="studySIMProgData_AwardedBy text-left">{Specialty.awardBy}</td>
                                <td className="studySIMProgData_LogoFile text-left">{Specialty.Logofile}</td>
                                <td className="studySIMProgData_Category text-left">{Specialty.CategoryProgramme}</td>
                                <td className="studySIMProgData_MoS text-left">
                                  <tr>
                                    {Specialty.ModeOfStudy.fullTime === true && 
                                      <span>Full-Time</span>
                                    }
                                  </tr>

                                  <tr>
                                    {Specialty.ModeOfStudy.partTime === true && 
                                      <span>Part-Time</span>
                                    }
                                  </tr>
                                </td>

                                <td className="studySIMProgData_Discipline text-left">
                                  <tr>{Specialty.discipline1}</tr>
                                  <tr>{Specialty.discipline2}</tr>
                                </td>

                                <td className="studySIMProgData_AcademicLvl text-left">{Specialty.AcademicLevel}</td>
                                
                                <td className="studySIMProgData_EntryQual text-left">
                                  <tr>
                                    {Specialty.Qualification.aLevel === true && 
                                      <span>"A" level</span>
                                    }
                                  </tr>

                                  <tr>
                                    {Specialty.Qualification.degree === true && 
                                      <span>Degree</span>
                                    }
                                  </tr>

                                  <tr>
                                    {Specialty.Qualification.diploma === true && 
                                      <span>Diploma</span>
                                    }
                                  </tr>

                                  <tr>
                                    {Specialty.Qualification.oLevel === true && 
                                      <span>"O" Level</span>
                                    }
                                  </tr>
                                </td>

                                <td className="studySIMProgData_SubDiscipline text-left">
                                  <tr>{Specialty.subDiscipline.subDisciplineName1}</tr>
                                  <tr>{Specialty.subDiscipline.subDisciplineName2}</tr>
                                  <tr>{Specialty.subDiscipline.subDisciplineName3}</tr>
                                  <tr>{Specialty.subDiscipline.subDisciplineName4}</tr>
                                  <tr>{Specialty.subDiscipline.subDisciplineName5}</tr>
                                </td>

                                <td className="studySIMProgData_Edit text-center">
                                  <Button className="editStudySIMProgBtn" onClick={() => 
                                    {
                                      this.setState({
                                        programmeName: Specialty.programmeName,
                                        University: Specialty.awardBy,
                                        category: Specialty.CategoryProgramme,
                                        ModeOfStudy: Specialty.ModeOfStudy,
                                        discipline1: Specialty.discipline1,
                                        discipline2: Specialty.discipline2,
                                        acadamiclevel: Specialty.AcademicLevel,
                                        olevel: Specialty.Qualification.oLevel,
                                        aLevel: Specialty.Qualification.aLevel,
                                        degree: Specialty.Qualification.degree,
                                        diploma: Specialty.Qualification.diploma,
                                        subdiscipline1: Specialty.subDiscipline.subDisciplineName1,
                                        subdiscipline2: Specialty.subDiscipline.subDisciplineName2,
                                        subdiscipline3: Specialty.subDiscipline.subDisciplineName3,
                                        subdiscipline4: Specialty.subDiscipline.subDisciplineName4,
                                        subdiscipline5: Specialty.subDiscipline.subDisciplineName5,
                                        
                                        //details
                                        aboutprogramme1: Specialty.aboutprogramme.aboutProgramme1,
                                        aboutprogramme2: Specialty.aboutprogramme.aboutProgramme2,
                                        aboutprogramme3: Specialty.aboutprogramme.aboutProgramme3,
                                        applicationperiod1: Specialty.applicationperiod.period1,
                                        applicationperiod2: Specialty.applicationperiod.period2,
                                        programmestructurecoursework: Specialty.programmestructure.coursework,
                                        programmestructureexamination: Specialty.programmestructure.examination,
                                        overseaopportunityexchange: Specialty.overseaopportunity.exchange,
                                        overseaopportunitytransfer: Specialty.overseaopportunity.transfer,
                                        intakemonthsfulltime: Specialty.intakemonths.fullTime,
                                        intakemonthsparttime: Specialty.intakemonths.partTime,
                                        durationfulltime: Specialty.duration.fullTime,
                                        durationparttime: Specialty.duration.partTime,
                                        docid: Specialty.docid,
                                      });
                                      this.handleEditStudySIMProgModal();
                                    }}
                                  >
                                    <FontAwesomeIcon size="lg" className="editStudySIMProgBtnIcon" icon={faEdit} />
                                  </Button>
                                </td>

                                <td className="studySIMProgData_Delete text-center">
                                  <Button className="deleteStudySIMProgBtn" onClick={() => 
                                    {
                                      this.setState({
                                        docid: Specialty.docid,
                                      });
                                      this.handleDeleteStudySIMProgModal();
                                    }}
                                  >
                                    <FontAwesomeIcon size="lg" className="deleteStudySIMProgBtnIcon" icon={faTrashAlt} />
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </Table>
                    </Col>
                  </Row>
                </Container>

              </Col>
            </Row>
          </Container>

          <Footer />
        </Container>

        {/* Add Programme Modal */}
        <Modal
          show={this.state.addStudySIMProgModal}
          onHide={this.handleAddStudySIMProgModal}
          aria-labelledby="addStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="addStudySIMProgModal"
        >
          <AddStudySIMProgModal handleAdd={() => {this.handleAddStudySIMProgModal()}} />
        </Modal>

        {/* Edit Programme Modal */}
        <Modal
          show={this.state.editStudySIMProgModal}
          onHide={this.handleEditStudySIMProgModal}
          aria-labelledby="editStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="editStudySIMProgModal"
        >
          <EditStudySIMProgModal
            docid={this.state.docid}
            programmeName={this.state.programmeName}
            University={this.state.University}
            category={this.state.category}
            ModeOfStudy={this.state.ModeOfStudy}
            discipline1={this.state.discipline1}
            discipline2={this.state.discipline2}
            acadamiclevel={this.state.acadamiclevel}
            olevel={this.state.olevel}
            aLevel={this.state.aLevel}
            degree={this.state.degree}
            diploma={this.state.diploma}
            subdiscipline1={this.state.subdiscipline1}
            subdiscipline2={this.state.subdiscipline2}
            subdiscipline3={this.state.subdiscipline3}
            subdiscipline4={this.state.subdiscipline4}
            subdiscipline5={this.state.subdiscipline5}

            //details
            aboutprogramme1={this.state.aboutprogramme1}
            aboutprogramme2={this.state.aboutprogramme2}
            aboutprogramme3={this.state.aboutprogramme3}
            applicationperiod1={this.state.applicationperiod1}
            applicationperiod2={this.state.applicationperiod2}
            programmestructurecoursework={this.state.programmestructurecoursework}
            programmestructureexamination={this.state.programmestructureexamination}
            overseaopportunityexchange={this.state.overseaopportunityexchange}
            overseaopportunitytransfer={this.state.overseaopportunitytransfer}
            intakemonthsfulltime={this.state.intakemonthsfulltime}
            intakemonthsparttime={this.state.intakemonthsparttime}
            durationfulltime={this.state.durationfulltime}
            durationparttime={this.state.durationparttime}
            
            handleSaveChanges={() => {this.handleEditStudySIMProgModal()}}
            handleCancelEdit={this.handleEditStudySIMProgModal}
          />
        </Modal>

        {/* Delete Programme Talk Modal */}
        <Modal
          show={this.state.deleteStudySIMProgModal}
          onHide={this.handleDeleteStudySIMProgModal}
          aria-labelledby="deleteStudySIMProgModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteStudySIMProgModal docid={this.state.docid} handleConfirmDelete={() => {this.handleDeleteStudySIMProgModal();}} handleCancelDelete={this.handleDeleteStudySIMProgModal}
          />
        </Modal>

        {/* View Programme Details Modal */}
        <Modal
          show={this.state.viewStudySIMProgDetailsModal}
          onHide={this.handleViewStudySIMProgDetailsModal}
          aria-labelledby="viewStudySIMProgDetailsModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
        >
          <ViewStudySIMProgDetailsModal
            programmeName={this.state.programmeName}
            aboutprogramme1={this.state.aboutprogramme1}
            aboutprogramme2={this.state.aboutprogramme2}
            aboutprogramme3={this.state.aboutprogramme3}
            applicationperiod1={this.state.applicationperiod1}
            applicationperiod2={this.state.applicationperiod2}
            programmestructurecoursework={this.state.programmestructurecoursework}
            programmestructureexamination={this.state.programmestructureexamination}
            overseaopportunityexchange={this.state.overseaopportunityexchange}
            overseaopportunitytransfer={this.state.overseaopportunitytransfer}
            intakemonthsfulltime={this.state.intakemonthsfulltime}
            intakemonthsparttime={this.state.intakemonthsparttime}
            durationfulltime={this.state.durationfulltime}
            durationparttime={this.state.durationparttime}
          />
        </Modal>
      </div>
    );
  }
}

export default StudySIM_Speciality;
