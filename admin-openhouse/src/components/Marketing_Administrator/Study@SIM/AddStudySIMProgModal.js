import React from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  FormControl,
  Container,
  InputGroup,
} from "react-bootstrap";

import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import "../../../css/Marketing_Administrator/AddStudySIMProgModal.css";

// const validateForm = (errors) => {
//   let valid = true;
//   Object.values(errors).forEach(
//     (val) => val.length > 0 && (valid = false)
//   );
//   return valid;
// }

export default class EditStudySIMProgModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docid: "",
      handleSaveChanges: "",
      handleCancelEdit: "",
      disciplinecheckedItems: [],
      subdisciplinecheckedItems: [],
      entryqualificationcheckedItems: [],
      programme: "",
      university: "",
      category: "",
      acadamiclevel: "",
      parttime: "",
      fulltime: "",
      diploma: "",
      degree: "",
      alevel: "",
      olevel: "",
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
      overseaopportunityexchange: "",
      overseaopportunitytransfer: "",
      programmestructurecoursework: "",
      programmestructureexamination: "",
    };
    this.DisciplinehandleChange = this.DisciplinehandleChange.bind(this);
    this.SubDisciplinehandleChange = this.SubDisciplinehandleChange.bind(this);
  }
  componentDidMount() {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const University = [];
    const Category = [];
    const Modeofstudy = [];
    const Discipline = [];
    const AcademicLevel = [];
    const entryQual = [];
    const subDiscipline = [];
    const subDiscipline2 = [];

    const db = fire.firestore();

    const Universityquery = db
      .collection("Programmes")

      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          University.push(doc.data().awardedBy);
          Category.push(doc.data().category);
          Modeofstudy.push(doc.data().modeOfStudy);
          Discipline.push(doc.data().discipline.disciplineName1);
          Discipline.push(doc.data().discipline.disciplineName2);
          AcademicLevel.push(doc.data().academicLevel);
          entryQual.push(doc.data().entryQualifications);
          subDiscipline.push(doc.data().subDiscipline.subDisciplineName1);
          subDiscipline.push(doc.data().subDiscipline.subDisciplineName2);
          subDiscipline.push(doc.data().subDiscipline.subDisciplineName3);
          subDiscipline.push(doc.data().subDiscipline.subDisciplineName4);
          subDiscipline.push(doc.data().subDiscipline.subDisciplineName5);
          subDiscipline2.push(doc.id);
          subDiscipline2.push(doc.data().discipline);
        });

        //   var unique = University.filter(onlyUnique);
        var uniqueUniversity = University.filter(onlyUnique);
        var uniqueCategory = Category.filter(onlyUnique);
        var uniqueDiscipline = Discipline.filter(onlyUnique);
        var uniqueAcademicLevel = AcademicLevel.filter(onlyUnique);
        var uniquesubDiscipline = subDiscipline.filter(onlyUnique);

        let uniqueentryQuals = Object.keys(Object.assign({}, ...entryQual));
        let uniqueModeofstudy = Object.keys(Object.assign({}, ...Modeofstudy));
        console.log(uniqueModeofstudy);
        //remove unfined
        uniqueUniversity = uniqueUniversity.filter((val) => val !== undefined);
        uniqueUniversity = uniqueUniversity.filter((val) => val !== "");
        uniqueCategory = uniqueCategory.filter((val) => val !== undefined);
        uniqueCategory = uniqueCategory.filter((val) => val !== "");

        uniqueDiscipline = uniqueDiscipline.filter((val) => val !== undefined);
        uniqueDiscipline = uniqueDiscipline.filter((val) => val !== "");
        uniqueAcademicLevel = uniqueAcademicLevel.filter(
          (val) => val !== undefined
        );
        uniqueAcademicLevel = uniqueAcademicLevel.filter((val) => val !== "");

        uniquesubDiscipline = uniquesubDiscipline.filter(
          (val) => val !== undefined
        );
        uniquesubDiscipline = uniquesubDiscipline.filter((val) => val !== "");
        this.setState({
          University: uniqueUniversity,
          Category: uniqueCategory,
          Modeofstudy: uniqueModeofstudy,
          Discipline: uniqueDiscipline,
          AcademicLevel: uniqueAcademicLevel,
          entryQual: uniqueentryQuals,
          subDiscipline: uniquesubDiscipline,
        });
      });
  }
  /* Edit Programme Modal Validations */
  // handleChange = (e) => {
  //     e.preventDefault();
  //     const { name, value } = e.target;

  //     let errors = this.state.errors;

  //     switch (name) {
  //         case 'programmeTalkName':
  //             errors.programmeTalkName = value.length == 0
  //                 ? 'Please enter a valid programme talk name!'
  //                 : '';
  //             break;

  //         case 'email':
  //             errors.email = value.length < 1
  //                 ? ''
  //                 : 'Please enter a valid email!';
  //             break;

  //         default:
  //             break;
  //     }

  //     this.setState({errors, [e.target.name]: e.target.value}, ()=> {
  //         console.log(errors)
  //     })

  // }
  DisciplinehandleChange(event) {
    //console.log(event.target.checked);
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
          // console.log(this.state.disciplinecheckedItems);

          var dis = this.state.disciplinecheckedItems;

          if (this.state.disciplinecheckedItems.length >= 2) {
            //console.log(x);
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
      let remove = this.state.disciplinecheckedItems.indexOf(
        event.target.value
      );

      this.setState(
        {
          disciplinecheckedItems: this.state.disciplinecheckedItems.filter(
            (_, i) => i !== remove
          ),
        },
        () => {
          // console.log(this.state.disciplinecheckedItems);
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
            event.target.value,
          ],
        },
        () => {
          //console.log(this.state.subdisciplinecheckedItems);

          var dis = this.state.subdisciplinecheckedItems;

          if (this.state.subdisciplinecheckedItems.length >= 5) {
            // console.log(x);
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
        }
      );
    } else {
      let remove = this.state.subdisciplinecheckedItems.indexOf(
        event.target.value
      );

      this.setState(
        {
          subdisciplinecheckedItems: this.state.subdisciplinecheckedItems.filter(
            (_, i) => i !== remove
          ),
        },
        () => {
          //console.log(this.state.subdisciplinecheckedItems);
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
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({
      [e.target.name]: [e.target.value],
    });
    if (e.target.value === "partTime") {
      this.setState({
        parttime: e.target.checked,
      });
    }

    if (e.target.value === "fullTime") {
      this.setState({
        fulltime: e.target.checked,
      });
    }

    if (e.target.value === "diploma") {
      this.setState({
        diploma: e.target.checked,
      });
    }

    if (e.target.value === "degree") {
      this.setState({
        degree: e.target.checked,
      });
    }

    if (e.target.value === "aLevel") {
      this.setState({
        alevel: e.target.checked,
      });
    }

    if (e.target.value === "oLevel") {
      this.setState({
        olevel: e.target.checked,
      });
    }

    if (e.target.value === "Coursework") {
      this.setState({
        programmestructurecoursework: e.target.checked,
      });
    }
    if (e.target.value === "Examination") {
      this.setState({
        programmestructureexamination: e.target.checked,
      });
    }
    if (e.target.value === "Exchange") {
      this.setState({
        overseaopportunityexchange: e.target.checked,
      });
    }
    if (e.target.value === "Transfer") {
      this.setState({
        overseaopportunitytransfer: e.target.checked,
      });
    }
  };
  test() {
    var a = this;
    const db = fire.firestore();

    var lastdoc = db
      .collection("Programmes")
      .orderBy("id", "desc")
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var docid = "";

          var res = doc.data().id.substring(10);
          var id = parseInt(res);
          if (id.toString().length <= 1) {
            docid = "programme-00" + (id + 1);
          } else if (id.toString().length <= 2) {
            docid = "programme-0" + (id + 1);
          } else {
            docid = "programme-" + (id + 1);
          }
          this.setState(
            {
              docid: docid,
            },
            () => {
              this.add();
              console.log(this.state.docid);
            }
          );
        });
      });
  }

  add() {
    console.log(this.state.id);
    console.log("programme: " + this.state.programme);
    console.log("university: " + this.state.university);
    console.log("category: " + this.state.category);
    console.log("acadamiclevel: " + this.state.acadamiclevel);

    console.log("PT: " + this.state.parttime);
    console.log("FT: " + this.state.fulltime);
    console.log("alevel: " + this.state.alevel);
    console.log("degree: " + this.state.degree);
    console.log("diploma: " + this.state.diploma);
    console.log("olevel: " + this.state.olevel);
    //-----------------------------------------------------
    //console.log("discipline: " + this.state.disciplinecheckedItems);

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
    //console.log("subdiscipline: " + this.state.subdisciplinecheckedItems);
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

    console.log(
      "overseaopportunityexchange: " + this.state.overseaopportunityexchange
    );
    console.log(
      "overseaopportunitytransfer: " + this.state.overseaopportunitytransfer
    );
    console.log(
      "programmestructurecoursework: " + this.state.programmestructurecoursework
    );
    console.log(
      "programmestructureexaminati: " + this.state.programmestructureexamination
    );
    const parentthis = this;
    const db = fire.firestore();
    if (this.state.files !== undefined) {
      const foldername = "Universities";
      const file = this.state.files[0];
      const storageRef = fire.storage().ref(foldername);
      const fileRef = storageRef.child(file.name).put(file);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log(downloadURL);
          const userRef = db
            .collection("Programmes")
            .doc(parentthis.state.docid);
          userRef.set({
            id: parentthis.state.docid,
            entryQualifications: {
              diploma: parentthis.state.diploma,
              oLevel: parentthis.state.olevel,
              degree: parentthis.state.degree,
              aLevel: parentthis.state.alevel,
            },
            subDiscipline: {
              subDisciplineName1: subdiscipline1,
              subDisciplineName2: subdiscipline2,
              subDisciplineName3: subdiscipline3,
              subDisciplineName4: subdiscipline4,
              subDisciplineName5: subdiscipline5,
            },
            logoFile: downloadURL,
            discipline: {
              disciplineName1: discipline1,
              disciplineName2: discipline2,
            },
            programmeStructure: {
              coursework: parentthis.state.programmestructurecoursework,
              examination: parentthis.state.programmestructureexamination,
            },
            awardedBy: parentthis.state.university.toString(),
            academicLevel: parentthis.state.acadamiclevel.toString(),
            intakeMonths: {
              fullTime: parentthis.state.intakemonthsfulltime.toString(),
              partTime: parentthis.state.intakemonthsparttime.toString(),
            },
            duration: {
              partTime: parentthis.state.durationparttime.toString(),
              fullTime: parentthis.state.durationfulltime.toString(),
            },
            applicationPeriod: {
              period1: parentthis.state.applicationperiod1.toString(),
              period2: parentthis.state.applicationperiod2.toString(),
            },
            overseaOpportunity: {
              exchange: parentthis.state.overseaopportunityexchange,
              transfer: parentthis.state.overseaopportunitytransfer,
            },
            programmeTitle: parentthis.state.programme.toString(),
            modeOfStudy: {
              partTime: parentthis.state.parttime,
              fullTime: parentthis.state.fulltime,
            },
            category: parentthis.state.category.toString(),
            programmeOverview: {
              aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
              aboutProgramme3: parentthis.state.aboutprogramme3.toString(),
              aboutProgramme2: parentthis.state.aboutprogramme2.toString(),
            },
          });
        });

        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (progress != "100") {
          parentthis.setState({ progress: progress });
        } else {
          parentthis.setState({ progress: "Uploaded!" });
        }
      });
    } else {
      const userRef = db.collection("Programmes").doc(this.state.docid);
      userRef.set({
        id: this.state.docid,
        entryQualifications: {
          diploma: parentthis.state.diploma,
          oLevel: parentthis.state.olevel,
          degree: parentthis.state.degree,
          aLevel: parentthis.state.alevel,
        },
        subDiscipline: {
          subDisciplineName1: subdiscipline1,
          subDisciplineName2: subdiscipline2,
          subDisciplineName3: subdiscipline3,
          subDisciplineName4: subdiscipline4,
          subDisciplineName5: subdiscipline5,
        },
        //"logoFile":downloadURL,
        discipline: {
          disciplineName1: discipline1,
          disciplineName2: discipline2,
        },
        programmeStructure: {
          coursework: parentthis.state.programmestructurecoursework,
          examination: parentthis.state.programmestructureexamination,
        },
        awardedBy: parentthis.state.university.toString(),
        academicLevel: parentthis.state.acadamiclevel.toString(),
        intakeMonths: {
          fullTime: parentthis.state.intakemonthsfulltime.toString(),
          partTime: parentthis.state.intakemonthsparttime.toString(),
        },
        duration: {
          partTime: parentthis.state.durationparttime.toString(),
          fullTime: parentthis.state.durationfulltime.toString(),
        },
        applicationPeriod: {
          period1: parentthis.state.applicationperiod1.toString(),
          period2: parentthis.state.applicationperiod2.toString(),
        },
        overseaOpportunity: {
          exchange: parentthis.state.overseaopportunityexchange,
          transfer: parentthis.state.overseaopportunitytransfer,
        },
        programmeTitle: parentthis.state.programme.toString(),
        modeOfStudy: {
          partTime: parentthis.state.parttime,
          fullTime: parentthis.state.fulltime,
        },
        category: parentthis.state.category.toString(),
        programmeOverview: {
          aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
          aboutProgramme3: parentthis.state.aboutprogramme3.toString(),
          aboutProgramme2: parentthis.state.aboutprogramme2.toString(),
        },
      });
    }
  }
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };
  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title id="editStudySIMProgModalTitle" className="w-100">
            Add Programme
          </Modal.Title>
        </Modal.Header>

        <Form noValidate>
          {/* Need to add onSubmit later */}
          <Modal.Body id="editStudySIMProgModalBody">
            {/* Main Row */}
            <Form.Row className="justify-content-center editStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Programme Name */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <FormControl
                        type="text"
                        name="programme"
                        id="editStudySIMProgForm_ProgName"
                        placeholder="Name of Programme*"
                        onChange={this.handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                </Form.Row>

                {/* Logo File */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <FormControl
                        type="file"
                        name="logoFile"
                        id="editStudySIMProgForm_LogoFile"
                        label="Logo File*"
                        custom
                        required
                        onChange={(e) => {
                          this.handleFileUpload(e.target.files);
                        }}
                      />
                    </InputGroup>
                  </Col>
                </Form.Row>

                {/* University */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control
                        as="select"
                        name="university"
                        defaultValue=""
                        className="editStudySIMProgFormSelect"
                        required
                        noValidate
                        placeholder="Choose a University"
                        onChange={this.handleChange}
                      >
                        <option
                          value=""
                          className="editStudySIMProgFormSelectOption"
                          disabled={true}
                        >
                          Choose a University
                        </option>

                        {/* To be retrieved from DB */}
                        {this.state.University &&
                          this.state.University.map((University, index) => {
                            return (
                              <option
                                value={University}
                                className="editStudySIMProgFormSelectOption"
                              >
                                {University}
                              </option>
                            );
                          })}
                      </Form.Control>
                    </InputGroup>
                  </Col>
                </Form.Row>

                {/* Category */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control
                        as="select"
                        name="category"
                        defaultValue=""
                        className="editStudySIMProgFormSelect"
                        required
                        noValidate
                        placeholder="Choose a Category"
                        onChange={this.handleChange}
                      >
                        <option
                          value=""
                          className="editStudySIMProgFormSelectOption"
                          disabled={true}
                        >
                          Choose a Category
                        </option>

                        {/* To be retrieved from DB */}
                        {this.state.Category &&
                          this.state.Category.map((Category, index) => {
                            return (
                              <option
                                value={Category}
                                className="editStudySIMProgFormSelectOption"
                              >
                                {Category}
                              </option>
                            );
                          })}
                      </Form.Control>
                    </InputGroup>
                  </Col>
                </Form.Row>

                {/* Academic Level */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control
                        as="select"
                        name="acadamiclevel"
                        defaultValue=""
                        className="editStudySIMProgFormSelect"
                        required
                        noValidate
                        onChange={this.handleChange}
                      >
                        <option
                          value=""
                          className="editStudySIMProgFormSelectOption"
                          disabled={true}
                        >
                          Choose an Academic Level
                        </option>

                        {/* To be retrieved from DB */}
                        {this.state.AcademicLevel &&
                          this.state.AcademicLevel.map(
                            (AcademicLevel, index) => {
                              if (AcademicLevel === this.props.acadamiclevel) {
                                return (
                                  <option
                                    value={AcademicLevel}
                                    className="editStudySIMProgFormSelectOption"
                                    selected
                                  >
                                    {AcademicLevel}
                                  </option>
                                );
                              } else {
                                return (
                                  <option
                                    value={AcademicLevel}
                                    className="editStudySIMProgFormSelectOption"
                                  >
                                    {AcademicLevel}
                                  </option>
                                );
                              }
                            }
                          )}
                      </Form.Control>
                    </InputGroup>
                  </Col>
                </Form.Row>

                {/* Mode of Study */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col
                    md="9"
                    className="text-left editStudySIMProgForm_InnerCol"
                  >
                    <Form.Label>Choose Mode of Study:</Form.Label>

                    <Container className="editStudySIMProgForm_MoSCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      <Form.Group controlId="exampleForm.ControlInput1">
                        {this.state.Modeofstudy &&
                          this.state.Modeofstudy.map((Modeofstudy) => {
                            {
                              if (Modeofstudy == "fullTime") {
                                return (
                                  <Row>
                                    <Col>
                                      <Form.Check
                                        name="ModeOfStudy"
                                        id={Modeofstudy}
                                        value={Modeofstudy}
                                        type="checkbox"
                                        label="Full-Time"
                                        className="editStudySIMProgForm_CheckBox"
                                        onChange={this.handleChange}
                                      />
                                    </Col>
                                  </Row>
                                );
                              }
                              if (Modeofstudy == "partTime") {
                                return (
                                  <Row>
                                    <Col>
                                      <Form.Check
                                        name="ModeOfStudy"
                                        id={Modeofstudy}
                                        value={Modeofstudy}
                                        type="checkbox"
                                        label="Part-Time"
                                        className="editStudySIMProgForm_CheckBox"
                                        onChange={this.handleChange}
                                      />
                                    </Col>
                                  </Row>
                                );
                              }
                            }
                          })}
                      </Form.Group>
                    </Container>
                  </Col>
                </Form.Row>

                {/* Disciplines */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col
                    md="9"
                    className="text-left editStudySIMProgForm_InnerCol"
                  >
                    <Form.Label>Choose Discipline(s):</Form.Label>

                    <Container className="editStudySIMProgForm_DisciplineCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      <Form.Group controlId="exampleForm.ControlInput1">
                        {this.state.Discipline &&
                          this.state.Discipline.map((Discipline) => {
                            {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check
                                      id={Discipline}
                                      name="entryqualification"
                                      value={Discipline}
                                      type="checkbox"
                                      label={Discipline}
                                      className="editStudySIMProgForm_CheckBox DisciplineCheckboxes"
                                      onChange={this.DisciplinehandleChange}
                                      disabled={this.state[Discipline]}
                                    />
                                  </Col>
                                </Row>
                              );
                            }
                          })}
                      </Form.Group>
                    </Container>
                  </Col>
                </Form.Row>

                {/* Entry Qualifications */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Choose Entry Qualification(s):
                    </Form.Label>

                    <Container className="editStudySIMProgForm_CheckBoxCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      {this.state.entryQual &&
                        this.state.entryQual.map((entryQual) => {
                          {
                            if (entryQual === "aLevel") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check
                                      name={entryQual}
                                      value={entryQual}
                                      type="checkbox"
                                      label="'A' Level"
                                      className="editStudySIMProgForm_CheckBox"
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                </Row>
                              );
                            }
                            if (entryQual === "degree") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check
                                      name={entryQual}
                                      value={entryQual}
                                      type="checkbox"
                                      label="Degree"
                                      className="editStudySIMProgForm_CheckBox"
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                </Row>
                              );
                            }
                            if (entryQual === "diploma") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check
                                      name={entryQual}
                                      value={entryQual}
                                      type="checkbox"
                                      label="Diploma"
                                      className="editStudySIMProgForm_CheckBox"
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                </Row>
                              );
                            }
                            if (entryQual === "oLevel") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check
                                      name={entryQual}
                                      value={entryQual}
                                      type="checkbox"
                                      label="'O' Level"
                                      className="editStudySIMProgForm_CheckBox"
                                      onChange={this.handleChange}
                                    />
                                  </Col>
                                </Row>
                              );
                            }
                          }
                        })}
                    </Container>
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Sub Disciplines */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col
                    md="9"
                    className="text-left addStudySIMProgForm_InnerCol"
                  >
                    <Form.Label className="addStudySIMProgFormLabel">
                      Choose Sub-Discipline(s):
                    </Form.Label>

                    <Container className="addStudySIMProgForm_SubDisciplineCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      {this.state.subDiscipline &&
                        this.state.subDiscipline.map((subDiscipline, index) => {
                          index = index + 1;
                          return (
                            <Row>
                              <Col>
                                <Form.Check
                                  name={subDiscipline}
                                  value={subDiscipline}
                                  type="checkbox"
                                  label={subDiscipline}
                                  className="editStudySIMProgForm_CheckBox subDisciplineCheckboxes"
                                  onChange={this.SubDisciplinehandleChange}
                                  disabled={this.state["sub" + subDiscipline]}
                                />
                              </Col>
                            </Row>
                          );
                        })}
                    </Container>
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
                    <Form.Label className="editStudySIMProgFormLabel">
                      About Programme 1
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      name="aboutprogramme1"
                      rows="4"
                      required
                      noValidate
                      className="editStudySIMProgForm_TextArea"
                      placeholder="About Programme"
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      About Programme 2
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="aboutprogramme2"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="About Programme"
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      About Programme 3
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="aboutprogramme3"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="About Programme"
                      onChange={this.handleChange}
                    />
                  </Col>
                </Form.Row>

                {/* Application Period */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Application Period 1
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="applicationperiod1"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Application Period"
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Application Period 2
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="applicationperiod2"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Application Period"
                      onChange={this.handleChange}
                    />
                  </Col>
                </Form.Row>

                {/* Programme Structure */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Programme Structure
                    </Form.Label>

                    <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                      {/* Coursework */}
                      <Col
                        md="6"
                        className="text-left editStudySIMProgForm_InnerCol"
                      >
                        <Form.Label className="editStudySIMProgFormLabel">
                          Coursework
                        </Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          {/* To be retrieved from db - row is generated dynamically */}
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check
                                name="programmestructurecoursework"
                                value="Coursework"
                                type="checkbox"
                                label="Yes"
                                className="editStudySIMProgForm_CheckBox"
                                onChange={this.handleChange}
                              />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Examination */}
                      <Col
                        md="6"
                        className="text-left editStudySIMProgForm_InnerCol"
                      >
                        <Form.Label className="editStudySIMProgFormLabel">
                          Examination
                        </Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          {/* To be retrieved from db - row is generated dynamically */}
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check
                                name="programmestructureexamination"
                                value="Examination"
                                type="checkbox"
                                label="Yes"
                                className="editStudySIMProgForm_CheckBox"
                                onChange={this.handleChange}
                              />
                            </Col>
                          </Row>
                        </Container>
                      </Col>
                    </Form.Row>
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="editStudySIMProgFormCol text-center">
                {/* Overseas Opportunity */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Overseas Opportunity
                    </Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Exchange */}
                      <Col
                        md="6"
                        className="text-left editStudySIMProgForm_InnerCol"
                      >
                        <Form.Label className="editStudySIMProgFormLabel">
                          Exchange
                        </Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          {/* To be retrieved from db - row is generated dynamically */}
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check
                                name="exchange"
                                value="Exchange"
                                type="checkbox"
                                label="Yes"
                                className="editStudySIMProgForm_CheckBox"
                                onChange={this.handleChange}
                              />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Transfer */}
                      <Col
                        md="6"
                        className="text-left editStudySIMProgForm_InnerCol"
                      >
                        <Form.Label className="editStudySIMProgFormLabel">
                          Transfer
                        </Form.Label>

                        <Container className="editStudySIMProgForm_StructureOverseasCon">
                          {/* To be retrieved from db - row is generated dynamically */}
                          <Row>
                            <Col style={{ paddingLeft: "8%" }}>
                              <Form.Check
                                name="transfer"
                                value="Transfer"
                                type="checkbox"
                                label="Yes"
                                className="editStudySIMProgForm_CheckBox"
                                onChange={this.handleChange}
                              />
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
                    <Form.Label className="editStudySIMProgFormLabel">
                      Full-Time Intake Month(s)
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="intakemonthsfulltime"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Intake Month(s)"
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Part-Time Intake Month(s)
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="intakemonthsparttime"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Intake Month(s)"
                      onChange={this.handleChange}
                    />
                  </Col>
                </Form.Row>

                {/* Duration */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Full-Time Duration
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="durationfulltime"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Duration"
                      onChange={this.handleChange}
                    />
                  </Col>

                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">
                      Part-Time Duration
                    </Form.Label>

                    <FormControl
                      as="textarea"
                      rows="4"
                      required
                      noValidate
                      name="durationparttime"
                      className="editStudySIMProgForm_TextArea"
                      placeholder="Duration"
                      onChange={this.handleChange}
                    />
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
                {/*  <Button
                  id="saveChangesEditProgFormBtn"
                  onClick={this.props.handleSaveChanges}
                >
                  Save Changes
              </Button>*/}
              </Col>
              <Button
                id="saveChangesEditProgFormBtn"
                onClick={() => this.test()}
              >
                Save Changes
              </Button>
              <Col md="6" className="text-left">
                <Button
                  id="cancelEditProgFormBtn"
                  onClick={this.props.handleCancelEdit}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </div>
    );
  }
}
