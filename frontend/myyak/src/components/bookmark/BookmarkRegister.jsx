import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import M from "materialize-css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const BookmarkRegister = () => {
  
  // 사용할 함수들 설정
  const navigate = useNavigate()
  const location = useLocation()
  
  // 사용할 변수들 설정
  const [bookmarkNickname, setBookmarkNickname] = useState("")
  const [medList, setMedList] = useState([])
  const [selectedSlot, setSelectedSlot] = useState()
  const bookNum = location.state.bookNum
  
  const handleBookmarkNickname = (event) => {
    setBookmarkNickname(event.target.value)
  }
  const handleSelectedSlot = (event) => {
    setSelectedSlot(event.target.value)
  }

  // Select 이용을 위한 Initialization
  useEffect(() => {
    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects, {});
  }, [medList]);

  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const Modal = document.getElementById("bookmark-register-modal");
    M.Modal.init(Modal, {
      onCloseEnd: () => { goToList () }
    });
  }, []);

  const goToList = () => {
    navigate("/bookmark")
  }


  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const body = {
    "case_sn": connectedCase.case_sn,
    "book_nickname": bookmarkNickname,
    "slot_num": selectedSlot,
    "book_num_order": bookNum,
  }

  const getRequestData = {
    params: {
      case_sn: connectedCase.case_sn
    },
    headers: headers
  };

  // 현재 약통 현황 불러오기 axios
  useEffect(() => {
    axios.get(`${URL}/case/list/`, getRequestData)
      .then((response) => {
        console.log(response.data)
        setMedList(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  // 자주찾는 약 등록하는 axios 요청
  const registerBookmark = () => {
    axios.put(`${URL}/book/`, body, { headers })
      .then((response) => {
        console.log(body)
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        console.log(body)
      })
  }

  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />


      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">자주 찾는 약</h4>
        

        {/* 자주 찾는 약 입력 폼 */}
        <div id="contents-box" className="white z-depth-4 row">

          {/* 등록할 약 고르는 필드 */}
          <div class="input-field col s12">
            <select onChange={handleSelectedSlot}>
              <option value="" disabled selected>등록할 약을 선택해주세요</option>
              
              {medList.map((data, index) => (
                data !== null && (
                  <option key={index} value={index + 1}>[{index + 1}번 칸] {data.med_name}</option>
                )
              ))}
            </select>
            <label>등록할 약 선택</label>
          </div>

          {/* 즐겨찾기 별명 필드 */}
          <div className="input-field col s12">
            <input id="bookmark-nickname" type="text" value={ bookmarkNickname } onChange={ handleBookmarkNickname }/>
            <label htmlFor="bookmark-nickname">자주찾는 약 별명 설정</label>
          </div> 

        </div>

        {/* 등록하기 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <div 
              id="button"
              data-target="bookmark-register-modal"
              className={`btn modal-trigger waves-effect waves black-text white z-depth-4 ${bookmarkNickname && selectedSlot ? "" : "disabled"}`}
              onClick={ registerBookmark }
            >
              등록
            </div>
          </div>
        </div>

        {/* 등록 확인 모달 */}
        <div id="bookmark-register-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">자주 찾는 약에<br />등록되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default BookmarkRegister