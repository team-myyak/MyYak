import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import M from "materialize-css"
import axios from "axios";
import { useSelector } from "react-redux";


const UsedMedRegisterDetail = () => {

  // 사용할 함수 설정
  const location = useLocation()
  const navigate = useNavigate()

  // 사용할 변수 설정
  const preId = location.state.preId
  const preName = location.state.preName
  const [usedNickname, setUsedNickname] = useState("")

  // 핸들 함수
  const handleUsedNickname = (event) => {
    setUsedNickname(event.target.value)
  }

  // 모달 사용을 위한 초기화
  useEffect(() => {
    const registerModal = document.getElementById("med-register-modal");
    M.Modal.init(registerModal, {});
  
    const registerCompleteModal = document.getElementById("med-register-complete-modal");
    M.Modal.init(registerCompleteModal, {
      onCloseEnd: () => { goToUsedMedList() }
    });
  }, []);

  // 목록으로 이동하는 함수
  const goToUsedMedList = () => {
    navigate('/usedmed')
  }
  
  // axios 요청시 필요한 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    "pre_id": preId,
    "used_nickname": usedNickname, 
  }
  

  // 복용약 등록하는 axios 요청
  const usedMedRegister = () => {
    axios.post(`${URL}/medicines/used/`, reqData, { headers })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  return (
    <div id="container">
      
      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 복용약 등록 타이틀 */}
        <h4 id="page-title" className="white-text">복용약 등록</h4>

        {/* 기기등록 폼 */}
        <div id="contents-box" className="white z-depth-4 row">
        
          {/* 복용약 이름 필드 */}
          <div className="input-field col s12">
            <input disabled value={ preName } id="serialnumber" type="text" className="validate"/>
            <label htmlFor="serialnumber" className="active">약 이름</label>
          </div>

          {/* 복용약 별명 필드 */}
          <div className="input-field col s12">
            <input id="case-nickname" type="text" value={ usedNickname } onChange={ handleUsedNickname }/>
            <label htmlFor="case-nickname">복용약 별칭 설정</label>
          </div>

        </div>

        {/* 등록 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <div 
              id="button"
              data-target="med-register-modal"
              className={`btn waves-effect waves modal-trigger white black-text z-depth-3 ${usedNickname ? "" : "disabled"}`}
            >
              등록
            </div>
          </div>
        </div>

        {/* 약 등록 모달 */}
        <div id="med-register-modal" className="modal">
          <div className="modal-content">
            <h5 className="center">{ usedNickname }</h5>
            <h6 className="center">{ preName }</h6>
            <p className="center">이 약을 복용중인 약에 등록하시겠습니까?</p>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves btn-flat">취소</button>
              <button 
                data-target="med-register-complete-modal"
                className="modal-close modal-trigger waves-effect waves btn-flat"
                onClick={ usedMedRegister }  
              >확인</button>
            </div>
          </div>
        </div>

        {/* 약 등록 확인 모달 */}
        <div id="med-register-complete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">약이<br />등록되었습니다</h6>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default UsedMedRegisterDetail