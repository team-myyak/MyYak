import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SocialSignup from "./SocialSignup";
import NavbarSignup from "./NavbarSignup";


const Signup = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")

  const [isDuplicated, setIsDuplicated] = useState()

  const navigate = useNavigate()

  // 로그인 상태 시 접근방지
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home")
    }
  })

  const usernameReq = "[A-Za-z][A-Za-z0-9]*"


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setIsDuplicated()
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handlePassword1Change = (event) => {
    setPassword1(event.target.value)
  }
  const handlePassword2Change = (event) => {
    setPassword2(event.target.value)
  }

  const userData = {
    "username" : username,
    "email" : email,
    "password1" : password1,
    "password2" : password2,
    "user_realname" : name,
  }

  const URL = useSelector((state) => state.url.url);

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`${URL}/user/signup/`, userData)
      .then((response) => {
        navigate("/signup/complete")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleIsDuplicated = (event) => {
    axios.post(`${URL}/user/signup/check-username/`, { "username" : username })
      .then((response) => {
        setIsDuplicated(response.data.duplicated)
        console.log(isDuplicated)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <NavbarSignup />

      <div id="contents">
        
        {/* 회원가입 title */}
        <h4 id="page-title" className="white-text">회원가입</h4>

      </div>

      {/* 회원가입 폼 컨테이너 */}
      <div id="signup-box" className="white z-depth-4">
        <form id="signup-form" className="row" onSubmit={ handleSubmit }>
          
          {/* 아이디 필드 */}
          <div id="username-field" className="input-field col s8">
            <input 
              id="username"
              type="text" 
              className="validate"
              pattern={ usernameReq }
              value={ username } 
              onChange={ handleUsernameChange }/>
            <label htmlFor="username">아이디</label>
            <span className="helper-text" data-error="영문 및 영문+숫자만 가능합니다" data-success={ isDuplicated === false ? "사용가능한 아이디입니다" : (isDuplicated === true ? "중복된 아이디입니다" : "중복여부를 체크해주세요")}>
            </span>
          </div>

          {/* 중복확인 버튼 */}
          <div id="isduplicated-button" className="col s4">
            <button 
              type="button" 
              className={`waves-effect waves-light btn grey darken-2 ${(!username || isDuplicated || !username.match(/^[A-Za-z][A-Za-z0-9]*$/)) ? "disabled" : ""}`} 
              onClick={handleIsDuplicated}
              disabled={isDuplicated}
            >
              중복확인
            </button>
          </div>

          {/* 이메일 필드 */}
          <div id="email-field" className="input-field col s12">
            <input id="email" type="email" className="validate" value={ email } onChange={ handleEmailChange }/>
            <label htmlFor="email">이메일</label>
            <span className="helper-text" data-error="잘못된 입력입니다" data-success=""></span>
          </div>

          {/* 이름 필드 */}
          <div id="name-field" className="input-field col s12">
            <input id="name" type="text" className="validate" value={ name } onChange={ handleNameChange }/>
            <label htmlFor="name">이름</label>
          </div>
          
          {/* 비밀번호 필드 */}
          <div className="input-field col s12">
            <input id="password1" type="password" value={ password1 } onChange={ handlePassword1Change }/>
            <label htmlFor="password1">비밀번호</label>
            <span className="helper-text">8자 이상, 영문 혹은 영문+숫자이어야 합니다</span>
          </div>

          {/* 비밀번호 확인 필드 */}
          <div className="input-field col s12">
            <input id="password2" className={`${password2 === "" ? "" : password1 !== password2 ? "invalid" : "valid"}`} type="password" value={ password2 } onChange={ handlePassword2Change }/>
            <label htmlFor="password2">비밀번호 확인</label>
            <span 
              className="helper-text" 
              data-error="비밀번호가 일치하지 않습니다"
              data-success="비밀번호가 일치합니다"
            ></span>
          </div>

          {/* 가입하기 버튼 */}
          <div id="signup-button" className="col s12">
            <button 
              className={`waves-effect waves-light btn grey darken-2 ${(isDuplicated===false && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && password1 === password2 && password2 && name) ? "" : "disabled" }`}
            >
              가입하기
            </button>
          </div>

        </form>

      </div>

      {/* 소셜로그인 파트 */}
      {/* <div id="social-signup">
        <SocialSignup />
      </div> */}

      {/* 로그인 페이지로 이동 */}
      <div id="password-find-field">
        <p>이미 계정이 있으신가요?</p>
        <Link to="/login" className="black-text">로그인 하기</Link>
      </div>
      
      <div id="bottom-area"></div>

    </div>
  )
}

export default Signup