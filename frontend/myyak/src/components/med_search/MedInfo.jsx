import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import M from "materialize-css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const MedInfo = () => {

  // 사용할 함수 설정
  const location = useLocation()
  const navigate = useNavigate()

  // 사용할 변수 설정
  const [medNum, setMedNum] = useState()
  const [medName, setMedName] = useState("")
  const [medCompany, setMedCompany] = useState("")
  const [expDate, setExpDate] = useState("")
  const [medMethod, setMedMethod] = useState("")
  const [medWarning, setMedWarning] = useState("")

  const [openModalMessage, setOpenModalMessage] = useState("")
  
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const slotNum = location.state.slotNum
  const connetedCase = useSelector((state) => state.connectedCase.connectedCase)

  // axios 요청에 사용할 정보
  const reqData = {
    params: {
      case_sn: connetedCase.case_sn,
      slot_num: slotNum
    },
    headers
  }

  // axios 열기 닫기 요청에 사용할 body
  const body = {
    "case_sn": connetedCase.case_sn,
    "slot_num": slotNum
  }

  // 해당 슬롯 데이터 axios 요청
  useEffect(() => {
    axios.get(`${URL}/case/slot/info`, reqData)
      .then((response) => {
        console.log(response.data)
        setMedName(response.data.med_name)
        setMedCompany(response.data.med_vendor)
        setMedNum(response.data.med_id)
        setExpDate(response.data.slot_exp)
        setMedMethod(response.data.med_method)
        setMedWarning(response.data.warning)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const openModal = document.getElementById("slot-open-modal");
    M.Modal.init(openModal, {});
  }, []);


  // 칸 열기 axios 요청
  const openSlot = () => {
    axios.post(`${URL}/case/med/`, body, { headers })
      .then((response) => {
        console.log(response)
        setOpenModalMessage("칸이 열렸습니다")
        var Modalelem = document.querySelector('#slot-open-modal');
        var instance = M.Modal.init(Modalelem);
        instance.open();
      })
      .catch((error) => {
        console.log(error)
        setOpenModalMessage("오류가 발생했습니다")
        var Modalelem = document.querySelector('#slot-open-modal');
        var instance = M.Modal.init(Modalelem);
        instance.open();
      })
  }


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">약 정보</h4>
        
        {/* 약 정보 */}
        <div id="contents-box" className="white z-depth-4">
          
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">약 이름</div>
            <div id="info-content" className="col s12">{medName}</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">제약사</div>
            <div id="info-content" className="col s12">{medCompany}</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">사용기한</div>
            <div id="info-content" className="col s12">{expDate}</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">용법/용량</div>
            <div id="info-content" className="col s12">{medMethod}</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">주의사항</div>
            <div id="info-content" className="col s12">{medWarning ? medWarning : "해당사항 없음"}</div>
          </div>

        </div>

        {/* 열기 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <div 
              id="button"
              data-target="slot-open-modal"
              className="btn waves-effect waves white black-text z-depth-3"
              onClick={openSlot}
            >
              열기
            </div>
          </div>
        </div>

        {/* 열기 모달 */}
        <div id="slot-open-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">{openModalMessage}</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default MedInfo