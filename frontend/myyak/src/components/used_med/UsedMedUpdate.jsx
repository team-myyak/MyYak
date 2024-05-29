import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import M from "materialize-css"
import axios from "axios";
import { useSelector } from "react-redux";


const UsedMedUpdate = () => {

  // 사용할 함수 설정
  const location = useLocation()
  const navigate = useNavigate()

  // 사용할 변수 설정
  const usedId = location.state.usedId
  const preName = location.state.preName
  const [usedNickname, setUsedNickname] = useState(location.state.usedNickname)

  // 핸들 함수
  const handleUsedNickname = (event) => {
    setUsedNickname(event.target.value)
  }

  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const updateModal = document.getElementById("med-update-modal");
    M.Modal.init(updateModal, {
      onCloseEnd: () => { goToUsedMedList() }
    });
  
    const deleteModal = document.getElementById("med-delete-modal");
    M.Modal.init(deleteModal, {
      onCloseEnd: () => { goToUsedMedList() }
    });
  }, []);

  // 목록으로 이동하는 함수
  const goToUsedMedList = () => {
    navigate('/usedmed')
  }

  // axios 요청 시 필요 data
  const URL = useSelector((state) => state.url.url);
  const userToken = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const putReqData = {
    "used_id": usedId,
    "used_nickname": usedNickname
  }
  const deleteReqData = {
    data: {
      "used_id": usedId,
    },
    headers: headers
  }


  // 별칭 수정하는 axios 요청
  const updateUsedMed = () => {
    axios.put(`${URL}/medicines/used/`, putReqData, { headers })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 복용약 삭제하는 axios 요청
  const deleteUsedMed = () => {
    axios.delete(`${URL}/medicines/used`, deleteReqData)
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
        <h4 id="page-title" className="white-text">복용약 수정</h4>

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
            <label htmlFor="case-nickname" className="active">복용약 별칭 설정</label>
          </div>

        </div>

        {/* 버튼섹션 */}
        <div id="buttons" className="row">

          {/* 수정 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-up"
              data-target="med-update-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              onClick={ updateUsedMed }
            >
              수정
            </div>
          </div>

          {/* 삭제 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              data-target="med-delete-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              onClick={ deleteUsedMed }
            >
              삭제
            </div>
          </div>

        </div>

        
        {/* 수정 모달 */}
        <div id="med-update-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">해당 복용약 별칭이 수정되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>

        {/* 삭제 모달 */}
        <div id="med-delete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">해당 복용약이 삭제되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>



      </div>



    </div>
  )
}

export default UsedMedUpdate



