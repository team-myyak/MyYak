import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../app/slices/authSlice";

const NavbarUnregister = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 로그아웃
  const Logout = () => {
    dispatch(login())
    navigate("/login")
  }

  // 홈으로 이동하는 함수
  const goToHome = () => {
    navigate("/home")
  }


  return (
    <div>

      {/* 상단 네비게이션 바 */}
      <div id="navbar">
        <div id="navbar-left">
        </div>
        <div id="navbar-center">
          <img src="/assets/myyak_logo.png" alt="#" width="70%" onClick={goToHome}/>
        </div>
        <div id="navbar-right-only" className="white-text">
          <div onClick={Logout}>
            로그아웃
          </div>
        </div>
      </div>



    </div>
  )
}
export default NavbarUnregister