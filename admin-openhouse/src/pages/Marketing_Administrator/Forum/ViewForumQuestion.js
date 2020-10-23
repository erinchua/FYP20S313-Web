import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Forum.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

class ViewForumQuestion extends Component {

    constructor() {
        super();
        // this.logout = this.logout.bind(this);
        this.state = {
          firstName: "",
          lastName: "",
          email: "",
          contactNo: "",
          dob: "",
          highestQualification: "",
          nationality: "",
          isSuspendedFromForum: "",
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
    
      display() {
        let params = this.props.location.search;
    
        params = params.substring(4);
    
        const db = fire.firestore();
        var a = this;
        var counter = 1;
    
        const questions = db
          .collectionGroup("Questions")
          .get()
          .then((snapshot) => {
            const questions = [];
            snapshot.forEach((doc) => {
              console.log(doc.data().id);
              if (doc.data().id == params) {
                const data = {
                  entry: doc.data().entry,
                  postedby: doc.data().posterName,
                  datetime: doc.data().dateTime,
                };
                questions.push(data);
              }
              this.setState({ question: questions });
            });
          });
    
        const comments = db.collectionGroup("Comments").onSnapshot((snapshot) => {
          const comments = [];
          snapshot.forEach((doc) => {
            if (doc.data().questionId == params) {
              const data = {
                commentid: doc.id,
                comment: doc.data().entry,
                postedby: doc.data().posterName,
                datetime: doc.data().dateTime,
                deleted: doc.data().deleted.toString(),
              };
              comments.push(data);
            }
            this.setState({ comments: comments });
          });
        });
      }

    render() {
        return (
            <div>
                {this.state.question &&
          this.state.question.map((question) => {
            return (
                <Container fluid className="Forum-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Forum-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Forum-topContentContainer">
                                        <Row id="ViewForum-firstRow">
                                            <Col md={12}>
                                                <Row>
                                                    <Button size="sm" id="ViewForum-backBtn" href="/Forum"><FontAwesomeIcon size="sm" icon={faHandPointLeft}/><span id="ViewForum-backText">Return to Forum</span></Button>
                                                </Row>
                                                <Row className="ViewForum-questionCon">
                                                    <h6>{question.entry}</h6>
                                                </Row>
                                                <Row className="ViewForum-questionDetailsCon">
                                                    <Col md={6} className="text-left">
                                                        <p><b>Date/Time Posted: </b><span>{question.datetime}</span></p>
                                                    </Col>
                                                    <Col md={6} className="text-right">
                                                        <p><b>Posted by: </b><span>{question.postedby}</span></p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row id="ViewForum-secondRow">
                                            <p id="ViewForum-secondRowText">Comments</p>
                                        </Row>
                                        {this.state.comments &&
                          this.state.comments.map((comments, index) => {
                            if (comments.deleted.toString() === "false") {
                              return (
                                <Row id="ViewForum-thirdRow">
                                  <Col md={5}>
                                    <Row className="ViewForum-replyRow justify-content-center">
                                      <Col
                                        md={11}
                                        className="ViewForum-replyCol"
                                      >
                                        <Row className="ViewForum-replyInnerCon">
                                          <p>{comments.comment}</p>
                                        </Row>
                                        <Row className="ViewForum-replyInnerDetailsCon">
                                          <Col md={6} className="text-left">
                                            <p>
                                              <b>Date/Time Posted: </b>
                                              <span>{comments.datetime}</span>
                                            </p>
                                          </Col>
                                          <Col md={6} className="text-right">
                                            <p>
                                              <b>Posted by: </b>
                                              <span>{comments.postedby}</span>
                                            </p>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              );
                            } else {
                              return (                                                                           
                                        <Row id="ViewForum-thirdRow">
                                            <Col md={12}>
                                                <Row className="ViewForum-commentCon">
                                                    <p>[Deleted]</p>
                                                </Row>
                                                <Row className="ViewForum-commentDetailsCon">
                                                    <Col md={6} className="text-left">
                                                        <p><b>Date/Time Posted: </b><span>{comments.datetime}</span></p>
                                                    </Col>
                                                    <Col md={6} className="text-right">
                                                        <p><b>Posted by: </b><span>{comments.postedby}</span></p>
                                                    </Col>
                                                </Row>
                                                
                                                {/*<Row className="ViewForum-replyRow justify-content-center">
                                                    <Col md={11} className="ViewForum-replyCol">
                                                        <Row className="ViewForum-replyInnerCon">
                                                            <p>Me too!</p>
                                                        </Row>
                                                        <Row className="ViewForum-replyInnerDetailsCon">
                                                            <Col md={6} className="text-left">
                                                                <p><b>Date/Time Posted: </b><span>21st November 2020, 8.35am</span></p>
                                                            </Col>
                                                            <Col md={6} className="text-right">
                                                                <p><b>Posted by: </b><span>Winston Obama</span></p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                 </Row>*/}
                                            </Col>
                                        </Row>
                                        );
                                    }
                                  })}
                                    </Container>
                                </Col>

                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>
                );
            })}
            </div>
        )
    }

}

export default ViewForumQuestion;