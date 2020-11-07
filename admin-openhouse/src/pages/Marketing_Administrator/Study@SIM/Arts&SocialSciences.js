import React, { Component } from "react";
import {db,auth} from "../../../config/firebase";
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
// import EditStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/.testEditStudySIMProgModal";
import EditStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/EditStudySIMProgModal_Clean";
import DeleteStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/DeleteStudySIMProgModal";
import ViewStudySIMProgDetailsModal from "../../../components/Marketing_Administrator/Study@SIM/ViewStudySIMProgDetailsModal";

class StudySIM_ArtsSocialSciences extends Component {
  constructor() {
    super();
    this.state = {
      artsocialscience : [],
      disciplines : [],
      subDiscplines : [],
      universities : [],
      addStudySIMProgModal: false,
      editStudySIMProgModal: false,
      deleteStudySIMProgModal: false,
      viewStudySIMProgDetailsModal: false,
    };
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        var getrole = db
        .collection("Administrators")
        .where("email", "==", user.email);
        getrole.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().administratorType === "Marketing Administrator") {
              this.fetchData();
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

   fetchData = async() => {
    const programmes =[]
      await db.collection("TestProgrammes")
      .where('discipline','array-contains','Arts & Social Sciences')
      .get()
      .then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
          const data = doc.data()
          programmes.push(data)
        })
        this.setState({artsocialscience : programmes})
      })

      const disciplines = []
      await db.collection('Disciplines').get().then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
          const data = doc.data()
          disciplines.push(data.name)
        })
        this.setState({disciplines : disciplines})
      })

      const subDisciplines = []
      await db.collection('SubDisciplines').get().then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
          const data = doc.data()
          subDisciplines.push(data.name)
        })
        this.setState({subDisciplines : subDisciplines})
      })

      const universities = []
      await db.collection('Universities').get().then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
          const data = doc.data()
          universities.push(data.universityName)
        })
        this.setState({universities : universities})
      })
    } 

  /* Add Programme Talk Modal */
  handleAddStudySIMProgModal = () => {
    if (this.state.addStudySIMProgModal == false) {
      this.setState({
        addStudySIMProgModal: true,
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
                      <h4 className="MAStudySIMHeaderText">Programmes for Art & Social Science</h4>
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
                            <th className="studySIMProgHeader_MoS">Mode of Study</th>
                            <th className="studySIMProgHeader_Discipline">Disciplines</th>
                            <th className="studySIMProgHeader_AcademicLvl">Academic Level</th>
                            <th className="studySIMProgHeader_EntryQual">Entry Qualifications</th>
                            <th className="studySIMProgHeader_SubDiscipline">Sub-Disciplines</th>
                            <th className="studySIMProgHeader_Edit">Edit</th>
                            <th className="studySIMProgHeader_Delete">Delete</th>
                          </tr>
                        </thead>
                        
                        {this.state.artsocialscience && this.state.artsocialscience.map((artsocialscience, index) => {
                          index = index + 1;
                          return (
                            <tbody>
                              <tr>
                                <td className="studySIMProgData_SNo text-center">{index}</td>
                                <td className="studySIMProgData_ProgName text-left">
                                  <a className="studySIMProgData_ProgNameLink" onClick={() => 
                                    {
                                      this.setState({programme:artsocialscience})
                                      this.handleViewStudySIMProgDetailsModal();
                                    }}
                                  >
                                    {artsocialscience.programmeTitle}
                                  </a>
                                </td>

                                <td className="studySIMProgData_AwardedBy text-left">{artsocialscience.awardedBy}</td>
                                <td className="studySIMProgData_LogoFile text-left"><img src={artsocialscience.uniLogo}></img></td>
                                <td className="studySIMProgData_MoS text-left">
                                  <tr>
                                  {typeof artsocialscience.modeOfStudy.fullTime !== 'undefined' ? <span> Full Time: {artsocialscience.modeOfStudy.fullTime ? 'Yes' : 'No'}</span>: ''  }
                                  </tr>
                                  <tr>
                                  {typeof artsocialscience.modeOfStudy.partTime !== 'undefined' ? <span> Part Time: {artsocialscience.modeOfStudy.partTime ? 'Yes' : 'No'}</span>: ''  }
                                  </tr>
                                </td>
                                {artsocialscience.discipline.map((discipline)=>{
                                   return(
                                <td className="studySIMProgData_Discipline text-left">{discipline} </td> )})
                                  }
                               

                                <td className="studySIMProgData_AcademicLvl text-left">{artsocialscience.academicLevel}</td>
                                  <td className="studySIMProgData_EntryQual text-left">
                                    <tr>
                                    {typeof artsocialscience.entryQualifications.oLevel !== 'undefined' && artsocialscience.entryQualifications.oLevel ? <span>"O" level </span> : ''} 
                                    </tr>
                                    <tr>
                                    {typeof artsocialscience.entryQualifications.aLevel !== 'undefined' && artsocialscience.entryQualifications.aLevel ? <span>"A" level </span> : ''} 
                                    </tr>
                                    <tr>
                                    {typeof artsocialscience.entryQualifications.aLevel !== 'undefined' && artsocialscience.entryQualifications.diploma ? <span>Diploma </span> : ''} 
                                    </tr>
                                    <tr>
                                    {typeof artsocialscience.entryQualifications.aLevel !== 'undefined' && artsocialscience.entryQualifications.degree ? <span>Degree </span> : ''} 
                                    </tr>
                                  </td>
                                  {artsocialscience.subDiscipline.map((subDisc)=>{
                                    return(<td className="studySIMProgData_SubDiscipline text-left">{subDisc}</td>)
                                  })}
                                  

                                  <td className="studySIMProgData_Edit text-center">
                                    <Button className="editStudySIMProgBtn" onClick={() => {
                                      this.setState({programme:artsocialscience})
                                        this.handleEditStudySIMProgModal();
                                      }}
                                    >
                                      <FontAwesomeIcon size="lg" className="editStudySIMProgBtnIcon" icon={faEdit} />
                                    </Button>
                                  </td>

                                  <td className="studySIMProgData_Delete text-center">
                                    <Button className="deleteStudySIMProgBtn" onClick={() => {
                                      this.setState({
                                          docid: artsocialscience.docid,
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
                          }
                        )}
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
          <AddStudySIMProgModal />
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
            programme = {this.state.programme}
            universities = {this.state.universities}
            disciplines = {this.state.disciplines}
            subDisciplines = {this.state.subDisciplines}
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
          <DeleteStudySIMProgModal docid={this.state.docid} 
            handleConfirmDelete={() => {this.handleDeleteStudySIMProgModal();}}
            handleCancelDelete={this.handleDeleteStudySIMProgModal}
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
          <ViewStudySIMProgDetailsModal programme = {this.state.programme}/>
        </Modal>
      </div>
    );
  }
}

export default StudySIM_ArtsSocialSciences;


