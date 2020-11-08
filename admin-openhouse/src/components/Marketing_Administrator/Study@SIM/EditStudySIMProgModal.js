import React from "react";
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup, Checkbox } from "react-bootstrap";

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/EditStudySIMProgModal.css";


const initialStates = {
  progNameError: "",
  logoFileError: "",
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
      disciplinecheckedItems: [],
      subdisciplinecheckedItems: [],

      programme: this.props.programmeName,
      university: this.props.University,
      category: this.props.category,
      academiclevel: this.props.academiclevel,
      parttime: "",
      fulltime: "",
      diploma: "",
      degree: "",
      alevel: "",
      olevel: "",

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
    const entryqualification = [];
    const subDiscipline = [];

    //set modeofstudy value into Modeofstudy array
    if (this.props.ModeOfStudy.partTime === true) {
      const data = {
        ModeOfStudy: "Part-Time",
        checked: true,
      };

      this.setState({
        parttime: true,
      });
      Modeofstudy.push(data);
    } else {
      const data = {
        ModeOfStudy: "Part-Time",
        checked: false,
      };
      this.setState({
        parttime: false,
      });
      Modeofstudy.push(data);
    }

    if (this.props.ModeOfStudy.fullTime === true) {
      const data = {
        ModeOfStudy: "Full-Time",
        checked: true,
      };
      Modeofstudy.push(data);
      this.setState({
        fulltime: true,
      });
    } else {
      const data = {
        ModeOfStudy: "Full-Time",
        checked: false,
      };
      this.setState({
        fulltime: false,
      });
      Modeofstudy.push(data);
    }

    //set entryqualification value into entryqualification array
    if (this.props.diploma === true) {
      const data = {
        entryqualification: "diploma",
        checked: true,
      };
      this.setState({
        diploma: true,
      });
      entryqualification.push(data);
    } else {
      const data = {
        entryqualification: "diploma",
        checked: false,
      };
      this.setState({
        diploma: false,
      });
      entryqualification.push(data);
    }

    if (this.props.degree === true) {
      const data = {
        entryqualification: "degree",
        checked: true,
      };
      this.setState({
        degree: true,
      });
      entryqualification.push(data);
    } else {
      const data = {
        entryqualification: "degree",
        checked: false,
      };
      this.setState({
        degree: false,
      });
      entryqualification.push(data);
    }

    if (this.props.aLevel === true) {
      const data = {
        entryqualification: "aLevel",
        checked: true,
      };
      this.setState({
        alevel: true,
      });
      entryqualification.push(data);
    } else {
      const data = {
        entryqualification: "aLevel",
        checked: false,
      };
      this.setState({
        alevel: false,
      });
      entryqualification.push(data);
    }

    if (this.props.olevel === true) {
      const data = {
        entryqualification: "oLevel",
        checked: true,
      };
      this.setState({
        olevel: true,
      });
      entryqualification.push(data);
    } else {
      const data = {
        entryqualification: "oLevel",
        checked: false,
      };
      this.setState({
        olevel: false,
      });
      entryqualification.push(data);
    }
    //console.log(entryqualification);

    const Universityquery = db
    .collection("Programmes")
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        University.push(doc.data().awardedBy);
        Category.push(doc.data().category);

        //Modeofstudy.push(doc.data().modeOfStudy);
        Discipline.push(doc.data().discipline.disciplineName1);
        Discipline.push(doc.data().discipline.disciplineName2);
        AcademicLevel.push(doc.data().academicLevel);

        //entryqualification.push(doc.data().entryqualificationifications);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName1);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName2);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName3);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName4);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName5);
      });

      //   var unique = University.filter(onlyUnique);
      var uniqueUniversity = University.filter(onlyUnique);
      var uniqueCategory = Category.filter(onlyUnique);
      var uniqueDiscipline = Discipline.filter(onlyUnique);
      var uniqueAcademicLevel = AcademicLevel.filter(onlyUnique);
      var uniquesubDiscipline = subDiscipline.filter(onlyUnique);

      //remove unfined and ""
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
      uniqueDiscipline.sort();
      uniquesubDiscipline.sort();
      var newuniquesubDiscipline = [];
      var newuniqueDiscipline = [];

      // get uniquediscipline across 5 fields in db
      for (var i = 0; i < uniqueDiscipline.length; i++) {
        if (
          uniqueDiscipline[i] === this.props.discipline1 ||
          uniqueDiscipline[i] === this.props.discipline2
        ) {
          //ensure that uniquediscipline that is on db is checked that is used for display
          const data = {
            Name: uniqueDiscipline[i],
            checked: true,
          };
          //store uniquediscipline that already exist in db
          this.setState({
              disciplinecheckedItems: [
                ...this.state.disciplinecheckedItems,
                uniqueDiscipline[i],
              ],
            },
            () => {}
          );
          newuniqueDiscipline.push(data);
        }
        // ensure that uniquediscipline that is not on db is unchecked that is used for display
        else {
          const data = {
            Name: uniqueDiscipline[i],
            checked: false,
          };
          newuniqueDiscipline.push(data);
        }
      }
      //console.log(newuniqueDiscipline);

      // get uniquesubdiscipline across 5 fields in db
      for (var i = 0; i < uniquesubDiscipline.length; i++) {
        if (
          uniquesubDiscipline[i] === this.props.subdisciplne1 ||
          uniquesubDiscipline[i] === this.props.subdisciplne2 ||
          uniquesubDiscipline[i] === this.props.subdisciplne3 ||
          uniquesubDiscipline[i] === this.props.subdisciplne4 ||
          uniquesubDiscipline[i] === this.props.subdisciplne5
        ) {
          //ensure that uniquesubdiscipline that is on db is checked that is used for display
          const data = {
            Name: uniquesubDiscipline[i],
            checked: true,
          };

          //store uniquesubdiscipline that already exist in db
          this.setState(
            {
              subdisciplinecheckedItems: [
                ...this.state.subdisciplinecheckedItems,
                uniquesubDiscipline[i],
              ],
            },
            () => {
              console.log(this.state.subdisciplinecheckedItems);
            }
          );
          newuniquesubDiscipline.push(data);
        }
        // ensure that uniquesubdiscipline that is not on db is unchecked that is used for display
        else {
          const data = {
            Name: uniquesubDiscipline[i],
            checked: false,
          };
          newuniquesubDiscipline.push(data);
        }
      }

      if (this.state.disciplinecheckedItems.length >= 2) {
        for (var i = 0; i < newuniqueDiscipline.length; i++) {
          if (
            Object.values(this.state.disciplinecheckedItems).includes(
              newuniqueDiscipline[i].Name
            )
          ) {
            this.setState({
              [newuniqueDiscipline[i].Name]: false,
            });
          } else {
            this.setState({
              [newuniqueDiscipline[i].Name]: true,
            });
          }
        }
      }

      if (this.state.subdisciplinecheckedItems.length >= 5) {
        for (var i = 0; i < newuniquesubDiscipline.length; i++) {
          if (
            Object.values(this.state.subdisciplinecheckedItems).includes(
              newuniquesubDiscipline[i].Name
            )
          ) {
            this.setState({
              ["sub" + newuniquesubDiscipline[i].Name]: false,
            });
          } else {
            this.setState({
              ["sub" + newuniquesubDiscipline[i].Name]: true,
            });
          }
        }
      }

      //console.log(uniqueAcademicLevel);
      this.setState({
        University: uniqueUniversity,
        Category: uniqueCategory,
        Modeofstudy: Modeofstudy,
        Discipline: newuniqueDiscipline,
        AcademicLevel: uniqueAcademicLevel,
        entryqualification: entryqualification,
        subDiscipline: newuniquesubDiscipline,
      });
    });
  }

  DisciplinehandleChange(event) {
    //console.log(event.target.checked);
    var x = document.getElementsByClassName("DisciplineCheckboxes");
    if (event.target.checked) {
      this.setState({
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
      });
    } else {
      let remove = this.state.subdisciplinecheckedItems.indexOf(event.target.value);

      this.setState({
        subdisciplinecheckedItems: this.state.subdisciplinecheckedItems.filter((_, i) => i !== remove)
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
    );}
  }

  handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({
      [e.target.name]: [e.target.value],
    });
    if (e.target.value === "Part-Time") {
      this.setState({
        parttime: e.target.checked
      });
    }

    if (e.target.value === "Full-Time") {
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

  edit() {
    console.log("programme: " + this.state.programme);
    console.log("university: " + this.state.university);
    console.log("category: " + this.state.category);
    console.log("academiclevel: " + this.state.academiclevel);

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

    console.log("overseaopportunityexchange: " + this.state.overseaopportunityexchange);
    console.log("overseaopportunitytransfer: " + this.state.overseaopportunitytransfer);
    console.log("programmestructurecoursework: " + this.state.programmestructurecoursework);
    console.log("programmestructureexaminati: " + this.state.programmestructureexamination);

    const parentthis = this;
    if (this.state.files !== undefined) {
      const foldername = "Universities";
      const file = this.state.files[0];
      const storageRef = storage.ref(foldername);
      const fileRef = storageRef.child(file.name).put(file);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log(downloadURL);

          // Validation
          const isValid = this.validate();
          if (isValid) {
            this.setState(initialStates);

            const userRef = db.collection("Programmes").doc(parentthis.props.docid);
            userRef.update({
              academicLevel: parentthis.state.academiclevel.toString(),
              "applicationPeriod.period1": parentthis.state.applicationperiod1.toString(),

              "applicationPeriod.period2": 
                parentthis.state.applicationperiod2.toString(),
                awardedBy: parentthis.state.university.toString(),
                category: parentthis.state.category.toString(),

              "discipline.disciplineName1": discipline1,
              "discipline.disciplineName2": discipline2,
              "duration.fullTime": parentthis.state.durationfulltime.toString(),
              "duration.partTime": parentthis.state.durationparttime.toString(),
              "entryQualifications.aLevel": parentthis.state.alevel,
              "entryQualifications.degree": parentthis.state.degree,
              "entryQualifications.diploma": parentthis.state.diploma,
              "entryQualifications.oLevel": parentthis.state.olevel,
              "intakeMonths.fullTime": parentthis.state.intakemonthsfulltime.toString(),

              "intakeMonths.partTime": 
                parentthis.state.intakemonthsparttime.toString(),
                logoFile: downloadURL,

              "modeOfStudy.fullTime": parentthis.state.fulltime,
              "modeOfStudy.partTime": parentthis.state.parttime,
              "overseaOpportunity.exchange": parentthis.state.overseaopportunityexchange,
              "overseaOpportunity.transfer": parentthis.state.overseaopportunitytransfer,
              "programmeOverview.aboutProgramme1": parentthis.state.aboutprogramme1.toString(),
              "programmeOverview.aboutProgramme2": parentthis.state.aboutprogramme2.toString(),
              "programmeOverview.aboutProgramme3": parentthis.state.aboutprogramme3.toString(),
              "programmeStructure.coursework": parentthis.state.programmestructurecoursework,

              "programmeStructure.examination": 
                parentthis.state.programmestructureexamination,
                programmeTitle: parentthis.state.programme.toString(),

              "subDiscipline.subDisciplineName1": subdiscipline1,
              "subDiscipline.subDisciplineName2": subdiscipline2,
              "subDiscipline.subDisciplineName3": subdiscipline3,
              "subDiscipline.subDisciplineName4": subdiscipline4,
              "subDiscipline.subDisciplineName5": subdiscipline5
            })
            .then(dataSnapshot => {
              this.props.handleSaveChanges();
            });
          }
        });

        /* const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (progress != "100") {
          parentthis.setState({ progress: progress });
        } else {
          parentthis.setState({ progress: "Uploaded!" });
        }*/
      });
    } else {
      // Validation
      const isValid = this.validate();
      if (isValid) {
        this.setState(initialStates);

        const userRef = db.collection("Programmes").doc(parentthis.props.docid);
        userRef
        .update({
          academicLevel: parentthis.state.academiclevel.toString(),
          "applicationPeriod.period1": parentthis.state.applicationperiod1.toString(),

          "applicationPeriod.period2": 
            parentthis.state.applicationperiod2.toString(),
            awardedBy: parentthis.state.university.toString(),
            category: parentthis.state.category.toString(),

          "discipline.disciplineName1": discipline1,
          "discipline.disciplineName2": discipline2,
          "duration.fullTime": parentthis.state.durationfulltime.toString(),
          "duration.partTime": parentthis.state.durationparttime.toString(),
          "entryQualifications.aLevel": parentthis.state.alevel,
          "entryQualifications.degree": parentthis.state.degree,
          "entryQualifications.diploma": parentthis.state.diploma,
          "entryQualifications.oLevel": parentthis.state.olevel,
          "intakeMonths.fullTime": parentthis.state.intakemonthsfulltime.toString(),
          "intakeMonths.partTime": parentthis.state.intakemonthsparttime.toString(),

          "modeOfStudy.fullTime": parentthis.state.fulltime,
          "modeOfStudy.partTime": parentthis.state.parttime,
          "overseaOpportunity.exchange": parentthis.state.overseaopportunityexchange,
          "overseaOpportunity.transfer": parentthis.state.overseaopportunitytransfer,
          "programmeOverview.aboutProgramme1": parentthis.state.aboutprogramme1.toString(),
          "programmeOverview.aboutProgramme2": parentthis.state.aboutprogramme2.toString(),
          "programmeOverview.aboutProgramme3": parentthis.state.aboutprogramme3.toString(),
          "programmeStructure.coursework": parentthis.state.programmestructurecoursework,

          "programmeStructure.examination":
            parentthis.state.programmestructureexamination,
            programmeTitle: parentthis.state.programme.toString(),

          "subDiscipline.subDisciplineName1": subdiscipline1,
          "subDiscipline.subDisciplineName2": subdiscipline2,
          "subDiscipline.subDisciplineName3": subdiscipline3,
          "subDiscipline.subDisciplineName4": subdiscipline4,
          "subDiscipline.subDisciplineName5": subdiscipline5,
        })
        .then(dataSnapshot => {
          this.props.handleSaveChanges();
        });
      }
    }
  }
  
  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };

  //Validations for the Forms in Modals
  validate = () => {
    let progNameError = "";
    let logoFileError = "";
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

    if ( !(this.state.programme && this.state.programme.length >= 4) ) {
      progNameError = "Please enter a valid programme name!";
    } 
    
    if (!this.state.logoFile) {
      logoFileError = "Please upload a logo!";
    }
    else if (this.state.logoFile.includes(".exe")) {
      logoFileError = "File uploaded is executable. Please upload a valid image file!"
    }

    if (!this.state.university) {
      universityError = "Please select a valid university!";
    }

    if (!this.state.academiclevel) {
      academicLevelError = "Please select a valid academic level!";
    }

    if (!this.state.ModeOfStudy) {
      modeOfStudyError = "Please select at least 1 mode of study!";
    }

    if (this.state.disciplinecheckedItems.length == 0) {
      disciplineError = "Please select at least 1 discipline!";
    }

    // if (this.state.entryqualificationcheckedItems.length == 0) {
    //   entryQualError = "Please select at least 1 entry qualification!";
    // }

    if (!this.state.subdisciplinecheckedItems.length == 0) {
      subDisciplineError = "Please select at least 1 sub-discipline!";
    }

    if ( !(this.state.aboutprogramme1 && this.state.aboutprogramme1.length >= 1) ) {
      aboutProgError = "Please enter programme details!";
    }

    if ( !(this.state.aboutprogramme1 || this.state.aboutprogramme2 || this.state.aboutprogramme3) ) {
      aboutProgError = "Please enter programme details!";
    }

    if ( !(this.state.applicationperiod1 && this.state.applicationperiod1.length >= 1) ) {
      applicationPeriodError = "Please enter application period details!";
    }

    if ( !(this.state.applicationperiod1 || this.state.applicationperiod2) ) {
      applicationPeriodError = "Please enter application period details!";
    }

    if ( !(this.state.intakemonthsfulltime || this.state.intakemonthsparttime) ) {
      intakeMonthsError = "Please enter intake month(s) details!";
    }

    if ( !(this.state.durationfulltime || this.state.durationparttime) ) {
      durationError = "Please enter duration details!";
    }

    if (progNameError || logoFileError || universityError || academicLevelError || modeOfStudyError || disciplineError || entryQualError
    || subDisciplineError || aboutProgError || applicationPeriodError || intakeMonthsError || durationError) {
      this.setState({
        progNameError, logoFileError, universityError, academicLevelError, modeOfStudyError, disciplineError, entryQualError, subDisciplineError,
        subDisciplineError, aboutProgError, applicationPeriodError, intakeMonthsError, durationError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      progNameError: "",
      logoFileError: "",
      universityError: "",
      academicLevelError: "",
      modeOfStudyError: "",
      disciplineError: "",
      entryQualError: "",
      subDisciplineError: "",
      aboutProgError: "",
      applicationPeriodError: "",
      intakeMonthsError: "",
      durationError: "",
      id: "", 
      programme: "", 
      logoFile: "", 
      university: "", 
      academiclevel: "", 
      ModeOfStudy: "", 
      disciplinecheckedItems: [],
      entryqualificationcheckedItems: [],
      subdisciplinecheckedItems: [],
      aboutprogramme1: "",
      aboutprogramme2: "",
      aboutprogramme3: "",
      applicationperiod1: "",
      applicationperiod2: "",
      intakemonthsfulltime: "",
      intakemonthsparttime: "",
      durationfulltime: "",
      durationparttime: ""
    })
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
                      <FormControl type="text" name="programme" id="editStudySIMProgForm_ProgName" placeholder="Name of Programme*" defaultValue={this.state.programme} onChange={this.handleChange} required />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.progNameError}</div>
                  </Col>
                </Form.Row>

                {/* Logo File */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <FormControl type="file" name="logoFile" id="editStudySIMProgForm_LogoFile" label="Logo File*" custom required onChange={(e) => {this.handleFileUpload(e.target.files);}} />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.logoFileError}</div>
                  </Col>
                </Form.Row>

                {/* University */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="editStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="university" defaultValue={this.props.University} className="editStudySIMProgFormSelect" required noValidate placeholder="Choose a University" onChange={this.handleChange}>
                        <option value="" className="editStudySIMProgFormSelectOption">Choose a University</option>

                        {this.props.universities && this.props.universities.map((University, index) => {
                          if (University === this.props.University) {
                            return (
                              <option value={University} className="editStudySIMProgFormSelectOption" selected>{University}</option>
                            );
                          } else {
                              return (
                                <option value={University} className="editStudySIMProgFormSelectOption">{University}</option>
                              );
                            }
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

                        {this.state.AcademicLevel && this.state.AcademicLevel.map((AcademicLevel, index) => {
                            if (AcademicLevel === this.props.academiclevel) {
                              return (
                                <option value={AcademicLevel} className="editStudySIMProgFormSelectOption" selected>{AcademicLevel}</option>
                              );
                            } else {
                              return (
                                <option value={AcademicLevel} className="editStudySIMProgFormSelectOption">{AcademicLevel}</option>
                              );
                            }
                          }
                        )}
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
                        {this.state.Modeofstudy && this.state.Modeofstudy.map((Modeofstudy) => {
                          {
                            return (
                              <Row>
                                <Col>
                                  {Modeofstudy.Modeofstudy}
                                  <Form.Check name="ModeOfStudy" id={Modeofstudy.ModeOfStudy} value={Modeofstudy.ModeOfStudy} type="checkbox" label={Modeofstudy.ModeOfStudy} className="editStudySIMProgForm_CheckBox" defaultChecked={Modeofstudy.checked} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
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
                        {this.props.disciplines && this.props.disciplines.map((Discipline) => {
                          {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check id={Discipline} name="discipline" value={Discipline} type="checkbox" label={Discipline} className="editStudySIMProgForm_CheckBox DisciplineCheckboxes" 
                                  defaultChecked={Discipline == this.props.discipline1 || Discipline == this.props.discipline2 ? true:false} 
                                  onChange={this.DisciplinehandleChange} disabled={this.state[Discipline]} />
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
                      {this.state.entryqualification && this.state.entryqualification.map((entryqualification) => {
                        {
                          if (entryqualification.entryqualification === "diploma") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryqualification.entryqualification} value={entryqualification.entryqualification} type="checkbox" label="Diploma" className="editStudySIMProgForm_CheckBox" defaultChecked={entryqualification.checked} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryqualification.entryqualification === "degree") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryqualification.entryqualification} value={entryqualification.entryqualification} type="checkbox" label="Degree" className="editStudySIMProgForm_CheckBox" defaultChecked={entryqualification.checked} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if ( entryqualification.entryqualification === "aLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryqualification.entryqualification} value={entryqualification.entryqualification} type="checkbox" label="'A' Level" className="editStudySIMProgForm_CheckBox" defaultChecked={entryqualification.checked} onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryqualification.entryqualification === "oLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryqualification.entryqualification} value={entryqualification.entryqualification} type="checkbox" label="'O' Level" className="editStudySIMProgForm_CheckBox" defaultChecked={entryqualification.checked} onChange={this.handleChange} />
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
                              subDiscipline == this.props.subdiscipline4 || subDiscipline == this.props.subdiscipline5 ? true: false} 
                              onChange={this.SubDisciplinehandleChange} disabled={this.state["sub" + subDiscipline]} />
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
                    <FormControl as="textarea" name="aboutprogramme1" rows="4" required noValidate className="editStudySIMProgForm_TextArea" placeholder="About Programme 1" defaultValue={this.state.aboutprogramme1} onChange={this.handleChange} />
                  
                    <div className="errorMessage text-left">{this.state.aboutProgError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">About Programme 2</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme2" className="editStudySIMProgForm_TextArea" placeholder="About Programme 2" defaultValue={this.state.aboutprogramme2} onChange={this.handleChange} />
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">About Programme 3</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme3" className="editStudySIMProgForm_TextArea" placeholder="About Programme 3" defaultValue={this.state.aboutprogramme3} onChange={this.handleChange} />
                  </Col>
                </Form.Row>

                {/* Application Period */}
                <Form.Row className="justify-content-center editStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="editStudySIMProgFormLabel">Application Period 1</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod1" className="editStudySIMProgForm_TextArea" placeholder="Application Period 1" defaultValue={this.state.applicationperiod1} onChange={this.handleChange} />
                  
                    <div className="errorMessage text-left">{this.state.applicationPeriodError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="editStudySIMProgFormLabel">Application Period 2</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod2" className="editStudySIMProgForm_TextArea" placeholder="Application Period 2" defaultValue={this.state.applicationperiod2} onChange={this.handleChange} />
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
                              <Form.Check name="programmestructurecoursework" value="Coursework" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" onChange={this.handleChange} defaultChecked={this.state.programmestructurecoursework} />
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
                              <Form.Check name="programmestructureexamination" value="Examination" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.state.programmestructureexamination} onChange={this.handleChange} />
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
                              <Form.Check name="exchange" value="Exchange" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.state.overseaopportunityexchange} onChange={this.handleChange} />
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
                              <Form.Check name="transfer" value="Transfer" type="checkbox" label="Yes" className="editStudySIMProgForm_CheckBox" defaultChecked={this.state.overseaopportunitytransfer} onChange={this.handleChange} />
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
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsfulltime" className="editStudySIMProgForm_TextArea" placeholder="Full-Time" defaultValue={this.state.intakemonthsfulltime} onChange={this.handleChange} /> 
                      </Col> 

                      {/* Part Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label> 
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsparttime" className="editStudySIMProgForm_TextArea" placeholder="Part-Time" defaultValue={this.state.intakemonthsparttime} onChange={this.handleChange} /> 
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

                        <FormControl as="textarea" rows="3" required noValidate name="durationfulltime" className="editStudySIMProgForm_TextArea" placeholder="Full-Time" defaultValue={this.state.durationfulltime} onChange={this.handleChange} /> 
                      </Col> 

                      {/* Part Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="editStudySIMProgFormLabel">Part-Time</Form.Label> 
                        <FormControl as="textarea" rows="3" required noValidate name="durationparttime" className="editStudySIMProgForm_TextArea" placeholder="Part-Time" defaultValue={this.state.durationparttime} onChange={this.handleChange} /> 
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
                <Button id="saveChangesEditProgFormBtn" onClick={() => {this.edit();}}>Save Changes</Button>
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
