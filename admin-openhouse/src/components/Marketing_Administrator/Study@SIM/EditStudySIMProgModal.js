import React from "react";
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup, Checkbox } from "react-bootstrap";

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/EditStudySIMProgModal.css";


async function savePicture(blobURL, imageName) {
  const pictureRef = storage.ref(`/Universities/`).child(imageName);
  const response = await fetch(blobURL);
  const blob = await response.blob(); //fetch blob object
  const snapshot = await pictureRef.put(blob); //upload
  const url = await snapshot.ref.getDownloadURL(); //url in storage
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

export default class EditStudySIMProgModal extends React.Component {
  state = initialStates;

  constructor(props) {
    super(props);

    this.state = {
      handleSaveChanges: "",
      handleCancelEdit: "",

      disciplinecheckedItems: [this.props.discipline1, this.props.discipline2],
      subdisciplinecheckedItems: [this.props.subdiscipline1, this.props.subdiscipline2, this.props.subdiscipline3, this.props.subdiscipline4, this.props.subdiscipline5],
      Modeofstudy: ['fullTime', 'partTime'],
      entryQualification: ['oLevel', 'aLevel', 'diploma', 'degree'],

      programme: this.props.programmeName,
      university: this.props.University,
      // category: this.props.category,
      academiclevel: this.props.academiclevel,
      logoUrl: this.props.logoUrl,
      url: "",
      parttime: this.props.ModeOfStudy.partTime,
      fulltime: this.props.ModeOfStudy.fullTime,
      diploma: this.props.diploma,
      degree: this.props.degree,
      alevel: this.props.aLevel,
      olevel: this.props.oLevel,

      //details
      aboutprogramme1: this.props.aboutprogramme1,
      aboutprogramme2: this.props.aboutprogramme2,
      aboutprogramme3: this.props.aboutprogramme3,
      applicationperiod1: this.props.applicationperiod1,
      applicationperiod2: this.props.applicationperiod2,
      durationfulltime: this.props.durationfulltime,
      durationparttime: this.props.durationparttime,
      intakemonthsfulltime: this.props.intakemonthsfulltime,
      intakemonthsparttime: this.props.intakemonthsparttime,
      overseaopportunityexchange: this.props.overseaopportunityexchange,
      overseaopportunitytransfer: this.props.overseaopportunitytransfer,
      programmestructurecoursework: this.props.programmestructurecoursework,
      programmestructureexamination: this.props.programmestructureexamination,
      ModeOfStudy: this.props.ModeOfStudy
    };
    this.DisciplinehandleChange = this.DisciplinehandleChange.bind(this);
    this.SubDisciplinehandleChange = this.SubDisciplinehandleChange.bind(this);
  }

  componentDidMount() {
    //Removing the empty strings in filter, otherwise checkbox disabled bug will occur. 
    this.setState(
      {
        disciplinecheckedItems: this.state.disciplinecheckedItems.filter(e => e),
        subdisciplinecheckedItems: this.state.subdisciplinecheckedItems.filter(e => e)
      }
    )

  }

  DisciplinehandleChange(event) {
    var x = document.getElementsByClassName("DisciplineCheckboxes");
    if (event.target.checked) {
      this.setState({
        disciplinecheckedItems: [
          ...this.state.disciplinecheckedItems,
          event.target.value
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
                console.log(x[i].innerText);
              } else {
                this.setState({
                  [x[i].innerText]: true,
                });
                console.log(x[i].innerText);
              }
            }
          }
        }
      );
    } else {
      let remove = this.state.disciplinecheckedItems.indexOf(
        event.target.value
      );

      this.setState({
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
        });
    }
  }

  SubDisciplinehandleChange(event) {
    var x = document.getElementsByClassName("subDisciplineCheckboxes");
    if (event.target.checked) {
      this.setState({
        subdisciplinecheckedItems: [
          ...this.state.subdisciplinecheckedItems,
          event.target.value,
        ],
      },
        () => {
          var dis = this.state.subdisciplinecheckedItems;

          if (this.state.subdisciplinecheckedItems.length >= 5) {
            for (var i = 0; i < x.length; i++) {
              if (Object.values(dis).includes(x[i].innerText)) {
                this.setState({
                  [x[i].innerText]: false,
                });
              } else {
                this.setState({
                  ["sub" + x[i].innerText]: true,
                });
              }
            }
          }
        });
    } else {
      let remove = this.state.subdisciplinecheckedItems.indexOf(event.target.value);

      this.setState({
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
      [e.target.name]: [e.target.value],
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
        degree: e.target.checked
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

  edit = async () => {
    console.log("programme: " + this.state.programme);
    console.log("university: " + this.state.university);
    console.log("logoUrl: " + this.state.logoUrl)
    console.log("academiclevel: " + this.state.academiclevel);

    console.log("FT: " + this.state.fulltime);
    console.log("PT: " + this.state.parttime);
    console.log("alevel: " + this.state.alevel);
    console.log("degree: " + this.state.degree);
    console.log("diploma: " + this.state.diploma);
    console.log("olevel: " + this.state.olevel);
    //-----------------------------------------------------
    console.log("discipline: " + this.state.disciplinecheckedItems);

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
    console.log("subdiscipline: " + this.state.subdisciplinecheckedItems);
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

    console.log("Subdisc1" + subdiscipline1);
    console.log("Subdisc2" + subdiscipline2);
    console.log("Subdisc3" + subdiscipline3);
    console.log("Subdisc4" + subdiscipline4);
    console.log("Subdisc5" + subdiscipline5);

    console.log("aboutprogramme1: " + this.state.aboutprogramme1);
    console.log("aboutprogramme2: " + this.state.aboutprogramme2);
    console.log("aboutprogramme3: " + this.state.aboutprogramme3);
    console.log("applicationperiod1: " + this.state.applicationperiod1);
    console.log("applicationperiod2: " + this.state.applicationperiod2);
    console.log("intakemonthsfulltime: " + this.state.intakemonthsfulltime);

    console.log("intakemonthspartime: " + this.state.intakemonthsparttime);
    console.log("durationfulltime: " + this.state.durationfulltime);
    console.log("durationparttime: " + this.state.durationparttime);

    console.log("overseaopportunityexchange: " + this.state.overseaopportunityexchange);
    console.log("overseaopportunitytransfer: " + this.state.overseaopportunitytransfer);
    console.log("programmestructurecoursework: " + this.state.programmestructurecoursework);
    console.log("programmestructureexaminati: " + this.state.programmestructureexamination);

    const isValid = this.validate();
    var title = "";
    var res = "";
    var extension = "";
    var fileName = "";
    const parentthis = this;

    console.log("props.logoUrl: " + this.props.logoUrl)

    if (this.state.logoUrl.startsWith("blob:")) {
      title = this.props.logoUrl.split(/\%2F(.*?)\?alt/)[1].split(".")[0]
      res = this.props.logoUrl.split("?alt=")[0];
      extension = res.substr(res.length - 4);

      if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
        fileName = title;
        const url = await savePicture(this.state.logoUrl, fileName);
        this.setState({
          url: url
        });
      } else {
        fileName = title + extension;
        const url = await savePicture(this.state.logoUrl, fileName);
        this.setState({
          url: url
        });
      }
    
      if (isValid) {
        this.setState(initialStates);

        const userRef = db.collection("ProgrammesWeb").doc(this.props.docid);
        userRef.update({
          id: this.props.docid,
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
            partTime: parentthis.state.ModeOfStudy.partTime,
            fullTime: parentthis.state.ModeOfStudy.fullTime
          },
          programmeOverview: {
            aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
            aboutProgramme2: parentthis.state.aboutprogramme2.toString(),
            aboutProgramme3: parentthis.state.aboutprogramme3.toString()
          }
        })
        .then(dataSnapshot => {
          this.props.handleSaveChanges();
        });
      }
    } else {
      if (isValid) {
        this.setState(initialStates);

        db.collection("ProgrammesWeb").doc(this.props.docid)
        .update({
          id: this.props.docid,
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
            partTime: parentthis.state.ModeOfStudy.partTime,
            fullTime: parentthis.state.ModeOfStudy.fullTime
          },
          programmeOverview: {
            aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
            aboutProgramme2: parentthis.state.aboutprogramme2.toString(),
            aboutProgramme3: parentthis.state.aboutprogramme3.toString()
          }
        })
        .then(dataSnapshot => {
          this.props.handleSaveChanges();
        });
      }

    }
  }

  handleFileUpload = (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files?.item(0);
      const logoURL = URL.createObjectURL(file);

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

    if (!this.state.university.toString()) {
      universityError = "Please select a valid university!";
    }

    if (!this.state.academiclevel.toString()) {
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
    
    if ((!this.state.aboutprogramme2) && this.state.aboutprogramme3) {
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
          <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
            Edit Programme
          </Modal.Title>
        </Modal.Header>

        <Form noValidate>
          <Modal.Body id="editStudySIMProgModalBody">
            {/* Main Row */}
            <Form.Row className="justify-content-center editStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Programme Name */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <FormControl type="text" name="programme" id="editStudySIMProgForm_ProgName" placeholder="Name of Programme*" defaultValue={this.props.programmeName} onChange={this.handleChange} required />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.progNameError}</div>
                  </Col>
                </Form.Row>

                {/* Logo File */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Logo File:</Form.Label>

                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.File name="logoUrl" id="editStudySIMProgForm_LogoFile" className="editStudySIMProgForm_LogoFile" label={this.props.logoUrl} custom required onChange={this.handleFileUpload} />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.logoUrlError}</div>
                  </Col>
                </Form.Row>

                {/* University */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="university" defaultValue={this.props.University} className="editStudySIMProgFormSelect" required noValidate placeholder="Choose a University" onChange={this.handleChange}>
                        <option value="" className="editStudySIMProgFormSelectOption">Choose a University</option>

                        {this.props.universities && this.props.universities.map((uni, index) => {
                          index = index + 1;
                          return (
                            <option key={index} value={uni} className="editStudySIMProgFormSelectOption">{uni}</option>
                          );
                        })}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.universityError}</div>
                  </Col>
                </Form.Row>

                {/* Academic Level */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="academiclevel" defaultValue={this.props.academiclevel} className="editStudySIMProgFormSelect" required noValidate onChange={this.handleChange}>
                        <option value="" className="editStudySIMProgFormSelectOption">Choose an Academic Level</option>

                        {this.props.academicLvls && this.props.academicLvls.map((AcademicLevel, index) => {
                          index = index + 1;
                          return (
                            <option key={index} value={AcademicLevel} className="editStudySIMProgFormSelectOption">{AcademicLevel}</option>
                          );
                        })}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.academicLevelError}</div>
                  </Col>
                </Form.Row>

                {/* Mode of Study */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                    <Form.Label className="editStudySIMProgFormLabel">Choose Mode of Study:</Form.Label>

                    <Container className="editStudySIMProgForm_MoSCon">
                      <Form.Group>
                        {this.state.Modeofstudy && this.state.Modeofstudy.map((mos, index) => {
                          index = index+1
                          {
                            if (mos == 'fullTime') {
                              return (
                                <Row key={index}>
                                  <Col>
                                    <Form.Check name="fulltime" id={mos} value={mos} type="checkbox" label="Full-Time" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.ModeOfStudy.fullTime} onChange={this.handleChange} />
                                  </Col>
                                </Row>
                              )
                            }
                            else if (mos == 'partTime') {
                              return (
                                <Row key={index}>
                                  <Col>
                                    <Form.Check name="parttime" id={mos} value={mos} type="checkbox" label="Part-Time" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.ModeOfStudy.partTime} onChange={this.handleChange} />
                                  </Col>
                                </Row>
                              )
                            }
                          }
                        })}
                      </Form.Group>
                    </Container>

                    <div className="errorMessage text-left">{this.state.modeOfStudyError}</div>
                  </Col>
                </Form.Row>

                {/* Disciplines */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                    <Form.Label className="editStudySIMProgFormLabel">Choose Discipline(s):</Form.Label>

                    <Container className="editStudySIMProgForm_DisciplineCon">
                      <Form.Group>
                        {this.props.disciplines && this.props.disciplines.map((Discipline, index) => {
                          {
                            index = index + 1;
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Check id={Discipline} name="discipline" value={Discipline} type="checkbox" label={Discipline} className="editStudySIMProgForm_CheckBox DisciplineCheckboxes"
                                    defaultChecked={Discipline == this.props.discipline1 || Discipline == this.props.discipline2 ? true : false}
                                    onChange={this.DisciplinehandleChange} disabled={this.state.disciplinecheckedItems.length == 2 && !this.state.disciplinecheckedItems.includes(Discipline)} />
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
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>

                    <Container className="editStudySIMProgForm_EntryQualCon">
                      {this.state.entryQualification && this.state.entryQualification.map((entry, index) => {
                        index = index + 1
                        {
                          if (entry === "diploma") {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Check name={entry} value={entry} type="checkbox" label="Diploma" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.diploma} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entry === "degree") {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Check name={entry} value={entry} type="checkbox" label="Degree" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.degree} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entry === "aLevel") {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Check name={entry} value={entry} type="checkbox" label="'A' Level" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.aLevel} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entry === "oLevel") {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Check name={entry} value={entry} type="checkbox" label="'O' Level" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.oLevel} onChange={this.handleChange} />
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
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Sub Disciplines */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left editStudySIMProgForm_InnerCol">
                    <Form.Label className="editStudySIMProgFormLabel">Choose Sub-Discipline(s):</Form.Label>

                    <Container className="editStudySIMProgForm_SubDisciplineCon">
                      {this.props.subDisciplines && this.props.subDisciplines.map((subDiscipline, index) => {
                        index = index + 1;
                        return (
                          <Row key={index}>
                            <Col>
                              <Form.Check name={subDiscipline} value={subDiscipline} type="checkbox" label={subDiscipline} className="editStudySIMProgForm_CheckBox subDisciplineCheckboxes"
                                defaultChecked={subDiscipline == this.props.subdiscipline1 || subDiscipline == this.props.subdiscipline2 || subDiscipline == this.props.subdiscipline3 ||
                                  subDiscipline == this.props.subdiscipline4 || subDiscipline == this.props.subdiscipline5 ? true : false}
                                onChange={this.SubDisciplinehandleChange} disabled={this.state.subdisciplinecheckedItems.length == 5 && !this.state.subdisciplinecheckedItems.includes(subDiscipline)} />
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
            <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
              Programme Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Main Row */}
            <Form.Row className="justify-content-center editStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* About Programme */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">About Programme 1</Form.Label>
                    <FormControl as="textarea" name="aboutprogramme1" rows="4" required noValidate className="editStudySIMProgForm_TextArea" placeholder="About Programme 1" defaultValue={this.props.aboutprogramme1} onChange={this.handleChange} />

                    <div className="errorMessage text-left">{this.state.aboutProgError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">About Programme 2</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme2" className="editStudySIMProgForm_TextArea" placeholder="About Programme 2" defaultValue={this.props.aboutprogramme2} onChange={this.handleChange} />
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">About Programme 3</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme3" className="editStudySIMProgForm_TextArea" placeholder="About Programme 3" defaultValue={this.props.aboutprogramme3} onChange={this.handleChange} />
                  </Col>
                </Form.Row>

                {/* Application Period */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Application Period 1</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod1" className="editStudySIMProgForm_TextArea" placeholder="Application Period 1" defaultValue={this.props.applicationperiod1} onChange={this.handleChange} />

                    <div className="errorMessage text-left">{this.state.applicationPeriodError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">Application Period 2</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod2" className="editStudySIMProgForm_TextArea" placeholder="Application Period 2" defaultValue={this.props.applicationperiod2} onChange={this.handleChange} />
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Programme Structure */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Programme Structure</Form.Label>

                    <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                      {/* Coursework */}
                      <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                        <Form.Label className="editStudySIMProgFormLabel">Coursework</Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructurecoursework" value="Coursework" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" onChange={this.handleChange} defaultChecked={this.props.programmestructurecoursework} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Examination */}
                      <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                        <Form.Label className="editStudySIMProgFormLabel">Examination</Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructureexamination" value="Examination" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.programmestructureexamination} onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>
                    </Form.Row>

                  </Col>
                </Form.Row>

                {/* Overseas Opportunity */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Overseas Opportunity</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Exchange */}
                      <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                        <Form.Label className="editStudySIMProgFormLabel">Exchange</Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="overseaopportunityexchange" value="Exchange" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.state.overseaopportunityexchange} onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Transfer */}
                      <Col md="6" className="text-left editStudySIMProgForm_InnerCol">
                        <Form.Label className="editStudySIMProgFormLabel">Transfer</Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="overseaopportunitytransfer" value="Transfer" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.props.overseaopportunitytransfer} onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>
                    </Form.Row>

                  </Col>
                </Form.Row>

                {/* Intake Month(s) */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Intake Month(s)</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Full Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="editStudySIMProgFormLabel">Full-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsfulltime" className="editStudySIMProgForm_TextArea" placeholder="Full-Time" defaultValue={this.props.intakemonthsfulltime} onChange={this.handleChange} />
                      </Col>

                      {/* Part Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsparttime" className="editStudySIMProgForm_TextArea" placeholder="Part-Time" defaultValue={this.props.intakemonthsparttime} onChange={this.handleChange} />
                      </Col>
                    </Form.Row>

                    <div className="errorMessage text-left">{this.state.intakeMonthsError}</div>
                  </Col>
                </Form.Row>

                {/* Duration */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Duration</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Full Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="editStudySIMProgFormLabel">Full-Time</Form.Label>

                        <FormControl as="textarea" rows="3" required noValidate name="durationfulltime" className="editStudySIMProgForm_TextArea" placeholder="Full-Time" defaultValue={this.props.durationfulltime} onChange={this.handleChange} />
                      </Col>

                      {/* Part Time */}
                      <Col md="6" className="text-left">
                        <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label>
                        <FormControl as="textarea" rows="3" required noValidate name="durationparttime" className="editStudySIMProgForm_TextArea" placeholder="Part-Time" defaultValue={this.props.durationparttime} onChange={this.handleChange} />
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
          {/* Edit Programme Talk Save Changes Btn */}
          <Container>
            <Row>
              <Col md="6" className="text-right">
                <Button id="saveChangesEditProgFormBtn" onClick={() => this.edit()}>Save Changes</Button>
              </Col>

              <Col md="6" className="text-left">
                <Button id="cancelEditProgFormBtn" onClick={this.props.handleCancelEdit}>Cancel</Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </div>
    );
  }
}
