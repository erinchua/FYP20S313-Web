import React from "react";
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup } from "react-bootstrap";

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/AddStudySIMProgModal.css";


async function savePicture(blobURL, imageName) {
  const pictureRef = storage.ref(`/Universities/`).child(imageName);
  const response = await fetch(blobURL);
  const blob = await response.blob(); //fetch blob object
  const snapshot = await pictureRef.put(blob); //upload
  const url = await snapshot.ref.getDownloadURL(); //url in storage
  console.log("image URL:", url);
  return url;
}

const initialStates = {
  progNameError: "",
  logoUrlError: "",
  universityError: "",
  academicLevelError: "",
  modeOfStudyError: "",
  disciplineError: "",
  entryQualError: "",
  subDisciplineError: "",
  aboutProgError: "",
  applicationPeriodError: "",
  intakeMonthsError: "",
  durationError: ""
}

export default class AddStudySIMProgModal extends React.Component {
  state = initialStates;

  constructor(props) {
    super(props);

    this.state = {
      docid: "",

      disciplinecheckedItems: [],
      subdisciplinecheckedItems: [],
      entryqualificationcheckedItems: [],
      Modeofstudy: ['fullTime', 'partTime'],
      entryQual: ['oLevel', 'aLevel', 'diploma', 'degree'],

      programme: "",
      university: "",
      academiclevel: "",
      parttime: false,
      fulltime: false,
      diploma: false,
      degree: false,
      alevel: false,
      olevel: false,
      logoUrl: "",

      //details
      aboutprogramme1: "",
      aboutprogramme2: "",
      aboutprogramme3: "",
      applicationperiod1: "",
      applicationperiod2: "",
      durationfulltime: "",
      durationparttime: "",
      intakemonthsfulltime: "",
      intakemonthsparttime: "",
      overseaopportunityexchange: false,
      overseaopportunitytransfer: false,
      programmestructurecoursework: false,
      programmestructureexamination: false,

      // Modal Btn Prop
      handleAdd: ""
    };
    this.DisciplinehandleChange = this.DisciplinehandleChange.bind(this);
    this.SubDisciplinehandleChange = this.SubDisciplinehandleChange.bind(this);
  }


  DisciplinehandleChange(event) {
    var x = document.getElementsByClassName("DisciplineCheckboxes");
    if (event.target.checked) {
      this.setState(
        {
          disciplinecheckedItems: [
            ...this.state.disciplinecheckedItems,
            event.target.value,
          ],
        },
        () => {
          var dis = this.state.disciplinecheckedItems;

          if (this.state.disciplinecheckedItems.length >= 2) {
            for (var i = 0; i < x.length; i++) {
              if (Object.values(dis).includes(x[i].innerText)) {
                this.setState({
                  [x[i].innerText]: false,
                });
              } else {
                this.setState({
                  [x[i].innerText]: true,
                });
              }
            }
          }
        }
      );
    } else {
      let remove = this.state.disciplinecheckedItems.indexOf(event.target.value);

      this.setState(
        {
          disciplinecheckedItems: this.state.disciplinecheckedItems.filter((_, i) => i !== remove)
        },
        () => {
          if (this.state.disciplinecheckedItems.length <= 2) {
            for (var i = 0; i < x.length; i++) {
              this.setState({
                [x[i].innerText]: false,
              });
            }
          }
        }
      );
    }
  }

  SubDisciplinehandleChange(event) {
    var x = document.getElementsByClassName("subDisciplineCheckboxes");
    if (event.target.checked) {
      this.setState(
        {
          subdisciplinecheckedItems: [
            ...this.state.subdisciplinecheckedItems,
            event.target.value
          ],
        },
        () => {
          var dis = this.state.subdisciplinecheckedItems;

          if (this.state.subdisciplinecheckedItems.length >= 5) {
            for (var i = 0; i < x.length; i++) {
              if (Object.values(dis).includes(x[i].innerText)) {
                this.setState({
                  [x[i].innerText]: false
                });
              } else {
                this.setState({
                  ["sub" + x[i].innerText]: true
                });
              }
            }
          }
        }
      );
    } else {
      let remove = this.state.subdisciplinecheckedItems.indexOf(event.target.value);

      this.setState(
        {
          subdisciplinecheckedItems: this.state.subdisciplinecheckedItems.filter((_, i) => i !== remove)
        },
        () => {
          if (this.state.subdisciplinecheckedItems.length <= 5) {
            for (var i = 0; i < x.length; i++) {
              this.setState({
                ["sub" + x[i].innerText]: false,
              });
            }
          }
        }
      );
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: [e.target.value]
    });

