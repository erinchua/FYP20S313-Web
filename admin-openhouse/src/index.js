import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import history from "./config/history";

import App from "./App";
import Login from "./pages/Login";
import SAHome from "./pages/Super_Administrator/SAHome";
import ResetPassword from "./pages/Marketing_Administrator/ResetPassword";
import StudentAccounts from "./pages/Marketing_Administrator/StudentAccounts";
import CampusFacilitiesMap from "./pages/Marketing_Administrator/CampusFacilitiesMap";
import Openhouse from "./pages/Marketing_Administrator/Openhouse";
import GettingToSIMHQ from "./pages/Marketing_Administrator/GettingToSIMHQ";
import Announcement from "./pages/Marketing_Administrator/Announcement";
import MAHome from "./pages/Marketing_Administrator/MAHome";
import ProgrammeTalkSchedule from "./pages/Marketing_Administrator/ProgrammeTalks/ProgrammeTalkSchedule";
import LiveTalk from "./pages/Marketing_Administrator/ProgrammeTalks/LiveTalk";
import PastRecording from "./pages/Marketing_Administrator/ProgrammeTalks/PastRecording";
import GuidedTour from "./pages/Marketing_Administrator/GuidedTour";
import Performances from "./pages/Marketing_Administrator/OpenHouseActivities/Performances";
import GameActivities from "./pages/Marketing_Administrator/OpenHouseActivities/GameActivities";
import Prizes from "./pages/Marketing_Administrator/OpenHouseActivities/Prizes";
import OpenHouseFeedback from "./pages/Marketing_Administrator/Useful_Info/OpenHouseFeedback";
import CommonFAQs from "./pages/Marketing_Administrator/Useful_Info/CommonFAQs";
import ArtsAndCulture from "./pages/Marketing_Administrator/StudentLife@SIM/ArtsAndCulture";
import InternationalStudentClub from "./pages/Marketing_Administrator/StudentLife@SIM/InternationalStudentClub";
import StudentCouncil from "./pages/Marketing_Administrator/StudentLife@SIM/StudentCouncil";
import SpecialInterestClub from "./pages/Marketing_Administrator/StudentLife@SIM/SpecialInterestClub";
import SportAndFitness from "./pages/Marketing_Administrator/StudentLife@SIM/SportAndFitness";
import StudentCare from "./pages/Marketing_Administrator/StudentLife@SIM/StudentCare";
import Forum from "./pages/Marketing_Administrator/Forum/Forum";
import ForumFlagged from "./pages/Marketing_Administrator/Forum/ForumFlagged";
import ForumSettings from "./pages/Marketing_Administrator/Forum/ForumSettings";
import ViewForumQuestion from "./pages/Marketing_Administrator/Forum/ViewForumQuestion";
import ArtsSocialSciences from "./pages/Marketing_Administrator/Study@SIM/Arts&SocialSciences";
import Business from "./pages/Marketing_Administrator/Study@SIM/Business";
import ITComputerSciences from "./pages/Marketing_Administrator/Study@SIM/IT&ComputerSciences";
import Nursing from "./pages/Marketing_Administrator/Study@SIM/Nursing";
import Specialty from "./pages/Marketing_Administrator/Study@SIM/Specialty";
import ContactInformation from "./pages/Marketing_Administrator/Useful_Info/ContactInformation";
import GenerateStudentRegistration from "./pages/Marketing_Administrator/GenerateReport/GenerateStudentRegistration";
import StudentLifeBrochure from "./pages/Marketing_Administrator/Brochure/StudentLifeBrochure";
import StudySIMBrochure from "./pages/Marketing_Administrator/Brochure/StudySIMBrochure";
import AttendanceMarkingScanner from "./pages/Crew/AttendanceMarkingScanner";
import AdmissionApplication from "./pages/Marketing_Administrator/Useful_Info/AdmissionApplication";
import GenerateAttendance from "./pages/Marketing_Administrator/GenerateReport/GenerateAttendance";
import OtherFinancialAssistance from "./pages/Marketing_Administrator/StudentLife@SIM/OtherFinancialAssistance";
import SIMGEBursary from "./pages/Marketing_Administrator/StudentLife@SIM/SIMGEBursary";
import Sponsors from "./pages/Marketing_Administrator/StudentLife@SIM/Sponsors";
import SIMGEScholarship from "./pages/Marketing_Administrator/StudentLife@SIM/SIMGEScholarship";
import Scholarship from "./pages/Marketing_Administrator/StudentLife@SIM/TestingScholarship";

import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/Login" component={Login} />
      <Route path="/ResetPassword" component={ResetPassword} />

      {/* Routes for Crew */}
      <Route path="/AttendanceMarkingScanner" component={AttendanceMarkingScanner} />

      {/* Routes for Super Admin */}
      <Route path="/SAHome" component={SAHome} />

      {/* Routes for Marketing Admin */}
      <Route path="/StudentAccounts" component={StudentAccounts} />
      <Route path="/CampusFacilitiesMap" component={CampusFacilitiesMap} />
      <Route path="/Openhouse" component={Openhouse} />
      <Route path="/GettingToSIMHQ" component={GettingToSIMHQ} />
      <Route path="/Announcement" component={Announcement} />
      <Route path="/MAHome" component={MAHome} />
      <Route path="/ProgrammeTalkSchedule" component={ProgrammeTalkSchedule} />
      <Route path="/LiveTalk" component={LiveTalk} />
      <Route path="/PastRecording" component={PastRecording} />
      <Route path="/GuidedTour" component={GuidedTour} />
      <Route path="/Performances" component={Performances} />
      <Route path="/GameActivities" component={GameActivities} />
      <Route path="/Prizes" component={Prizes} />
      <Route path="/OpenHouseFeedback" component={OpenHouseFeedback} />
      <Route path="/CommonFAQs" component={CommonFAQs} />
      <Route path="/ArtsAndCulture" component={ArtsAndCulture} />
      <Route path="/InternationalStudentClub" component={InternationalStudentClub} />
      <Route path="/StudentCouncil" component={StudentCouncil} />
      <Route path="/SpecialInterestClub" component={SpecialInterestClub} />
      <Route path="/SportAndFitness" component={SportAndFitness} />
      <Route path="/StudentCare" component={StudentCare} />
      <Route path="/Forum" component={Forum} />
      <Route path="/ForumFlagged" component={ForumFlagged} />
      <Route path="/ForumSettings" component={ForumSettings} />
      <Route path="/ViewForumQuestion" component={ViewForumQuestion} />
      <Route path="/Arts&SocialSciences" component={ArtsSocialSciences} />
      <Route path="/Business" component={Business} />
      <Route path="/IT&ComputerSciences" component={ITComputerSciences} />
      <Route path="/Nursing" component={Nursing} />
      <Route path="/Specialty" component={Specialty} />
      <Route path="/ContactInformation" component={ContactInformation} />
      <Route path="/GenerateStudentRegistration" component={GenerateStudentRegistration} />
      <Route path="/StudentLifeBrochure" component={StudentLifeBrochure} />
      <Route path="/StudySIMBrochure" component={StudySIMBrochure} />
      <Route path="/AdmissionApplication" component={AdmissionApplication} />
      <Route path="/GenerateAttendance" component={GenerateAttendance} />
      <Route path="/OtherFinancialAssistance" component={OtherFinancialAssistance} />
      <Route path="/SIMGEBursary" component={SIMGEBursary} />
      <Route path="/Sponsors" component={Sponsors} />
      <Route path="/SIMGEScholarship" component={SIMGEScholarship} />
      <Route path="/Scholarship" component={Scholarship} />
      
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
