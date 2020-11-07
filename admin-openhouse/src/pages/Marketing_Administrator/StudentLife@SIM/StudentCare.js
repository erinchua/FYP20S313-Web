import { Container, Row, Col, Table, Button, Modal, Form, Tab, Nav } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db, storage } from "../../../config/firebase";
import history from "../../../config/history";
import firebase from "firebase/app";

import '../../../css/Marketing_Administrator/StudentCare.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileImage, faFutbol, faBiking, faSpa, faUsers, faComments } from '@fortawesome/free-solid-svg-icons';

async function savePicture(blobURL, imageName) {
    const pictureRef = storage.ref(`/StudentCare/`).child(imageName);
    const response = await fetch(blobURL);
    const blob = await response.blob(); //fetch blob object
    const snapshot = await pictureRef.put(blob); //upload
    const url = await snapshot.ref.getDownloadURL(); //url in storage
    console.log("image URL:", url);
    return url;
}

const initialStates = {
    studentWellnessDescriptionError: "",
    studentWellnessLogoError: "",
    counsellingServiceDescriptionError: "",
    counsellingServiceLogoError: "",
    peerSupportDescriptionError: "",
    peerSupportLogoError: "",
    wellnessAdvocatesDescriptionError: "",
    wellnessAdvocatesLogoError: "",
    workDescriptionError: "",
    activityNameError: "",
    activityLogoError: "",
}

class StudentCare extends Component {

    state = initialStates;

