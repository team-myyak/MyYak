import React, { useEffect } from "react";
import Navbar from "../Navbar";
import M from "materialize-css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


const NoticeDetail = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const noticeTitle = location.state.title
  const noticeContent = location.state.content
  const noticeDate = location.state.noticeDate
  const noticeId = location.state.noticeId

  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const Modal = document.getElementById("notice-delete-modal");
    M.Modal.init(Modal, {
      onCloseEnd: () => { goToList () }
    });
  }, []);


  // axios 요청 시 필요한 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const data = {
    "notice_id": noticeId
  }
  const deleteReqData = {
    data: {
      "notice_id": noticeId
    },
    headers: headers
  }


  // 페이지 로딩 시 바로 읽음 처리
  useEffect(() => {
    axios.post(`${URL}/notice/`, data, { headers })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // 알림 삭제 axios
  const deleteNotice = () => {
    axios.delete(`${URL}/notice/`, deleteReqData)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const goToList = () => {
    navigate("/notice")
  }

  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">알림함</h4>
        
        {/* 알림내용 */}
        <div id="contents-box" className="white z-depth-4 row">
          <div id="notice-detail-title" className="col s12">
            {noticeTitle}
          </div>
          <div id="notice-detail-date" className="col s12">
            알림일시: {noticeDate}
          </div>
          <div id="notice-detail-content" className="col s12" style={{whiteSpace: "pre-wrap"}}>
            {noticeContent}
          </div>
        </div>

        {/* 버튼섹션 */}
        <div id="buttons" className="row">
          
          {/* 삭제버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-up"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              data-target="notice-delete-modal" 
              onClick={deleteNotice}>
              삭제
            </div>
          </div>

          {/* 목록으로 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              className="btn waves-effect waves white black-text z-depth-3" onClick={goToList}>
              목록으로
            </div>
          </div>
          

          {/* 삭제 모달 */}
          <div id="notice-delete-modal" className="modal">
            <div className="modal-content">
              <h6 className="center">해당 알림이<br />삭제되었습니다</h6>
              <div className="modal-footer center">
                <button className="modal-close waves-effect waves btn-flat">확인</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div> 
  )
}

export default NoticeDetail
