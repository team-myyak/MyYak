import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import M from "materialize-css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


const BookmarkUpdate = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const medName = location.state.medName
  const [bookmarkNickname, setBookmarkNickname] = useState(location.state.bookNickname)
  const [bookNum, setBookNum] = useState(location.state.bookNum)
  const slotId = location.state.slotId % 8 ? location.state.slotId % 8 : 8 

  const handleBookmarkNickname = (event) => {
    setBookmarkNickname(event.target.value)
  }
  


  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const updateModal = document.getElementById("bookmark-update-modal");
    M.Modal.init(updateModal, {
      onCloseEnd: () => { goToList () }
    });
    const deleteModal = document.getElementById("bookmark-delete-modal");
    M.Modal.init(deleteModal, {
      onCloseEnd: () => { goToList () }
    });
  }, []); 

  
  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const body = {
    "case_sn": connectedCase.case_sn,
    "new_nickname": bookmarkNickname,
    "slot_num": slotId,
    "book_num_order": bookNum
  }

  const deleteReqData = {
    data: {
      "case_sn": connectedCase.case_sn,
      "book_num_order": bookNum
    },
    headers : headers
  }

  // 즐겨찾기 수정 및 삭제 axios 필요
  const updateBookmark = () => {
    axios.post(`${URL}/book/`, body, { headers })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteBookmark = () => {
    axios.delete(`${URL}/book/`, deleteReqData)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        console.log(deleteReqData)
      })
  }


  const goToList = () => {
    navigate("/bookmark")
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

          {/* 등록된 약 필드 */}
          <div className="input-field col s12">
            <input disabled value={`[${slotId}번 칸] ${medName}`} id="med-name" type="text" className="validate"/>
            <label htmlFor="med-name" className="active">등록된 약</label>
          </div>


          {/* 즐겨찾기 별명 필드 */}
          <div className="input-field col s12">
            <input id="bookmark-nickname" type="text" value={ bookmarkNickname } onChange={ handleBookmarkNickname }/>
            <label htmlFor="bookmark-nickname" className="active">자주찾는 약 별명 설정</label>
          </div> 

        </div>


        {/* 버튼 섹션 */}
        <div id="buttons" className="row">
          {/* 수정 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-up"
              data-target="bookmark-update-modal"
              className="btn modal-trigger waves-effect waves black-text white z-depth-4"
              onClick={updateBookmark}
            >
              수정
            </div>
          </div>
          {/* 삭제 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              data-target="bookmark-delete-modal"
              className="btn modal-trigger waves-effect waves black-text white z-depth-4"
              onClick={deleteBookmark}
            >
              삭제
            </div>
          </div>
        </div>

        {/* 수정 모달 */}
        <div id="bookmark-update-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">자주 찾는 약 정보가<br />수정되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>

        {/* 삭제 모달 */}
        <div id="bookmark-delete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">자주 찾는 약 정보가<br />삭제되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BookmarkUpdate