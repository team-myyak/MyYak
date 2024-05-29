import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import M from "materialize-css"
import { useSelector } from "react-redux";


const MedRegisterNew = () => {

  // 사용할 함수들 설정
  const location = useLocation()
  const navigate = useNavigate()

  // 사용할 변수들
  const medBarcode = location.state.medBarcode
  const slotNum = location.state.slotNum
  const [medNum, setMedNum] = useState("")

  const [medName, setMedName] = useState("")
  const [medCompany,setMedCompany] = useState("")
  const [expDate, setExpDate] = useState("")
  const [openModalMessage, setOpenModalMessage] = useState("")
  const connetedCase = useSelector((state) => state.connectedCase.connectedCase)
  const caseSn = connetedCase.case_sn

  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const params = {
    params: {
      "bar_code": medBarcode
    },
  }
  const reqData = {
    "case_sn": caseSn,
		"slot_num": slotNum,
		"med_id": medNum,
		"slot_exp": expDate,
  }

  // 다 끝나고 약 목록 페이지로 이동하는 함수
  const goToMedList = () => {
    navigate("/med/register/list")
  }

  useEffect(() => {
    axios.get(`${URL}/medicines/search`, params)
      .then((response) => {
        setMedNum(response.data[0].med_id)
        setMedName(response.data[0].med_name)
        setMedCompany(response.data[0].med_vendor)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  // 날짜 선택 창 Initialization
  useEffect(() => {
    
    const Datepicker = document.getElementById("exp-date");
    const DatapickerOptions = {
      format: 'yyyy-mm-dd',
      showMonthAfterYear: true,
      i18n: {
        months: [
          '1월', '2월', '3월', '4월', '5월', '6월',
          '7월', '8월', '9월', '10월', '11월', '12월'
        ],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        weekdaysAbbrev: ['일', '월', '화', '수', '목', '금', '토'],
        weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
      },
      onSelect: (selectedDate) => {
        const dateString = selectedDate.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace('. ', '-').replace('. ', '-').replace('.', ''); 
        setExpDate(dateString);
      }
    }
    M.Datepicker.init(Datepicker, DatapickerOptions);
  }, []);


  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const registerModal = document.getElementById("med-register-modal");
    M.Modal.init(registerModal, {});
  
    const registerCompleteModal = document.getElementById("med-register-complete-modal");
    M.Modal.init(registerCompleteModal, {
      onCloseEnd: () => { goToMedList() }
    });
  }, []);




  

  const medRegister = () => {
    axios.post(`${URL}/case/slot/`, reqData, { headers })
      .then((response) => {
        console.log(response)
        setOpenModalMessage("약이 등록되었습니다")
        var Modalelem = document.querySelector('#med-register-complete-modal');
        var instance = M.Modal.init(Modalelem, {
          onCloseEnd: () => { goToMedList() }
        });
        instance.open();
      })
      .catch((error) => {
        console.log(reqData)
        console.log(error)
        setOpenModalMessage("오류가 발생했습니다")
        var Modalelem = document.querySelector('#med-register-complete-modal');
        var instance = M.Modal.init(Modalelem, {
          onCloseEnd: () => { goToMedList() }
        });
        instance.open();
      })
  }



  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">약 등록하기</h4>

        {/* 약 등록 폼 */}
        <div id="contents-box" className="white z-depth-4">
          <div id="form-box" className="row">

            {/* 약 이름 필드 */}
            <div className="input-field col s12">
              <input disabled value={ medName } id="med-name" type="text" className="validate"/>
              <label htmlFor="med-name" className="active">약 이름</label>
            </div>

            {/* 제조사 필드 */}
            <div className="input-field col s12">
              <input disabled id="med-company" type="text" value={ medCompany } />
              <label htmlFor="med-company" className="active">제조사</label>
            </div>

            {/* 사용기한 필드 */}
            <div className="input-field col s12">
              <input id="exp-date" type="text" class="datepicker"/>
              <label htmlFor="exp-date">사용기한</label>
            </div>

          </div>
        </div>

        {/* 등록 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <div 
              id="button"
              data-target="med-register-modal"
              className={`btn waves-effect waves modal-trigger white black-text z-depth-3 ${expDate ? "" : "disabled"}`}
            >
              등록
            </div>
          </div>
        </div>

        {/* 약 등록 모달 */}
        <div id="med-register-modal" className="modal">
          <div className="modal-content">
            <h5 className="center">{ medName }</h5>
            <h6 className="center">{ medCompany }</h6>
            <p className="center">사용기한: { expDate }</p>
            <p className="center">이 약을 등록하시겠습니까?</p>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves btn-flat">취소</button>
              <button 
                data-target="med-register-complete-modal"
                className="modal-close waves-effect waves btn-flat"
                onClick={ medRegister }  
              >확인</button>
            </div>
          </div>
        </div>

        {/* 약 등록 확인 모달 */}
        <div id="med-register-complete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">{openModalMessage}</h6>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>



      </div>

    </div>
  )
}

export default MedRegisterNew