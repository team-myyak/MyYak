import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";
import { caseListUpdate } from "../../app/slices/caseListSlice";
import { connectedCaseUpdate } from "../../app/slices/connectedCaseSlice";
import { QrScanner } from '@yudiel/react-qr-scanner';

const CaseRegister = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serialNumber, setSerialNumber] = useState("")
  const [nickname, setNickname] = useState("")
  const [invalidate, setInvalidate] = useState(false)   // 기기등록 경고 메세지

  const handleSerialNumberChange = (event) => {
    setSerialNumber(event.target.value)
  }
  const handleNicknameChange = (event) => {
    setNickname(event.target.value)
  }

  const URL = useSelector((state) => state.url.url);

  const userData = {
    "case_sn": serialNumber,
    "reg_nickname": nickname
  }

  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }

  // 비로그인 상태 시 로그인 페이지로 이동
  useEffect(() => {
    if (!userToken) {
      navigate("/login")
    }
  })


  const register = () => {
    axios.post(`${URL}/case/`, userData, { headers })
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

        navigate("/case/register/complete")
      })
      .catch((error) => {
        setInvalidate(true)
      })
  }


    
    return (
      <div id="container">

        {/* 상단 네비게이션 바 */}
        <Navbar />

        <div id="contents">

          {/* 기기등록 타이틀 */}
          <h4 id="page-title" className="white-text">기기등록하기</h4>

          {/* 기기등록 폼 */}
          <div id="contents-box" className="white z-depth-4 row">

            {/* 시리얼넘버 필드 */}
            <div className="input-field col s12">
                <input id="case-serial" type="text" value={ serialNumber } onChange={ handleSerialNumberChange }/>
                <label htmlFor="case-serial" className="active">시리얼 넘버</label>
              </div>

            {/* 기기 별명 필드 */}
            <div className="input-field col s12">
              <input id="case-nickname" type="text" value={ nickname } onChange={ handleNicknameChange }/>
              <label htmlFor="case-nickname">기기 별명</label>
            </div>

            {/* 로그인 경고 메세지 */}
            <div id="login-message" className={`col s12 sm ${ invalidate ? "" : "hide"}`}>
              <p className="red-text darken-4">유효하지 않은 번호이거나 이미 등록된 기기입니다</p>
            </div>

          </div>

          {/* QR 코드 인식기 */}
          <div 
            // style={{"width":"70%", "margin":"0 auto"}}
          >
            <QrScanner
              constraints={{facingMode: 'environment'}}
              onDecode={(result) => setSerialNumber(result)}
              onError={(error) => console.log(error?.message)}
            />
          </div>

          {/* 등록하기 버튼 */}
          <div id="buttons" className="row">
            <div className="col s10 offset-s1">
              <div 
                id="button"
                className={`btn waves-effect waves white black-text z-depth-3 ${serialNumber && nickname ? "" : "disabled"}`} onClick={register}>
                등록
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
  
  export default CaseRegister