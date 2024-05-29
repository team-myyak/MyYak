import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import axios from "axios";
import M from "materialize-css";
import { login } from "../../app/slices/authSlice";


const UserInfo = () => {

  // 사용할 변수들 설정
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [dateJoined, setDataJoined] = useState("")
  const [name, setName] = useState("")

  // 사용할 함수들 설정
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url);
  const userToken = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Token ${userToken}`
  }

  // 회원정보 불러오는 axios 요청
  useEffect(() => {
    axios.post(`${URL}/user/info/`, null, { headers })
    .then((response) => {
        // 가입일시 깔끔하게 정리
        const inputDate = response.data.date_joined;
        const dateObject = new Date(inputDate);
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObject.getDate().toString().padStart(2, "0");
        const hours = dateObject.getHours().toString().padStart(2, "0");
        const minutes = dateObject.getMinutes().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        console.log(response.data)
        setUsername(response.data.username)
        setEmail(response.data.email)
        setName(response.data.user_realname)
        setDataJoined(formattedDate)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // Modal 이용을 위한 Initialization
  useEffect(() => {
    const deleteModal = document.getElementById("user-delete-modal");
    M.Modal.init(deleteModal, {});
    const deleteCompleteModal = document.getElementById("user-delete-complete-modal");
    M.Modal.init(deleteCompleteModal, {});
  }, []);


  // 회원탈퇴 axios 요청
  const deleteUser = () => {
    axios.delete(`${URL}/user/`, { headers })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteComplete = () => {
    // 로그아웃 처리
    dispatch(login())
    navigate("/login")
  }


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 회원정보 타이틀 */}
        <h4 id="page-title" className="white-text">회원정보</h4>

        {/* 회원정보 정보 */}
        <div id="contents-box" className="white z-depth-4">
          
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">아이디</div>
            <div id="info-content" className="col s12">{ username }</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">이메일</div>
            <div id="info-content" className="col s12">{ email }</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">이름</div>
            <div id="info-content" className="col s12">{ name }</div>
          </div>
          <div id="info-list" className="row">
            <div id="info-title" className="col s12">가입일시</div>
            <div id="info-content" className="col s12">{ dateJoined }</div>
          </div>

        </div>

        {/* 버튼 섹션 */}
        <div id="buttons" className="row">

          {/* 회원정보 수정 버튼 */}
          <div className="col s10 offset-s1">
            <Link 
              to="/userinfo/update"
              state={{ username: username, email: email, name: name }}
            >
              <div 
                id="button-up"
                className="btn waves-effect waves white black-text z-depth-3"
              >
                회원정보 수정
              </div>
            </Link>
          </div>

          {/* 회원탈퇴 버튼 */}
          <div className="col s10 offset-s1">
            <div 
              id="button-down"
              data-target="user-delete-modal"
              className="btn modal-trigger waves-effect waves white black-text z-depth-3"
            >
              회원탈퇴
            </div>
          </div>

        </div>


        {/* 삭제 모달 */}
        <div id="user-delete-modal" className="modal">
          <div className="modal-content">
            <h6 className="center">정말로 회원탈퇴 하시겠습니까?</h6>
            <div className="modal-footer">
              <button 
                data-target="user-delete-complete-modal"
                className="modal-close modal-trigger waves-effect waves btn-flat"
                onClick={ deleteUser }  
              >확인</button>
              <button className="modal-close waves-effect waves btn-flat">취소</button>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        <div id="user-delete-complete-modal" className="modal" onClick={ deleteComplete }>
          <div className="modal-content">
            <h6 className="center">회원 탈퇴 처리되었습니다</h6>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves btn-flat">확인</button>
            </div>
          </div>
        </div>

      </div>



    </div>

  )
}

export default UserInfo