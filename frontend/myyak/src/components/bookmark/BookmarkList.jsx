import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"



const renderBookmarkListItem = (bookmark, bookNum) => {

  // 긴 내용을 자르고 "..."으로 대체하는 함수
  const shortenContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };

  return (
    <Link to={bookmark ? "/bookmark/update" : "/bookmark/register"} state={ bookmark ? { bookNum: bookNum + 1, medName: bookmark.med_name, bookNickname: bookmark.book_nickname, slotId: bookmark.slot_id } : { bookNum: bookNum + 1 }}>
      <div id="list-box" className="btn waves-effect waves black-text white z-depth-4">
        { bookmark ? (
          <div id="list-box-content">
            <div id="list-box-primary">{shortenContent(bookmark.book_nickname, 9)}</div>
            <div id="list-box-secondary">{shortenContent(bookmark.med_name, 18)}</div>
          </div>
            ) : "(비어있음)"}
      </div>  
    </Link>
  );
}


const BookmarkList = () => {
  
  // 사용할 변수들 설정
  const [bookmarkList, setBookmarkList] = useState([])

  // axios 요청에 사용할 변수들
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    params: {
      "case_sn": connectedCase.case_sn
    },
    headers: headers
  } 

  // 자주찾는약 불러오는 axios 요청
  useEffect(() => {
    axios.get(`${URL}/case/book/`, reqData)
      .then((response) => {
        console.log(response.data)
        setBookmarkList(response.data)        
      })
      .catch((error) => {
        console.log(reqData)
        console.log(error)
      })
  }, [])



  return (
    <div id="container">
      
      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">자주 찾는 약</h4>

        {/* 자주 찾는 약 리스트 */}
        <div className="row">
          {bookmarkList.map((bookmark, index) => (
            <div key={index} className="col s12">
              {renderBookmarkListItem(bookmark, index)}
            </div>
          ))}
        </div>









      </div>


    </div>
  )
}

export default BookmarkList