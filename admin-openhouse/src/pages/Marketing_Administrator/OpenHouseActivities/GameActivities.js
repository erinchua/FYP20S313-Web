import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/GameActivities.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHourglassEnd, faHourglassStart, faPlus, faSchool, faTrash, faMapPin, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

class GameActivities extends Component {
    constructor() {
        super();
        this.state = {
            date: "",
            pointsAward: "",
            startTime: "",
            gameBoothName: "",
            venue: "",
            boothNumber: "",
            //Below states are for the functions
            openHouseDates: "",
            gamesActivities: "",
            sortBoothNo: "",
            //Below states are for the modals
            addModal: false,
            editModal: false,
            deleteModal: false,
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

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        this.authListener();
    }

    display= () => {
        // var getYear = new Date().getFullYear();
        // console.log(getYear);
    
        // const db = fire.firestore();
        // const gameactivities = [];
        // const userRef = db
        // .collection("GamesActivities")
        // .get()
        // .then((snapshot) => {
        //     snapshot.forEach((doc) => {
        //         gameactivities.push(doc.data().date);
        //     });
        //     console.log(gameactivities);
        //     function onlyUnique(value, index, self) {
        //         return self.indexOf(value) === index;
        //     }
        //     var unique = gameactivities.filter(onlyUnique);
        //     console.log(unique);

        //     //day1
        //     const day1date = [];
        //     day1date.push(unique[0]);
        //     this.setState({ day1date: day1date });
        //     const day1  = db
        //     .collection("GamesActivities").where("date", "==", unique[0])
        //     .get()
        //     .then((snapshot) => {
        //         const gameactivities = [];
        //         snapshot.forEach((doc) => {
        //             const data = {
        //             docid : doc.id,
        //             id: doc.data().id,
        //             date: doc.data().date,
        //             pointsAward: doc.data().pointsAward,
        //             startTime: doc.data().startTime,
        //             gameBoothName: doc.data().gameBoothName,
        //             venue: doc.data().venue,
        //         };
        //             gameactivities.push(data);
        //         });
        //         this.setState({ day1: gameactivities });
        //     });

        //     //day 2
        //     const day2date = [];
        //     day2date.push(unique[1]);
        //     this.setState({ day2date: day2date });
        //     const day2  = db
        //     .collection("GamesActivities").where("date", "==", unique[1])
        //     .get()
        //     .then((snapshot) => {
        //         const gameactivities = [];
        //         snapshot.forEach((doc) => {
        //             const data = {
        //                 docid : doc.id,
        //                 id: doc.data().id,
        //                 date: doc.data().date,
        //                 pointsAward: doc.data().pointsAward,
        //                 startTime: doc.data().startTime,
        //                 gameBoothName: doc.data().gameBoothName,
        //                 venue: doc.data().venue,
        //             };
        //             gameactivities.push(data);                
        //         });
        //         this.setState({ day2: gameactivities });
        //     });
        // });   

        const db = fire.firestore();
        const dates = [];
        const orders = [];
        const array = [];
        const sort = [];

        //Retrieve Open House Dates from Openhouse Collection
        const retrieveDate = db
        .collection("Openhouse")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.get('day')
                for (var i = 0; i < Object.keys(data).length; i++) {
                    const retrieved = {
                        date: data[Object.keys(data)[i]].date
                    };
                    dates.push(retrieved)
                }
            });
            this.setState({openHouseDates: dates})
        })

        const ordering = db.collection("GamesActivities")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const data = {
                    boothNumber: doc.data().boothNumber
                };
                orders.push(data);
            });
            for (var i = 0; i < Object.keys(orders).length; i++) {
                var data = orders[i].boothNumber;
                array.push(data)
                var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                const order = {
                    boothNumber: array.sort(collator.compare)
                }
                sort.push(order);
                
            }
            this.setState ({sortBoothNo: sort})            
        });
        
        const userRef = db
        .collection("GamesActivities").orderBy("boothNumber", "asc")
        .get()
        .then((snapshot) => {
            const gamesActivities = [];
            snapshot.forEach((doc) => {
                if (doc.data().date === dates[0].date) {
                    const data = {
                        date: doc.data().date,
                        pointsAward: doc.data().pointsAward,
                        startTime: doc.data().startTime,
                        gameBoothName: doc.data().gameBoothName,
                        venue: doc.data().venue,
                        id: doc.id,
                        boothNumber: doc.data().boothNumber,
                    };
                    gamesActivities.push(data);
                } else {
                    const data = {
                        date: doc.data().date,
                        pointsAward: doc.data().pointsAward,
                        startTime: doc.data().startTime,
                        gameBoothName: doc.data().gameBoothName,
                        venue: doc.data().venue,
                        id: doc.id,
                        boothNumber: doc.data().boothNumber,
                    };
                    gamesActivities.push(data);
                }

            });            
            this.setState({ gamesActivities: gamesActivities });
        });

        
    }

    addGameActivities = (e) => {
        e.preventDefault();
        const db = fire.firestore();
        var lastdoc = db.collection("GamesActivities").orderBy('id', 'desc')
        .limit(1).get().then((snapshot) =>  {
            snapshot.forEach((doc) => {
                var docid= "";
                var res = doc.data().id.substring(9);
                var id = parseInt(res)
                if(id.toString().length <= 1) {
                    docid = "activity-00" + (id + 1) 
                } else if(id.toString().length <= 2) {
                    docid = "activity-0" + (id + 1) 
                } else {
                    docid = "activity-0" + (id + 1) 
                }
                console.log(docid)
                const userRef = db
                .collection("GamesActivities")
                .doc(docid)
                .set({
                    date: this.state.date,
                    pointsAward: this.state.pointsAward,
                    startTime: this.state.startTime,
                    gameBoothName: this.state.gameBoothName,
                    venue: this.state.venue,
                    id : docid,
                })
                .then(function () {
                    window.location.reload();
                });
            })
        })
    };

    DeleteGameActivities(e, gameactivitiesid) {
        const db = fire.firestore();
        const userRef = db
        .collection("GamesActivities")
        .doc(gameactivitiesid)
        .delete()
        .then(function () {
            console.log("Deleted the Game/Activity");
            window.location.reload();
        });
    }

    update(e, gameactivitiesid) {
        const gameBoothName = document.getElementById(gameactivitiesid + "gameboothname").value
        const pointsAward = document.getElementById(gameactivitiesid + "pointsaward").value
        const venue = document.getElementById(gameactivitiesid + "venue").value

        const db = fire.firestore();
        if (gameBoothName != null && pointsAward != null && venue != null) {
        const userRef = db
            .collection("GamesActivities")
            .doc(gameactivitiesid)
            .update({
                pointsAward: pointsAward,
                gameBoothName: gameBoothName,
                venue: venue,
            })
            .then(function () {
                console.log("Updated the Game/Activity");
                window.location.reload();
            });
        }
    }

    editGameActivities(e, gameactivitiesid) {
        document.getElementById(gameactivitiesid + "spangameboothname").removeAttribute("hidden");
        document.getElementById(gameactivitiesid + "spanpointsaward").removeAttribute("hidden");
        document.getElementById(gameactivitiesid + "spanvenue").removeAttribute("hidden");
        document.getElementById(gameactivitiesid + "editbutton").setAttribute("hidden", "");
        document.getElementById(gameactivitiesid + "updatebutton").removeAttribute("hidden");
        document.getElementById(gameactivitiesid + "cancelbutton").removeAttribute("hidden");
        var texttohide = document.getElementsByClassName(
            gameactivitiesid + "text"
        );
        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].setAttribute("hidden", "");
        }  
    }

    CancelEdit(e, gameactivitiesid) {
        document.getElementById(gameactivitiesid + "spangameboothname").setAttribute("hidden", "");
        document.getElementById(gameactivitiesid + "spanpointsaward").setAttribute("hidden", "");
        document.getElementById(gameactivitiesid + "spanvenue").setAttribute("hidden", "");
        document.getElementById(gameactivitiesid + "editbutton").removeAttribute("hidden");
        document.getElementById(gameactivitiesid + "updatebutton").setAttribute("hidden", "");
        document.getElementById(gameactivitiesid + "cancelbutton").setAttribute("hidden", "");
        var texttohide = document.getElementsByClassName(
            gameactivitiesid + "text"
        );
        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].removeAttribute("hidden", "");
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="GamesActivities-container">
                    <NavBar isMA={true} />

                        <Container fluid className="GamesActivities-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="GamesActivities-topContentContainer">
                                        <Row id="GamesActivities-firstRow">
                                            <Col md={6} className="text-left" id="GamesActivities-firstRowCol">
                                                <h4 id="GamesActivities-title">Games & Activities</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="GamesActivities-firstRowCol">
                                                <Button id="GamesActivities-addBtn"><FontAwesomeIcon size="lg" icon={faPlus} /><span id="GamesActivities-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="GamesActivities-secondRow">
                                            <Col md={12} id="GamesActivities-secondRowCol">
                                                <Tab.Container defaultActiveKey="day1">
                                                    <Row className="GamesActivities-secondInnerRow">
                                                        <Col md={12} className="GamesActivities-secondInnerCol">
                                                                {this.state.openHouseDates ?
                                                                    <Nav defaultActiveKey="day1" className="GamesActivities-nav" variant="tabs">
                                                                        <Col md={6} className="text-center GamesActivities-navItemCon">
                                                                            <Nav.Item className="GamesActivities-navItems">
                                                                                <Nav.Link eventKey="day1" className="GamesActivities-navLinks">{this.state.openHouseDates[0].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>

                                                                        <Col md={6} className="text-center GamesActivities-navItemCon">
                                                                            <Nav.Item className="GamesActivities-navItems">
                                                                                <Nav.Link eventKey="day2" className="GamesActivities-navLinks">{this.state.openHouseDates[1].date}</Nav.Link>
                                                                            </Nav.Item>
                                                                        </Col>
                                                                    </Nav> : ''
                                                                }
                                                        </Col>
                                                    </Row>

                                                    <Row className="GamesActivities-secondInnerRow">
                                                        <Col md={12} className="GamesActivities-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="day1">
                                                                    <Col md={12} className="text-center GamesActivities-tableColCon">
                                                                        <Table responsive="sm" bordered className="GamesActivities-tableCon">
                                                                            <thead className="GamesActivities-tableHeader">
                                                                                <tr>
                                                                                    <th>Booth No.</th>
                                                                                    <th>Booth Name</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Points</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GamesActivities-tableBody">
                                                                                {this.state.gamesActivities && this.state.gamesActivities.map((day1) => {
                                                                                    let i = 0;
                                                                                    if (day1.date === this.state.openHouseDates[0].date) {
                                                                                        if (day1.boothNumber == this.state.sortBoothNo[i].boothNumber[i]) {
                                                                                            i++;
                                                                                            console.log(i)
                                                                                            return (
                                                                                                <tr>
                                                                                                    <td>{day1.boothNumber}</td>
                                                                                                    <td>{day1.gameBoothName}</td>
                                                                                                    <td>{day1.startTime}</td>
                                                                                                    <td>{day1.venue}</td>
                                                                                                    <td>{day1.pointsAward}</td>
                                                                                                    <td><Button size="sm" id="GamesActivities-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                    <td><Button size="sm" id="GamesActivities-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                                </tr>
                                                                                            )

                                                                                        }
                                                                                    } else {
                                                                                        return ('')
                                                                                    }
                                                                                    
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>


                                                                <Tab.Pane eventKey="day2">
                                                                    <Col md={12} className="text-center GamesActivities-tableColCon">
                                                                        <Table responsive="sm" bordered className="GamesActivities-tableCon">
                                                                            <thead className="GamesActivities-tableHeader">
                                                                                <tr>
                                                                                    <th>Booth No.</th>
                                                                                    <th>Booth Name</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Points</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="GamesActivities-tableBody">
                                                                                {this.state.gamesActivities && this.state.gamesActivities.map((day2) => {
                                                                                    if (day2.date === this.state.openHouseDates[1].date) {
                                                                                        return (
                                                                                            <tr>
                                                                                                <td>{day2.boothNumber}</td>
                                                                                                <td>{day2.gameBoothName}</td>
                                                                                                <td>{day2.startTime}</td>
                                                                                                <td>{day2.venue}</td>
                                                                                                <td>{day2.pointsAward}</td>
                                                                                                <td><Button size="sm" id="GamesActivities-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                                <td><Button size="sm" id="GamesActivities-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        return ('')
                                                                                    }
                                                                                })}
                                                                            </tbody>
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

            </div>




            // <div className="home">
            //     {/* day1 */}
            //     <div>
            //     {this.state.day1date &&
            //             this.state.day1date.map((day1) => {
            //             return (
            //                 <p>{day1}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">Booth No.</th>
            //             <th scope="col">Booth Name</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Points</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day1 &&
            //             this.state.day1.map((day1,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.gameBoothName}
            //                     </span>
                                
            //                     <span id={day1.docid + "spangameboothname"} hidden>
            //                     <input
            //                         id={day1.docid + "gameboothname"}
            //                         defaultValue={day1.gameBoothName}
            //                         type="text"
            //                         name={day1.docid + "gameboothname"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.gameBoothName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.venue}
            //                     </span>
            //                     <span id={day1.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day1.docid + "venue"}
            //                         defaultValue={day1.venue}
            //                         type="text"
            //                         name={day1.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.pointsAward}
            //                     </span>
            //                     <span id={day1.docid + "spanpointsaward"} hidden>
            //                     <input
            //                         id={day1.docid + "pointsaward"}
            //                         defaultValue={day1.pointsAward}
            //                         type="text"
            //                         name={day1.docid + "pointsaward"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.pointsAward}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day1.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editGameActivities(e, day1.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day1.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day1.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day1.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day1.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeleteGameActivities(e, day1.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     <div>
            //     {/* day2 */}
            //     {this.state.day2date &&
            //             this.state.day2date.map((day2) => {
            //             return (
            //                 <p>{day2}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">Booth No.</th>
            //             <th scope="col">Booth Name</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Points</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day2 &&
            //             this.state.day2.map((day2,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.gameBoothName}
            //                     </span>
                                
            //                     <span id={day2.docid + "spangameboothname"} hidden>
            //                     <input
            //                         id={day2.docid + "gameboothname"}
            //                         defaultValue={day2.gameBoothName}
            //                         type="text"
            //                         name={day2.docid + "gameboothname"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.gameBoothName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.venue}
            //                     </span>
            //                     <span id={day2.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day2.docid + "venue"}
            //                         defaultValue={day2.venue}
            //                         type="text"
            //                         name={day2.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.pointsAward}
            //                     </span>
            //                     <span id={day2.docid + "spanpointsaward"} hidden>
            //                     <input
            //                         id={day2.docid + "pointsaward"}
            //                         defaultValue={day2.pointsAward}
            //                         type="text"
            //                         name={day2.docid + "pointsaward"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.pointsAward}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day2.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editGameActivities(e, day2.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day2.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day2.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day2.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day2.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeleteGameActivities(e, day2.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     <form onSubmit={this.addGameActivities}>
            //     <input
            //         type="text"
            //         name="gameBoothName"
            //         placeholder="Game Booth Name"
            //         onChange={this.updateInput}
            //         value={this.state.gameBoothName}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="date"
            //         placeholder="Date"
            //         onChange={this.updateInput}
            //         value={this.state.date}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="startTime"
            //         placeholder="Start Time"
            //         onChange={this.updateInput}
            //         value={this.state.startTime}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="pointsAward"
            //         placeholder="Points"
            //         onChange={this.updateInput}
            //         value={this.state.pointsAward}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="venue"
            //         placeholder="Venue"
            //         onChange={this.updateInput}
            //         value={this.state.venue}
            //         required
            //     />
            //     <button type="submit">Add Game Activities</button>
            //     </form>
            // </div>
        );
    }
}

export default GameActivities;
