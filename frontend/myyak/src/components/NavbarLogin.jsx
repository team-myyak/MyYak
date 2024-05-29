import React from "react";
import { useNavigate } from "react-router-dom";

const NavbarLogin = () => {

  const navigate = useNavigate()

  // 홈으로 이동하는 함수
  const goToHome = () => {
    navigate("/home")
  }

  // 회원가입 페이지로 이동하는 함수
  const goToSignup = () => {
    navigate("/signup")
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
          <div onClick={goToSignup}>
            회원가입
          </div>
        </div>
      </div>



    </div>
  )
}
export default NavbarLogin