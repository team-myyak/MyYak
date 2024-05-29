import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import M from "materialize-css";



const UserUpdate = () => {
  
  // 사용할 함수들 설정
  const location = useLocation([])
  const navigate = useNavigate()

  // 사용할 변수들 설정 
  const [username, setUsername] = useState(location.state.username)
  const [email, setEmail] = useState(location.state.email)
  const [name, setName] = useState(location.state.name)
  
  // 이메일 변경 시 변수에 저장하는 함수
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const goToInfo = () => {
    navigate("/userinfo")
  }


  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const updateModal = document.getElementById("userinfo-update-modal");
    M.Modal.init(updateModal, {
      onCloseEnd: () => { goToInfo () }
    });
  }, []); 

  // axios 요청 시 필요 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }
  const reqData = {
    "new_email": email,
    "new_realname": name,
  }

  // 회원정보 수정 axios 요청
  const updateUserinfo = () => {
    axios.put(`${URL}/user/info/`, reqData, { headers })
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

        {/* 회원정보수정 타이틀 */}
        <h4 id="page-title" className="white-text">회원정보 수정</h4>

        {/* 회원등록 수정 폼 */}
        <div id="contents-box" className="white z-depth-4 row">
            
          {/* 아이디 필드 */}
          <div className="input-field col s12">
            <input disabled value={ username } id="username" type="text" className="validate"/>
            <label htmlFor="username" className="active">아이디</label>
          </div>

          {/* 이메일 필드 */}
          <div className="input-field col s12">
            <input id="email" type="text" value={ email } onChange={ handleEmailChange }/>
            <label htmlFor="email" className="active">이메일</label>
          </div>

          {/* 이름 필드 */}
          <div className="input-field col s12">
            <input id="name" type="text" value={ name } onChange={ handleNameChange }/>
            <label htmlFor="name" className="active">이름</label>
          </div>
          
        </div>


        {/* 버튼섹션 */}
        <div id="buttons" className="row">
          {/* 수정버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button"
              data-target="userinfo-update-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
              onClick={updateUserinfo}
            >
              수정
            </div>
          </div>
        </div>

        {/* 수정 모달 */}
        <div id="userinfo-update-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">회원정보가 수정되었습니다</h6>
            <div className="modal-footer center">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>

          {/* 비밀번호 변경 버튼 */}
          {/* <div className="col s10 offset-s1">
            <div 
              id="button-down"
              className="btn waves-effect waves white black-text z-depth-3"
            >
              비밀번호 변경
            </div>
          </div> */}


      </div>
    </div>
  )
}

export default UserUpdate