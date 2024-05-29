import { Route, Routes, useLocation  } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import HomeRouter from "./routers/HomeRouter";
import LoginRouter from "./routers/LoginRouter";
import SignupRouter from "./routers/SignupRouter";
import SignupCompleteRouter from "./routers/SignupCompleteRouter";
import CaseUnregisterRouter from "./routers/case/CaseUnregisterRouter"; 
import CaseRegisterRouter from  "./routers/case/CaseRegisterRouter"; 
import CaseRegisterCompleteRouter from  "./routers/case/CaseRegisterCompleteRouter"; 
import CaseManagementRouter from  "./routers/case/CaseManagementRouter"; 
import CaseListRouter from  "./routers/case/CaseListRouter";
import UserInfoRouter from "./routers/user/UserInfoRouter";
import UserUpdateRouter from "./routers/user/UserUpdateRouter";
import MedRegisterListRouter from "./routers/med/MedRegisterListRouter";
import MedRegisterBarcodeRouter from "./routers/med/MedRegisterBarcodeRouter";
import MedRegisterNameRouter from "./routers/med/MedRegisterNameRouter";
import MedRegisterNewRouter from "./routers/med/MedRegisterNewRouter";
import MedUpdateRouter from "./routers/med/MedUpdateRouter";
import MedSearchRouter from "./routers/med_search/MedSearchRouter";
import MedSearchResultRouter from "./routers/med_search/MedSearchResultRouter";
import MedInfoRouter from "./routers/med_search/MedInfoRouter";
import BookmarkListRouter from "./routers/bookmark/BookmarkListRouter";
import BookmarkRegisterRouter from "./routers/bookmark/BookmarkRegisterRouter";
import BookmarkUpdateRouter from "./routers/bookmark/BookmarkUpdateRouter";
import MedRegisterSearchRouter from "./routers/med/MedRegisterSearchRouter";
import NowCaseListRouter from "./routers/now_case/NowCaseListRouter";
import UsedMedListRouter from "./routers/used_med/UsedMedListRouter";
import UsedMedRegisterRouter from "./routers/used_med/UsedMedRegisterRouter";
import NoticeListRouter from "./routers/notice/NoticeListRouter";
import NoticeDetailRouter from "./routers/notice/NoticeDetailRouter";
import MapKakaoRouter from "./routers/map/MapKakaoRouter";
import UsedMedRegisterDetailRouter from "./routers/used_med/UsedMedRegisterDetailRouter";
import UsedMedUpdateRouter from "./routers/used_med/UsedMedUpdateRouter";

import "./styles/styles.css"
import "./styles/animation.css"


function App() {
  const location = useLocation();

  return (
    <div id="App">
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<HomeRouter />}/>
            <Route path="/home" element={<HomeRouter />}/>
            <Route path="/login" element={<LoginRouter />}/>
            <Route path="/signup" element={<SignupRouter />}/>
            <Route path="/signup/complete" element={<SignupCompleteRouter />}/>
            <Route path="/case/unregister" element={<CaseUnregisterRouter />}/>
            <Route path="/case/register" element={<CaseRegisterRouter />}/>
            <Route path="/case/register/complete" element={<CaseRegisterCompleteRouter />}/>
            <Route path="/case/management" element={<CaseManagementRouter />}/>
            <Route path="/case/list" element={<CaseListRouter />}/>
            <Route path="/userinfo" element={<UserInfoRouter />}/>
            <Route path="/userinfo/update" element={<UserUpdateRouter />}/>
            <Route path="/med/register/list" element={<MedRegisterListRouter />}/>
            <Route path="/med/register/barcode" element={<MedRegisterBarcodeRouter />}/>
            <Route path="/med/register/name" element={<MedRegisterNameRouter />}/>
            <Route path="/med/register/search" element={<MedRegisterSearchRouter />} />
            <Route path="/med/register/new" element={<MedRegisterNewRouter />}/>
            <Route path="/med/register/update" element={<MedUpdateRouter />}/>
            <Route path="/med/search" element={<MedSearchRouter />}/>
            <Route path="/med/search/result" element={<MedSearchResultRouter />}/>
            <Route path="/med/info" element={<MedInfoRouter />}/>
            <Route path="/bookmark" element={<BookmarkListRouter />}/>
            <Route path="/bookmark/register" element={<BookmarkRegisterRouter />} />
            <Route path="/bookmark/update" element={<BookmarkUpdateRouter />} />
            <Route path="/nowcase" element={<NowCaseListRouter />} />
            <Route path="/usedmed" element={<UsedMedListRouter />} />
            <Route path="/usedmed/register" element={<UsedMedRegisterRouter />} />
            <Route path="/usedmed/register/detail" element={<UsedMedRegisterDetailRouter />} />
            <Route path="/usedmed/update" element={<UsedMedUpdateRouter />} />
            <Route path="/notice" element={<NoticeListRouter />} />
            <Route path="/notice/detail" element={<NoticeDetailRouter />} />
            <Route path="/map" element={<MapKakaoRouter />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}


export default App;


