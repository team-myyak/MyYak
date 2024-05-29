import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


const NoticeList = () => {

  const [noticeList, setNoticeList] = useState([])

  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    headers: headers
  }


  // 알림 불러오는 axios
  useEffect(() => {
    axios.get(`${URL}/notice/`, reqData)
      .then((response) => {
        setNoticeList(response.data.reverse())
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  
  
  // 긴 내용을 자르고 "..."으로 대체하는 함수
  const shortenContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };



  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">알림함</h4>

        {noticeList && noticeList.length !== 0 ? (
          <div id="contents-box" className="white z-depth-4 row">
            {noticeList.map((notice, index) => (
              <div key={index} className="col s12">
                <Link to="/notice/detail" state={{ title: notice.notice_title, content: notice.notice_content, noticeDate: notice.notice_create_dttm, noticeId: notice.notice_id }}>
                  <div id="notice-list" className="waves-effect waves black-text">
                    <div id="notice-list-title-part">
                      <div id="notice-list-title">{notice.notice_title}</div>
                      {!notice.notice_read_dttm && (
                        <div id="notice-list-title-icon"><img src="/assets/notice_new_icon.png" alt="#" height="70%"/></div>
                      )}
                    </div>
                    <div id="notice-list-content" style={{whiteSpace: "pre-wrap"}}>
                      {shortenContent(notice.notice_content, 70)}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div id="message" className="white-text center"><h6>비어있는 알림함입니다</h6></div>
        )}


        {/* 하단 여유공간 */}
        <div id="bottom-area"></div>

      </div>
    </div>
  )
}

export default NoticeList
