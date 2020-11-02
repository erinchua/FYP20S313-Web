import React, { Component } from "react";
import fire from "../../config/firebase";
import history from "../../config/history";
import { Container, Row, Col, Button, Table, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

import "../../css/Marketing_Administrator/CampusFacilitiesMap.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEdit } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SideNavBar from '../../components/SideNavbar';


const initialStates = {
  blockError: "",
  facilityNameError: "",
  facilityLocationError: ""
}

class CampusFacilitiesMap extends Component {
  state = initialStates;

  constructor() {
    super();
    this.state = {
      blockName: "",
      facilityName: "",
      location: "",
      // url: "",
      // progress: "",

      filteredBlock: [],
      editCampusFacilModal: false
    };
    this.resetForm = this.resetForm.bind(this);
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

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.authListener();
  }

  display() {
    const db = fire.firestore();

    //Map Image File
    // const image = db
    // .collection("CampusFacilities").doc("map")
    // .get()
    // .then((snapshot) => {
    //   const maparray = [];
    //   const image = snapshot.data();
    //   const data = {
    //     url: image.url,

    //   };
    //   maparray.push(data);
    //   this.setState({ maparr: maparray});   
    // });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const userRef = db
    .collection("CampusFacilities").orderBy('blockName','asc')
    .get()
    .then((snapshot) => {
      const facilities = [];
      const block = [];
      snapshot.forEach((doc) => {
        const data = {
          blockName: doc.data().blockName,
          facilityName: doc.data().facilityName,
          location: doc.data().location,
          id: doc.id,
        };
        facilities.push(data);
        block.push(doc.data().blockName);
      });
      this.setState({ block: block });
      var filteredBlock = block.filter(onlyUnique);
      
      this.setState({ facilities: facilities,});
      this.setState({filteredBlock: filteredBlock});
    });
  }


  // update(e, facilitiesid) {
  //   const blockName = document.getElementById(facilitiesid + "block").value
  //   const facilityName = document.getElementById(facilitiesid + "name").value
  //   const location = document.getElementById(facilitiesid + "location").value

  //   const db = fire.firestore();
  //   if (blockName != null && facilityName != null && location != null) {
  //     const userRef = db
  //     .collection("CampusFacilities")
  //     .doc(facilitiesid)
  //     .update({
  //       blockName: blockName,
  //       facilityName: facilityName,
  //       location: location,
  //     })
  //     .then(function () {
  //       // alert("Updated");
  //       window.location.reload();
  //     });
  //   }
  // }

  // editLink(e, facilitiesid){
  //   document.getElementById(facilitiesid + "upload").removeAttribute("hidden");
  //   document.getElementById(facilitiesid + "spanimagelink").removeAttribute("hidden");
  //   document.getElementById(facilitiesid + "editbutton").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "updatebutton").removeAttribute("hidden");
  //   document.getElementById(facilitiesid + "cancelbutton").removeAttribute("hidden");
  //   var texttohide = document.getElementsByClassName(
  //     facilitiesid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].setAttribute("hidden", "");
  //   }
  // }

  // CancelEditLink(e, facilitiesid) {
  //   document.getElementById(facilitiesid + "upload").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "spanimagelink").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(facilitiesid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //     facilitiesid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }

  editFacilities(e, facilitiesid) {
    // document.getElementById(facilitiesid + "spanblock").removeAttribute("hidden");
    // document.getElementById(facilitiesid + "spanname").removeAttribute("hidden");
    // document.getElementById(facilitiesid + "spanlocation").removeAttribute("hidden");
    // document.getElementById(facilitiesid + "editbutton").setAttribute("hidden", "");
    // document.getElementById(facilitiesid + "updatebutton").removeAttribute("hidden");
    // document.getElementById(facilitiesid + "cancelbutton").removeAttribute("hidden");
    // var texttohide = document.getElementsByClassName(
    //   facilitiesid + "text"
    // );
    // for (var i = 0; i < texttohide.length; i++) {
    //   texttohide[i].setAttribute("hidden", "");
    // }

    const isValid = this.validate();
    if (isValid) {
      this.setState(initialStates);

      const db = fire.firestore();
      db
      .collection("CampusFacilities")
      .doc(this.state.id)
      .update({
        blockName: this.state.blockName,
        facilityName: this.state.facilityName,
        location: this.state.location,
      })
      .then(dataSnapshot => {
        this.setState({
          editCampusFacilModal: false
        })
        this.display()
      }); 
    }
  }

  // CancelEdit(e, facilitiesid) {
  //   document.getElementById(facilitiesid + "spanblock").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "spanname").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "spanlocation").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(facilitiesid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(facilitiesid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //     facilitiesid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }
  
  /** Images for this page are static so the images cannot be replaced. **/
  // handleFileUpload = (files) => {
  //   this.setState({
  //     files: files,
  //   });
  // };

  // handleSave = () => {
  //   const parentthis = this;
  //   const db = fire.firestore();

  //   if (this.state.files !== undefined) {
  //     const foldername = "CampusFacilitiesMap";
  //     const file = this.state.files[0];
  //     const storageRef = fire.storage().ref(foldername);
  //     const fileRef = storageRef.child(this.state.files[0].name).put(this.state.files[0]);
  //     fileRef.on("state_changed", function (snapshot) {
  //       fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  //         console.log("File available at", downloadURL);

  //         const userRef = db
  //         .collection("CampusFacilities")
  //         .doc("map")
  //         .update({
  //           url: downloadURL,
  //         })
  //         .then(function () {
  //           // alert("Updated");
  //           window.location.reload();
  //         });
          
  //       });

  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       if (progress != "100") {
  //         parentthis.setState({ progress: progress });
  //       } else {
  //         parentthis.setState({ progress: "Uploaded!" });
  //       }
  //     });
  //     console.log();
  //   } else {
  //     alert("No Files Selected");
  //   }
  // };

  /* Edit Campus Facilities Modal */
  handleEditCampusFacilModal = (facility) => {
    if (this.state.editCampusFacilModal == false) {
      this.setState({
        id: facility.id,
        editCampusFacilModal: true,
        blockName: facility.blockName,
        facilityName: facility.facilityName,
        location: facility.location,
      });
    }
    else {
      this.setState({
        editCampusFacilModal: false
      });
      this.resetForm();
    }
  };

  //Validations for the Forms in Modals
  validate = () => {
    let blockError = "";
    let facilityNameError = "";
    let facilityLocationError = "";

    if (!this.state.blockName) {
      blockError = "Please select a valid block!";
    } 

    if (! (this.state.facilityName && this.state.facilityName.length >= 2) ) {
      facilityNameError = "Please enter a valid facility name!";
    }

    if (! (this.state.location && this.state.location.length >= 2) ) {
      facilityLocationError = "Please enter a valid facility location!";
    }

    if (blockError || facilityNameError || facilityLocationError) {
      this.setState({
        blockError, facilityNameError, facilityLocationError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      blockError: "",
      facilityNameError: "",
      facilityLocationError: "",
      id: "", 
      blockName: "",
      facilityName: "",
      location: "",
    })
  }


  render() {
    return (
      <div>
        <Container fluid className="campusFacilCon">
          <NavBar isMA={true} />

          <Container fluid className="campusFacilContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="campusFacilContentCon">
                  {/* Campus Facilities Map Page Header row */}
                  <Row id="campusFacilContentHeaderRow" className="justify-content-center">
                    <Col md="12" className="text-left campusFacilContentHeaderCol">
                      <h4 id="campusFacilHeaderText">Campus Facilities Map</h4>
                    </Col>
                  </Row>

                  {/* Campus Facilities Table */}
                  <Row id="campusFacilTableRow" className="justify-content-center">
                    <Col md="12">
                      <Table responsive="sm" bordered id="campusFacilTable">
                        <thead>
                          <tr className="text-center">
                            <th id="campusFacilHeader_Block" className="text-center">Block</th>
                            <th id="campusFacilHeader_FacilName" className="text-center">Name of Facility</th>
                            <th id="campusFacilHeader_Location" className="text-center">Location</th>
                            <th id="campusFacilHeader_Edit" className="text-center">Edit</th>
                          </tr>
                        </thead>
                          
                        <tbody>
                          {this.state.facilities && this.state.facilities.map((facility) => {
                            return (
                              <tr key={facility.id}>
                                <td id="campusFacilData_Block" className="text-center">{facility.blockName}</td>
                                <td id="campusFacilData_FacilName" className="text-left">{facility.facilityName}</td>
                                <td id="campusFacilData_Location" className="text-left">{facility.location}</td>
                                <td id="campusFacilData_Edit" className="text-center">
                                  <Button id="editCampusFacilBtn" onClick={() => {this.handleEditCampusFacilModal(facility)}}>
                                    <FontAwesomeIcon size="lg" id="editCampusFacilBtnIcon" icon={faEdit} />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}

                        </tbody>

                      </Table>
                    </ Col>
                  </Row>

                </Container>
              </Col>
            </Row>


          </Container>

          <Footer />
        </Container>


        {/* Edit Campus Facilities Modal */}
        <Modal 
          show={this.state.editCampusFacilModal}
          onHide={this.handleEditCampusFacilModal}
          aria-labelledby="editCampusFacilModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title id="editCampusFacilModalTitle" className="w-100">
              Edit Campus Facility
            </Modal.Title>
          </Modal.Header>

          <Modal.Body id="editCampusFacilModalBody">
            <Form noValidate onSubmit={()=>{this.editFacilities()}}>
              {/* Block */}
              <Form.Row className="justify-content-center editCampusFacilFormRow">
                <Col md="10" className="editCampusFacilFormCol">
                  <InputGroup className="editCampusFacilFormColInputGrp">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="editCampusFacilFormIconInputGrp">
                        <FontAwesomeIcon size="lg" className="editCampusFacilFormIcon" icon={faBuilding} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>

                    <Form.Control as="select" name="blockName" defaultValue={this.state.blockName} onChange={this.updateInput} className="editCampusFacilFormSelect" required noValidate>
                      <option value="chooseBlock" className="editCampusFacilFormSelectOption">Choose Block</option>
                      
                      {this.state.filteredBlock && this.state.filteredBlock.map((blockName) => {
                        return (
                          <>
                            <option value={blockName} className="editCampusFacilFormSelectOption">{blockName}</option>
                          </>
                        );
                      })}
                    </Form.Control> 
                  </InputGroup>

                  <div className="errorMessage text-left">{this.state.blockError}</div>
                </Col>
              </Form.Row>

              {/* Facility Name */}
              <Form.Row className="justify-content-center editCampusFacilFormRow">
                <Col md="10">
                  <Form.Label className="editCampusFacilFormLabel">Facility Name</Form.Label>
                  <FormControl as="textarea" rows="4" name="facilityName" defaultValue={this.state.facilityName} onChange={this.updateInput} required noValidate id="editCampusFacilForm_FacilName" placeholder="Facility Name*" />                                       
                
                  <div className="errorMessage text-left">{this.state.facilityNameError}</div>
                </Col>
              </Form.Row>

              {/* Facility Location */}
              <Form.Row className="justify-content-center editCampusFacilFormRow">
                <Col md="10">
                  <Form.Label className="editCampusFacilFormLabel">Facility Location</Form.Label>
                  <FormControl as="textarea" rows="4" name="location" defaultValue={this.state.location} onChange={this.updateInput} required noValidate id="editCampusFacilForm_FacilLocation" placeholder="Facility Location*" />                                       
                
                  <div className="errorMessage text-left">{this.state.facilityLocationError}</div>
                </Col>
              </Form.Row>

            </Form>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            {/* Edit Campus Facility Save Changes Btn */}
            <Container>
              <Row>
                <Col md="6" className="text-right">
                  <Button id="saveChangesCampusFacilFormBtn" onClick={(e)=>{this.editFacilities()}}>Save Changes</Button>
                </Col>

                <Col md="6" className="text-left">
                  <Button id="cancelEditCampusFacilFormBtn" onClick={this.handleEditCampusFacilModal}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>

        </Modal>



        {/* <div>
          <table id="users" class="table table-bordered"> 
            <tbody>
            {this.state.maparr &&
                this.state.maparr.map((image) => {
                        return (
                            <tr>
                              <td>Map Image File</td>
                              <td>
                              <span class={image.id + "text"}>
                              {image.URL} 
                        </span>
                          <span id={image.id + "spanimagelink"} hidden>
                          <input
                            id={image.id + "imagelink"}
                            defaultValue={image.URL}
                            type="text"
                            name={image.id + "imagelink"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={image.URL}
                            required
                            disabled={"disabled"}
                          />
                        </span>
                        <span id= {image.id+ "upload" } hidden ><input
            type="file"
            onChange={(e) => {
              this.handleFileUpload(e.target.files);
            }}
          />
         
       {this.state.progress}
       <div>
         <progress value={this.state.progress} max="100" />
       </div>
       </span> </td>
                        <td>
                        <button
                          id={image.id + "editbutton"}
                          onClick={(e) => {
                            this.editLink(e, image.id);
                          }}
                        >
                          Browse
                        </button>
                        <button id = {image.id + "updatebutton"}
                        hidden
                        onClick={(e) => {
                          this.handleSave();
                        }}>
                          Save
                          </button>
                        <button
                          hidden
                          id={image.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEditLink(e, image.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                            </tr>
                          );
                    
                })}
              
              <tr>
                <th scope="col">Block</th>
                <th scope="col">Name of Place</th>
                <th scope="col">Location</th>
                <th scope="col">Edit</th>
              </tr>
              {this.state.facilities &&
                this.state.facilities.map((facilities) => {
                  return (
                    <tr>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.blockName}
                        </span>
                          
                          <span id={facilities.id + "spanblock"} hidden>
                          <input
                            id={facilities.id + "block"}
                            defaultValue={facilities.blockName}
                            type="text"
                            name={facilities.id + "block"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.blockName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.facilityName}
                        </span>    
                          <span id={facilities.id + "spanname"} hidden>
                          <input
                            id={facilities.id + "name"}
                            defaultValue={facilities.facilityName}                    
                            type="text"
                            name={facilities.id + "name"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.facilityName}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={facilities.id + "text"}>
                      {facilities.location} 
                        </span>  
                          <span id={facilities.id + "spanlocation"} hidden>
                          <input
                            id={facilities.id + "location"}
                            defaultValue={facilities.location}
                            type="text"
                            name={facilities.id + "location"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={facilities.location}
                            required
                          />
                        </span> 
                      </td>
                      <td>
                        <button
                          id={facilities.id + "editbutton"}
                          onClick={(e) => {
                            this.editFacilities(e, facilities.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={facilities.id + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, facilities.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={facilities.id + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, facilities.id);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div> */}
      </div>
    );
  }
}
export default CampusFacilitiesMap;
