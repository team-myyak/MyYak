import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar";
import M from "materialize-css"
import axios from "axios";
import { caseListUpdate } from "../../app/slices/caseListSlice";
import { connectedCaseUpdate } from "../../app/slices/connectedCaseSlice";

const CaseManagement = () => {
    
  // 사용할 함수들 불러오기
  const location = useLocation([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // 시리얼 넘버, 기기 별명
  const serialNumber = location.state.caseSn
  const [nickname, setNickname] = useState(location.state.regNickname)
    
  // axios 요청에 담을 데이터
  const updateData = {
    "case_sn": serialNumber,
    "reg_nickname": nickname,
  }
  const deleteData = {
    "case_sn": serialNumber,
  }

  // 기기별명 변경 시 변수에 저장하는 함수
  const handleNicknameChange = (event) => {
    setNickname(event.target.value)
  }

  // API 요청에 쓸 변수
  const URL = useSelector((state) => state.url.url);
  const userToken = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Token ${userToken}`
  }
 
  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const updateModal = document.getElementById("caseManagement-update-modal");
    M.Modal.init(updateModal, {});
  
    const deleteModal = document.getElementById("caseManagement-delete-modal");
    M.Modal.init(deleteModal, {});
  }, []);

  // 기기별명 수정 axios 요청
  const updateNickname = () => {
    axios.put(`${URL}/case/`, updateData, { headers })
      .then((response) => {
        // Redux Store 에 등록된 기기 업뎃, 현재 접속 기기 업뎃
        // 로그인 유저의 기기 목록 api 로 요청
        axios.get(`${URL}/case/mycase/`, { headers })  
          // 받아온 기기목록 data를 store에 업데이트
          .then((response) => {
            dispatch(caseListUpdate(response.data))
            dispatch(connectedCaseUpdate(response.data[0]))
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 기기삭제 axios 요청
  const deleteCase = () => {
    axios.delete(`${URL}/case/`, { headers, data: deleteData })
      .then((response) => {
        // Redux Store 에 등록된 기기 업뎃, 현재 접속 기기 업뎃
        // 로그인 유저의 기기 목록 api 로 요청
        axios.get(`${URL}/case/mycase/`, { headers })  
          // 받아온 기기목록 data를 store에 업데이트
          .then((response) => {
            dispatch(caseListUpdate(response.data))
            dispatch(connectedCaseUpdate(response.data[0]))
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 수정, 삭제 후 등록 기기 리스트 페이지로 이동하는 함수
  const goToList = () => {
    navigate("/case/list")
  }


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 기기등록 타이틀 */}
        <h4 id="page-title" className="white-text">내 기기 관리</h4>

        {/* 기기등록 폼 */}
        <div id="contents-box" className="white z-depth-4 row">
            
          {/* 시리얼넘버 필드 */}
          <div className="input-field col s12">
            <input disabled value={ serialNumber } id="serialnumber" type="text" className="validate"/>
            <label htmlFor="serialnumber" className="active">시리얼 넘버</label>
          </div>

          {/* 기기별명 필드 */}
          <div className="input-field col s12">
            <input id="case-nickname" type="text" value={ nickname } onChange={ handleNicknameChange }/>
            <label htmlFor="case-nickname" className="active">기기 별명</label>
          </div>

        </div>


        {/* 버튼섹션 */}
        <div id="buttons" className="row">

          {/* 수정 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-up"
              data-target="caseManagement-update-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              onClick={ updateNickname }
            >
              수정
            </div>
          </div>

          {/* 삭제 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              data-target="caseManagement-delete-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              onClick={ deleteCase }
            >
              삭제
            </div>
          </div>

        </div>

        
        {/* 수정 모달 */}
        <div id="caseManagement-update-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">기기 별명이 수정되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat" onClick={ goToList }>확인</button>
            </div>
          </div>
        </div>

        {/* 삭제 모달 */}
        <div id="caseManagement-delete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">해당 기기가 삭제되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat" onClick={ goToList }>확인</button>
            </div>
          </div>
        </div>


      </div>    
    </div>
  )
}

export default CaseManagement