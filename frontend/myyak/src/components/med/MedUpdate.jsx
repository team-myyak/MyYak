import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import axios from "axios";

const MedUpdate = () => {

  // 사용할 함수 설정
  const location = useLocation()
  const navigate = useNavigate()

  // 사용할 변수 설정
  const [medNum, setMedNum] = useState()
  const [medName, setMedName] = useState("")
  const [medCompany, setMedCompany] = useState("")
  const [expDate, setExpDate] = useState("")
  const [openModalMessage, setOpenModalMessage] = useState("")
  
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const slotNum = location.state.slotNum
  const connetedCase = useSelector((state) => state.connectedCase.connectedCase)
  
  
  // 다 끝나고 약 목록 페이지로 이동하는 함수
  const goToMedList = () => {
    navigate("/med/register/list")
  }
  
  // axios 요청에 사용할 정보
  const reqData = {
    params: {
      case_sn: connetedCase.case_sn,
      slot_num: slotNum
    },
    headers
  }

  const deleteReqData = {
    data: {
      "case_sn": connetedCase.case_sn,
      "slot_num": slotNum
    },
    headers
  }

  const updateReqDate = {
      "case_sn": connetedCase.case_sn,
      "slot_num": slotNum,
      // "med_id": medNum,
      "slot_exp": expDate,
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
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // 날짜 선택 창 Initialization
  useEffect(() => {
    const dateObject = new Date(expDate)
    const Datepicker = document.getElementById("exp-date");
    const DatapickerOptions = {
      format: 'yyyy-mm-dd',
      defaultDate: dateObject,
      setDefaultDate: true,
      showMonthAfterYear: true,
      i18n: {
        months: [
          '1월', '2월', '3월', '4월', '5월', '6월',
          '7월', '8월', '9월', '10월', '11월', '12월'
        ],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        weekdaysAbbrev: ['일', '월', '화', '수', '목', '금', '토'],
        // weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
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
  }, [expDate]);

  
  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const updateModal = document.getElementById("med-update-modal");
    M.Modal.init(updateModal, {});
  
    const updateCompleteModal = document.getElementById("med-update-complete-modal");
    M.Modal.init(updateCompleteModal, {
      onCloseEnd: () => { goToMedList() }
    });

    const medDeleteModal = document.getElementById("med-delete-modal");
    M.Modal.init(medDeleteModal, {});
  
    const medDeleteCompleteModal = document.getElementById("med-delete-complete-modal");
    M.Modal.init(medDeleteCompleteModal, {
      onCloseEnd: () => { goToMedList() }
    });
  }, []);

  // 약 삭제 하는 axios 요청 함수
  const medDelete = () => {
    axios.delete(`${URL}/case/slot/`, deleteReqData)
      .then((response) => {
        console.log(response)
        setOpenModalMessage("약이 삭제되었습니다")
        var Modalelem = document.querySelector('#med-delete-complete-modal');
        var instance = M.Modal.init(Modalelem, {
          onCloseEnd: () => { goToMedList() }
        });
        instance.open();
      })
      .catch((error) => {
        console.log(error)
        setOpenModalMessage("오류가 발생했습니다")
        var Modalelem = document.querySelector('#med-delete-complete-modal');
        var instance = M.Modal.init(Modalelem, {
          onCloseEnd: () => { goToMedList() }
        });
        instance.open();
      })
  }

  // 약 사용기한 수정등록 axios 요청하는 함수
  // const medUpdate = async () => {
  //   try {
  //     // 먼저 기존약 삭제
  //     await axios.delete(`${URL}/case/slot/`, deleteReqData);
  //     console.log("첫 번째 axios 요청 완료");
  
  //     // 수정된 사용기한으로 등록
  //     await axios.post(`${URL}/case/slot/`, updateReqDate, { headers })
  //       .then((response) => {
  //         setOpenModalMessage("사용기한이 수정되었습니다")
  //         var Modalelem = document.querySelector('#med-update-complete-modal');
  //         var instance = M.Modal.init(Modalelem);
  //         instance.open();
  //       })
  //     console.log("두 번째 axios 요청 완료");
  //   } catch (error) {
  //     console.log(error);
  //     setOpenModalMessage("오류가 발생했습니다")
  //     var Modalelem = document.querySelector('#med-update-complete-modal');
  //     var instance = M.Modal.init(Modalelem);
  //     instance.open();
  //   }
  // };
  const medUpdate = () => {
    axios.put(`${URL}/case/slot/`, updateReqDate, { headers })
      .then((response) => {
        console.log(response)
        setOpenModalMessage("사용기한이 수정되었습니다")
        var Modalelem = document.querySelector('#med-update-complete-modal');
        var instance = M.Modal.init(Modalelem, {
          onCloseEnd: () => { goToMedList() }
        });
        instance.open();
      })
      .catch((error) => {
        console.log(error)
        setOpenModalMessage("오류가 발생했습니다.")
        var Modalelem = document.querySelector('#med-update-complete-modal');
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
        <h4 id="page-title" className="white-text">약 등록 수정</h4>

        {/* 약 수정 폼 */}
        <div id="contents-box" className="white z-depth-3">
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


        {/* 버튼 섹션 */}
        <div id="buttons" className="row">

          {/* 사용기한 수정 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-up"
              data-target="med-update-modal"
              className={`btn waves-effect waves modal-trigger white black-text z-depth-3 ${expDate ? "" : "disabled"}`}
            >
              사용기한 수정
            </div>
          </div>

          {/* 약 삭제 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              data-target="med-delete-modal"
              className="btn waves-effect waves modal-trigger white black-text z-depth-3"
            >
              삭제
            </div>
          </div>


          {/* 사용기한 수정 모달 */}
          <div id="med-update-modal" className="modal">
            <div className="modal-content">
              <h6 className="center">사용기한을<br />{ expDate } 으로<br />변경하시겠습니까?</h6>
              <div className="modal-footer">
                <button id="modal-cancel-button" className="modal-close waves-effect waves btn-flat">취소</button>
                <button 
                  data-target="med-update-complete-modal"
                  className="modal-close waves-effect waves btn-flat"
                  onClick={ medUpdate }  
                >확인</button>
              </div>
            </div>
          </div>

          {/* 사용기한 수정 확인 모달 */}
          <div id="med-update-complete-modal" className="modal">
            <div className="modal-content">
              <h6 className="center">{openModalMessage}</h6>
              <div className="modal-footer">
                <button className="modal-close waves-effect waves btn-flat">확인</button>
              </div>
            </div>
          </div>


          {/* 약 삭제 모달 */}
          <div id="med-delete-modal" className="modal">
            <div className="modal-content">
              <h6 className="center">{slotNum}번 칸에 지정된<br />{ medName } 을<br />삭제하시겠습니까?</h6>

              <div className="modal-footer">
                <button className="modal-close waves-effect waves btn-flat">취소</button>
                <button 
                  id="modal-delete-button"
                  data-target="med-delete-complete-modal"
                  className="modal-close waves-effect waves btn-flat"
                  onClick={ medDelete }  
                >삭제</button>
              </div>
            </div>
          </div>

          {/* 약 삭제 확인 모달 */}
          <div id="med-delete-complete-modal" className="modal">
            <div className="modal-content">
              <h6 className="center">{openModalMessage}</h6>
              <div className="modal-footer">
                <button id="modal-complete-button" className="modal-close waves-effect waves btn-flat">확인</button>
              </div>
            </div>
          </div>

















        </div>




      </div>


    </div>
  )
}

export default MedUpdate
