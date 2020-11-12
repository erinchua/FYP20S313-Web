import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import React, { Component } from "react";
import { auth, db } from "../../../config/firebase";
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
        let params = this.props.location.search;
    
        params = params.substring(4);
    
        var a = this;
        var counter = 1;
    
        const questions = db
          .collectionGroup("Questions")
          .get()
          .then((snapshot) => {
            const questions = [];
            snapshot.forEach((doc) => {
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
          const replies = [];
          snapshot.forEach((doc) => {
            if (doc.data().questionId == params) {
              if (!doc.data().hasOwnProperty('commentId')){
                    const data = {
                        id: doc.data().id,
                        comment: doc.data().entry,
                        postedby: doc.data().posterName,
                        datetime: doc.data().dateTime,
                        deleted: doc.data().deleted.toString(),
                    };
                    comments.push(data);
              } else {
                    const data = {
                        id: doc.data().id,
                        reply: doc.data().entry,
                        postedby: doc.data().posterName,
                        datetime: doc.data().dateTime,
                        deleted: doc.data().deleted.toString(),
                        commentId: doc.data().commentId,
                    };
                     replies.push(data);
              }
              this.setState({ comments: comments });
              this.setState({ replies: replies });
            }
            
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
                                                            <div key={comments.id}>
                                                                <Row id="ViewForum-thirdRow">
                                                                    <Col md={12}>

                                                                        <Row className="ViewForum-commentCon">
                                                                            <p>{comments.comment}</p>
                                                                        </Row>
                                                                        <Row className="ViewForum-commentDetailsCon">
                                                                            <Col md={6} className="text-left">
                                                                                <p><b>Date/Time Posted: </b><span>{comments.datetime}</span></p>
                                                                            </Col>
                                                                            <Col md={6} className="text-right">
                                                                                <p><b>Posted by: </b><span>{comments.postedby}</span></p>
                                                                            </Col>
                                                                        </Row>

                                                                        {this.state.replies && this.state.replies.map((replies) => {
                                                                            if (replies.deleted.toString() === "false") {
                                                                                if(replies.commentId === comments.id){
                                                                                    return (
                                                                                        <Row className="ViewForum-replyRow justify-content-center">
                                                                                            <Col md={11} className="ViewForum-replyCol">
                                                                                                <Row className="ViewForum-replyInnerCon">
                                                                                                    <p>{replies.reply}</p>
                                                                                                </Row>
                                                                                                <Row className="ViewForum-replyInnerDetailsCon">
                                                                                                    <Col md={6} className="text-left">
                                                                                                        <p>
                                                                                                            <b>Date/Time Posted: </b>
                                                                                                            <span>{replies.datetime}</span>
                                                                                                        </p>
                                                                                                    </Col>
                                                                                                    <Col md={6} className="text-right">
                                                                                                        <p>
                                                                                                            <b>Posted by: </b>
                                                                                                            <span>{replies.postedby}</span>
                                                                                                        </p>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                } else {
                                                                                    return(null)
                                                                                }
                                                                            } else {
                                                                                return (
                                                                                    <Row className="ViewForum-replyRow justify-content-center">
                                                                                        <Col md={11} className="ViewForum-replyCol">
                                                                                            <Row className="ViewForum-replyInnerCon">
                                                                                                <p>[Deleted]</p>
                                                                                            </Row>
                                                                                            <Row className="ViewForum-replyInnerDetailsCon">
                                                                                                <Col md={6} className="text-left">
                                                                                                    <p>
                                                                                                        <b>Date/Time Posted: </b>
                                                                                                        <span>{replies.datetime}</span>
                                                                                                    </p>
                                                                                                </Col>
                                                                                                <Col md={6} className="text-right">
                                                                                                    <p>
                                                                                                        <b>Posted by: </b>
                                                                                                        <span>{replies.postedby}</span>
                                                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Col>
                                                                                    </Row>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </Col>
                                                                </Row>
                                                                <div className="border"></div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (      
                                                        <div key={comments.id}>                                                                    
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
                                                                    
                                                                    {this.state.replies && this.state.replies.map((replies) => {
                                                                        if (replies.deleted.toString() === "false") {
                                                                            if(replies.commentId === comments.id){
                                                                                return (
                                                                                    <Row className="ViewForum-replyRow justify-content-center">
                                                                                        <Col md={11} className="ViewForum-replyCol">
                                                                                            <Row className="ViewForum-replyInnerCon">
                                                                                                <p>{replies.reply}</p>
                                                                                            </Row>
                                                                                            <Row className="ViewForum-replyInnerDetailsCon">
                                                                                                <Col md={6} className="text-left">
                                                                                                    <p>
                                                                                                        <b>Date/Time Posted: </b>
                                                                                                        <span>{replies.datetime}</span>
                                                                                                    </p>
                                                                                                </Col>
                                                                                                <Col md={6} className="text-right">
                                                                                                    <p>
                                                                                                        <b>Posted by: </b>
                                                                                                        <span>{replies.postedby}</span>
                                                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Col>
                                                                                    </Row>
                                                                                )
                                                                            } else {
                                                                                return(null)
                                                                            }
                                                                        } else {
                                                                            return (
                                                                                <Row className="ViewForum-replyRow justify-content-center">
                                                                                    <Col md={11} className="ViewForum-replyCol">
                                                                                        <Row className="ViewForum-replyInnerCon">
                                                                                            <p>[Deleted]</p>
                                                                                        </Row>
                                                                                        <Row className="ViewForum-replyInnerDetailsCon">
                                                                                            <Col md={6} className="text-left">
                                                                                                <p>
                                                                                                    <b>Date/Time Posted: </b>
                                                                                                    <span>{replies.datetime}</span>
                                                                                                </p>
                                                                                            </Col>
                                                                                            <Col md={6} className="text-right">
                                                                                                <p>
                                                                                                    <b>Posted by: </b>
                                                                                                    <span>{replies.postedby}</span>
                                                                                                </p>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                </Row>
                                                                            )
                                                                        }
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                            <div className="border"></div>
                                                        </div> 
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