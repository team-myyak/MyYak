import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import M from "materialize-css"
import { connectedCaseUpdate } from "../app/slices/connectedCaseSlice";
import axios from 'axios'

const Home = () => {
  
  // 사용할 함수들 설정
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 사용할 변수 설정
  const caseList = useSelector((state) => state.caseList.caseList)
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase)
  const [bookmarkList, setBookmarkList] = useState([])

  // axios 요청에 사용할 변수
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    params: {
      "case_sn": connectedCase ? connectedCase.case_sn : null
    },
    headers: headers
  } 

  // 비로그인 상태 시 로그인 페이지로 이동
  useEffect(() => {
    if (!userToken) {
      navigate("/login")
    } else if (!caseList || caseList.length === 0) {
      navigate("/case/unregister")
    } else {
      axios.get(`${URL}/case/book/`, reqData)
      .then((response) => {
        console.log("북마크리스트 :", response.data)
        setBookmarkList(response.data)        
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }, [])

  
  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const dropdown = document.getElementById("caselist-select");
    M.Dropdown.init(dropdown, {});
  }, []);

  
  
  // 기기 전환하는 함수
  const changeCase = (caseItem) => {
    dispatch(connectedCaseUpdate(caseItem))
    navigate("/home")
  }

  // 긴 내용을 자르고 "..."으로 대체하는 함수
  const shortenContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };


  // 각 페이지로 이동하는 내비게이션
  const goToMedSearch = () => {
    navigate("/med/search")
  }
  const goToMedRegister = () => {
    navigate("/med/register/list")
  }
  const goToBookmark = () => {
    navigate("/bookmark")
  }
  const goToMap = () => {
    navigate("/map")
  }

  if (!caseList || caseList.length === 0) {
    return null
  }
  

  return (

    <div id="container">

      {/* 상단 내비게이션 바 */}
      <Navbar />

      <div id="main-page-contents">

        {/* 현재 접속 기기 선택 */}
        <div id="caselist-select-section">
          <div id="caselist-select" className="dropdown-trigger btn-flat" data-target="dropdown1">
            <div id="selected-case" className="white-text">{shortenContent(connectedCase.reg_nickname, 7)}</div>
            <div id="triangle"><img src="/assets/triangle_icon.png" alt="#" width="10rem" /></div>
          </div>
        </div>

        {/* 기기리스트 드롭다운 */}
        <ul id='dropdown1' class='dropdown-content'>
          {caseList.map((caseItem, index) => (
            <li key={ index } onClick={() => changeCase(caseItem)}><Link>{caseItem.reg_nickname}</Link></li>
          ))}
        </ul>
        
        {/* 메인버튼 섹션 */}
        <div id="main-buttons" className="row">

          {/* 약 찾기, 약 등록 버튼 */}
          <div id="main-buttons-up" className="row">
            <div className="col s6">
              <div id="main-button1" className="white z-depth-4 btn waves-effect waves" onClick={ goToMedSearch }>
                <div id="main-button1-icon"><img src="/assets/medicine_search_icon.png" alt="#" width="50%"/></div>
                <div id="main-button1-title">약 찾기</div>
              </div>
            </div>
            <div className="col s6">
            <div id="main-button1" className="white z-depth-4 btn waves-effect waves" onClick={ goToMedRegister }>
                <div id="main-button1-icon"><img src="/assets/medicine_register_icon.png" alt="#" width="50%"/></div>
                <div id="main-button1-title">약 등록</div>
              </div>
            </div>
          </div>

          {/* 근처 약국찾기 버튼 */}
          <div id="main-buttons-down" className="row">
            <div className="col s12">
              <div id="main-button2" className="white z-depth-4 btn waves-effect waves" onClick={goToMap}>
                <div id="main-button2-icon"><img src="/assets/pharmacy_icon.png" alt="#" width="80%"/></div>
                <div id="main-button2-title">근처 약국 찾기</div>
              </div>
            </div>
          </div>

          {/* 메인 소제목 */}
          <div id="main-page-small-title-section">
            <h5 id="main-page-small-title" className="white-text">자주 찾는 약</h5>
            <img id="main-page-small-title-icon" src="/assets/plus_white_shadow_icon.png" alt="#" height="50%" onClick={goToBookmark} />
          </div>
          
          {/* 자주찾는 약 */}
          {bookmarkList.every((item) => item === null) ? (
            <div id="main-bookmark-alert" className="white-text">자주 찾는 약 정보가 비어있습니다</div>
          ) : (
            <div id="main-bookmark-list" className="row">
              {bookmarkList.map((bookmarkItem, index) => (
                bookmarkItem && (
                  <div className="col s6">
                    <Link to="/med/info" state={{ slotNum: bookmarkItem.slot_id % 8 ? bookmarkItem.slot_id % 8 : 8 }}>
                      <div id="main-bookmark-item" className="btn waves-effect waves white black-text z-depth-3">{shortenContent(bookmarkItem.book_nickname, 6)}</div>
                    </Link>
                  </div>
                )
              ))}
            </div>
          )}

        </div>

      </div>
    </div>

  )
}

export default Home