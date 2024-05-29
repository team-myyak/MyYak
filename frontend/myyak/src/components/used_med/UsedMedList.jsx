import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css"
import { useSelector } from "react-redux";
import axios from "axios";


const UsedMedList = () => {

  // 복용중인 약 리스트가 담길 변수
  const [usedMedList, setUsedMedList] = useState([])

  
  // axios 요청 시 필요한 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    headers: headers
  }


  // 복용약 목록 불러오는 axios
  useEffect(() => {
    axios.get(`${URL}/medicines/used/`, reqData)
      .then((response) => {
        setUsedMedList(response.data)
        console.log(response)
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
        <h4 id="page-title" className="white-text">복용중인 약</h4>

        {/* 복용약 리스트 */}
        {usedMedList && usedMedList.length !== 0 ? (
          <div className="row">
            <div className="col s12">
              {usedMedList.map((usedMed, index) => (
                <Link 
                  to="/usedmed/update"
                  state={{ usedId: usedMed.used_id, preName: usedMed.pre_name, usedNickname: usedMed.used_nickname }}
                  key={ index }
                >
                  <div id="list-box" className="waves-effect waves btn white z-depth-3">
                    <div id="list-box-content">
                      <div id="list-box-primary">{shortenContent(usedMed.used_nickname, 9)}</div>
                      <div id="list-box-secondary">{shortenContent(usedMed.pre_name, 18)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div id="message" className="white-text center"><h6>복용중인 약 정보가 없습니다</h6></div>
        )}


        

        {/* 추가하기 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <Link to="/usedmed/register">
              <div id="button" className="btn waves-effect waves white black-text z-depth-3">
                추가하기
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UsedMedList