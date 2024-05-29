import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/slices/authSlice";
import { caseListUpdate } from "../app/slices/caseListSlice";
import { connectedCaseUpdate } from "../app/slices/connectedCaseSlice";
import { usernameUpdate } from "../app/slices/usernameSlice";
import axios from "axios";


const Navbar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const username = useSelector((state) => state.username.username )
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase )

  const [noticeList, setNoticeList] = useState([])
  const [isUnreadNoticeExist, setIsUnreadNoticeExist] = useState(false)

  // 사이드바 이용을 위한 Initialization
  useEffect(() => {
    const SideBar = document.getElementById("slide-out");
    M.Sidenav.init(SideBar, {});
  }, []);


  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    headers: headers
  }


  // 알림함 목록 불러오기 axios
  useEffect(() => {
    axios.get(`${URL}/notice/`, reqData)
      .then((response) => {
        setNoticeList(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    setIsUnreadNoticeExist(noticeList.some(notice => notice.notice_read_dttm === null))
    console.log(isUnreadNoticeExist) 
  }, [noticeList])


  // 로그아웃
  const Logout = () => {
    dispatch(login())
    navigate("/login")

    setTimeout(() => {
      dispatch(caseListUpdate())
      dispatch(connectedCaseUpdate())
      dispatch(usernameUpdate())
    }, 1000)
  }

  // 홈으로 이동하는 함수
  const goToHome = () => {
    navigate("/home")
  }

  // 회원정보로 이동하는 함수
  const goToProfile = () => {
    navigate("/userinfo")
  }

  // 알림함으로 이동하는 함수
  const goToNotice = () => {
    navigate("/notice")
  }

  // 기기 관리로 이동하는 함수
  const goToCase = () => {
    navigate("/case/list")
  }

  return (
    <div>

      {/* 상단 네비게이션 바 */}
      <div id="navbar">
        <div id="navbar-left" data-target="slide-out" className="sidenav-trigger">
          <img src="/assets/menu_icon.png" alt="#" width="30%" />
        </div>
        <div id="navbar-center">
          <img src="/assets/myyak_logo.png" alt="#" width="70%" onClick={goToHome}/>
        </div>
        <div id="navbar-right">
          <div id="navbar-right-notice">
            {isUnreadNoticeExist ? (
              <img src="/assets/notice_unread_icon.png" alt="#" width="50%" onClick={goToNotice} />
            ) : (
              <img src="/assets/notice_icon.png" alt="#" width="50%" onClick={goToNotice} />
            )}
          </div>
          <div id="navbar-right-profile">
            <img src="/assets/profile_icon1.png" alt="#" width="70%" onClick={goToProfile}/>
          </div>
        </div>
      </div>


      {/* 메뉴 사이드 바 */}
      <ul id="slide-out" className="sidenav">

        <li>
          <div className="user-view">
            <div id="user-left">
              <Link to="/userinfo">
                <img className="circle sidenav-close" src="/assets/profile_icon.png" onClick={goToProfile}/>
              </Link>
            </div>
            <div id="user-right">
              {username} 님, 환영합니다!
            </div>
          </div>
        </li>

        <div id="sidebar-case-info">
          <div id="sidebar-connected-case-label">현재 접속한 기기</div>
          <div id="sidebar-connected-case-value">{connectedCase ? connectedCase.reg_nickname : "접속기기 없음"}</div>
          <div id="sidebar-go-to-caselist" className="sidenav-close" onClick={goToCase}>+ 기기 관리</div>
        </div>

        <li><Link to="/nowcase" id="sidebar-navigator-list" className="sidenav-close waves-effect waves">내 약통 정보</Link></li>
        <li><Link to="/bookmark" id="sidebar-navigator-list" className="sidenav-close waves-effect waves">자주 찾는 약</Link></li>
        <li><Link to="/usedmed" id="sidebar-navigator-list" className="sidenav-close waves-effect waves">복용중인 약</Link></li>
        <li><Link to="/map" id="sidebar-navigator-list" className="sidenav-close waves-effect waves">근처 약국 찾기</Link></li>

        <div id="sidebar-bottom">
          <div id="sidebar-logo"><img src="/assets/myyak_logo_black.png" alt="#" height="100%" /></div>
          <div id="logout" onClick={ Logout }><li><Link className="sidenav-close">로그아웃</Link></li></div>
        </div>
      </ul>

    </div>
  )
}
export default Navbar