    if (e.target.value === "partTime") {
      this.setState({
        parttime: e.target.checked
      });
    }

    if (e.target.value === "fullTime") {
      this.setState({
        fulltime: e.target.checked
      });
    }

    if (e.target.value === "diploma") {
      this.setState({
        diploma: e.target.checked
      });
    }

    if (e.target.value === "degree") {
      this.setState({
        degree: e.target.checked,
      });
    }

    if (e.target.value === "aLevel") {
      this.setState({
        alevel: e.target.checked
      });
    }

    if (e.target.value === "oLevel") {
      this.setState({
        olevel: e.target.checked
      });
    }

    if (e.target.value === "Coursework") {
      this.setState({
        programmestructurecoursework: e.target.checked
      });
    }

    if (e.target.value === "Examination") {
      this.setState({
        programmestructureexamination: e.target.checked
      });
    }

    if (e.target.value === "Exchange") {
      this.setState({
        overseaopportunityexchange: e.target.checked
      });
    }

    if (e.target.value === "Transfer") {
      this.setState({
        overseaopportunitytransfer: e.target.checked
      });
    }
  };


  addProgramme = async () => {
    const isValid = this.validate();

    console.log("programme: " + this.state.programme);
    console.log("university: " + this.state.university);
    console.log("category: " + this.state.category);
    console.log("academiclevel: " + this.state.academiclevel);

    console.log("FT: " + this.state.fulltime);
    console.log("PT: " + this.state.parttime);
    console.log("alevel: " + this.state.alevel);
    console.log("degree: " + this.state.degree);
    console.log("diploma: " + this.state.diploma);
    console.log("olevel: " + this.state.olevel);
    //-----------------------------------------------------

    var discipline = this.state.disciplinecheckedItems;
    var discipline1 = "";
    var discipline2 = "";

    for (var index = 0; index < discipline.length; ++index) {
      if (index === 0) {
        discipline1 = discipline[index];
      }
      if (index === 1) {
        discipline2 = discipline[index];
      }
    }

    console.log(discipline1);
    console.log(discipline2);

    //------------------------------------------------------------------------------

    var subdiscipline = this.state.subdisciplinecheckedItems;
    var subdiscipline1 = "";
    var subdiscipline2 = "";
    var subdiscipline3 = "";
    var subdiscipline4 = "";
    var subdiscipline5 = "";
    for (var index = 0; index < subdiscipline.length; ++index) {
      if (index === 0) {
        subdiscipline1 = subdiscipline[index];
      }
      if (index === 1) {
        subdiscipline2 = subdiscipline[index];
      }
      if (index === 2) {
        subdiscipline3 = subdiscipline[index];
      }
      if (index === 3) {
        subdiscipline4 = subdiscipline[index];
      }
      if (index === 4) {
        subdiscipline5 = subdiscipline[index];
      }
    }

    console.log(subdiscipline1);
    console.log(subdiscipline2);
    console.log(subdiscipline3);
    console.log(subdiscipline4);
    console.log(subdiscipline5);

    console.log("aboutprogramme1: " + this.state.aboutprogramme1);
    console.log("aboutprogramme2: " + this.state.aboutprogramme2);
    console.log("aboutprogramme3: " + this.state.aboutprogramme3);
    console.log("applicationperiod1: " + this.state.applicationperiod1);
    console.log("applicationperiod2: " + this.state.applicationperiod2);
    console.log("intakemonthsfulltime: " + this.state.intakemonthsfulltime);

    console.log("intakemonthspartimetime: " + this.state.intakemonthsparttime);
    console.log("durationfulltime: " + this.state.durationfulltime);
    console.log("durationparttime: " + this.state.durationparttime);

    console.log("overseaopportunityexchange: " + this.state.overseaopportunityexchange);
    console.log("overseaopportunitytransfer: " + this.state.overseaopportunitytransfer);
    console.log("programmestructurecoursework: " + this.state.programmestructurecoursework);
    console.log("programmestructureexamination: " + this.state.programmestructureexamination);

    const parentthis = this;
    var title = "";
    var capsTitle = "";

    if (this.state.logoUrl.startsWith("blob:")) {
      const words = String(this.state.programme).split(" ");
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      capsTitle = words.join(" ");
      title = capsTitle.replace(/\s/g, '');

      const url = await savePicture(this.state.logoUrl, title);
      this.setState({
        url: url
      });
    }

    if (isValid) {
      this.setState(initialStates);

      db.collection("ProgrammesWeb").orderBy("id", "desc").limit(1)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            var docid = "";
            var res = doc.data().id.substring(13, 10);
            var id = parseInt(res);
            id += 1;

            if (id.toString().length == 1) {
              docid = "programme-00" + (id)
              console.log(docid)
            } else if (id.toString().length == 2) {
              docid = "programme-0" + (id)
              console.log(docid)
            } else {
              docid = "programme-" + (id)
              console.log(docid)
            }

            db.collection("ProgrammesWeb")
              .doc(docid)
              .set({
                id: docid,
                entryQualifications: {
                  diploma: parentthis.state.diploma,
                  oLevel: parentthis.state.olevel,
                  degree: parentthis.state.degree,
                  aLevel: parentthis.state.alevel
                },
                subDiscipline: {
                  subDisciplineName1: subdiscipline1,
                  subDisciplineName2: subdiscipline2,
                  subDisciplineName3: subdiscipline3,
                  subDisciplineName4: subdiscipline4,
                  subDisciplineName5: subdiscipline5
                },
                logoUrl: this.state.url,
                discipline: {
                  disciplineName1: discipline1,
                  disciplineName2: discipline2
                },
                programmeStructure: {
                  coursework: parentthis.state.programmestructurecoursework,
                  examination: parentthis.state.programmestructureexamination
                },
                awardedBy: parentthis.state.university.toString(),
                academicLevel: parentthis.state.academiclevel.toString(),
                intakeMonths: {
                  fullTime: parentthis.state.intakemonthsfulltime.toString(),
                  partTime: parentthis.state.intakemonthsparttime.toString()
                },
                duration: {
                  partTime: parentthis.state.durationparttime.toString(),
                  fullTime: parentthis.state.durationfulltime.toString()
                },
                applicationPeriod: {
                  period1: parentthis.state.applicationperiod1.toString(),
                  period2: parentthis.state.applicationperiod2.toString()
                },
                overseaOpportunity: {
                  exchange: parentthis.state.overseaopportunityexchange,
                  transfer: parentthis.state.overseaopportunitytransfer
                },
                programmeTitle: parentthis.state.programme.toString(),
                modeOfStudy: {
                  partTime: parentthis.state.parttime,
                  fullTime: parentthis.state.fulltime
                },
                programmeOverview: {
                  aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
                  aboutProgramme3: parentthis.state.aboutprogramme3.toString(),
                  aboutProgramme2: parentthis.state.aboutprogramme2.toString()
                }
              })
              .then(dataSnapshot => {
                console.log("Added Programme!");
                this.props.handleAdd();
              });

          });
        });
    }
  }

  handleFileUpload = (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files?.item(0);
      const logoURL = URL.createObjectURL(file);

      console.log("Create:", logoURL);
      this.setState({
        logoUrl: logoURL,
      })
    }
  };

  // Handle Checkbox Validations
  handleCheckbox = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }

  //Validations for the Forms in Modals
  validate = () => {
    let progNameError = "";
    let logoUrlError = "";
    let universityError = "";
    let academicLevelError = "";
    let modeOfStudyError = "";
    let disciplineError = "";
    let entryQualError = "";
    let subDisciplineError = "";
    let aboutProgError = "";
    let applicationPeriodError = "";
    let intakeMonthsError = "";
    let durationError = "";

    if (!(String(this.state.programme).length >= 4)) {
      progNameError = "Please enter a valid programme name!";
    }

    if (!this.state.logoUrl) {
      logoUrlError = "Please upload a logo!";
    }

    if (!this.state.university) {
      universityError = "Please select a valid university!";
    }

    if (!this.state.academiclevel) {
      academicLevelError = "Please select a valid academic level!";
    }

    if (this.state.fulltime === false && this.state.parttime === false) {
      modeOfStudyError = "Please select at least 1 mode of study!";
    }

    if (this.state.disciplinecheckedItems.length == 0) {
      disciplineError = "Please select at least 1 discipline!";
    }

    if (this.state.alevel === false && this.state.olevel === false && this.state.diploma === false && this.state.degree === false) {
      entryQualError = "Please select at least 1 entry qualification!";
    }

    if (this.state.subdisciplinecheckedItems.length == 0) {
      subDisciplineError = "Please select at least 1 sub-discipline!";
    }

    if (!this.state.aboutprogramme1.length >= 1) {
      aboutProgError = "Please enter programme details!";
    }

    if (!(this.state.aboutprogramme1 || this.state.aboutprogramme2 || this.state.aboutprogramme3)) {
      aboutProgError = "Please enter programme details!";
    }

    if (!this.state.applicationperiod1.length >= 1) {
      applicationPeriodError = "Please enter application period details!";
    }

    if (!(this.state.applicationperiod1 || this.state.applicationperiod2)) {
      applicationPeriodError = "Please enter application period details!";
    }

    if (!(this.state.intakemonthsfulltime || this.state.intakemonthsparttime)) {
      intakeMonthsError = "Please enter intake month(s) details!";
    }

    if (!(this.state.durationfulltime || this.state.durationparttime)) {
      durationError = "Please enter duration details!";
    }

    if (progNameError || logoUrlError || universityError || academicLevelError || modeOfStudyError || disciplineError || entryQualError
      || subDisciplineError || aboutProgError || applicationPeriodError || intakeMonthsError || durationError) {
      this.setState({
        progNameError, logoUrlError, universityError, academicLevelError, modeOfStudyError, disciplineError, entryQualError, subDisciplineError,
        subDisciplineError, aboutProgError, applicationPeriodError, intakeMonthsError, durationError
      });
      return false;
    }
    return true;
  }


  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
            Add Programme
          </Modal.Title>
        </Modal.Header>

        <Form noValidate>
          <Modal.Body id="addStudySIMProgModalBody">
            {/* Main Row */}
            <Form.Row className="justify-content-center addStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Programme Name */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <FormControl type="text" name="programme" id="addStudySIMProgForm_ProgName" placeholder="Name of Programme*" onChange={this.handleChange} required />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.progNameError}</div>
                  </Col>
                </Form.Row>

                {/* Logo File */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Logo File:</Form.Label>

                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <Form.File name="logoUrl" id="addStudySIMProgForm_LogoFile" className="addStudySIMProgForm_LogoFile" label={this.state.logoUrl} onChange={this.handleFileUpload} custom required />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.logoUrlError}</div>
                  </Col>
                </Form.Row>

                {/* University */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="university" defaultValue="" className="addStudySIMProgFormSelect" required noValidate placeholder="Choose a University" onChange={this.handleChange}>
                        <option value="" className="addStudySIMProgFormSelectOption">Choose a University</option>

                        {this.props.universities && this.props.universities.map((University, index) => {
                          return (
                            <option value={University} className="addStudySIMProgFormSelectOption">{University}</option>
                          );
                        })}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.universityError}</div>
                  </Col>
                </Form.Row>

                {/* Academic Level */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="academiclevel" defaultValue="" className="addStudySIMProgFormSelect" required noValidate onChange={this.handleChange}>
                        <option value="" className="addStudySIMProgFormSelectOption">Choose an Academic Level</option>

                        {this.props.academicLvls && this.props.academicLvls.map((AcademicLevel, index) => {
                          return (
                            <option value={AcademicLevel} className="addStudySIMProgFormSelectOption">{AcademicLevel}</option>
                          );
                        })}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.academicLevelError}</div>
                  </Col>
                </Form.Row>

                {/* Mode of Study */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Mode of Study:</Form.Label>

                    <Container className="addStudySIMProgForm_MoSCon">
                      <Form.Group>
                        {this.state.Modeofstudy && this.state.Modeofstudy.map((Modeofstudy) => {
                          {
                            if (Modeofstudy == "fullTime") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check name="fulltime" id={Modeofstudy} value={Modeofstudy} type="checkbox" label="Full-Time" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                  </Col>
                                </Row>
                              );
                            }

                            if (Modeofstudy == "partTime") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check name="parttime" id={Modeofstudy} value={Modeofstudy} type="checkbox" label="Part-Time" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                  </Col>
                                </Row>
                              );
                            }
                          }
                        })}
                      </Form.Group>
                    </Container>

                    <div className="errorMessage text-left">{this.state.modeOfStudyError}</div>
                  </Col>
                </Form.Row>

                {/* Disciplines */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Discipline(s):</Form.Label>

                    <Container className="addStudySIMProgForm_DisciplineCon">
                      <Form.Group>
                        {this.props.disciplines && this.props.disciplines.map((Discipline) => {
                          {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check id={Discipline} name="discipline" value={Discipline} type="checkbox" label={Discipline} className="addStudySIMProgForm_CheckBox DisciplineCheckboxes" onChange={this.DisciplinehandleChange} disabled={this.state[Discipline]} />
                                </Col>
                              </Row>
                            );
                          }
                        })}
                      </Form.Group>
                    </Container>

                    <div className="errorMessage text-left">{this.state.disciplineError}</div>
                  </Col>
                </Form.Row>

                {/* Entry Qualifications */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>

                    <Container className="addStudySIMProgForm_EntryQualCon">
                      {this.state.entryQual && this.state.entryQual.map((entryQual) => {
                        {
                          if (entryQual === "aLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name="alevel" value={entryQual} type="checkbox" label="&#34;A&#34; Level" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "degree") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name="degree" value={entryQual} type="checkbox" label="Degree" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "diploma") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name="diploma" value={entryQual} type="checkbox" label="Diploma" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "oLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name="olevel" value={entryQual} type="checkbox" label="&#34;O&#34; Level" className="addStudySIMProgForm_CheckBox" onChange={this.handleCheckbox} />
                                </Col>
                              </Row>
                            );
                          }
                        }
                      })}
                    </Container>

                    <div className="errorMessage text-left">{this.state.entryQualError}</div>
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Sub Disciplines */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Sub-Discipline(s):</Form.Label>

                    <Container className="addStudySIMProgForm_SubDisciplineCon">
                      {this.props.subDisciplines && this.props.subDisciplines.map((subDiscipline, index) => {
                        index = index + 1;
                        return (
                          <Row key={index}>
                            <Col>
                              <Form.Check name={subDiscipline} value={subDiscipline} type="checkbox" label={subDiscipline} className="addStudySIMProgForm_CheckBox subDisciplineCheckboxes" onChange={this.SubDisciplinehandleChange} disabled={this.state["sub" + subDiscipline]} />
                            </Col>
                          </Row>
                        );
                      })}
                    </Container>

                    <div className="errorMessage text-left">{this.state.subDisciplineError}</div>
                  </Col>
                </Form.Row>
              </Col>
            </Form.Row>
          </Modal.Body>

          {/* Programme Details Section */}
          <Modal.Header>
            <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
              Programme Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Main Row */}
            <Form.Row className="justify-content-center addStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* About Programme */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 1</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme1" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />

                    <div className="errorMessage text-left">{this.state.aboutProgError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 2</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme2" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 3</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme3" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />
                  </Col>
                </Form.Row>

                {/* Application Period */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Application Period 1</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod1" className="addStudySIMProgForm_TextArea" placeholder="Application Period 1" onChange={this.handleChange} />

                    <div className="errorMessage text-left">{this.state.applicationPeriodError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">Application Period 2</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod2" className="addStudySIMProgForm_TextArea" placeholder="Application Period 2" onChange={this.handleChange} />
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Programme Structure */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Programme Structure</Form.Label>

                    <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                      {/* Coursework */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Coursework</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructurecoursework" value="Coursework" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Examination */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Examination</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructureexamination" value="Examination" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>

                      </Col>
                    </Form.Row>
                  </Col>
                </Form.Row>

                {/* Overseas Opportunity */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Overseas Opportunity</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Exchange */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Exchange</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="overseaopportunityexchange" value="Exchange" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Transfer */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Transfer</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="overseaopportunitytransfer" value="Transfer" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>
                    </Form.Row>

                  </Col>
                </Form.Row>

                {/* Intake Month(s) */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Intake Month(s)</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Full Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="addStudySIMProgFormLabel">Full-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsfulltime" className="addStudySIMProgForm_TextArea" placeholder="Full-Time" onChange={this.handleChange} />
                      </Col>

                      {/* Part Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="addStudySIMProgFormLabel">Part-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsparttime" className="addStudySIMProgForm_TextArea" placeholder="Part-Time" onChange={this.handleChange} />
                      </Col>
                    </Form.Row>

                    <div className="errorMessage text-left">{this.state.intakeMonthsError}</div>
                  </Col>
                </Form.Row>

                {/* Duration */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Duration</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Full Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="addStudySIMProgFormLabel">Full-Time</Form.Label>

                        <FormControl as="textarea" rows="3" required noValidate name="durationfulltime" className="addStudySIMProgForm_TextArea" placeholder="Full-Time" onChange={this.handleChange} />
                      </Col>

                      {/* Part Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="addStudySIMProgFormLabel">Part-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="durationparttime" className="addStudySIMProgForm_TextArea" placeholder="Part-Time" onChange={this.handleChange} />
                      </Col>
                    </Form.Row>

                    <div className="errorMessage text-left">{this.state.durationError}</div>
                  </Col>
                </Form.Row>
              </Col>
            </Form.Row>
          </Modal.Body>
        </Form>

        <Modal.Footer className="justify-content-center">
          {/* Add Programme Submit Btn*/}
          <Button type="submit" id="addStudySIMProgFormBtn" onClick={this.addProgramme}>Submit</Button>
        </Modal.Footer>
      </div>
    );
  }
}