    constructor() {
        super();
        this.state = {
            //Work, play and live well
            workId: "",
            workDescription: "",
            activityId: "",
            activityName: "",
            activityLogo: "",
            workArray: "",
            activityArray: "",
            //Student Wellness Centre
            studentWellnessId: "",
            studentWellnessDescription: "",
            studentWellnessLogo: "",
            studentWellnessArray: "",
            //Counselling Service
            counsellingServiceId: "",
            counsellingServiceDescription: "",
            counsellingServiceLogo: "",
            counsellingServiceArray: "",
            //SIM Peer Support
            peerSupportId: "",
            peerSupportDescription: "",
            peerSupportLogo: "",
            peerSupportArray: "",
            //SIM Wellness Advocates
            wellnessAdvocatesId: "",
            wellnessAdvocatesDescription: "",
            wellnessAdvocatesLogo: "",
            wellnessAdvocatesArray: "",
            //Others
            logoFieldName: "",
            previousLogo: "",
            //Below states are for the modals
            workEditModal: false,
            activityEditModal: false,
            studentWellnessEditModal: false,
            counsellingServiceEditModal: false,
            peerSupportEditModal: false,
            wellnessAdvocatesEditModal: false,
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

        db.collection("StudentCare").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {

                //Work, play and live well
                if (doc.id === "workPlayLiveWell") {
                    const activityArray = [];
                    const workArray = [];

                    const activities = doc.data().activities;
                    for (var i = 1; i <= Object.keys(activities).length; i++) {
                        var activity = "activity" + i;
                        const activitiesData = {
                            activityId: activity,
                            activityName: activities[activity].activitiesName,
                            activityLogo: activities[activity].activitiesLogo,
                        }
                        activityArray.push(activitiesData);
                    }

                    const workData = {
                        workId: doc.id,
                        workDescription: doc.data().desc,
                    }
                    workArray.push(workData);

                    this.setState({
                        workArray: workArray,
                        activityArray: activityArray,
                    });
                }

                //Student Wellness Centre
                if (doc.id === "studentWellnessCentre") {
                    const studentWellness = [];
                    const logoFieldTitle = [];

                    var title = doc.data().id;
                    var splitTitle = title.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
                    for (let i = 0; i < splitTitle.length; i++) {
                        logoFieldTitle.push(splitTitle[i][0].toUpperCase() + splitTitle[i].substr(1))
                    }
                    
                    var logoFieldName = logoFieldTitle.join(" ");

                    const data = {
                        studentWellnessId: doc.data().id,
                        studentWellnessDescription: doc.data().desc,
                        studentWellnessLogo: doc.data().logo,
                        logoFieldName: logoFieldName,
                    }
                    studentWellness.push(data);
                    this.setState({
                        studentWellnessArray: studentWellness
                    });
                }

                //Counselling Service
                if (doc.id === "counsellingService") {
                    const counsellingService = [];
                    const logoFieldTitle = [];

                    var title = doc.data().id;
                    var splitTitle = title.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
                    for (let i = 0; i < splitTitle.length; i++) {
                        logoFieldTitle.push(splitTitle[i][0].toUpperCase() + splitTitle[i].substr(1))
                    }
                    
                    var logoFieldName = logoFieldTitle.join(" ");

                    const data = {
                        counsellingServiceId: doc.data().id,
                        counsellingServiceDescription: doc.data().desc,
                        counsellingServiceLogo: doc.data().logo,
                        logoFieldName: logoFieldName,
                    }
                    counsellingService.push(data);
                    this.setState({
                        counsellingServiceArray: counsellingService
                    });
                }

                //SIM Peer Support
                if (doc.id === "simPeerSupport") {
                    const peerSupport = [];
                    const logoFieldTitle = [];

                    var title = doc.data().id;
                    var splitTitle = title.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
                    for (let i = 0; i < splitTitle.length; i++) {
                        logoFieldTitle.push(splitTitle[i][0].toUpperCase() + splitTitle[i].substr(1))
                    }
                    
                    var logoFieldName = logoFieldTitle.join(" ");

                    const data = {
                        peerSupportId: doc.data().id,
                        peerSupportDescription: doc.data().desc,
                        peerSupportLogo: doc.data().logo,
                        logoFieldName: logoFieldName,
                    }
                    peerSupport.push(data);
                    this.setState({
                        peerSupportArray: peerSupport
                    });
                }

                //SIM Wellness Advocates
                if (doc.id === "simWellnessAdvocates") {
                    const wellnessAdvocates = [];
                    const logoFieldTitle = [];

                    var title = doc.data().id;
                    var splitTitle = title.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
                    for (let i = 0; i < splitTitle.length; i++) {
                        logoFieldTitle.push(splitTitle[i][0].toUpperCase() + splitTitle[i].substr(1))
                    }
                    
                    var logoFieldName = logoFieldTitle.join(" ");

                    const data = {
                        wellnessAdvocatesId: doc.data().id,
                        wellnessAdvocatesDescription: doc.data().desc,
                        wellnessAdvocatesLogo: doc.data().logo,
                        logoFieldName: logoFieldName,
                    }
                    wellnessAdvocates.push(data);
                    this.setState({
                        wellnessAdvocatesArray: wellnessAdvocates
                    });
                }

            });
        });
    }

    handleFileUpload(e, id) {
        if (e.target.files?.length > 0){
            const file = e.target.files?.item(0);
            const homeURL = URL.createObjectURL(file);

            console.log("Create:", homeURL);
            if (id == this.state.studentWellnessId) {
                this.setState({
                    studentWellnessLogo: homeURL,
                    previousLogo: this.state.studentWellnessLogo,
                });
            }

            if (id == this.state.counsellingServiceId) {
                this.setState({
                    counsellingServiceLogo: homeURL,
                    previousLogo: this.state.counsellingServiceLogo,
                });
            }

            if (id == this.state.peerSupportId) {
                this.setState({
                    peerSupportLogo: homeURL,
                    previousLogo: this.state.peerSupportLogo,
                });
            }

            if (id == this.state.wellnessAdvocatesId) {
                this.setState({
                    wellnessAdvocatesLogo: homeURL,
                    previousLogo: this.state.wellnessAdvocatesLogo,
                });
            }

            if (id == this.state.activityId) {
                this.setState({
                    activityLogo: homeURL,
                    previousLogo: this.state.activityLogo,
                });
            }
        }
    };

    //Update function for Student Wellness Centre, Counselling Service, SIM Peer Support and SIM Wellness Advocates
    handleUpdate = async(id) => {
        const isStudentWellnessValid = this.validateStudentWellness();
        const isCounsellingServiceValid = this.validateCounsellingService();
        const isPeerSupportValid = this.validatePeerSupport();
        const isWellnessAdvocatesValid = this.validateWellnessAdvocates();

        //Student Wellness Centre
        if (id == this.state.studentWellnessId) {

            if (this.state.studentWellnessLogo.startsWith("blob:")) {
                var title = this.state.previousLogo.split(/\%..(.*?)\?alt/)[1].split(".")[0]
                var res = this.state.previousLogo.split("?alt=")[0];
                var extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    var fileName = title;
                    const url = await savePicture(this.state.studentWellnessLogo, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    var fileName = title + extension;
                    const url = await savePicture(this.state.studentWellnessLogo, fileName);
                    this.setState({
                        url: url
                    });
                }

                if (isStudentWellnessValid) { 
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.studentWellnessDescription,
                        logo: this.state.url,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated Student Wellness Centre");
                        this.setState({
                            studentWellnessEditModal: false
                        });
                        this.display();
                    });
                }
                
            } else {
                if (isStudentWellnessValid) { 
                    this.setState(initialStates);
                    
                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.studentWellnessDescription,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated Student Wellness Centre");
                        this.setState({
                            studentWellnessEditModal: false
                        });
                        this.display();
                    });
                }
            }
        }

        //Counselling Service
        if (id == this.state.counsellingServiceId) {

            if (this.state.counsellingServiceLogo.startsWith("blob:")) {
                var title = this.state.previousLogo.split(/\%..(.*?)\?alt/)[1].split(".")[0]
                var res = this.state.previousLogo.split("?alt=")[0];
                var extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    var fileName = title;
                    const url = await savePicture(this.state.counsellingServiceLogo, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    var fileName = title + extension;
                    const url = await savePicture(this.state.counsellingServiceLogo, fileName);
                    this.setState({
                        url: url
                    });
                }

                if (isCounsellingServiceValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.counsellingServiceDescription,
                        logo: this.state.url,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated Counselling Service");
                        this.setState({
                            counsellingServiceEditModal: false
                        });
                        this.display();
                    });
                }

            } else {
                if (isCounsellingServiceValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.counsellingServiceDescription,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated Counselling Service");
                        this.setState({
                            counsellingServiceEditModal: false
                        });
                        this.display();
                    });
                }
            }
        }

        //SIM Peer Support
        if (id == this.state.peerSupportId) {

            if (this.state.peerSupportLogo.startsWith("blob:")) {
                var title = this.state.previousLogo.split(/\%..(.*?)\?alt/)[1].split(".")[0]
                var res = this.state.previousLogo.split("?alt=")[0];
                var extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    var fileName = title;
                    const url = await savePicture(this.state.peerSupportLogo, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    var fileName = title + extension;
                    const url = await savePicture(this.state.peerSupportLogo, fileName);
                    this.setState({
                        url: url
                    });
                }

                if (isPeerSupportValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.peerSupportDescription,
                        logo: this.state.url,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated SIM Peer Support");
                        this.setState({
                            peerSupportEditModal: false
                        });
                        this.display();
                    });
                }

            } else {
                if (isPeerSupportValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.peerSupportDescription,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated SIM Peer Support");
                        this.setState({
                            peerSupportEditModal: false
                        });
                        this.display();
                    });
                }
            }
        }

        //SIM Wellness Advocates
        if (id == this.state.wellnessAdvocatesId) {

            if (this.state.wellnessAdvocatesLogo.startsWith("blob:")) {
                var title = this.state.previousLogo.split(/\%..(.*?)\?alt/)[1].split(".")[0]
                var res = this.state.previousLogo.split("?alt=")[0];
                var extension = res.substr(res.length - 4);

                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    var fileName = title;
                    const url = await savePicture(this.state.wellnessAdvocatesLogo, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    var fileName = title + extension;
                    const url = await savePicture(this.state.wellnessAdvocatesLogo, fileName);
                    this.setState({
                        url: url
                    });
                }

                if (isWellnessAdvocatesValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.wellnessAdvocatesDescription,
                        logo: this.state.url,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated SIM Wellness Advocates");
                        this.setState({
                            wellnessAdvocatesEditModal: false
                        });
                        this.display();
                    });
                }

            } else {
                if (isWellnessAdvocatesValid) {
                    this.setState(initialStates);

                    db.collection("StudentCare").doc(id)
                    .update({
                        desc: this.state.wellnessAdvocatesDescription,
                    })
                    .then(dataSnapshot => {
                        console.log("Updated SIM Wellness Advocates");
                        this.setState({
                            wellnessAdvocatesEditModal: false
                        });
                        this.display();
                    });
                }
            }
        }
    }

    handleWorkUpdate = async(id) => {
        const isWorkValid = this.validateWork();
        const isActivityValid = this.validateActivity();

        if (id == this.state.activityId) {

            if (this.state.activityLogo.startsWith("blob:")) {
                var title = this.state.previousLogo.split(/\%..(.*?)\?alt/)[1].split(".")[0]
                var res = this.state.previousLogo.split("?alt=")[0];
                var extension = res.substr(res.length - 4);
    
                if (!extension.includes('.png') && !extension.includes('.jpg') && !extension.includes('.PNG') && !extension.includes('.JPG')) {
                    var fileName = title;
                    const url = await savePicture(this.state.activityLogo, fileName);
                    this.setState({
                        url: url
                    });
                } else {
                    var fileName = title + extension;
                    const url = await savePicture(this.state.activityLogo, fileName);
                    this.setState({
                        url: url
                    });
                }

                var number = id.split(/([0-9]+)/);

                if (isActivityValid) {
                    this.setState(initialStates);

                    if (number[1] === "1") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity1.activitiesName": this.state.activityName,
                            "activities.activity1.activitiesLogo": this.state.url,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activities");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    } else if (number[1] === "2") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity2.activitiesName": this.state.activityName,
                            "activities.activity2.activitiesLogo": this.state.url,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activities");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    } else if (number[1] === "3") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity3.activitiesName": this.state.activityName,
                            "activities.activity3.activitiesLogo": this.state.url,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activities");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    }
                }
    
            } else {
                var number = id.split(/([0-9]+)/);

                if (isActivityValid) {
                    this.setState(initialStates);

                    if (number[1] === "1") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity1.activitiesName": this.state.activityName,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activity Name");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    } else if (number[1] === "2") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity2.activitiesName": this.state.activityName,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activity Name");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    } else if (number[1] === "3") {
                        db.collection("StudentCare").doc("workPlayLiveWell")
                        .update({
                            "activities.activity3.activitiesName": this.state.activityName,
                        })
                        .then(dataSnapshot => {
                            console.log("Updated Activity Name");
                            this.setState({
                                activityEditModal: false
                            });
                            this.display();
                        });
                    }
                }
            }
            
        } else {
            if (isWorkValid) {
                this.setState(initialStates);

                db.collection("StudentCare").doc(id)
                .update({
                    desc: this.state.workDescription,
                })
                .then(dataSnapshot => {
                    console.log("Updated Work Description");
                    this.setState({
                        workEditModal: false
                    });
                    this.display();
                });
            }
        }
    }

    //Work, play and live well Edit Modal
    handleWorkEditModal = (workPlayLive) => {
        if (this.state.workEditModal == false) {
            this.setState({
                workEditModal: true,
                workId: workPlayLive.workId,
                workDescription: workPlayLive.workDescription,
            });
        }
        else {
            this.setState({
                workEditModal: false
            });
        }
    }

    //Activity Edit Modal
    handleActivityEditModal = (activity) => {
        if (this.state.activityEditModal == false) {
            this.setState({
                activityEditModal: true,
                activityId: activity.activityId,
                activityName: activity.activityName,
                activityLogo: activity.activityLogo,
            });
        }
        else {
            this.setState({
                activityEditModal: false
            });
        }
    }

    //Student Wellness Centre Edit Modal
    handleStudentWellnessEditModal = (studentWellness) => {
        if (this.state.studentWellnessEditModal == false) {
            this.setState({
                studentWellnessEditModal: true,
                studentWellnessId: studentWellness.studentWellnessId,
                studentWellnessDescription: studentWellness.studentWellnessDescription,
                studentWellnessLogo: studentWellness.studentWellnessLogo,
            });
        }
        else {
            this.setState({
                studentWellnessEditModal: false
            });
        }
    }

    //Counselling Service Edit Modal
    handleCounsellingServiceEditModal = (counsellingService) => {
        if (this.state.counsellingServiceEditModal == false) {
            this.setState({
                counsellingServiceEditModal: true,
                counsellingServiceId: counsellingService.counsellingServiceId,
                counsellingServiceDescription: counsellingService.counsellingServiceDescription,
                counsellingServiceLogo: counsellingService.counsellingServiceLogo,
            });
        }
        else {
            this.setState({
                counsellingServiceEditModal: false
            });
        }
    }

    //SIM Peer Support Edit Modal
    handlePeerSupportEditModal = (peerSupport) => {
        if (this.state.peerSupportEditModal == false) {
            this.setState({
                peerSupportEditModal: true,
                peerSupportId: peerSupport.peerSupportId,
                peerSupportDescription: peerSupport.peerSupportDescription,
                peerSupportLogo: peerSupport.peerSupportLogo,
            });
        }
        else {
            this.setState({
                peerSupportEditModal: false
            });
        }
    }

    //SIM Wellness Advocates
    handleWellnessAdvocatesEditModal = (wellnessAdvocates) => {
        if (this.state.wellnessAdvocatesEditModal == false) {
            this.setState({
                wellnessAdvocatesEditModal: true,
                wellnessAdvocatesId: wellnessAdvocates.wellnessAdvocatesId,
                wellnessAdvocatesDescription: wellnessAdvocates.wellnessAdvocatesDescription,
                wellnessAdvocatesLogo: wellnessAdvocates.wellnessAdvocatesLogo,
            });
        }
        else {
            this.setState({
                wellnessAdvocatesEditModal: false
            });
        }
    }

    //Validation for Student Wellness
    validateStudentWellness = () => {
        let studentWellnessDescriptionError = "";
        let studentWellnessLogoError = "";

        if (!this.state.studentWellnessDescription) {
            studentWellnessDescriptionError = "Please enter a valid description.";
        }

        if (!this.state.studentWellnessLogo) {
            studentWellnessLogoError = "Please browse a logo.";
        }

        if (studentWellnessDescriptionError || studentWellnessLogoError) {
            this.setState({studentWellnessDescriptionError, studentWellnessLogoError});
            return false;
        } 

        return true;
    }

    //Validation for Counselling Service
    validateCounsellingService = () => {
        let counsellingServiceDescriptionError = "";
        let counsellingServiceLogoError = "";

        if (!this.state.counsellingServiceDescription) {
            counsellingServiceDescriptionError = "Please enter a valid description.";
        }

        if (!this.state.counsellingServiceLogo) {
            counsellingServiceLogoError = "Please browse a logo.";
        }

        if (counsellingServiceDescriptionError || counsellingServiceLogoError) {
            this.setState({counsellingServiceDescriptionError, counsellingServiceLogoError});
            return false;
        } 

        return true;
    }

    //Validation for SIM Peer Support
    validatePeerSupport = () => {
        let peerSupportDescriptionError = "";
        let peerSupportLogoError = "";

        if (!this.state.peerSupportDescription) {
            peerSupportDescriptionError = "Please enter a valid description.";
        }

        if (!this.state.peerSupportLogo) {
            peerSupportLogoError = "Please browse a logo.";
        }

        if (peerSupportDescriptionError || peerSupportLogoError) {
            this.setState({peerSupportDescriptionError, peerSupportLogoError});
            return false;
        } 

        return true;
    }

    //Validation for SIM Wellness Advocates
    validateWellnessAdvocates = () => {
        let wellnessAdvocatesDescriptionError = "";
        let wellnessAdvocatesLogoError = "";

        if (!this.state.wellnessAdvocatesDescription) {
            wellnessAdvocatesDescriptionError = "Please enter a valid description.";
        }

        if (!this.state.wellnessAdvocatesLogo) {
            wellnessAdvocatesLogoError = "Please browse a logo.";
        }

        if (wellnessAdvocatesDescriptionError || wellnessAdvocatesLogoError) {
            this.setState({wellnessAdvocatesDescriptionError, wellnessAdvocatesLogoError});
            return false;
        } 

        return true;
    }

    //Validation for Work, Play and Live Well
    validateWork = () => {
        let workDescriptionError = "";

        if (!this.state.workDescription) {
            workDescriptionError = "Please enter a valid description.";
        }

        if (workDescriptionError) {
            this.setState({workDescriptionError});
            return false;
        } 

        return true;
    }

    //Validation for Activities
    validateActivity = () => {
        let activityNameError = "";
        let activityLogoError = "";

        if (!this.state.activityName) {
            activityNameError = "Please enter a valid description.";
        }

        if (!this.state.activityLogo) {
            activityLogoError = "Please browse a logo.";
        }

        if (activityNameError || activityLogoError) {
            this.setState({activityNameError, activityLogoError});
            return false;
        } 

        return true;
    }

    render() {
        return (
            <div>
                <Container fluid className="StudentCare-container">
                    <NavBar isMA={true} />

                        <Container fluid className="StudentCare-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="StudentCare-topContentContainer">
                                        <Row id="StudentCare-firstRow">
                                            <Col md={12} className="text-left" id="StudentCare-firstRowCol">
                                                <h4 id="StudentCare-title">Student Care</h4>
                                            </Col>
                                        </Row>

                                        <Row id="StudentCare-secondRow">
                                            <Col md={12} id="StudentCare-secondRowCol">
                                                <Tab.Container defaultActiveKey="workPlayLive">
                                                    <Row className="StudentCare-secondInnerRow">
                                                        <Col md={12} className="StudentCare-secondInnerCol">
                                                            <Nav defaultActiveKey="workPlayLive" className="StudentCare-nav" variant="tabs">
                                                                <Col className="text-center StudentCare-navItemCon">
                                                                    <Nav.Item className="StudentCare-navItems">
                                                                        <Nav.Link eventKey="workPlayLive" className="StudentCare-navLinks">Work, play and <br/>live well</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col className="text-center StudentCare-navItemCon">
                                                                    <Nav.Item className="StudentCare-navItems">
                                                                        <Nav.Link eventKey="studentWellnessCentre" className="StudentCare-navLinks">Student Wellness Centre</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col className="text-center StudentCare-navItemCon">
                                                                    <Nav.Item className="StudentCare-navItems">
                                                                        <Nav.Link eventKey="counsellingService" className="StudentCare-navLinks">Counselling <br/>Service</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col className="text-center StudentCare-navItemCon">
                                                                    <Nav.Item className="StudentCare-navItems">
                                                                        <Nav.Link eventKey="simPeerSupport" className="StudentCare-navLinks">SIM <br/>Peer Support</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col className="text-center StudentCare-navItemCon">
                                                                    <Nav.Item className="StudentCare-navItems">
                                                                        <Nav.Link eventKey="simWellnessAdvocates" className="StudentCare-navLinks">SIM Wellness Advocates</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>
                                                    
                                                    <Row className="StudentCare-secondInnerRow">
                                                        <Col md={12} className="StudentCare-secondInnerCol">
                                                            <Tab.Content>
                                                                
                                                                {/* Work, play and live well */}
                                                                <Tab.Pane eventKey="workPlayLive">
                                                                    <Row id="StudentCare-secondRow">
                                                                        <Col md={12} className="text-center StudentCare-tableColCon">
                                                                            <Table responsive="sm" bordered className="StudentCare-tableCon">
                                                                                <thead id="StudentCare-tableHeader">
                                                                                    <tr>
                                                                                        <th>Description</th>
                                                                                        <th id="StudentCare-editHeading">Edit</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                {this.state.workArray && this.state.workArray.map((workPlayLive) => {
                                                                                    return (
                                                                                        <tbody id="StudentCare-tableBody" key={workPlayLive.workId}>
                                                                                            <tr>
                                                                                                <td className="text-left">{workPlayLive.workDescription}</td>
                                                                                                <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handleWorkEditModal(workPlayLive)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    )
                                                                                })}
                                                                            </Table>
                                                                        </Col>
                                                                    </Row>

                                                                    <div id="border"></div>
                                                                    <Row id="StudentCare-titleRow">
                                                                        <Col md={12} className="text-left" id="StudentCare-titleRowCol">
                                                                            <h6 id="StudentCare-title">Activities</h6>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row id="StudentCare-secondRow">
                                                                        <Col md={12} className="text-center" id="StudentCare-secondRowCol">
                                                                            <Table responsive="sm" bordered id="StudentCare-tableContainer">
                                                                                <thead id="StudentCare-tableHeader">
                                                                                    <tr>
                                                                                        <th>Activity Name</th>
                                                                                        <th id="StudentCare-LogoHeading">Logo File</th>
                                                                                        <th id="StudentCare-editHeading">Edit</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                {this.state.activityArray && this.state.activityArray.map((activities) => {
                                                                                    return (
                                                                                        <tbody id="StudentCare-tableBody" key={activities.activityId}>
                                                                                            <tr>
                                                                                                <td>{activities.activityName}</td>
                                                                                                <td>{activities.activityName} Logo</td>
                                                                                                <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handleActivityEditModal(activities)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    )
                                                                                })}
                                                                                
                                                                            </Table>
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>

                                                                {/* Student Wellness Centre */}
                                                                <Tab.Pane eventKey="studentWellnessCentre">
                                                                    <Col md={12} className="text-center StudentCare-tableColCon">
                                                                        <Table responsive="sm" bordered className="StudentCare-tableCon">
                                                                            <thead id="StudentCare-tableHeader">
                                                                                <tr>
                                                                                    <th>Description</th>
                                                                                    <th id="StudentCare-LogoHeading">Logo File</th>
                                                                                    <th id="StudentCare-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.studentWellnessArray && this.state.studentWellnessArray.map((studentWellness) => {
                                                                                return (
                                                                                    <tbody id="StudentCare-tableBody" key={studentWellness.studentWellnessId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{studentWellness.studentWellnessDescription}</td>
                                                                                            <td>{studentWellness.logoFieldName} Logo</td>
                                                                                            <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handleStudentWellnessEditModal(studentWellness)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Counselling Service */}
                                                                <Tab.Pane eventKey="counsellingService">
                                                                    <Col md={12} className="text-center StudentCare-tableColCon">
                                                                        <Table responsive="sm" bordered className="StudentCare-tableCon">
                                                                            <thead id="StudentCare-tableHeader">
                                                                                <tr>
                                                                                    <th>Description</th>
                                                                                    <th id="StudentCare-LogoHeading">Logo File</th>
                                                                                    <th id="StudentCare-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.counsellingServiceArray && this.state.counsellingServiceArray.map((counsellingService) => {
                                                                                return (
                                                                                    <tbody id="StudentCare-tableBody" key={counsellingService.counsellingServiceId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{counsellingService.counsellingServiceDescription}</td>
                                                                                            <td>{counsellingService.logoFieldName} Logo</td>
                                                                                            <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handleCounsellingServiceEditModal(counsellingService)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                                
                                                                {/* Sim Peer Support */}
                                                                <Tab.Pane eventKey="simPeerSupport">
                                                                    <Col md={12} className="text-center StudentCare-tableColCon">
                                                                        <Table responsive="sm" bordered className="StudentCare-tableCon">
                                                                            <thead id="StudentCare-tableHeader">
                                                                                <tr>
                                                                                    <th>Description</th>
                                                                                    <th id="StudentCare-LogoHeading">Logo File</th>
                                                                                    <th id="StudentCare-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.peerSupportArray && this.state.peerSupportArray.map((peerSupport) => {
                                                                                return (
                                                                                    <tbody id="StudentCare-tableBody" key={peerSupport.peerSupportId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{peerSupport.peerSupportDescription}</td>
                                                                                            <td>{peerSupport.logoFieldName} Logo</td>
                                                                                            <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handlePeerSupportEditModal(peerSupport)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>

                                                                {/* Sim Wellness Advocates */}
                                                                <Tab.Pane eventKey="simWellnessAdvocates">
                                                                    <Col md={12} className="text-center StudentCare-tableColCon">
                                                                        <Table responsive="sm" bordered className="StudentCare-tableCon">
                                                                            <thead id="StudentCare-tableHeader">
                                                                                <tr>
                                                                                    <th>Description</th>
                                                                                    <th id="StudentCare-LogoHeading">Logo File</th>
                                                                                    <th id="StudentCare-editHeading">Edit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {this.state.wellnessAdvocatesArray && this.state.wellnessAdvocatesArray.map((wellnessAdvocate) => {
                                                                                return (
                                                                                    <tbody id="StudentCare-tableBody" key={wellnessAdvocate.wellnessAdvocatesId}>
                                                                                        <tr>
                                                                                            <td className="text-left">{wellnessAdvocate.wellnessAdvocatesDescription}</td>
                                                                                            <td>{wellnessAdvocate.logoFieldName} Logo</td>
                                                                                            <td><Button size="sm" id="StudentCare-editBtn" onClick={() => this.handleWellnessAdvocatesEditModal(wellnessAdvocate)}><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                )
                                                                            })}
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Col>
                                                    </Row>

                                                </Tab.Container>
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>

                {/* WorkPlayLive Edit Modal */}
                {this.state.workEditModal == true ? 
                    <Modal show={this.state.workEditModal} onHide={this.handleWorkEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="2x" icon={faFutbol}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="StudentCare-textAreas" as="textarea" rows="4" type="text" name="workDescription" placeholder="Work, Play and Live Well Description" required defaultValue={this.state.workDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.workDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="StudentCare-editFooter">
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-saveBtn" type="submit" onClick={() => this.handleWorkUpdate(this.state.workId)}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-cancelBtn" onClick={this.handleWorkEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Activities Edit Modal */}
                {this.state.activityEditModal == true ? 
                    <Modal show={this.state.activityEditModal} onHide={this.handleActivityEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Activities</Modal.Title>
                        </Modal.Header>
                        {this.state.activityArray && this.state.activityArray.map((activities) => {
                            if (this.state.activityId === activities.activityId) {
                                return (
                                    <div>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="StudentCare-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faBiking}/>
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.Control id="StudentCare-inputFields" type="text" name="activityName" placeholder="Activity Name: E.g. Cycling" required defaultValue={activities.activityName} onChange={this.updateInput} noValidate></Form.Control>
                                                            <div className="errorMessage">{this.state.activityNameError}</div>
                                                        </Form.Group>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="StudentCare-formGroup">
                                                        <img height="100px" width="100px" src={this.state.activityLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                                    </Form.Group>                     
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Group as={Row} className="StudentCare-formGroup">
                                                        <Form.Group as={Col} md="1">
                                                            <FontAwesomeIcon size="lg" icon={faFileImage} />
                                                        </Form.Group> 
                                                        <Form.Group as={Col} md="7">
                                                            <Form.File type="file" name="imgFile" className="StudentCare-imgFile" label={activities.activityLogo} onChange={(e) => this.handleFileUpload(e, activities.activityId)} custom required></Form.File>
                                                            <div className="errorMessage">{this.state.activityLogoError}</div>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Container>
                                                <Row id="StudentCare-editFooter">
                                                    <Col md={6} className="StudentCare-editCol">
                                                        <Button id="StudentCare-saveBtn" type="submit" onClick={() => this.handleWorkUpdate(activities.activityId)}>Save Changes</Button>
                                                    </Col>
                                                    <Col md={6} className="StudentCare-editCol">
                                                        <Button id="StudentCare-cancelBtn" onClick={this.handleActivityEditModal}>Cancel</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Modal.Footer>
                                    </div>
                                )
                            }
                        })}
                    </Modal>: ''
                }

                {/* Student Wellness Centre Edit Modal */}
                {this.state.studentWellnessEditModal == true ? 
                    <Modal show={this.state.studentWellnessEditModal} onHide={this.handleStudentWellnessEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faSpa}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="StudentCare-textAreas" as="textarea" rows="4" type="text" name="studentWellnessDescription" placeholder="Student Wellness Centre Description" required defaultValue={this.state.studentWellnessDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.studentWellnessDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <img height="50px" width="50px" src={this.state.studentWellnessLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="StudentCare-imgFile" label={this.state.studentWellnessLogo} onChange={(e) => this.handleFileUpload(e, this.state.studentWellnessId)} custom required></Form.File>
                                                <div className="errorMessage">{this.state.studentWellnessLogoError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="StudentCare-editFooter">
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-saveBtn" type="submit" onClick={() => {this.handleUpdate(this.state.studentWellnessId)}}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-cancelBtn" onClick={this.handleStudentWellnessEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* Counselling Service Edit Modal */}
                {this.state.counsellingServiceEditModal == true ? 
                    <Modal show={this.state.counsellingServiceEditModal} onHide={this.handleCounsellingServiceEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faComments}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="StudentCare-textAreas" as="textarea" rows="4" type="text" name="counsellingServiceDescription" placeholder="Counselling Service Description" required defaultValue={this.state.counsellingServiceDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.counsellingServiceDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <img height="50px" width="50px" src={this.state.counsellingServiceLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="StudentCare-imgFile" label={this.state.counsellingServiceLogo} onChange={(e) => this.handleFileUpload(e, this.state.counsellingServiceId)} custom required></Form.File>
                                                <div className="errorMessage">{this.state.counsellingServiceLogoError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="StudentCare-editFooter">
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-saveBtn" type="submit" onClick={() => {this.handleUpdate(this.state.counsellingServiceId)}}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-cancelBtn" onClick={this.handleCounsellingServiceEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* SIM Peer Support Edit Modal */}
                {this.state.peerSupportEditModal == true ? 
                    <Modal show={this.state.peerSupportEditModal} onHide={this.handlePeerSupportEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faUsers}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="StudentCare-textAreas" as="textarea" rows="4" type="text" name="peerSupportDescription" placeholder="SIM Peer Support Description" required defaultValue={this.state.peerSupportDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.peerSupportDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <img height="50px" width="50px" src={this.state.peerSupportLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="StudentCare-imgFile" label={this.state.peerSupportLogo} onChange={(e) => this.handleFileUpload(e, this.state.peerSupportId)} custom required></Form.File>
                                                <div className="errorMessage">{this.state.peerSupportLogoError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="StudentCare-editFooter">
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-saveBtn" type="submit" onClick={() => {this.handleUpdate(this.state.peerSupportId)}}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-cancelBtn" onClick={this.handlePeerSupportEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

                {/* SIM Wellness Advocates Edit Modal */}
                {this.state.wellnessAdvocatesEditModal == true ? 
                    <Modal show={this.state.wellnessAdvocatesEditModal} onHide={this.handleWellnessAdvocatesEditModal} size="lg" centered keyboard={false}>
                        <Modal.Header closeButton className="justify-content-center">
                            <Modal.Title id="StudentCare-modalTitle" className="w-100">Edit Description</Modal.Title>
                        </Modal.Header>
                        <div>
                            <Modal.Body>
                                <Form noValidate>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faSpa}/>
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.Control id="StudentCare-textAreas" as="textarea" rows="4" type="text" name="wellnessAdvocatesDescription" placeholder="SIM Wellness Advocates Description" required defaultValue={this.state.wellnessAdvocatesDescription} onChange={this.updateInput} noValidate></Form.Control>
                                                <div className="errorMessage">{this.state.wellnessAdvocatesDescriptionError}</div>
                                            </Form.Group>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <img height="50px" width="50px" src={this.state.wellnessAdvocatesLogo} style={{marginTop: "1%", marginBottom: "1%"}}/>
                                        </Form.Group>                     
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group as={Row} className="StudentCare-formGroup">
                                            <Form.Group as={Col} md="1">
                                                <FontAwesomeIcon size="lg" icon={faFileImage} />
                                            </Form.Group> 
                                            <Form.Group as={Col} md="7">
                                                <Form.File type="file" name="imgFile" className="StudentCare-imgFile" label={this.state.wellnessAdvocatesLogo} onChange={(e) => this.handleFileUpload(e, this.state.wellnessAdvocatesId)} custom required></Form.File>
                                                <div className="errorMessage">{this.state.wellnessAdvocatesLogoError}</div>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container>
                                    <Row id="StudentCare-editFooter">
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-saveBtn" type="submit" onClick={() => {this.handleUpdate(this.state.wellnessAdvocatesId)}}>Save Changes</Button>
                                        </Col>
                                        <Col md={6} className="StudentCare-editCol">
                                            <Button id="StudentCare-cancelBtn" onClick={this.handleWellnessAdvocatesEditModal}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Footer>
                        </div>
                    </Modal>: ''
                }

            </div>

        );
    }
}
export default StudentCare;
