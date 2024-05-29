import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import { login } from "../app/slices/authSlice";
import { caseListUpdate } from "../app/slices/caseListSlice";
import { connectedCaseUpdate } from "../app/slices/connectedCaseSlice";
import { usernameUpdate } from "../app/slices/usernameSlice";
import NavbarLogin from "./NavbarLogin";


const Login = () => {

  // 사용하기 위한 함수들 선언
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // 사용할 변수들 선언
  const [username, setUsername] = useState("")          // 아이디
  const [password, setPassword] = useState("")          // 비밀번호
  const [invalidate, setInvalidate] = useState(false)   // 로그인 경고 메세지 여부

  // 로그인 요청 시 body에 담아보낼 data
  const loginData = {
    "username" : username,
    "password" : password
  }

  const user = useSelector((state) => state.auth.token);

  // API 요청 보낼 url
  const URL = useSelector((state) => state.url.url);
  
  // 로그인 상태 시 접근 방지 -> 홈으로
  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [])

  // 로그인 form 에 입력되는 value 저장하는 함수
  const handleUsername = (event) => {
    setUsername(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  // 로그인 버튼 누르면 호출되는 함수
  const handleSubmit = (event) => {

    event.preventDefault()

    // 로그인 axios 요청
    axios.post(`${URL}/user/login/`, loginData)
      .then((response) => {

        // 로그인 경고 메세지 초기화
        setInvalidate(false)

        // Redux Store 에 token, 유저아이디 저장
        dispatch(login(response.data.key))
        dispatch(usernameUpdate(username))

        // 로그인한 유저 토큰 정보
        const userToken = response.data.key
        const headers = {
          Authorization: `Token ${userToken}`
        }

        // Redux Store 에 등록된 기기 목록, 현재 접속 기기 저장
        // 로그인 유저의 기기 목록 api 로 요청
        axios.get(`${URL}/case/mycase`, { headers })
          
          // 받아온 기기목록 data를 store에 업데이트
          .then((response) => {
            dispatch(caseListUpdate(response.data))
            dispatch(connectedCaseUpdate(response.data[0]))
            // 기기등록 여부에 따라 이동할 페이지 결정
            if (!response.data || response.data.length === 0) {
              navigate("/case/unregister")
            } else {
              navigate("/home")
            }
           })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        // 요청에 문제있으면 로그인 경고 메세지 띄우기
        setInvalidate(true)
        console.log(error)
      })
  }

  return (
  
    <div id="container">
   
      {/* 상단 네비게이션 바 */}
      <NavbarLogin />

      {/* 로그인 타이틀 */}
      <h1 className="white-text center">LOGIN</h1>

      {/* 로그인 폼 컨테이너 */}
      <div id="login-box" className="white z-depth-4">
        <form id="login-form" className="row" onSubmit={ handleSubmit }>

          {/* 아이디 필드 */}
          <div id="username-field" className="input-field col s12">
            <input id="username" type="text" value={ username } onChange={ handleUsername }/>
            <label htmlFor="username">아이디</label>
          </div>

          {/* 비밀번호 필드 */}
          <div className="input-field col s12">
            <input id="password" type="password" value={ password } onChange={ handlePassword }/>
            <label htmlFor="password">비밀번호</label>
          </div>

          {/* 로그인 경고 메세지 */}
          <div id="login-message" className={`col s12 sm ${ invalidate ? "" : "hide"}`}>
            <p className="red-text darken-4">아이디 및 비밀번호가 일치하지 않습니다!</p>
          </div>

          {/* 로그인 버튼 */}
          <div id="login-button" className="col s12">
            <button className={`waves-effect waves-light btn grey darken-2 ${ username && password ? "" : "disabled" }`}>로그인</button>
          </div>

        </form>
      </div>

      {/* 소셜로그인 컴포넌트 */}
      {/* <div id="social-login">
        <SocialLogin />
      </div> */}

      {/* 비밀번호 찾기안내 */}
      {/* <div id="password-find-field">
        <p>혹시 비밀번호를 잊어버리셨나요?</p>
        <Link to="#" className="black-text">비밀번호 찾기</Link>
      </div> */}

      {/* 하단 여유공간 */}
      <div id="bottom-area"></div>

    </div>
  )
}

export default Login